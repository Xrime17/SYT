import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(
    @Body() dto: CreateTaskDto,
  ) {
    return this.tasksService.createTask(
      dto.userId,
      dto.title,
      dto.description,
    );
  }

  @Get('task/:taskId')
  getTaskById(@Param('taskId') taskId: string) {
    return this.tasksService.getTaskById(taskId);
  }

  @Get(':userId')
  getTasks(@Param('userId') userId: string) {
    return this.tasksService.getTasks(userId);
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
      ...(dto.dueDate !== undefined && {
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      }),
    });
  }

  @Delete(':taskId')
  delete(@Param('taskId') taskId: string) {
    return this.tasksService.deleteTask(taskId);
  }
}
