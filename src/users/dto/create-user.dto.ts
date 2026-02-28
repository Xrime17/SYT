import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNumber()
  @IsInt({ message: 'telegramId must be an integer' })
  telegramId!: number;

  @IsString()
  @IsNotEmpty({ message: 'firstName is required' })
  @MinLength(1, { message: 'firstName must not be empty' })
  @MaxLength(100, { message: 'firstName must be at most 100 characters' })
  firstName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'lastName must be at most 100 characters' })
  lastName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'username must be at most 100 characters' })
  username?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'timezone must be at most 50 characters' })
  timezone?: string;
}
