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
| `WEB_APP_URL` | URL фронта (Mini App). Нужен для кнопки «ОТКРЫТЬ» в списке чатов и в чате с ботом (HTTPS в продакшене) |

#### Кнопка «ОТКРЫТЬ» в списке чатов (как у других ботов)

В Telegram синяя кнопка **«ОТКРЫТЬ»** рядом с ботом в списке чатов — это фича **Main Mini App**, которую нужно один раз включить в **@BotFather**:

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram.
2. Отправьте команду **`/mybots`** и выберите своего бота.
3. Нажмите **Bot Settings** (Настройки бота).
4. Выберите **Configure Mini App** (Настроить Mini App) или **Configure Main Mini App**.
5. Включите Mini App и укажите **URL вашего приложения** — тот же HTTPS-адрес, что и в `WEB_APP_URL` (например `https://your-app.vercel.app`).

После этого у бота в списке чатов и в профиле появится кнопка «ОТКРЫТЬ», как у «Просто Трекер» и «The Wall» в примерах. Со стороны кода мы уже вызываем `setChatMenuButton` при старте сервера и при `/start` (если задан `WEB_APP_URL`), но отображение кнопки в списке чатов дополнительно зависит от этой настройки в BotFather.

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

