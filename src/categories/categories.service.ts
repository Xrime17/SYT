import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HomeCategory, Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { isUUID } from 'class-validator';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

/** Ответ для CategoryChipStrip (HomeScreen): обязательные id, label, iconKey + поля для текущего UI. */
export type CategoryChipJson = {
  id: string;
  label: string;
  iconKey: string;
  shortLabel: string;
  sortOrder: number;
  emoji: string | null;
  createdAt: string;
};

/** Подзаголовок Home: `totalHabits` = число активных записей `Habit` (не в архиве). */
export type HomeSubtitleMetricsJson = {
  totalHabits: number;
  metric: 'activeHabitsCount';
};

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  private toChip(row: HomeCategory): CategoryChipJson {
    return {
      id: row.id,
      label: row.label,
      iconKey: row.iconKey,
      shortLabel: row.shortLabel,
      sortOrder: row.sortOrder,
      emoji: row.emoji,
      createdAt: row.createdAt.toISOString(),
    };
  }

  private deriveShortLabel(label: string): string {
    const t = label.trim();
    if (t.length === 0) return '?';
    if (t.length <= 2) return t.toUpperCase();
    return t.slice(0, 2).toUpperCase();
  }

  async listForUser(userId: string): Promise<CategoryChipJson[]> {
    const rows = await this.prisma.homeCategory.findMany({
      where: { userId },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
    return rows.map((r) => this.toChip(r));
  }

  async create(userId: string, dto: CreateCategoryDto): Promise<CategoryChipJson> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const agg = await this.prisma.homeCategory.aggregate({
      where: { userId },
      _max: { sortOrder: true },
    });
    const nextOrder =
      dto.sortOrder ?? (agg._max.sortOrder != null ? agg._max.sortOrder + 1 : 0);

    const shortLabel = dto.shortLabel?.trim()
      ? dto.shortLabel.trim()
      : this.deriveShortLabel(dto.label);

    const iconKey = `custom_${randomUUID()}`;

    try {
      const row = await this.prisma.homeCategory.create({
        data: {
          userId,
          label: dto.label.trim(),
          shortLabel,
          iconKey,
          emoji: dto.emoji?.trim() ? dto.emoji.trim() : null,
          sortOrder: nextOrder,
        },
      });
      return this.toChip(row);
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new BadRequestException('Could not create category (duplicate key)');
      }
      throw e;
    }
  }

  async update(
    categoryId: string,
    userId: string,
    dto: UpdateCategoryDto,
  ): Promise<CategoryChipJson> {
    const existing = await this.prisma.homeCategory.findUnique({
      where: { id: categoryId },
    });
    if (!existing || existing.userId !== userId) {
      throw new NotFoundException(`Category ${categoryId} not found`);
    }

    const patch: Record<string, unknown> = {};
    if (dto.label !== undefined) patch.label = dto.label;
    if (dto.shortLabel !== undefined) patch.shortLabel = dto.shortLabel;
    if (dto.emoji !== undefined) patch.emoji = dto.emoji;
    if (dto.sortOrder !== undefined) patch.sortOrder = dto.sortOrder;

    if (Object.keys(patch).length === 0) {
      throw new BadRequestException('No fields to update');
    }

    try {
      const row = await this.prisma.homeCategory.update({
        where: { id: categoryId },
        data: patch as {
          label?: string;
          shortLabel?: string;
          emoji?: string | null;
          sortOrder?: number;
        },
      });
      return this.toChip(row);
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new NotFoundException(`Category ${categoryId} not found`);
      }
      throw e;
    }
  }

  async reorder(userId: string, orderedIds: string[]): Promise<CategoryChipJson[]> {
    const rows = await this.prisma.homeCategory.findMany({
      where: { userId },
      select: { id: true },
    });
    const set = new Set(rows.map((r) => r.id));
    if (orderedIds.length !== set.size) {
      throw new BadRequestException(
        'orderedIds must list every category of the user exactly once',
      );
    }
    for (const id of orderedIds) {
      if (!set.has(id)) {
        throw new BadRequestException(`Unknown category id: ${id}`);
      }
    }

    await this.prisma.$transaction(
      orderedIds.map((id, index) =>
        this.prisma.homeCategory.update({
          where: { id },
          data: { sortOrder: index },
        }),
      ),
    );

    return this.listForUser(userId);
  }

  async delete(categoryId: string, userId: string): Promise<void> {
    const existing = await this.prisma.homeCategory.findUnique({
      where: { id: categoryId },
    });
    if (!existing || existing.userId !== userId) {
      throw new NotFoundException(`Category ${categoryId} not found`);
    }
    await this.prisma.homeCategory.delete({ where: { id: categoryId } });
  }

  async homeSubtitleMetrics(userId: string): Promise<HomeSubtitleMetricsJson> {
    const totalHabits = await this.prisma.habit.count({
      where: { userId, archivedAt: null },
    });
    return { totalHabits, metric: 'activeHabitsCount' };
  }

  static assertUuidV4(value: string, field: string): void {
    if (!isUUID(value, '4')) {
      throw new BadRequestException(`${field} must be a UUID v4`);
    }
  }
}
