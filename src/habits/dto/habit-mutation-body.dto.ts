import { IsUUID } from 'class-validator';

export class HabitMutationBodyDto {
  @IsUUID('4')
  userId!: string;
}
