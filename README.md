# DeFi Wallet Relationship Explorer

React/Vite frontend with an Express API backed by CognoDB.

## Run locally

Copy `.env.example` to `.env` and provide CognoDB credentials, then run:

```bash
pnpm install
pnpm db:schema
pnpm db:seed
pnpm dev
```

In another terminal, run `pnpm --filter @defi-wallet-explorer/web dev` and open the Vite URL.

## Docker deployment

The Compose stack has an API, a static web container, and an Nginx gateway. Nginx exposes only port 80 and proxies `/api/*` to the API.

```bash
docker compose up -d --build
docker compose ps
```

For a new database, run once:

```bash
docker compose run --rm api pnpm db:schema
docker compose run --rm api pnpm db:seed
```

Visit `http://localhost`. To publish it, run this on a server with a public IP and allow inbound TCP port 80 in the host firewall and cloud security group. Then visit `http://SERVER_PUBLIC_IP`, or point your domain's A/AAAA record at that IP. Add TLS before exposing port 443.
