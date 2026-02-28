import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

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
}
