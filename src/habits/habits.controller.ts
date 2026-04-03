import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateHabitDto } from './dto/create-habit.dto';
import { HabitMutationBodyDto } from './dto/habit-mutation-body.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { HabitsService } from './habits.service';

@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Get('user/:userId')
  list(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.habitsService.listForUser(userId);
  }

  @Post()
  create(@Body() dto: CreateHabitDto) {
    return this.habitsService.create(dto);
  }

  @Patch(':habitId')
  update(
    @Param('habitId', ParseUUIDPipe) habitId: string,
    @Body() dto: UpdateHabitDto,
  ) {
    return this.habitsService.update(habitId, dto);
  }

  @Post(':habitId/increment')
  increment(
    @Param('habitId', ParseUUIDPipe) habitId: string,
    @Body() dto: HabitMutationBodyDto,
  ) {
    return this.habitsService.increment(habitId, dto.userId);
  }

  @Post(':habitId/decrement')
  decrement(
    @Param('habitId', ParseUUIDPipe) habitId: string,
    @Body() dto: HabitMutationBodyDto,
  ) {
    return this.habitsService.decrement(habitId, dto.userId);
  }
}
