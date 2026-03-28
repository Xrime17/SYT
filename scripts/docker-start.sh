#!/bin/sh
# Единая точка входа в контейнере: миграции + Nest.
# Не полагаться только на Dockerfile CMD — в Railway UI Start Command часто его подменяет.
set -e
cd /app
export NPM_CONFIG_UPDATE_NOTIFIER=false
echo "[syt] docker-start: prisma migrate deploy"
npx prisma migrate deploy
echo "[syt] docker-start: starting Nest (PORT=${PORT:-unset})"
exec node dist/main.js
