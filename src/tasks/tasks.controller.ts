import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RemindersService } from '../reminders/reminders.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { QuickReminderUserDto } from './dto/quick-reminder-user.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly remindersService: RemindersService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateTaskDto,
  ) {
    return this.tasksService.createTask(
      dto.userId,
      dto.title,
      dto.description,
      {
        type: dto.type,
        priority: dto.priority,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        categoryId: dto.categoryId,
      },
    );
  }

  @Get('task/:taskId')
  getTaskById(@Param('taskId') taskId: string) {
    return this.tasksService.getTaskById(taskId);
  }

  @Get(':userId')
  getTasks(
    @Param('userId') userId: string,
    @Query('date') date?: string,
    @Query('timezone') timezone?: string,
    @Query('timezoneOffsetMinutes') timezoneOffsetMinutes?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    const offset =
      timezoneOffsetMinutes != null && timezoneOffsetMinutes !== ''
        ? parseInt(timezoneOffsetMinutes, 10)
        : undefined;
    return this.tasksService.getTasks(
      userId,
      date,
      timezone,
      Number.isFinite(offset) ? offset : undefined,
      categoryId?.trim() || undefined,
    );
  }

  /** Быстрое напоминание: POST — создать/идемпотентно оставить; ответ содержит appliedRule и ruleDescription. */
  @Post(':taskId/quick-reminder')
  enableQuickReminder(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Body() dto: QuickReminderUserDto,
  ) {
    return this.remindersService.setQuickReminder(taskId, dto.userId, true);
  }

  /** Снять быстрое напоминание (идемпотентно: повторный вызов — removed: false). */
  @Delete(':taskId/quick-reminder')
  disableQuickReminder(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Query('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.remindersService.setQuickReminder(taskId, userId, false);
  }

  @Patch(':taskId')
  update(
    @Param('taskId') taskId: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.updateTask(taskId, {
      ...(dto.title !== undefined && { title: dto.title }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.status !== undefined && { status: dto.status }),
      ...(dto.priority !== undefined && { priority: dto.priority }),
      ...(dto.type !== undefined && { type: dto.type }),
      ...(dto.dueDate !== undefined && {
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      }),
      ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
    });
  }

  @Delete(':taskId')
  delete(@Param('taskId') taskId: string) {
    return this.tasksService.deleteTask(taskId);
  }
}
