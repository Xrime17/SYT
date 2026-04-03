import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';

export type HabitListItemJson = {
  id: string;
  title: string;
  iconKey: string;
  targetPerDay: number;
  sortOrder: number;
  todayCount: number;
  doneToday: boolean;
};

function getLocalDateStringForTimezone(timezone: string, date = new Date()): string {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  }
}

@Injectable()
export class HabitsService {
  constructor(private readonly prisma: PrismaService) {}

  async getTodayContext(userId: string): Promise<{ localDate: string; timezone: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { timezone: true },
    });
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }
    const timezone = user.timezone?.trim() || 'UTC';
    const localDate = getLocalDateStringForTimezone(timezone);
    return { localDate, timezone };
  }

  private toListItem(
    row: {
      id: string;
      title: string;
      iconKey: string;
      targetPerDay: number;
      sortOrder: number;
      logs: { count: number }[];
    },
  ): HabitListItemJson {
    const todayCount = row.logs[0]?.count ?? 0;
    const targetPerDay = row.targetPerDay;
    return {
      id: row.id,
      title: row.title,
      iconKey: row.iconKey,
      targetPerDay,
      sortOrder: row.sortOrder,
      todayCount,
      doneToday: todayCount >= targetPerDay,
    };
  }

  async listForUser(userId: string): Promise<HabitListItemJson[]> {
    const { localDate } = await this.getTodayContext(userId);

    const rows = await this.prisma.habit.findMany({
      where: { userId, archivedAt: null },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      include: {
        logs: {
          where: { localDate },
          take: 1,
          select: { count: true },
        },
      },
    });

    return rows.map((r) => this.toListItem(r));
  }

  async create(dto: CreateHabitDto): Promise<HabitListItemJson> {
    await this.getTodayContext(dto.userId);

    const targetPerDay = dto.targetPerDay ?? 1;
    let sortOrder = dto.sortOrder;
    if (sortOrder === undefined) {
      const agg = await this.prisma.habit.aggregate({
        where: { userId: dto.userId },
        _max: { sortOrder: true },
      });
      sortOrder =
        agg._max.sortOrder != null ? agg._max.sortOrder + 1 : 0;
    }

    const row = await this.prisma.habit.create({
      data: {
        userId: dto.userId,
        title: dto.title.trim(),
        iconKey: dto.iconKey,
        targetPerDay,
        sortOrder,
      },
    });

    return this.toListItem({ ...row, logs: [] });
  }

  async update(habitId: string, dto: UpdateHabitDto): Promise<HabitListItemJson> {
    const { localDate } = await this.getTodayContext(dto.userId);

    const existing = await this.prisma.habit.findUnique({
      where: { id: habitId },
    });
    if (!existing || existing.userId !== dto.userId) {
      throw new NotFoundException(`Habit ${habitId} not found`);
    }

    const data: Prisma.HabitUpdateInput = {};
    if (dto.title !== undefined) data.title = dto.title.trim();
    if (dto.iconKey !== undefined) data.iconKey = dto.iconKey;
    if (dto.targetPerDay !== undefined) data.targetPerDay = dto.targetPerDay;
    if (dto.sortOrder !== undefined) data.sortOrder = dto.sortOrder;
    if (dto.archived === true) data.archivedAt = new Date();
    if (dto.archived === false) data.archivedAt = null;

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields to update');
    }

    await this.prisma.habit.update({
      where: { id: habitId },
      data,
    });

    return this.getOneForUser(habitId, dto.userId, localDate);
  }

  private async getOneForUser(
    habitId: string,
    userId: string,
    localDate: string,
  ): Promise<HabitListItemJson> {
    const row = await this.prisma.habit.findFirst({
      where: { id: habitId, userId },
      include: {
        logs: {
          where: { localDate },
          take: 1,
          select: { count: true },
        },
      },
    });
    if (!row) {
      throw new NotFoundException(`Habit ${habitId} not found`);
    }
    return this.toListItem(row);
  }

  async increment(habitId: string, userId: string): Promise<HabitListItemJson> {
    const { localDate } = await this.getTodayContext(userId);

    const habit = await this.prisma.habit.findFirst({
      where: { id: habitId, userId, archivedAt: null },
    });
    if (!habit) {
      throw new NotFoundException(`Habit ${habitId} not found`);
    }

    const existing = await this.prisma.habitDayLog.findUnique({
      where: {
        habitId_localDate: { habitId, localDate },
      },
    });

    const current = existing?.count ?? 0;
    if (current >= habit.targetPerDay) {
      return this.getOneForUser(habitId, userId, localDate);
    }

    await this.prisma.habitDayLog.upsert({
      where: {
        habitId_localDate: { habitId, localDate },
      },
      create: {
        habitId,
        userId,
        localDate,
        count: current + 1,
      },
      update: {
        count: { increment: 1 },
      },
    });

    return this.getOneForUser(habitId, userId, localDate);
  }

  async decrement(habitId: string, userId: string): Promise<HabitListItemJson> {
    const { localDate } = await this.getTodayContext(userId);

    const habit = await this.prisma.habit.findFirst({
      where: { id: habitId, userId, archivedAt: null },
    });
    if (!habit) {
      throw new NotFoundException(`Habit ${habitId} not found`);
    }

    const existing = await this.prisma.habitDayLog.findUnique({
      where: {
        habitId_localDate: { habitId, localDate },
      },
    });
    const current = existing?.count ?? 0;
    if (current <= 0) {
      return this.getOneForUser(habitId, userId, localDate);
    }

    if (current === 1) {
      await this.prisma.habitDayLog.delete({
        where: {
          habitId_localDate: { habitId, localDate },
        },
      });
    } else {
      await this.prisma.habitDayLog.update({
        where: {
          habitId_localDate: { habitId, localDate },
        },
        data: { count: { decrement: 1 } },
      });
    }

    return this.getOneForUser(habitId, userId, localDate);
  }

  /** Активные привычки (не в архиве) — для подзаголовка Home. */
  async countActiveForUser(userId: string): Promise<number> {
    return this.prisma.habit.count({
      where: { userId, archivedAt: null },
    });
  }
}
