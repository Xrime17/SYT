## Backend (NestJS + Prisma)

**Технологии**: NestJS (TypeScript), Prisma ORM, PostgreSQL, Docker.

### Структура

- **`src/app.module.ts`**: корневой модуль, подключает `ConfigModule`, `PrismaModule`, а также модули `UsersModule`, `TasksModule`, `RecurringModule`, `RemindersModule`.
- **`src/main.ts`**: входная точка приложения, чтение порта из `ConfigService` (`PORT`, по умолчанию 3000).
- **`src/prisma`**: интеграция Prisma с Nest (`PrismaModule`, `PrismaService`).
- **`prisma/schema.prisma`**: схема Prisma с подключением к PostgreSQL через `DATABASE_URL`.
- **Модули**:
  - `src/users/users.module.ts`
  - `src/tasks/tasks.module.ts`
  - `src/recurring/recurring.module.ts`
  - `src/reminders/reminders.module.ts`

Бизнес-логика и контроллеры/сервисы не реализованы, только структура.

### Окружение

Создайте файл `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

И задайте **`DATABASE_URL`** для PostgreSQL, например:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
PORT=3000
```

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

