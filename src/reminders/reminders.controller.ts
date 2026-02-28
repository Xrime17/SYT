import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { RemindersService } from './reminders.service';

@Controller('reminders')
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Post()
  create(@Body() dto: CreateReminderDto) {
    return this.remindersService.createReminder(
      dto.taskId,
      new Date(dto.remindAt),
    );
  }

  @Get('user/:userId')
  getForUser(@Param('userId') userId: string) {
    return this.remindersService.getRemindersForUser(userId);
  }

  @Patch('sent/:id')
  markAsSent(@Param('id') id: string) {
    return this.remindersService.markAsSent(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.remindersService.deleteReminder(id);
  }
}
