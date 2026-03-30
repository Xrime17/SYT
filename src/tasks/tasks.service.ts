import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Priority, Task, TaskType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type TaskWithCompletedAt = Task & { completedAt?: Date | null };

export type UpdateTaskData = {
  title?: string;
  description?: string;
  status?: Task['status'];
  priority?: Task['priority'];
  dueDate?: Date | null;
  /** `null` — явно снять категорию. */
  categoryId?: string | null;
};

export type CreateTaskOptions = {
  dueDate?: Date | null;
  priority?: Priority;
  type?: TaskType;
  categoryId?: string | null;
};

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertHomeCategoryOwnedByUser(
    categoryId: string,
    userId: string,
  ): Promise<void> {
    const row = await this.prisma.homeCategory.findFirst({
      where: { id: categoryId, userId },
    });
    if (!row) {
      throw new BadRequestException(
        'categoryId is invalid or does not belong to this user',
      );
    }
  }

  /** Clamp dueDate: past → today start-of-day, beyond +1 year → max. null/undefined pass through. */
  private clampDueDate(d: Date | null | undefined): Date | null | undefined {
    if (d === null || d === undefined) return d;
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const maxDate = new Date(todayStart.getFullYear() + 1, todayStart.getMonth(), todayStart.getDate());
    if (d < todayStart) return todayStart;
    if (d > maxDate) return maxDate;
    return d;
  }

  async createTask(
    userId: string,
    title: string,
    description?: string,
    options?: CreateTaskOptions,
  ): Promise<Task> {
    try {
      const clampedDue = this.clampDueDate(options?.dueDate);
      if (options?.categoryId) {
        await this.assertHomeCategoryOwnedByUser(options.categoryId, userId);
      }
      return await this.prisma.task.create({
        data: {
          userId,
          title,
          description,
          ...(clampedDue !== undefined && { dueDate: clampedDue }),
          ...(options?.priority !== undefined && { priority: options.priority }),
          ...(options?.type !== undefined && { type: options.type }),
          ...(options?.categoryId !== undefined &&
            options.categoryId !== null && { categoryId: options.categoryId }),
        },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2003'
      ) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
      throw e;
    }
  }

  /**
   * Returns [startUTC, endUTC] for the calendar day YYYY-MM-DD.
   * Prefers device offset (minutes ahead of UTC) — reflects actual device time, robust to VPN.
   * Falls back to IANA timezone, then UTC day.
   */
  private getDayRangeInTimezone(
    dateStr: string,
    timezone?: string,
    timezoneOffsetMinutes?: number,
  ): { start: Date; end: Date } | null {
    const [y, m, day] = dateStr.split('-').map(Number);
    if (isNaN(y) || isNaN(m) || isNaN(day)) return null;
    const refUtc = Date.UTC(y, m - 1, day, 0, 0, 0, 0);

    if (typeof timezoneOffsetMinutes === 'number' && timezoneOffsetMinutes >= -720 && timezoneOffsetMinutes <= 720) {
      const offsetMs = timezoneOffsetMinutes * 60 * 1000;
      const startUtcMs = refUtc - offsetMs;
      return {
        start: new Date(startUtcMs),
        end: new Date(startUtcMs + 86400000 - 1),
      };
    }

    if (!timezone || typeof timezone !== 'string' || timezone.length > 64) {
      return {
        start: new Date(refUtc),
        end: new Date(Date.UTC(y, m - 1, day, 23, 59, 59, 999)),
      };
    }

    try {
      const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      const parts = formatter.formatToParts(new Date(refUtc));
      const get = (k: string) => parts.find((p) => p.type === k)?.value ?? '0';
      const localHour = parseInt(get('hour'), 10) || 0;
      const localMin = parseInt(get('minute'), 10) || 0;
      const localSec = parseInt(get('second'), 10) || 0;
      const offsetMs =
        (localHour * 3600 + localMin * 60 + localSec) * 1000;
      const startUtcMs = refUtc - offsetMs;
      const start = new Date(startUtcMs);
      const end = new Date(startUtcMs + 86400000 - 1);
      return { start, end };
    } catch {
      return {
        start: new Date(refUtc),
        end: new Date(Date.UTC(y, m - 1, day, 23, 59, 59, 999)),
      };
    }
  }

  /**
   * Список задач пользователя. Опционально: день (`date` + tz) и/или `categoryId` (категория Home).
   * Фильтр по категории сужает выборку; группировка `groupHomeLists` на клиенте остаётся корректной,
   * т.к. это те же правила bucket’ов, применённые к подмножеству задач.
   */
  async getTasks(
    userId: string,
    date?: string,
    timezone?: string,
    timezoneOffsetMinutes?: number,
    categoryId?: string,
  ): Promise<TaskWithCompletedAt[]> {
    const where: Prisma.TaskWhereInput = { userId };

    const cat = categoryId?.trim();
    if (cat) {
      await this.assertHomeCategoryOwnedByUser(cat, userId);
      where.categoryId = cat;
    }

    if (date) {
      const range = this.getDayRangeInTimezone(date, timezone, timezoneOffsetMinutes);
      if (range) {
        where.OR = [
          { dueDate: { gte: range.start, lte: range.end } },
          { generatedDate: { gte: range.start, lte: range.end } },
        ];
      }
    }

    const rows = await this.prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        completions: { take: 1, orderBy: { completedAt: 'desc' } },
      },
    });
    return rows.map(({ completions, ...task }) => ({
      ...task,
      completedAt:
        task.status === 'COMPLETED' ? (completions[0]?.completedAt ?? null) : null,
    }));
  }

  async getTaskById(taskId: string): Promise<TaskWithCompletedAt> {
    const row = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        completions: { take: 1, orderBy: { completedAt: 'desc' } },
      },
    });
    if (!row) {
      throw new NotFoundException(`Task with id ${taskId} not found`);
    }
    const { completions, ...task } = row;
    return {
      ...task,
      completedAt:
        task.status === 'COMPLETED' ? (completions[0]?.completedAt ?? null) : null,
    };
  }

  async updateTask(
    taskId: string,
    data: UpdateTaskData,
  ): Promise<Task> {
    try {
      const existing = await this.prisma.task.findUnique({
        where: { id: taskId },
      });
      if (!existing) {
        throw new NotFoundException(`Task with id ${taskId} not found`);
      }
      if (data.categoryId !== undefined && data.categoryId !== null) {
        await this.assertHomeCategoryOwnedByUser(
          data.categoryId,
          existing.userId,
        );
      }
      const clampedDue = data.dueDate !== undefined ? this.clampDueDate(data.dueDate) : undefined;
      const nextStatus = data.status ?? existing.status;
      const shouldCreateCompletion =
        data.status !== undefined &&
        existing.status !== 'COMPLETED' &&
        nextStatus === 'COMPLETED';

      const updateData: Prisma.TaskUpdateInput = {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.priority !== undefined && { priority: data.priority }),
        ...(clampedDue !== undefined && { dueDate: clampedDue === null ? null : clampedDue }),
        ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
      };

      const [updated] = await this.prisma.$transaction([
        this.prisma.task.update({ where: { id: taskId }, data: updateData }),
        ...(shouldCreateCompletion
          ? [
              this.prisma.taskCompletion.create({
                data: { taskId: existing.id, userId: existing.userId },
              }),
            ]
          : []),
      ]);

      return updated;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new NotFoundException(`Task with id ${taskId} not found`);
      }
      throw e;
    }
  }

  async deleteTask(taskId: string): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });
    if (!task) {
      throw new NotFoundException(`Task with id ${taskId} not found`);
    }
    await this.prisma.reminder.deleteMany({ where: { taskId } });
    const rule = await this.prisma.recurringRule.findUnique({
      where: { taskId },
    });
    if (rule) {
      await this.prisma.task.updateMany({
        where: { recurringRuleId: rule.id },
        data: { recurringRuleId: null },
      });
      await this.prisma.recurringRule.delete({ where: { taskId } });
    }
    await this.prisma.taskCompletion.deleteMany({ where: { taskId } });
    return this.prisma.task.delete({
      where: { id: taskId },
    });
  }
}
