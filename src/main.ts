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
  console.log('[syt] bootstrap: PORT=', process.env.PORT ?? '(unset, default 3000)');
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: true }); // allow localhost (dev)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const configService = app.get(ConfigService);
  const port = Number(configService.get('PORT')) || 3000;
  // Railway/Docker: слушать все интерфейсы, иначе прокси часто даёт 502
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://0.0.0.0:${port}`);
}

bootstrap();
