import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Priority, TaskType } from '@prisma/client';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'userId is required' })
  userId!: string;

  @IsString()
  @IsNotEmpty({ message: 'title is required' })
  @MinLength(1, { message: 'title must not be empty' })
  @MaxLength(500, { message: 'title must be at most 500 characters' })
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'description must be at most 2000 characters' })
  description?: string;

  @IsOptional()
  @IsEnum(TaskType)
  type?: TaskType;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsOptional()
  @IsDateString({}, { message: 'dueDate must be a valid ISO 8601 date string' })
  dueDate?: string;
}
