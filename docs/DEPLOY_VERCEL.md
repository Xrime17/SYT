# Деплой фронта на Vercel

## 1. Репозиторий на GitHub

Если проекта ещё нет в GitHub:

```bash
cd /home/evgeny/projects/Syt
git init
git add .
git commit -m "Initial commit"
# Создай репозиторий на github.com и выполни:
git remote add origin https://github.com/ТВОЙ_ЮЗЕР/Syt.git
git push -u origin main
```

## 2. Подключение к Vercel

1. Зайди на [vercel.com](https://vercel.com) и войди (через GitHub).
2. **Add New…** → **Project**.
3. **Import** репозиторий **Syt** (если не видно — настрой доступ к GitHub в Vercel).
4. **Важно:** в настройках проекта задай **Root Directory**: нажми **Edit** рядом с путём и укажи **`frontend`**. Тогда Vercel будет собирать только фронт.
5. **Environment Variables** (можно задать при импорте или потом в Settings → Environment Variables):
   - `NEXT_PUBLIC_API_URL` = URL твоего бэкенда, например:
     - для продакшена: `https://твой-backend.railway.app` (или Render, Fly.io и т.п.),
     - пока бэкенд локально/туннель: `https://твой-ngrok.ngrok.io` (туннель на порт 3000).
6. Нажми **Deploy**.

После деплоя получишь адрес вида **`https://syt-xxx.vercel.app`** (или свой домен, если подключишь).

## 3. Кнопка Open в боте

В `.env` бэкенда (локально или на сервере) укажи этот адрес:

```env
WEB_APP_URL=https://syt-xxx.vercel.app
```

Перезапусти бэкенд. В Telegram у бота появится кнопка **Open**, открывающая этот URL.

## 4. Бэкенд для продакшена

Фронт на Vercel ходит на API по `NEXT_PUBLIC_API_URL`. Нужен доступный по HTTPS бэкенд:

- **Railway** — [railway.app](https://railway.app), залить папку с NestJS, добавить PostgreSQL.
- **Render** — [render.com](https://render.com), Web Service + PostgreSQL.
- **Fly.io** — деплой через Docker.

На бэкенде включи CORS для домена фронта (у тебя в коде уже `origin: true` — разрешены все; для прода лучше указать `https://твой-фронт.vercel.app`).

## Кратко

| Шаг | Действие |
|-----|----------|
| 1 | Репозиторий Syt в GitHub |
| 2 | Vercel → Import → Root Directory: **frontend** |
| 3 | Добавить переменную **NEXT_PUBLIC_API_URL** (URL бэкенда) |
| 4 | Deploy → скопировать URL фронта |
| 5 | В бэкенде задать **WEB_APP_URL** = URL с Vercel |
