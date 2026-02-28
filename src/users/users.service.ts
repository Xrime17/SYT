import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type UpdateUserData = {
  firstName?: string;
  lastName?: string;
  username?: string;
  timezone?: string;
  planType?: User['planType'];
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(
    telegramId: number,
    firstName: string,
    lastName?: string,
    username?: string,
    timezone?: string,
  ): Promise<User> {
    try {
      return await this.prisma.user.create({
        data: {
          telegramId: BigInt(telegramId),
          firstName,
          lastName,
          username,
          timezone,
        },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(
          `User with telegramId ${telegramId} already exists`,
        );
      }
      throw e;
    }
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findUserByTelegramId(telegramId: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { telegramId: BigInt(telegramId) },
    });
  }

  async getUserByTelegramId(telegramId: number): Promise<User> {
    const user = await this.findUserByTelegramId(telegramId);
    if (!user) {
      throw new NotFoundException(
        `User with telegramId ${telegramId} not found`,
      );
    }
    return user;
  }

  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.prisma.user.update({
      where: { id },
      data: {
        ...(data.firstName !== undefined && { firstName: data.firstName }),
        ...(data.lastName !== undefined && { lastName: data.lastName }),
        ...(data.username !== undefined && { username: data.username }),
        ...(data.timezone !== undefined && { timezone: data.timezone }),
        ...(data.planType !== undefined && { planType: data.planType }),
      },
    });
  }

  async deleteUser(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
