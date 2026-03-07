# Деплой бэкенда Syt на Koyeb

Пошаговая инструкция: бэкенд (NestJS + Telegram-бот) на Koyeb, база PostgreSQL, фронт на Vercel подключается к API по постоянному URL.

## Что нужно заранее

- Репозиторий **SYT** на GitHub (с Dockerfile в корне).
- Фронт уже задеплоен на Vercel (URL вида `https://syt-two.vercel.app`).
- Токен Telegram-бота и (опционально) готовая PostgreSQL — в Koyeb можно создать БД.

---

## Шаг 1. Регистрация и создание сервиса

1. Открой [app.koyeb.com](https://app.koyeb.com) и войди через **GitHub** (или Google).
2. Нажми **Create Web Service**.
3. В качестве источника выбери **GitHub**. Если Koyeb ещё не подключён:
   - нажми **Install GitHub App**, выбери аккаунт/организацию;
   - выдай доступ ко всем репо или только к **SYT** → **Install**.
4. В списке репозиториев выбери **SYT** (или вставь URL публичного репо) → **Continue**.

---

## Шаг 2. Настройка сборки

1. **Branch:** оставь `main` (или нужную ветку).
2. **Builder:** выбери **Dockerfile**.
3. **Dockerfile path:** оставь пустым или укажи `Dockerfile` (файл в корне репо).
4. **Build:** больше ничего не меняй — Koyeb соберёт образ из Dockerfile.

---

## Шаг 3. Порты и маршруты

1. В блоке **Exposed ports** добавь порт:
   - **Port:** `3000`
   - **Protocol:** `http`
2. В **Routes** (если спрашивают): укажи маршрут к порту 3000, например `/:3000` или оставь дефолт (часто подставляется автоматически при одном порте).

---

## Шаг 4. Переменные окружения

В **Environment variables** добавь (подставь свои значения):

| Name               | Value |
|--------------------|--------|
| `PORT`             | `3000` |
| `DATABASE_URL`     | см. шаг 5 |
| `TELEGRAM_BOT_TOKEN` | токен от @BotFather |
| `WEB_APP_URL`      | URL фронта на Vercel, например `https://syt-two.vercel.app` |

`DATABASE_URL` можно взять из Koyeb Database (шаг 5) или из внешнего сервиса (Neon, Supabase и т.д.).

---

## Шаг 5. База данных PostgreSQL

### Вариант A: PostgreSQL в Koyeb

1. В том же Koyeb-проекте нажми **Create** → **Database**.
2. Выбери **PostgreSQL**, регион тот же, что и у сервиса (например Frankfurt).
3. Создай БД; в настройках будет строка подключения (внутренний URL в сети Koyeb или публичный, в зависимости от тарифа).
4. Скопируй **Connection string** и вставь в переменную **DATABASE_URL** сервиса (шаг 4). Формат обычно:  
   `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require`

### Вариант B: Внешняя БД (Neon, Supabase и т.д.)

Создай базу в сервисе, скопируй connection string и вставь в **DATABASE_URL** в настройках сервиса на Koyeb.

---

## Шаг 6. Регион и тип инстанса

1. **Region:** выбери ближайший (например **Frankfurt**).
2. **Instance type:** если доступен бесплатный — выбери его; иначе минимальный платный.

---

## Шаг 7. Имя и деплой

1. **Service name:** например `syt-backend`.
2. Нажми **Deploy**. Koyeb соберёт образ по Dockerfile, выполнит при старте `npx prisma migrate deploy` и запустит приложение.
3. Дождись зелёного статуса. Скопируй **публичный URL** сервиса (вид: `https://syt-backend-XXXXX.koyeb.app` или похожий).

---

## Шаг 8. Проверка API

Открой в браузере:

```
https://ТВОЙ-URL.koyeb.app/health
```

Ожидаемый ответ: `{"status":"ok","timestamp":"..."}`.

Если видишь 404 или ошибку — проверь, что в настройках сервиса порт **3000** открыт и маршрут ведёт на него.

---

## Шаг 9. Подключение фронта (Vercel)

1. Зайди в [Vercel](https://vercel.com) → проект фронта → **Settings** → **Environment Variables**.
2. Добавь или измени переменную:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://ТВОЙ-URL.koyeb.app` (без слэша в конце)
3. Сохрани и сделай **Redeploy** проекта.

После этого фронт будет ходить в API на Koyeb. Кнопка **Open** в Telegram откроет фронт на Vercel; бот по-прежнему работает на бэкенде Koyeb.

---

## Если что-то пошло не так

- **Ошибка при сборке:** смотри **Logs** в карточке сервиса на Koyeb (Build logs). Убедись, что в репо в корне есть `Dockerfile`, `package.json`, `prisma/schema.prisma`.
- **502 / сервис не стартует:** открой **Logs** (Runtime). Проверь, что `DATABASE_URL` верный и миграции проходят (`prisma migrate deploy` в Dockerfile уже есть).
- **Бот не отвечает:** проверь, что `TELEGRAM_BOT_TOKEN` и `WEB_APP_URL` заданы в Environment variables и после их смены сделан **Redeploy** (Deploy → Deploy without rebuild или Deploy with build).

---

## Краткий чеклист

| Шаг | Действие |
|-----|----------|
| 1 | Koyeb → Create Web Service → GitHub → репо SYT |
| 2 | Builder: Dockerfile |
| 3 | Ports: 3000, http |
| 4 | Env: PORT, DATABASE_URL, TELEGRAM_BOT_TOKEN, WEB_APP_URL |
| 5 | Создать PostgreSQL (Koyeb или внешний) → подставить DATABASE_URL |
| 6 | Region + Instance type → Deploy |
| 7 | Скопировать URL сервиса → проверить /health |
| 8 | Vercel: NEXT_PUBLIC_API_URL = URL Koyeb → Redeploy |
