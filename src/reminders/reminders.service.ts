import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Reminder } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RemindersService {
  private readonly logger = new Logger(RemindersService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron('* * * * *')
  async runDueRemindersCron(): Promise<void> {
    await this.processDueReminders();
  }

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

  async getRemindersForUser(userId: string): Promise<Reminder[]> {
    return this.prisma.reminder.findMany({
      where: { task: { userId } },
      orderBy: { remindAt: 'asc' },
    });
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

  async processDueReminders(): Promise<Reminder[]> {
    const now = new Date();
    const due = await this.prisma.reminder.findMany({
      where: {
        remindAt: { lte: now },
        sent: false,
      },
      orderBy: { remindAt: 'asc' },
    });
    if (due.length > 0) {
      this.logger.log(
        `Due reminders (not sending): ${due.length} reminder(s)`,
      );
      await this.prisma.reminder.updateMany({
        where: { id: { in: due.map((r) => r.id) } },
        data: { sent: true },
      });
    }
    return due;
  }
}
