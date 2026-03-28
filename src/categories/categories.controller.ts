import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Headers,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ReorderCategoriesDto } from './dto/reorder-categories.dto';
import { UsersService } from '../users/users.service';

/**
 * Категории Home (Prisma `HomeCategory`). Идентификация владельца:
 * - query/body `userId` (UUID), как у `/tasks/:userId`;
 * - или заголовок `x-telegram-user-id` (числовой Telegram id) → внутренний user id.
 * Если заданы оба — UUID должен совпадать с пользователем Telegram.
 */
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly usersService: UsersService,
  ) {}

  private async resolveUserId(
    userId: string | undefined,
    telegramHeader: string | undefined,
  ): Promise<string> {
    const tgRaw = telegramHeader?.trim();
    if (tgRaw) {
      const tid = parseInt(tgRaw, 10);
      if (Number.isNaN(tid) || tid <= 0) {
        throw new BadRequestException('Invalid x-telegram-user-id header');
      }
      const user = await this.usersService.findUserByTelegramId(tid);
      if (!user) {
        throw new NotFoundException(`No user for telegram id ${tid}`);
      }
      const uid = userId?.trim();
      if (uid) {
        CategoriesService.assertUuidV4(uid, 'userId');
        if (uid !== user.id) {
          throw new ForbiddenException('userId does not match Telegram account');
        }
      }
      return user.id;
    }

    const uid = userId?.trim();
    if (!uid) {
      throw new BadRequestException(
        'Provide userId (query/body) or x-telegram-user-id header',
      );
    }
    CategoriesService.assertUuidV4(uid, 'userId');
    return uid;
  }

  @Patch('reorder')
  async reorder(
    @Body() dto: ReorderCategoriesDto,
    @Headers('x-telegram-user-id') telegramHeader?: string,
  ) {
    const userId = await this.resolveUserId(dto.userId, telegramHeader);
    return this.categoriesService.reorder(userId, dto.orderedIds);
  }

  @Post()
  async create(
    @Body() dto: CreateCategoryDto,
    @Headers('x-telegram-user-id') telegramHeader?: string,
  ) {
    const userId = await this.resolveUserId(dto.userId, telegramHeader);
    return this.categoriesService.create(userId, dto);
  }

  /** Метрики подзаголовка Home: `totalHabits` = число `HomeCategory` (чипы), см. `HomeSubtitleMetricsJson`. */
  @Get('home-metrics')
  async homeMetrics(
    @Query('userId') userIdQuery: string | undefined,
    @Headers('x-telegram-user-id') telegramHeader?: string,
  ) {
    const userId = await this.resolveUserId(userIdQuery, telegramHeader);
    return this.categoriesService.homeSubtitleMetrics(userId);
  }

  @Get()
  async list(
    @Query('userId') userIdQuery: string | undefined,
    @Headers('x-telegram-user-id') telegramHeader?: string,
  ) {
    const userId = await this.resolveUserId(userIdQuery, telegramHeader);
    return this.categoriesService.listForUser(userId);
  }

  @Patch(':categoryId')
  async update(
    @Param('categoryId', new ParseUUIDPipe({ version: '4' })) categoryId: string,
    @Body() dto: UpdateCategoryDto,
    @Headers('x-telegram-user-id') telegramHeader?: string,
  ) {
    const userId = await this.resolveUserId(dto.userId, telegramHeader);
    return this.categoriesService.update(categoryId, userId, dto);
  }

  @Delete(':categoryId')
  async remove(
    @Param('categoryId', new ParseUUIDPipe({ version: '4' })) categoryId: string,
    @Query('userId') userIdQuery: string | undefined,
    @Headers('x-telegram-user-id') telegramHeader?: string,
  ) {
    const userId = await this.resolveUserId(userIdQuery, telegramHeader);
    await this.categoriesService.delete(categoryId, userId);
  }
}
