import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { NoStoreHttpCacheInterceptor } from './common/no-store-http-cache.interceptor';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { RecurringModule } from './recurring/recurring.module';
import { RemindersModule } from './reminders/reminders.module';
import { HealthModule } from './health/health.module';
import { TelegramModule } from './telegram/telegram.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    UsersModule,
    TasksModule,
    RecurringModule,
    RemindersModule,
    HealthModule,
    TelegramModule,
    CategoriesModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: NoStoreHttpCacheInterceptor },
  ],
})
export class AppModule {}

