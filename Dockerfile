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

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

# Миграции в Supabase применяются вручную (pooler не поддерживает migrate). Старт приложения:
CMD ["node", "dist/main.js"]

