# Supabase for BBWA

## Summary

Operational guide for the Supabase layer of BBWA: migrations, Edge Functions, environment variables, local development, and deployment.

## Overview

- Who it's for: contributors working on backend platform pieces (database, Edge Functions, automation).
- What it covers: migrations, seeding, type generation, Edge Functions (secrets, local dev, deployment, invocation, scheduling), environment variables, local workflow, production notes, security, troubleshooting.
- What it doesn't: Next.js UI code beyond environment setup; see `apps/web/` for app specifics.

## Table of Contents

- [Summary](#summary)
- [Overview](#overview)
- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
- [Project linking and environments](#project-linking-and-environments)
- [Database](#database)
  - [Migrations](#migrations)
  - [Seeding](#seeding)
  - [Type generation](#type-generation)
- [Edge Functions](#edge-functions)
  - [Function overview](#function-overview)
  - [Secrets management (CLI)](#secrets-management-cli)
  - [Local development (Edge Functions)](#local-development-edge-functions)
  - [Deployment](#deployment)
  - [Invocation endpoints](#invocation-endpoints)
  - [Scheduling (expiry-reminders)](#scheduling-expiry-reminders)
- [Environment variables (web app)](#environment-variables-web-app)
  - [Client-safe](#client-safe)
  - [Server-only (never exposed to client)](#server-only-never-exposed-to-client)
  - [Feature flags](#feature-flags)
- [Local development workflow](#local-development-workflow)
- [Production (Netlify + Supabase)](#production-netlify--supabase)
- [Security](#security)
- [Troubleshooting](#troubleshooting)

## Quick Start

Get the Supabase stack working end-to-end.

```bash
# 1) Authenticate and link (once per machine)
supabase login
supabase link --project-ref <project_ref>

# 2) Apply DB schema
supabase db push

# 3) Generate types for the web app
supabase gen types typescript --linked > apps/web/src/types/supabase.generated.ts

# 4) Serve a function locally (example)
supabase functions serve airtable-faq --no-verify-jwt
```

Next: see [Database](#database) and [Edge Functions](#edge-functions) for details.

## Prerequisites

- Supabase CLI installed and authenticated
  - Install: [Supabase CLI docs](https://supabase.com/docs/guides/cli)
  - Login: `supabase login`
- Project linked: `supabase link --project-ref <project_ref>`
- Node.js 18+ and pnpm/npm for the web app

## Project linking and environments

- Link once per machine: `supabase link --project-ref <project_ref>`
- Verify link: `supabase projects list` or `supabase status`
- Local DB optional: `supabase start` (only if you want local Postgres/emulators)

## Database

### Migrations

- Files live in `supabase/migrations/` and follow `YYYYMMDDHHMMSS_description.sql`.
- Never edit existing migrations; always create a new one.
- All tables must enforce RLS with baseline policies.

Common CLI:

```bash
 # Create a new empty migration file (edit it manually)
 supabase migration new add_new_table

 # Push all local migrations to the linked project
 supabase db push
 ```

### Seeding

- Seed file: `supabase/seed.sql` (projects + FAQs sample data).
- Recommended: run in the Supabase SQL Editor against your project.

### Type generation

Keep the app types in sync with the database:

```bash
 # From repo root
 supabase gen types typescript --linked > apps/web/src/types/supabase.generated.ts
 ```

Notes:

- Re-run after schema changes.
- Commit `apps/web/src/types/supabase.generated.ts` to VCS.

## Edge Functions

Location: `supabase/functions/`

### Function overview

- airtable-faq (GET) — Purpose: fetch FAQs from Airtable with caching + ETag. Secrets: `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`, `AIRTABLE_FAQ_TABLE`.
- airtable-contact-forward (POST) — Purpose: forward validated contact submissions to Airtable with idempotency. Secrets: `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`, `AIRTABLE_CONTACT_TABLE`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
- expiry-reminders (POST, scheduled) — Purpose: send reminders for certifications expiring in 30 days with audit + dedup. Secrets: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `AUTOMATION_PROVIDER` ('make'|'n8n'), `MAKE_WEBHOOK_URL` or `N8N_WEBHOOK_URL`, `INDUCTION_URL`. Scheduling: see `supabase/functions/expiry-reminders/README.md` for pg_cron and alternatives.
- process-white-card (POST) — Purpose: OCR pipeline (mock) for white card images; updates `certifications`, triggers notifications. Secrets: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
- notify-builder (POST) — Purpose: send builder notifications on processing results. Secrets: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `BUILDER_EMAIL`.
- notify-compliance-alert (POST) — Purpose: send compliance alerts (email + optional SMS) with rate limiting and audits. Secrets: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `BUILDER_ALERT_EMAIL`, `BUILDER_ALERT_PHONE`.

### Secrets management (CLI)

```bash
 # From repo root; requires project linked
 supabase functions secrets set \
   AIRTABLE_API_KEY=... \
   AIRTABLE_BASE_ID=... \
   AIRTABLE_FAQ_TABLE=FAQ \
   AIRTABLE_CONTACT_TABLE=Contacts \
   SUPABASE_URL=https://<project>.supabase.co \
   SUPABASE_SERVICE_ROLE_KEY=sbp_... \
   BUILDER_EMAIL=ops@example.com \
   BUILDER_ALERT_EMAIL=alerts@example.com \
   BUILDER_ALERT_PHONE=+61XXXXXXXXX \
   AUTOMATION_PROVIDER=make \
   MAKE_WEBHOOK_URL=https://hook.make.com/... \
   N8N_WEBHOOK_URL=https://n8n.example.com/webhook/... \
   INDUCTION_URL=https://your-app.netlify.app/induction

 # Inspect
 supabase functions secrets list
 ```

Notes:

- Service role key is server-only. Never expose it in `apps/web/`.
- Prefer function secrets over web app env for third-party credentials (Airtable, etc.).

### Local development (Edge Functions)

```bash
 # Optional: start local stack
 supabase start

 # Serve functions (disable JWT for local testing where appropriate)
 supabase functions serve airtable-faq --no-verify-jwt
 supabase functions serve airtable-contact-forward --no-verify-jwt
 # ...serve others in separate terminals as needed
 ```

### Deployment

```bash
 # Deploy individual functions
 supabase functions deploy airtable-faq --project-ref <project_ref>
 supabase functions deploy airtable-contact-forward --project-ref <project_ref>
 supabase functions deploy expiry-reminders --project-ref <project_ref>
 supabase functions deploy process-white-card --project-ref <project_ref>
 supabase functions deploy notify-builder --project-ref <project_ref>
 supabase functions deploy notify-compliance-alert --project-ref <project_ref>
 ```

### Invocation endpoints

- Base: `https://<project>.supabase.co/functions/v1/<name>`
- Auth — Public GET (e.g., `airtable-faq`): no auth in dev; consider JWT in prod if needed.
- Auth — Private POST (e.g., `airtable-contact-forward`, `expiry-reminders`): use `Authorization: Bearer <SERVICE_ROLE_KEY>`.

### Scheduling (expiry-reminders)

- Use pg_cron or external schedulers (GitHub Actions / Netlify) with Service Role auth.
- See `supabase/functions/expiry-reminders/README.md` for ready-to-copy snippets.

## Environment variables (web app)

File: `apps/web/.env.example`

### Client-safe

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (preferred) or `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

### Server-only (never exposed to client)

- `SUPABASE_SERVICE_ROLE_KEY`
- AI provider keys: `GEMINI_API_KEY`, `OPENAI_API_KEY`
- Session secret: `SESSION_SECRET`
- Do NOT store Airtable secrets in the Next.js env; keep them as function secrets.

### Feature flags

- `FAQ_SOURCE` ('local' default, or 'airtable')
- `FAQ_LIMIT`

## Local development workflow

 1) Link project once: `supabase link --project-ref <project_ref>`
 2) Apply DB changes: `supabase db push`
 3) Generate types: `supabase gen types typescript --linked > apps/web/src/types/supabase.generated.ts`
 4) Start web: `pnpm --filter web dev` or `npm run dev` inside `apps/web/`
 5) Serve/deploy functions as needed (see above)

## Production (Netlify + Supabase)

- Netlify site env vars:
  - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (or anon)
- Function secrets live in Supabase (CLI or Dashboard). Netlify does not inject them.
- Use scheduled jobs (pg_cron or external) for `expiry-reminders`.

## Security

- RLS enabled for all tables. Design policies before exposing routes.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` outside Edge Functions / server-only contexts.
- Rotate keys periodically; re-run `supabase functions secrets set` when rotated.

## Troubleshooting

- 401 calling functions: ensure `--no-verify-jwt` locally or proper `Authorization` header in prod.
- Idempotency conflicts in `airtable-contact-forward`: duplicates return `{ ok: true, idempotent: true }`.
- Types out of date: re-run the gen command after applying migrations.
- CLI push issues: confirm project link and auth (`supabase status`, `supabase login`).
