import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Reminder, Task, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type DueReminderWithContext = Reminder & {
  task: Pick<Task, 'id' | 'title' | 'description' | 'userId'> & {
    user: Pick<User, 'telegramId'>;
  };
};

/** Как выбрано время для быстрого напоминания (см. computeDefaultRemindAt и ответ API). */
export type QuickReminderAppliedRule =
  | 'taskDueDate'
  | 'pastDueOneHourFromNow'
  | 'defaultTomorrow9Utc'
  | 'unchangedExistingUnsent';

export type SetQuickReminderResult =
  | {
      enabled: true;
      reminder: Reminder;
      appliedRule: QuickReminderAppliedRule;
      /** Краткое описание правила для клиента */
      ruleDescription: string;
    }
  | { enabled: false; removed: boolean };

const QUICK_RULE_DESCRIPTIONS: Record<QuickReminderAppliedRule, string> = {
  taskDueDate: 'Время напоминания совпадает со сроком задачи (dueDate).',
  pastDueOneHourFromNow:
    'Срок задачи в прошлом; напоминание назначено через 1 час от текущего момента.',
  defaultTomorrow9Utc:
    'У задачи нет срока; напоминание на завтра в 09:00 UTC.',
  unchangedExistingUnsent:
    'Уже есть несработавшее напоминание; время не менялось (идемпотентный повтор).',
};

function quickRuleForComputed(task: Pick<Task, 'dueDate'>): QuickReminderAppliedRule {
  if (!task.dueDate) return 'defaultTomorrow9Utc';
  const d = new Date(task.dueDate);
  if (d.getTime() < Date.now()) return 'pastDueOneHourFromNow';
  return 'taskDueDate';
}

/**
 * Правила напоминаний (одна строка Reminder на задачу):
 * - Home (колокольчик), страница /reminders и Telegram /remind используют одну сущность: upsert по taskId.
 * - «Быстрое» включение: есть dueDate в будущем → оно; dueDate в прошлом → +1 ч от сейчас; без dueDate → завтра 09:00 UTC.
 * - Повторное включение при уже несработавшем напоминании — без изменения remindAt (идемпотентность).
 * - Выключение: удаление строки (повторный DELETE без строки — removed: false). После sent=true колокольчик «выкл» до следующего включения.
 */
@Injectable()
export class RemindersService {
  private readonly logger = new Logger(RemindersService.name);

  constructor(private readonly prisma: PrismaService) {}

  /** Время по умолчанию для быстрого напоминания (см. класс-комментарий). */
  computeDefaultRemindAt(task: Pick<Task, 'dueDate'>): Date {
    if (task.dueDate) {
      const d = new Date(task.dueDate);
      if (d.getTime() < Date.now()) {
        return new Date(Date.now() + 60 * 60 * 1000);
      }
      return d;
    }
    const t = new Date();
    t.setUTCDate(t.getUTCDate() + 1);
    t.setUTCHours(9, 0, 0, 0);
    return t;
  }

  /**
   * Создать или обновить единственное напоминание задачи (дата/время заданы явно).
   * Используется /reminders POST и Telegram /remind — без дублирования логики рассылки.
   */
  async createReminder(taskId: string, remindAt: Date): Promise<Reminder> {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });
    if (!task) {
      throw new NotFoundException(`Task with id ${taskId} not found`);
    }
    return this.prisma.reminder.upsert({
      where: { taskId },
      create: { taskId, remindAt },
      update: { remindAt, sent: false },
    });
  }

  /**
   * Колокольчик Home / REST: включить (дефолтное время + appliedRule в ответе) или выключить (deleteMany, идемпотентно).
   */
  async setQuickReminder(
    taskId: string,
    userId: string,
    enabled: boolean,
  ): Promise<SetQuickReminderResult> {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });
    if (!task || task.userId !== userId) {
      throw new NotFoundException(`Task with id ${taskId} not found`);
    }
    if (!enabled) {
      const { count } = await this.prisma.reminder.deleteMany({ where: { taskId } });
      return { enabled: false, removed: count > 0 };
    }
    const existing = await this.prisma.reminder.findUnique({
      where: { taskId },
    });
    if (existing && !existing.sent) {
      return {
        enabled: true,
        reminder: existing,
        appliedRule: 'unchangedExistingUnsent',
        ruleDescription: QUICK_RULE_DESCRIPTIONS.unchangedExistingUnsent,
      };
    }
    const remindAt = this.computeDefaultRemindAt(task);
    const reminder = await this.createReminder(taskId, remindAt);
    const appliedRule = quickRuleForComputed(task);
    return {
      enabled: true,
      reminder,
      appliedRule,
      ruleDescription: QUICK_RULE_DESCRIPTIONS[appliedRule],
    };
  }

  async getRemindersForUser(userId: string): Promise<(Reminder & { task: { title: string } })[]> {
    return this.prisma.reminder.findMany({
      where: { task: { userId } },
      include: { task: { select: { title: true } } },
      orderBy: { remindAt: 'asc' },
    }) as Promise<(Reminder & { task: { title: string } })[]>;
  }

  async markAsSent(reminderId: string): Promise<Reminder> {
    const reminder = await this.prisma.reminder.findUnique({
      where: { id: reminderId },
    });
    if (!reminder) {
      throw new NotFoundException(`Reminder with id ${reminderId} not found`);
    }
    return this.prisma.reminder.update({
      where: { id: reminderId },
      data: { sent: true },
    });
  }

  async deleteReminder(reminderId: string): Promise<void> {
    const reminder = await this.prisma.reminder.findUnique({
      where: { id: reminderId },
    });
    if (!reminder) {
      throw new NotFoundException(`Reminder with id ${reminderId} not found`);
    }
    await this.prisma.reminder.delete({
      where: { id: reminderId },
    });
  }

  /** Returns unsent due reminders with task title and user telegramId for notification sending. */
  async findDueReminders(): Promise<DueReminderWithContext[]> {
    const now = new Date();
    return this.prisma.reminder.findMany({
      where: { remindAt: { lte: now }, sent: false },
      orderBy: { remindAt: 'asc' },
      include: {
        task: {
          select: { id: true, title: true, description: true, userId: true, user: { select: { telegramId: true } } },
        },
      },
    }) as Promise<DueReminderWithContext[]>;
  }

  /** Marks a batch of reminders as sent by IDs. */
  async markBatchAsSent(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    await this.prisma.reminder.updateMany({
      where: { id: { in: ids } },
      data: { sent: true },
    });
    this.logger.log(`Marked ${ids.length} reminder(s) as sent`);
  }
}
