import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateCategoryDto {
  /** Опционально, если передан заголовок `x-telegram-user-id`. */
  @IsOptional()
  @IsUUID('4')
  userId?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  label!: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(8)
  shortLabel?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  emoji?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(9999)
  sortOrder?: number;
}
