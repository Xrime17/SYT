FROM node:20-alpine AS builder

WORKDIR /app

# Устанавливаем все зависимости (включая dev) для сборки — rimraf, nest-cli, prisma, typescript
COPY package.json nest-cli.json tsconfig*.json ./
COPY prisma ./prisma
RUN npm install
RUN npx prisma generate

COPY src ./src

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
# Меньше шума в логах Railway от npx/npm
ENV NPM_CONFIG_UPDATE_NOTIFIER=false

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

# Railway: миграции, затем API. Если в UI задан Start Command — он ПЕРЕЗАПИСЫВЕТ эту строку;
# там должно быть то же самое (migrate + node), иначе после migrate контейнер выйдет и будет 502.
CMD ["sh", "-c", "npx prisma migrate deploy && echo '[syt] migrations ok, starting Nest…' && exec node dist/main.js"]

