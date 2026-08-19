# ==========================================
# Multi-Stage Production Dockerfile for NestJS API
# ==========================================

# 1. Dependency Installation Stage
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
COPY package.json package-lock.json* ./
COPY prisma ./prisma/
RUN npm ci --legacy-peer-deps

# 2. Build Stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build
RUN npm prune --production --legacy-peer-deps

# 3. Production Runtime Stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

RUN addgroup --system --gid 1001 nestgroup
RUN adduser --system --uid 1001 nestuser

COPY --from=builder --chown=nestuser:nestgroup /app/dist ./dist
COPY --from=builder --chown=nestuser:nestgroup /app/node_modules ./node_modules
COPY --from=builder --chown=nestuser:nestgroup /app/prisma ./prisma
COPY --from=builder --chown=nestuser:nestgroup /app/package.json ./package.json

USER nestuser

EXPOSE 4000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
