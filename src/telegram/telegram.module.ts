import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RecurringModule } from '../recurring/recurring.module';
import { RemindersModule } from '../reminders/reminders.module';
import { TasksModule } from '../tasks/tasks.module';
import { UsersModule } from '../users/users.module';
import { TelegramService } from './telegram.service';
import { TelegramWebhookController } from './telegram-webhook.controller';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    TasksModule,
    RecurringModule,
    RemindersModule,
  ],
  controllers: [TelegramWebhookController],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
