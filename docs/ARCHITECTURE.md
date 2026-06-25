# Architecture

## Overview

LeadParrot is a single Next.js (App Router) application. All server logic — auth, data access, source fetching, AI scoring, billing — runs server-side in server components, server actions, and route handlers. Browser code is limited to interactive client components.

```
Browser ──► Next.js App Router
              ├─ Server Components (read via DataStore)
              ├─ Server Actions  (src/lib/actions.ts — mutations)
              └─ Route Handlers  (api/*, auth/*)
                     │
        ┌────────────┼─────────────────────────┐
        ▼            ▼                          ▼
   DataStore     AI Service               Source Fetchers
  (memory |     (mock|openai|anthropic)  (reddit|hn|rss|manual|web)
   supabase)         │                          │
        │            ▼                          ▼
   Supabase     Provider APIs            Official/public APIs
  (Postgres+RLS)                          (+ demo fallback)
```

## Key design decision: dual data layer

The app targets a **`DataStore` interface** ([`src/lib/db/store.ts`](../src/lib/db/store.ts)) with two implementations:

- **`MemoryStore`** — seeded in-memory singleton. Active in **demo mode** (no Supabase env or `LEADPARROT_DEMO=1`). Makes the whole product clickable + the E2E suite runnable offline.
- **`SupabaseStore`** — Supabase queries, org-scoped, RLS-enforced. The production path.

`getStore()` returns the user-scoped store (RLS via cookie session); `getAdminStore()` returns the service-role store for background ingestion + admin reporting. Pages and actions never touch Supabase directly — they go through the interface, so both modes share identical UI/logic.

## Auth & context

- [`src/lib/auth.ts`](../src/lib/auth.ts): `getSessionUser()`, `getContext()` (user + org + subscription), `requireContext()` (redirects), `requireAdmin()`.
- In demo mode a stub demo user/org is returned. In Supabase mode, session comes from `@supabase/ssr` cookies, refreshed by middleware ([`src/lib/supabase/middleware.ts`](../src/lib/supabase/middleware.ts)).

## Request flows

**Scan a source** (`runScanAction` → [`src/lib/scan.ts`](../src/lib/scan.ts)):
`createSourceRun(pending→running)` → fetcher.fetch() → for each post: keyword pre-filter → usage check → upsert raw post (dedupe) → AI score → recompute weighted overall → persist lead + AI log + usage event → `running→success` (or `error`).

**Generate reply** (`generateReplyAction`): usage check → AI draftReply → persist `reply_drafts` (one per lead) + usage event.

**Score a manual post** (`addManualPostAction`): upsert raw post → score → lead → redirect to lead detail.

## AI abstraction

[`src/lib/ai/service.ts`](../src/lib/ai/service.ts) selects a provider from `AI_PROVIDER`, falling back to `mock` when a key is missing or a call throws. Providers implement `scoreLead` / `draftReply`. Output is validated with Zod ([`schemas/`](../src/lib/ai/schemas)); the canonical `overall_score` is always recomputed server-side from the weighted model so the model can't skew ranking.

## Sources

Each fetcher implements `SourceFetcher` and returns normalized `FetchedPost[]` plus `{ configured, usedMock, note }`. Unconfigured sources return deterministic demo posts + setup instructions instead of failing. A small state machine ([`status.ts`](../src/lib/sources/status.ts)) guards run transitions.

## Billing & email

- **Stripe**: REST-over-fetch abstraction ([`billing/stripe.ts`](../src/lib/billing/stripe.ts)) — checkout session creation + manual HMAC webhook verification. No SDK dependency.
- **Resend**: optional digest send ([`email/digest.ts`](../src/lib/email/digest.ts)); otherwise in-app preview.

Both report "not configured" rather than throwing.

## Rendering & runtime

- Server components read through the store; mutations are **server actions** that `revalidatePath` affected routes.
- Interactive bits (run scan, generate/copy reply, filters, status select) are client components calling server actions via `useTransition`.
- Middleware runs on the Edge runtime and only refreshes/guards sessions in Supabase mode (no-op in demo).

## Folder map

See the structure section in [`README.md`](../README.md). Core libs: `ai/`, `scoring/`, `sources/`, `db/`, `billing/`, `email/`, `usage/`, plus `scan.ts` (orchestration), `auth.ts`, `actions.ts`, `env.ts`, `plans.ts`.

## Testing

- **Unit** (Vitest): scoring math, Zod schemas, keyword filtering, usage limits, status machine, and a full scan-flow integration test against `MemoryStore`.
- **E2E** (Playwright): demo-mode happy path (discover → score → reply → copy).
