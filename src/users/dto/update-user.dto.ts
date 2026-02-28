import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { PlanType } from '@prisma/client';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'firstName must not be empty' })
  @MaxLength(100, { message: 'firstName must be at most 100 characters' })
  firstName?: string;

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

  @IsOptional()
  @IsEnum(PlanType, { message: 'planType must be FREE or PRO' })
  planType?: PlanType;
}
