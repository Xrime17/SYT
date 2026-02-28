# Syt Frontend (Telegram Mini App)

React (Next.js) + TypeScript + TailwindCSS. Трекер задач как **Telegram Mini App**: открывается по кнопке **Open** в боте.

## Как пользоваться

1. В Telegram открой бота и нажми **Start** (регистрация).
2. Нажми кнопку **Open** (в меню рядом с полем ввода или в сообщении после Start) — откроется веб-приложение.
3. Пользователь подставляется автоматически из Telegram, без ввода логина.

Если открыть фронт в обычном браузере (не из Telegram), будет показано: «Откройте приложение в Telegram (Start → Open)».

## Запуск

```bash
npm install
npm run dev
```

Фронт: **http://localhost:3001**. Бэкенд: **http://localhost:3000**.

В `.env.local` (по желанию):

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Деплой на Vercel (HTTPS для кнопки Open)

Пошагово: **[docs/DEPLOY_VERCEL.md](../docs/DEPLOY_VERCEL.md)**.

Кратко: Vercel → Import репозитория → **Root Directory: `frontend`** → задать `NEXT_PUBLIC_API_URL` (URL бэкенда) → Deploy. Полученный URL подставить в бэкенд как `WEB_APP_URL`.

## Бот и кнопка Open

В backend в `.env` задай:

```env
WEB_APP_URL=https://твой-фронт.vercel.app
```

После запуска бэкенда бот выставит кнопку меню **Open** с этим URL.

## Структура

- `src/pages` — index, tasks, recurring, reminders
- `src/components` — Button, Input, Card, TaskItem, Layout, TelegramUserLoader
- `src/hooks/useTelegramUser.ts` — автовход по Telegram initData
- `src/api` — client, users, tasks, recurring, reminders
- `src/context/UserContext.tsx` — пользователь, telegramLoading, telegramError

## Следующий шаг

- Страница **tasks** с `GET /tasks/:userId` и кнопками Create / Edit / Delete.
