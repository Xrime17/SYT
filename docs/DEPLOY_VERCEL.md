# Деплой фронта на Vercel

## Вариант: Vercel + бэкенд через ngrok

Фронт на Vercel (постоянный HTTPS), бэкенд — локально, в интернет через ngrok.

### Шаг 1. Запусти бэкенд и ngrok

```bash
# Терминал 1: бэкенд
cd /home/evgeny/projects/Syt && npm run start:dev

# Терминал 2: туннель на порт 3000
ngrok http 3000
```

Скопируй HTTPS-URL из ngrok (например `https://abc123.ngrok-free.app`). Он понадобится для Vercel.

### Шаг 2. Деплой на Vercel

1. Зайди на [vercel.com](https://vercel.com) → войди через GitHub.
2. **Add New…** → **Project** → импортируй репозиторий **Xrime17/SYT** (или твой репо).
3. **Root Directory:** нажми **Edit** → укажи **`frontend`**.
4. **Environment Variables:** добавь:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** URL из ngrok (из шага 1), например `https://abc123.ngrok-free.app`
5. Нажми **Deploy**.

Дождись окончания сборки. Скопируй URL проекта (например `https://syt-xxx.vercel.app`).

### Шаг 3. Кнопка Open в боте

В `.env` бэкенда добавь или измени:

```env
WEB_APP_URL=https://syt-xxx.vercel.app
```

(подставь свой URL с Vercel из шага 2.)

Перезапусти бэкенд (терминал 1: Ctrl+C и снова `npm run start:dev`).

### Итог

| Кто          | Где работает | URL                    |
|-------------|--------------|------------------------|
| Фронт       | Vercel       | https://syt-xxx.vercel.app |
| Бэкенд      | Твой ПК      | через ngrok → https://xxx.ngrok-free.app |

Кнопка **Open** в Telegram откроет фронт на Vercel; фронт ходит в API по ngrok-URL. Пока ngrok запущен — всё работает. Если ngrok перезапустишь, URL изменится — тогда в Vercel (Settings → Environment Variables) поменяй `NEXT_PUBLIC_API_URL` и сделай Redeploy.

---

## Туннель Cloudflare (cloudflared) — альтернатива ngrok

Бесплатно, без регистрации. Подходит, если ngrok недоступен с твоего IP (ошибка 9040) или не хочешь заводить аккаунт.

### Установка cloudflared

**Windows:**

1. Открой [Releases](https://github.com/cloudflare/cloudflared/releases), найди последний релиз.
2. Скачай **`cloudflared-windows-amd64.exe`** (или `cloudflared-windows-arm64.exe` на ARM).
3. Переименуй в `cloudflared.exe` и положи в папку, например `C:\cloudflared\`, или оставь на рабочем столе.
4. Чтобы вызывать из любого места: **Параметры системы** → **Дополнительно** → **Переменные среды** → в **Path** добавь папку с `cloudflared.exe`. Либо открывай туннель из той папки:
   ```cmd
   cd C:\cloudflared
   cloudflared.exe tunnel --url http://localhost:3000
   ```
5. Проверка (из папки с exe или если добавил в Path):
   ```cmd
   cloudflared --version
   ```

**Через winget (Windows 11 / новый Windows 10):**

```cmd
winget install --id Cloudflare.cloudflared
```

После установки открой **новый** терминал (cmd или PowerShell) и выполни:
```cmd
cloudflared tunnel --url http://localhost:3000
```

**Linux (WSL/Ubuntu, amd64):**

```bash
# Скачать бинарник
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o cloudflared
chmod +x cloudflared
sudo mv cloudflared /usr/local/bin/

# Проверка
cloudflared --version
```

**Другая ОС или архитектура:** [Releases](https://github.com/cloudflare/cloudflared/releases) — выбери нужный файл (например `cloudflared-linux-arm64`, `cloudflared-darwin-amd64` для macOS). Распакуй и добавь в PATH или запускай из папки.

### Запуск туннеля на бэкенд (порт 3000)

1. Запусти бэкенд в одном терминале:
   ```bash
   cd ~/projects/Syt && npm run start:dev
   ```

2. В **другом** терминале:
   ```bash
   cloudflared tunnel --url http://localhost:3000
   ```

3. В выводе появится что-то вроде:
   ```
   Your quick Tunnel has been created! Visit it at:
   https://random-words-1234.trycloudflare.com
   ```
   Скопируй этот **HTTPS-URL** — это публичный адрес твоего бэкенда.

### Как использовать этот URL

- **В Vercel:** Settings → Environment Variables → `NEXT_PUBLIC_API_URL` = `https://xxxx.trycloudflare.com` (твой URL из вывода). Затем Redeploy проекта.
- Фронт на Vercel будет слать запросы на этот адрес; туннель переправляет их на твой `localhost:3000`.

### Важно

- Туннель работает **пока запущен** процесс `cloudflared`. Закрыл терминал — URL перестаёт работать.
- При каждом новом запуске `cloudflared tunnel --url ...` выдаётся **новый URL**. Старый перестаёт работать. Поэтому после перезапуска туннеля нужно:
  1. Обновить `NEXT_PUBLIC_API_URL` в Vercel на новый URL.
  2. Сделать Redeploy фронта на Vercel (или подождать следующего деплоя).

Регистрация в Cloudflare для такого режима (**quick tunnel**) не нужна. Если захочешь постоянный один и тот же URL — тогда нужен аккаунт Cloudflare и именованный туннель (это уже отдельная настройка).

### Краткая шпаргалка

| Действие              | Команда |
|-----------------------|--------|
| Установить            | `curl -L ...cloudflared-linux-amd64 -o cloudflared && chmod +x cloudflared && sudo mv cloudflared /usr/local/bin/` |
| Запустить туннель     | `cloudflared tunnel --url http://localhost:3000` |
| Остановить            | Ctrl+C в терминале с cloudflared |

---

## Туннель localhost.run — без установки

Работает через SSH. Ничего ставить не нужно, если есть `ssh` (есть в Linux/macOS и в Windows 10/11 и WSL). **URL при каждом запуске новый.**

### Запуск

1. Запусти бэкенд на порту 3000:
   ```bash
   cd ~/projects/Syt && npm run start:dev
   ```

2. В **другом** терминале:
   ```bash
   ssh -R 80:localhost:3000 nokey@localhost.run
   ```

3. При первом запуске может спросить про fingerprint — введи `yes`.

4. В выводе появится что-то вроде:
   ```
   Connect to http://abc123.localhost.run or https://abc123.localhost.run
   ```
   Скопируй **HTTPS-URL** (например `https://abc123.localhost.run`) — это адрес твоего бэкенда.

### Использование с Vercel

- В Vercel: **Environment Variables** → `NEXT_PUBLIC_API_URL` = твой URL (например `https://abc123.localhost.run`).
- Сделай **Redeploy** проекта, чтобы фронт подхватил переменную.

### Важно

- Туннель живёт **пока открыт** терминал с `ssh`. Закрыл — URL перестаёт работать.
- При каждом новом запуске команды выше — **новый адрес**. Нужно обновить `NEXT_PUBLIC_API_URL` в Vercel и сделать Redeploy.

### Кратко

| Действие           | Команда |
|--------------------|--------|
| Запустить туннель  | `ssh -R 80:localhost:3000 nokey@localhost.run` |
| Остановить         | Ctrl+C в терминале с ssh |

---

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

## Деплой через Vercel CLI (без GitHub)

Можно задеплоить фронт прямо с компьютера, без пуша в репозиторий.

1. Установи Vercel CLI (один раз): `npm i -g vercel`
2. Из папки фронта выполни:
   ```bash
   cd /home/evgeny/projects/Syt/frontend
   vercel
   ```
   При первом запуске войди в аккаунт (логин через браузер). Если проект уже есть — выбери его; если нет — создай новый.
3. Для продакшен-деплоя (на основной URL проекта):
   ```bash
   vercel --prod
   ```
4. Переменная **NEXT_PUBLIC_API_URL**: если бэкенд по туннелю (ngrok/cloudflared), задай её в Vercel: **Dashboard → проект → Settings → Environment Variables** → добавь `NEXT_PUBLIC_API_URL` = URL бэкенда → **Redeploy**.

После деплоя URL будет в выводе (например `https://syt-two.vercel.app`). Этот же URL должен быть в `.env` как **WEB_APP_URL**.

## Кратко

| Шаг | Действие |
|-----|----------|
| 1 | Репозиторий Syt в GitHub |
| 2 | Vercel → Import → Root Directory: **frontend** |
| 3 | Добавить переменную **NEXT_PUBLIC_API_URL** (URL бэкенда) |
| 4 | Deploy → скопировать URL фронта |
| 5 | В бэкенде задать **WEB_APP_URL** = URL с Vercel |
