import { Injectable, NotFoundException } from '@nestjs/common';
import { Priority, Task, TaskType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type UpdateTaskData = {
  title?: string;
  description?: string;
  status?: Task['status'];
  priority?: Task['priority'];
  dueDate?: Date | null;
};

export type CreateTaskOptions = {
  dueDate?: Date | null;
  priority?: Priority;
  type?: TaskType;
};

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async createTask(
    userId: string,
    title: string,
    description?: string,
    options?: CreateTaskOptions,
  ): Promise<Task> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    return this.prisma.task.create({
      data: {
        userId,
        title,
        description,
        ...(options?.dueDate !== undefined && { dueDate: options.dueDate }),
        ...(options?.priority !== undefined && { priority: options.priority }),
        ...(options?.type !== undefined && { type: options.type }),
      },
    });
  }

  async getTasks(userId: string): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTaskById(taskId: string): Promise<Task | null> {
    return this.prisma.task.findUnique({
      where: { id: taskId },
    });
  }

  async updateTask(
    taskId: string,
    data: UpdateTaskData,
  ): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });
    if (!task) {
      throw new NotFoundException(`Task with id ${taskId} not found`);
    }
    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.priority !== undefined && { priority: data.priority }),
        ...(data.dueDate !== undefined && {
          dueDate: data.dueDate === null ? null : data.dueDate,
        }),
      },
    });
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
