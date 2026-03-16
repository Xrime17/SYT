import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Reminder, Task, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type DueReminderWithContext = Reminder & {
  task: Pick<Task, 'id' | 'title' | 'userId'> & {
    user: Pick<User, 'telegramId'>;
  };
};

@Injectable()
export class RemindersService {
  private readonly logger = new Logger(RemindersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createReminder(taskId: string, remindAt: Date): Promise<Reminder> {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });
    if (!task) {
      throw new NotFoundException(`Task with id ${taskId} not found`);
    }
    return this.prisma.reminder.create({
      data: { taskId, remindAt },
    });
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
          select: { id: true, title: true, userId: true, user: { select: { telegramId: true } } },
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
