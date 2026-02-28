import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(
      dto.telegramId,
      dto.firstName,
      dto.lastName,
      dto.username,
      dto.timezone,
    );
  }

  @Get('telegram/:telegramId')
  getByTelegramId(@Param('telegramId') telegramId: string) {
    return this.usersService.getUserByTelegramId(Number(telegramId));
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(id, {
      ...(dto.firstName !== undefined && { firstName: dto.firstName }),
      ...(dto.lastName !== undefined && { lastName: dto.lastName }),
      ...(dto.username !== undefined && { username: dto.username }),
      ...(dto.timezone !== undefined && { timezone: dto.timezone }),
      ...(dto.planType !== undefined && { planType: dto.planType }),
    });
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
