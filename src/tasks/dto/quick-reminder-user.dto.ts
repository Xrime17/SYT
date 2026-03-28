import { IsUUID } from 'class-validator';

export class QuickReminderUserDto {
  @IsUUID('4')
  userId!: string;
}
