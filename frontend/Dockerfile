# 멀티스테이지 빌드를 위한 베이스 이미지
FROM node:18-alpine AS base

# 의존성 설치 스테이지
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 패키지 매니저 파일들 복사
COPY package.json pnpm-lock.yaml* ./

# pnpm 설정 및 의존성 설치
RUN corepack enable
RUN corepack prepare pnpm@9.0.0 --activate
RUN pnpm install --frozen-lockfile

# 빌드 스테이지
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js 텔레메트리 비활성화
ENV NEXT_TELEMETRY_DISABLED 1

# 애플리케이션 빌드
RUN corepack enable
RUN corepack prepare pnpm@9.0.0 --activate
RUN pnpm build

# 프로덕션 이미지 스테이지
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# 시스템 사용자 생성
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# pnpm 설치
RUN corepack enable
RUN corepack prepare pnpm@9.0.0 --activate

# 필요한 파일들 복사
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js

# 소유권 변경
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["pnpm", "start"] 