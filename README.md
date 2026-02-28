## Backend (NestJS + Prisma)

**Технологии**: NestJS (TypeScript), Prisma ORM, PostgreSQL, Telegram Bot (Telegraf), Docker.

### Структура

- **`src/app.module.ts`**: корневой модуль — `ConfigModule`, `PrismaModule`, `UsersModule`, `TasksModule`, `RecurringModule`, `RemindersModule`, `HealthModule`, `TelegramModule`.
- **`src/main.ts`**: входная точка, порт из `ConfigService` (`PORT`, по умолчанию 3000), CORS, глобальный `ValidationPipe`.
- **`src/prisma`**: Prisma с Nest (`PrismaModule`, `PrismaService`).
- **`prisma/schema.prisma`**: схема БД (User, Task, RecurringRule, Reminder и др.).
- **Модули**: Users, Tasks, Recurring, Reminders — контроллеры и сервисы реализованы; Health — проверка живости; Telegram — бот с кнопкой Open (Mini App).

### Окружение

Создайте `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

Переменные:

| Переменная | Описание |
|------------|----------|
| `DATABASE_URL` | PostgreSQL (обязательно) |
| `PORT` | Порт сервера (по умолчанию 3000) |
| `TELEGRAM_BOT_TOKEN` | Токен бота (необязательно; без него бот не стартует) |
| `WEB_APP_URL` | URL фронта для кнопки Open в боте (HTTPS в продакшене) |

### Установка зависимостей

```bash
npm install
```

### Запуск в режиме разработки

```bash
npm run start:dev
```

Приложение будет доступно на `http://localhost:3000`.

### Prisma

- генерация клиента:

```bash
npm run prisma:generate
```

При изменении `schema.prisma` запускайте команду заново.

### Docker

Сборка образа:

```bash
docker build -t nest-backend .
```

Запуск контейнера (PostgreSQL должен быть доступен по `DATABASE_URL`):

```bash
docker run --env-file .env -p 3000:3000 nest-backend
```

