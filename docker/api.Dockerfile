FROM node:24-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY apps/api/src ./apps/api/src
COPY database ./database

EXPOSE 3000

CMD ["pnpm", "start"]
