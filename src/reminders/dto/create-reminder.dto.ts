import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateReminderDto {
  @IsString()
  @IsNotEmpty({ message: 'taskId is required' })
  taskId!: string;

  @IsDateString(
    {},
    { message: 'remindAt must be a valid ISO 8601 date string' },
  )
  remindAt!: string;
}
