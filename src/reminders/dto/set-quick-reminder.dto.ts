import { IsBoolean, IsUUID } from 'class-validator';

export class SetQuickReminderDto {
  @IsUUID('4')
  taskId!: string;

  @IsUUID('4')
  userId!: string;

  @IsBoolean()
  enabled!: boolean;
}
