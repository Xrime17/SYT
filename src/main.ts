import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

// BigInt is not JSON-serializable by default (e.g. User.telegramId)
(BigInt.prototype as unknown as { toJSON?: () => string }).toJSON =
  function () {
    return this.toString();
  };

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: true }); // allow localhost (dev)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
