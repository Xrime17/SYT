import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Frequency, Prisma, RecurringRule, Task } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type RecurringRuleWithTask = RecurringRule & {
  task: Pick<Task, 'userId' | 'title' | 'description' | 'type' | 'priority' | 'createdAt'> & {
    reminders: { remindAt: Date }[];
  };
};

export type UpdateRecurringData = {
  frequency?: Frequency;
  interval?: number;
  daysOfWeek?: number[];
  endDate?: Date | null;
};

@Injectable()
export class RecurringService {
  private readonly logger = new Logger(RecurringService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createRecurring(
    taskId: string,
    frequency: Frequency,
    interval?: number,
    daysOfWeek?: number[],
    endDate?: Date,
  ): Promise<RecurringRule> {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });
    if (!task) {
      throw new NotFoundException(`Task with id ${taskId} not found`);
    }

    const existing = await this.prisma.recurringRule.findUnique({
      where: { taskId },
    });
    if (existing) {
      throw new BadRequestException(
        `Recurring rule already exists for task ${taskId}`,
      );
    }

    return this.prisma.recurringRule.create({
      data: {
        taskId,
        frequency,
        interval: interval ?? 1,
        daysOfWeek: daysOfWeek ?? [],
        endDate,
      },
    });
  }

  async getRecurringByTask(taskId: string): Promise<RecurringRule> {
    const rule = await this.prisma.recurringRule.findUnique({
      where: { taskId },
    });
    if (!rule) {
      throw new NotFoundException(
        `Recurring rule for task ${taskId} not found`,
      );
    }
    return rule;
  }

  async updateRecurring(
    taskId: string,
    data: UpdateRecurringData,
  ): Promise<RecurringRule> {
    const rule = await this.prisma.recurringRule.findUnique({
      where: { taskId },
    });
    if (!rule) {
      throw new NotFoundException(
        `Recurring rule for task ${taskId} not found`,
      );
    }

    return this.prisma.recurringRule.update({
      where: { taskId },
      data: {
        ...(data.frequency !== undefined && { frequency: data.frequency }),
        ...(data.interval !== undefined && { interval: data.interval }),
        ...(data.daysOfWeek !== undefined && { daysOfWeek: data.daysOfWeek }),
        ...(data.endDate !== undefined && {
          endDate: data.endDate === null ? null : data.endDate,
        }),
      },
    });
  }

  async deleteRecurring(taskId: string): Promise<void> {
    const rule = await this.prisma.recurringRule.findUnique({
      where: { taskId },
    });
    if (!rule) {
      throw new NotFoundException(
        `Recurring rule for task ${taskId} not found`,
      );
    }
    await this.prisma.recurringRule.delete({
      where: { taskId },
    });
  }

  /**
   * Returns true if a task should be generated for this rule on the given day (UTC).
   */
  shouldGenerateToday(
    rule: RecurringRuleWithTask,
    today: Date,
  ): boolean {
    const dayOfMonth = today.getUTCDate();
    const jsDay = today.getUTCDay(); // 0-6 (Sun=0)
    const dayOfWeek = jsDay === 0 ? 7 : jsDay; // 1-7 (Mon=1 .. Sun=7)

    switch (rule.frequency) {
      case 'DAILY':
        return true;
      case 'WEEKLY':
        return rule.daysOfWeek.includes(dayOfWeek);
      case 'MONTHLY':
        return rule.interval >= 1 && rule.interval <= 31 && dayOfMonth === rule.interval;
      case 'CUSTOM': {
        const taskCreated = new Date(rule.task.createdAt);
        const startCreated = Date.UTC(
          taskCreated.getUTCFullYear(),
          taskCreated.getUTCMonth(),
          taskCreated.getUTCDate(),
        );
        const startToday = Date.UTC(
          today.getUTCFullYear(),
          today.getUTCMonth(),
          today.getUTCDate(),
        );
        const daysSince = Math.floor((startToday - startCreated) / 86400000);
        return daysSince >= 0 && daysSince % rule.interval === 0;
      }
      default:
        return false;
    }
  }

  /**
   * Generates recurring tasks for today (UTC). Returns the number of tasks created.
   */
  async generateRecurringTasksForToday(): Promise<number> {
    const now = new Date();
    const startOfToday = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );

    const rulesRaw = await this.prisma.recurringRule.findMany({
      where: {
        OR: [{ endDate: null }, { endDate: { gte: startOfToday } }],
      },
      include: {
        task: { include: { reminders: true } },
      },
    });
    const rules: RecurringRuleWithTask[] = rulesRaw as RecurringRuleWithTask[];

    let created = 0;

    for (const rule of rules) {
      if (rule.endDate && rule.endDate < startOfToday) continue;
      if (!this.shouldGenerateToday(rule, startOfToday)) continue;

      const template = rule.task as RecurringRuleWithTask['task'];
      const reminders = template.reminders || [];

      try {
        await this.prisma.$transaction(async (tx) => {
          const newTask = await tx.task.create({
            data: {
              userId: template.userId,
              title: template.title,
              description: template.description,
              type: template.type,
              status: 'ACTIVE',
              priority: template.priority,
              dueDate: startOfToday,
              recurringRuleId: rule.id,
              generatedDate: startOfToday,
            },
          });

          for (const rem of reminders) {
            const reminderTime = new Date(rem.remindAt);
            const remindAt = new Date(
              Date.UTC(
                startOfToday.getUTCFullYear(),
                startOfToday.getUTCMonth(),
                startOfToday.getUTCDate(),
                reminderTime.getUTCHours(),
                reminderTime.getUTCMinutes(),
                reminderTime.getUTCSeconds(),
              ),
            );
            await tx.reminder.create({
              data: { taskId: newTask.id, remindAt },
            });
          }
        });
        created++;
      } catch (e) {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === 'P2002'
        ) {
          // Unique constraint violation: task already created by another process
          continue;
        }
        throw e;
      }
    }

    if (created > 0) {
      this.logger.log(
        `Created ${created} task(s) for ${startOfToday.toISOString().slice(0, 10)}`,
      );
    }
    return created;
  }

  @Cron('5 0 * * *')
  async runRecurringGenerationCron(): Promise<void> {
    await this.generateRecurringTasksForToday();
  }
}
