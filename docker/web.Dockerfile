FROM node:24-alpine AS build

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/package.json
RUN pnpm install --frozen-lockfile

COPY apps/web ./apps/web

# The public browser API path is handled by the gateway Nginx service.
ENV VITE_API_URL=/api
RUN pnpm --filter @defi-wallet-explorer/web build

FROM nginx:1.27-alpine

COPY docker/nginx/web.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80
