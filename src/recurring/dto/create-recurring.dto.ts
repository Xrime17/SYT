import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Frequency } from '@prisma/client';

export class CreateRecurringDto {
  @IsString()
  @IsNotEmpty({ message: 'taskId is required' })
  taskId!: string;

  @IsEnum(Frequency, {
    message: 'frequency must be DAILY, WEEKLY, MONTHLY or CUSTOM',
  })
  frequency!: Frequency;

  @IsOptional()
  @IsInt()
  @Min(1, { message: 'interval must be a positive integer' })
  interval?: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true, message: 'daysOfWeek must be integers' })
  @Min(1, { each: true, message: 'daysOfWeek must be 1-7 (ISO weekday: Mon=1, Sun=7)' })
  @Max(7, { each: true, message: 'daysOfWeek must be 1-7 (ISO weekday: Mon=1, Sun=7)' })
  @ArrayMinSize(0)
  @ArrayMaxSize(7)
  daysOfWeek?: number[];

  @IsOptional()
  @IsDateString({}, { message: 'endDate must be a valid ISO 8601 date string' })
  endDate?: string;
}
