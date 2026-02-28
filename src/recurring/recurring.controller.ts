import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateRecurringDto } from './dto/create-recurring.dto';
import { UpdateRecurringDto } from './dto/update-recurring.dto';
import { RecurringService } from './recurring.service';

@Controller('recurring')
export class RecurringController {
  constructor(private readonly recurringService: RecurringService) {}

  @Post()
  create(@Body() dto: CreateRecurringDto) {
    return this.recurringService.createRecurring(
      dto.taskId,
      dto.frequency,
      dto.interval,
      dto.daysOfWeek,
      dto.endDate ? new Date(dto.endDate) : undefined,
    );
  }

  @Post('generate-today')
  generateToday() {
    return this.recurringService.generateRecurringTasksForToday();
  }

  @Get(':taskId')
  getByTask(@Param('taskId') taskId: string) {
    return this.recurringService.getRecurringByTask(taskId);
  }

  @Patch(':taskId')
  update(
    @Param('taskId') taskId: string,
    @Body() dto: UpdateRecurringDto,
  ) {
    return this.recurringService.updateRecurring(taskId, {
      ...(dto.frequency !== undefined && { frequency: dto.frequency }),
      ...(dto.interval !== undefined && { interval: dto.interval }),
      ...(dto.daysOfWeek !== undefined && { daysOfWeek: dto.daysOfWeek }),
      ...(dto.endDate !== undefined && {
        endDate: dto.endDate ? new Date(dto.endDate) : null,
      }),
    });
  }

  @Delete(':taskId')
  delete(@Param('taskId') taskId: string) {
    return this.recurringService.deleteRecurring(taskId);
  }
}
