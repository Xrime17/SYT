import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Priority, TaskStatus } from '@prisma/client';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'title must not be empty' })
  @MaxLength(500, { message: 'title must be at most 500 characters' })
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'description must be at most 2000 characters' })
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus, { message: 'status must be ACTIVE, COMPLETED or ARCHIVED' })
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(Priority, { message: 'priority must be LOW, MEDIUM or HIGH' })
  priority?: Priority;

  @IsOptional()
  @IsDateString({}, { message: 'dueDate must be a valid ISO 8601 date string' })
  dueDate?: string;
}
