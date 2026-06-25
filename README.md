# 🦜 LeadParrot

**Find customers already asking for what you sell — and get a useful reply draft before your competitors see the thread.**

LeadParrot is a high-intent lead-discovery and reply-draft tool. It monitors **public/allowed** sources (Reddit official API, Hacker News, RSS, manual paste), scores buyer intent with AI, and drafts helpful, non-spammy replies you review and post yourself.

> LeadParrot **does not** auto-post, auto-DM, scrape private communities, or spam anyone. It is a discovery + drafting tool — you stay in control.

---

## Highlights

- **Validation-first & runs with zero secrets.** With no env configured the app boots in **demo mode**: seeded in-memory data + a deterministic mock AI provider, so the entire product is clickable offline.
- **Provider abstraction.** AI = `mock | openai | anthropic`. Sources degrade to demo data + setup instructions when not configured. Stripe/Resend show "not configured" instead of crashing.
- **Safe by design.** Official APIs only, keyword + negative-keyword filtering, affiliation disclosure in every reply draft, prominent platform-rules disclaimers.
- **Org-scoped data with RLS.** Postgres schema + Row Level Security so no cross-organization leakage.

---

## Tech stack

Next.js (App Router) · TypeScript · Tailwind CSS · Supabase (Postgres/Auth/Storage/RLS) · Zod · Stripe (REST abstraction) · Resend (optional) · Vitest · Playwright.

---

## Quick start (local)

```bash
# 1. Install
npm install

# 2. (Optional) configure env — everything is optional; omit for demo mode
cp .env.example .env.local

# 3. Run
npm run dev
# open http://localhost:3000
```

With **no** `.env.local`, the app runs in **demo mode**: visit `/login` → "Enter demo workspace".

To force demo mode even with Supabase configured: `LEADPARROT_DEMO=1`.

---

## Environment variables

All optional. See [`.env.example`](.env.example) for the full list.

| Group | Vars | If missing |
| --- | --- | --- |
| Supabase | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Demo mode (in-memory data, stub user) |
| AI | `AI_PROVIDER` (`mock`/`openai`/`anthropic`), `OPENAI_API_KEY`, `ANTHROPIC_API_KEY` | Deterministic mock provider |
| Reddit | `REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET`, `REDDIT_USER_AGENT` | Reddit scans return demo posts + setup note |
| Email | `RESEND_API_KEY`, `DIGEST_FROM_EMAIL` | Digest is in-app preview only |
| Stripe | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_PRICE_*` | "Billing not configured" |
| App | `NEXT_PUBLIC_APP_URL`, `ADMIN_EMAILS` | Localhost default; admin gated by demo/role |

---

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Copy the URL + anon key + service-role key into `.env.local`.
3. Run the migrations (below).
4. Enable **Email** auth (and any OAuth providers you want) in the Supabase dashboard.

### Running migrations

The SQL lives in [`supabase/migrations`](supabase/migrations):

- `0001_init.sql` — schema, triggers (auto-profile, auto-membership, `updated_at`).
- `0002_rls.sql` — Row Level Security policies + `is_org_member()` helper.

**Using the Supabase CLI (recommended):**

```bash
npm i -g supabase
supabase link --project-ref <your-ref>
supabase db push          # applies migrations in supabase/migrations
```

**Or paste into the SQL editor:** run `0001_init.sql` then `0002_rls.sql` in order.

See [`docs/DATABASE.md`](docs/DATABASE.md) for the full schema + RLS model.

---

## Mock AI usage

Default `AI_PROVIDER=mock`. The mock provider (`src/lib/ai/providers/mock.ts`) returns **deterministic** scoring + reply drafts derived from the post text and your keywords/competitors — no network, fully reproducible (great for tests and demos).

Switch to a real provider by setting `AI_PROVIDER=openai` (or `anthropic`) **and** the matching API key. If the key is missing, the provider transparently falls back to the mock so nothing breaks. See [`docs/AI_SCORING_WORKFLOW.md`](docs/AI_SCORING_WORKFLOW.md).

---

## Running tests

```bash
npm run test        # Vitest unit tests (scoring, schemas, keywords, usage, status, scan flow)
npm run typecheck   # tsc --noEmit
npm run lint        # next lint

# E2E (demo mode, offline):
npx playwright install chromium   # one-time
npm run test:e2e
```

---

## Source integrations (summary)

| Source | Status | Notes |
| --- | --- | --- |
| Manual | ✅ Always on | Paste a public URL/text, scored on demand |
| Reddit | ✅ Official API | App-only OAuth, read-only, configurable subreddits/sort/window. **No auto-commenting.** |
| Hacker News | ✅ Public API | Algolia HN Search (no auth) |
| RSS | ✅ | Any public RSS/Atom feed |
| Web search | 🔜 Placeholder | Reserved for SerpAPI/Tavily/Exa/Bing. **No scraping.** |

Details + safety rules: [`docs/SOURCE_INTEGRATIONS.md`](docs/SOURCE_INTEGRATIONS.md), [`docs/PLATFORM_SAFETY.md`](docs/PLATFORM_SAFETY.md).

---

## Deployment

Works on **Vercel** or **Railway**. Set the env vars, run migrations against your Supabase project, point `NEXT_PUBLIC_APP_URL` at your domain, and configure the Stripe webhook to `POST /api/stripe/webhook`. Full guide: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

---

## Project structure

```
src/
  app/                 # App Router pages + route handlers
    page.tsx           # Landing
    pricing/ demo/     # Marketing
    login/ signup/ onboarding/ auth/
    app/               # Authenticated area (/app/*): dashboard, projects, leads, billing, settings, digest, admin
    api/               # demo/score, stripe/checkout, stripe/webhook
  components/          # UI + interactive client components
  lib/
    ai/                # provider abstraction + Zod schemas + prompts
    scoring/           # weighted score + keyword matching
    sources/           # reddit / hackernews / rss / manual / web-search fetchers + status machine
    db/                # DataStore interface, memory + supabase implementations, seed
    billing/ email/    # Stripe + Resend abstractions
    usage/             # plan limit checks
    scan.ts            # source → filter → AI → lead orchestration
supabase/migrations/   # schema + RLS
tests/unit/  tests/e2e/
docs/
```

---

## Documentation

- [PRD](docs/PRD.md) · [Architecture](docs/ARCHITECTURE.md) · [Database](docs/DATABASE.md)
- [AI scoring workflow](docs/AI_SCORING_WORKFLOW.md) · [Source integrations](docs/SOURCE_INTEGRATIONS.md)
- [Platform safety](docs/PLATFORM_SAFETY.md) · [Compliance](docs/COMPLIANCE.md)
- [Validation plan](docs/VALIDATION_PLAN.md) · [Deployment](docs/DEPLOYMENT.md)

---

## Disclaimer

> LeadParrot helps you discover public conversations and draft replies. **You are responsible for following each platform's rules before responding.** LeadParrot does not post for you.
