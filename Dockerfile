# NestJS Builder
FROM node:22-alpine as nestjs-builder

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm prisma generate --schema  ./apps/backend/prisma/schema.prisma

EXPOSE 3000

CMD ["sh", "-c", "(/opt/keycloak/bin/kc.sh start-dev &) && (pnpm nx serve backend)"]
