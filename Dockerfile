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
COPY scripts/docker-start.sh /app/docker-start.sh
RUN chmod +x /app/docker-start.sh

EXPOSE 3000

# Локальный Docker / fallback; на Railway приоритет у `deploy.startCommand` в railway.toml
CMD ["/app/docker-start.sh"]

