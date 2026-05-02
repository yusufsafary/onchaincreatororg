# OnchainCreator — Web3 Creator Marketplace

## Overview
A Web3 creator marketplace connecting content creators with onchain projects. Creators can browse campaigns, get verified, and get paid. Projects can find and hire verified Web3 content creators.

Ported from: https://github.com/yusufsafary/onchaincreatororg

## Architecture

### Monorepo (pnpm workspaces)
- `artifacts/onchaincreator/` — Frontend web app (Vite static HTML)
- `artifacts/api-server/` — Express 5 backend API
- `lib/db/` — Drizzle ORM + PostgreSQL schema
- `lib/api-spec/` — OpenAPI spec
- `lib/api-zod/` — Generated Zod schemas
- `lib/api-client-react/` — Generated React Query hooks

### Frontend (`artifacts/onchaincreator/`)
- Pure HTML/CSS/JS site (no React) served via Vite
- Bilingual: English + Japanese toggle
- Features: Hero, Campaigns browser, How it Works, Team, Blog, Dashboard
- Supabase auth integration (Google OAuth) — requires SUPABASE_URL + SUPABASE_ANON_KEY env vars to activate
- Waitlist form posts to `/api/waitlist`

### Backend (`artifacts/api-server/`)
- Express 5 API at `/api` prefix
- Routes:
  - `GET /api/healthz` — health check
  - `GET /api/config` — returns Supabase config (currently returns null to disable auth)
  - `POST /api/waitlist` — saves email signups to PostgreSQL

### Database
- Replit PostgreSQL (via Drizzle ORM)
- Schema: `lib/db/src/schema/waitlist.ts`
  - `waitlist` table: id, email (unique), role, handle, chain, created_at

## Key URLs
- Frontend: `/` (port 24892 in dev)
- API: `/api` (port 8080 in dev)

## Enabling Supabase Auth (Optional)
To enable Google OAuth login:
1. Create a Supabase project at supabase.com
2. Set `SUPABASE_URL` and `SUPABASE_ANON_KEY` environment variables
3. Update `artifacts/api-server/src/routes/config.ts` to return the real values

## Development
- Frontend: `pnpm --filter @workspace/onchaincreator run dev`
- API: `pnpm --filter @workspace/api-server run dev`
- DB push: `pnpm --filter @workspace/db run push`
