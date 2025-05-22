FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS builder
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY package.json pnpm-lock.yaml  ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .

ARG ENVIRONMENT=dev
ENV NODE_ENV production
RUN pnpm run build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --prod

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

COPY --from=builder --chown=nestjs:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist /app/dist
COPY --from=builder --chown=nestjs:nodejs /app/package.json /app/package.json

USER nestjs

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]

