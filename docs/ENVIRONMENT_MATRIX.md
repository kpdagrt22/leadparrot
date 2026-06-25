# LeadParrot — Environment Variable Matrix

LeadParrot is **validation-first**: every integration is optional and the app runs end-to-end with **zero secrets**. When a key is missing, the code does not throw at startup — it detects what is configured (`src/lib/env.ts`) and **degrades gracefully** to mock/demo behavior. This document is the single source of truth for what each variable does, where it lives, and what happens when it is absent.

Key behaviors confirmed from the codebase:

- **Demo mode** runs automatically whenever Supabase is not configured (or when `LEADPARROT_DEMO=1`). It serves seeded in-memory data and a stub demo user, so the whole product is clickable offline.
- **`AI_PROVIDER` defaults to `mock`** — deterministic demo scoring/replies with no API calls and no spend.
- LeadParrot **never scrapes**. The web-search keys (Tavily / Exa / SerpAPI) are reserved for **official search APIs only**.
- Useful scripts: `npm run dev`, `npm run build`, `npm run test`, `npm run typecheck`, `npm run lint`, and `npm run verify:env` (sanity-checks your environment configuration).

## Conventions

- **`NEXT_PUBLIC_*`** variables are inlined into the browser bundle by Next.js. They are **public / non-secret** by design — never put a real secret behind a `NEXT_PUBLIC_` name.
- All other variables are **server-only**. `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, the AI provider keys, and `REDDIT_CLIENT_SECRET` are **true secrets** and must never reach the client.
- "Required locally?" assumes you want the full real experience for that feature. **Nothing is required to start the app locally** — missing keys fall back to mock/demo.

---

## Full variable matrix

| variable | required locally? | required production? | public / server-only | used by | placeholder? | failure behavior (missing/blank) | Vercel location | security notes |
|---|---|---|---|---|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | No (demo mode without it) | **Yes** (real auth/data) | **Public** (browser) | Supabase auth, DB, storage; `isSupabaseConfigured()` | No | App runs in **demo mode**: in-memory seeded data + stub demo user | Project → Settings → Environment Variables | Public project URL, not a secret. Pairs with the anon key (RLS enforces access — see `0002_rls.sql`). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No (demo mode without it) | **Yes** (real auth/data) | **Public** (browser) | Supabase client auth/queries; `isSupabaseConfigured()` | No | App runs in **demo mode** (same as above) | Project → Settings → Environment Variables | Anon key is intended for the browser; safe **only** because Row Level Security (migrations `0001_init.sql` + `0002_rls.sql`) restricts rows. Not a privileged key. |
| `SUPABASE_SERVICE_ROLE_KEY` | No | Recommended (background ingestion) | **Server-only (SECRET)** | Privileged server tasks / ingestion; `hasServiceRole()` | No | Service-role features (background ingestion) are skipped; app still runs on anon + RLS | Project → Settings → Environment Variables | **Bypasses RLS.** Highest-privilege key in the system. Server-only — never expose to the client, never log. |
| `AI_PROVIDER` | No (defaults to `mock`) | No (defaults to `mock`) | Server-only (non-secret) | AI abstraction; selects `mock` \| `openai` \| `anthropic` | No (has default `mock`) | Defaults to **`mock`**: deterministic demo scoring/replies, no API calls | Project → Settings → Environment Variables | Not a secret. Set to `openai` or `anthropic` to enable real AI (also needs the matching key). |
| `OPENAI_API_KEY` | No | Only if `AI_PROVIDER=openai` | **Server-only (SECRET)** | OpenAI calls when `AI_PROVIDER=openai` (default model `gpt-4o-mini` via `OPENAI_MODEL`) | No | If provider is `openai` but key missing, falls back to mock AI behavior | Project → Settings → Environment Variables | Billable API secret. Server-only — never inline into the client. |
| `ANTHROPIC_API_KEY` | No | Only if `AI_PROVIDER=anthropic` | **Server-only (SECRET)** | Anthropic calls when `AI_PROVIDER=anthropic` (default model `claude-haiku-4-5-20251001` via `ANTHROPIC_MODEL`) | No | If provider is `anthropic` but key missing, falls back to mock AI behavior | Project → Settings → Environment Variables | Billable API secret. Server-only — never inline into the client. |
| `REDDIT_CLIENT_ID` | No | Only for live Reddit source | Server-only | Reddit official API; `isRedditConfigured()` | No | Reddit source returns **mock demo posts + setup instructions** | Project → Settings → Environment Variables | Public-ish client identifier, but keep with its secret. Official API only — no scraping. |
| `REDDIT_CLIENT_SECRET` | No | Only for live Reddit source | **Server-only (SECRET)** | Reddit OAuth; `isRedditConfigured()` | No | Reddit source returns mock demo posts + setup instructions | Project → Settings → Environment Variables | OAuth client secret. Server-only — never expose to the client. |
| `REDDIT_USER_AGENT` | No (default `leadparrot/0.1`) | Recommended for live Reddit | Server-only (non-secret) | Reddit API request header | No (has default) | Defaults to `leadparrot/0.1` | Project → Settings → Environment Variables | Not a secret. Reddit asks for a descriptive UA (e.g. `leadparrot/0.1 by your_reddit_username`). |
| `TAVILY_API_KEY` | No | Only for live web-search source | **Server-only (SECRET)** | Official search API; `isWebSearchConfigured()` | **Yes — reserved placeholder (official API only, no scraping)** | Web-search source shows "requires API key" and returns demo data | Project → Settings → Environment Variables | Billable API secret. Server-only. Reserved for official search APIs — LeadParrot never scrapes. |
| `EXA_API_KEY` | No | Only for live web-search source | **Server-only (SECRET)** | Official search API; `isWebSearchConfigured()` | **Yes — reserved placeholder (official API only, no scraping)** | Web-search source shows "requires API key" and returns demo data | Project → Settings → Environment Variables | Billable API secret. Server-only. Official search API only. |
| `SERPAPI_API_KEY` | No | Only for live web-search source | **Server-only (SECRET)** | Official search API; `isWebSearchConfigured()` | **Yes — reserved placeholder (official API only, no scraping)** | Web-search source shows "requires API key" and returns demo data | Project → Settings → Environment Variables | Billable API secret. Server-only. Official search API only. |
| `RESEND_API_KEY` | No | Only to send real digest emails | **Server-only (SECRET)** | Email digests via Resend; `isResendConfigured()` | No | Daily digest is shown as an **in-dashboard preview only** (no email sent) | Project → Settings → Environment Variables | Email-sending secret. Server-only — never expose to the client. |
| `FROM_EMAIL` | No (has default) | Recommended when sending email | Server-only (non-secret) | Digest sender identity (legacy `DIGEST_FROM_EMAIL` also accepted) | No (default `LeadParrot <digest@example.com>`) | Falls back to the default sender string | Project → Settings → Environment Variables | Not a secret. Use a domain you've verified in Resend. |
| `STRIPE_SECRET_KEY` | No | **Yes** for live billing | **Server-only (SECRET)** | Stripe server API; `isStripeConfigured()` (with publishable key) | No | Billing UI shows **"Billing not configured"** | Project → Settings → Environment Variables | Full Stripe account secret. Server-only — never log, never expose to the client. |
| `STRIPE_WEBHOOK_SECRET` | No | **Yes** for webhook verification | **Server-only (SECRET)** | Verifies Stripe webhook signatures | No | Webhook events cannot be verified/processed (billing events skipped) | Project → Settings → Environment Variables | Signing secret — protects the webhook endpoint from forgery. Server-only. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | No | **Yes** for live billing | **Public** (browser) | Stripe.js at checkout; `isStripeConfigured()` (with secret key) | No | Billing UI shows "Billing not configured" | Project → Settings → Environment Variables | Publishable key is designed for the browser — not a secret, but pair with the server secret to enable billing. |
| `NEXT_PUBLIC_STRIPE_PRICE_STARTER` | No | Yes for Starter plan checkout | **Public** (browser) | Checkout price id (legacy server `STRIPE_PRICE_STARTER` accepted) | No | Starter plan cannot be checked out | Project → Settings → Environment Variables | Price ID, not a secret. Create in the Stripe dashboard. |
| `NEXT_PUBLIC_STRIPE_PRICE_PRO` | No | Yes for Pro plan checkout | **Public** (browser) | Checkout price id (legacy server `STRIPE_PRICE_PRO` accepted) | No | Pro plan cannot be checked out | Project → Settings → Environment Variables | Price ID, not a secret. Create in the Stripe dashboard. |
| `NEXT_PUBLIC_STRIPE_PRICE_AGENCY` | No | Yes for Agency plan checkout | **Public** (browser) | Checkout price id (legacy server `STRIPE_PRICE_AGENCY` accepted) | No | Agency plan cannot be checked out | Project → Settings → Environment Variables | Price ID, not a secret. Create in the Stripe dashboard. |
| `NEXT_PUBLIC_APP_URL` | No (default `http://localhost:3000`) | **Yes** (correct redirects/links) | **Public** (browser) | Absolute URLs, OAuth/Stripe redirects, email links | No (has localhost default) | Falls back to `http://localhost:3000` (wrong links in prod) | Project → Settings → Environment Variables | Not a secret. **Must** be set to your real deployed origin in production or redirects/links break. |
| `ADMIN_EMAILS` | No | Recommended (admin page access) | Server-only (non-secret) | `isAdminEmail()` — gate for the internal admin page | No | Empty list → no real users are admin (in **demo mode** the stub user is always admin) | Project → Settings → Environment Variables | Not a secret, but controls access to the internal page. Comma-separated, case-insensitive. |

> Note: `OPENAI_MODEL`, `ANTHROPIC_MODEL`, `WEB_SEARCH_PROVIDER`, `WEB_SEARCH_API_KEY`, `DIGEST_FROM_EMAIL` (legacy), the legacy server-only `STRIPE_PRICE_*` names, and `LEADPARROT_DEMO` also exist in `src/lib/env.ts`. They are optional/legacy/alias variables and are not part of the required-vars profiles below.

---

## Setup profiles

Each profile lists the **exact** variables that profile needs. Variables not listed for a profile can be left blank — the app degrades gracefully.

### 1. Local Mock — *nothing required*

The default `npm run dev` experience. **Zero secrets.** With no Supabase configured, the app runs in **demo mode** (seeded in-memory data + stub demo user), and with `AI_PROVIDER` unset it defaults to **`mock`** AI (deterministic scoring/replies, no API spend). Every page is clickable; the stub demo user is treated as admin.

**Required:** *(none)*

```
# .env.local can be empty. Optionally:
AI_PROVIDER=mock          # already the default
LEADPARROT_DEMO=1         # optional: force demo even if Supabase is set
```

Run: `npm run dev` (or `npm run test` / `npm run build` — all pass with no secrets).

### 2. Production Alpha Minimum — *real auth + data, mock everything else*

The smallest real deployment: real Supabase (auth, Postgres, RLS) and correct production URLs, while AI stays on `mock` and all source/billing/email integrations stay in their demo/"not configured" states.

**Required (4):**

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=https://your-domain.example
```

Notes:
- Setting the three Supabase vars takes the app **out of demo mode** — apply migrations `0001_init.sql` and `0002_rls.sql` first so tables and RLS exist.
- `NEXT_PUBLIC_APP_URL` **must** be your real origin (default localhost will break redirects/links).
- `AI_PROVIDER` left unset/`mock` — no AI spend. Reddit/web-search/Stripe/Resend remain in demo/"requires key"/"not configured" states.
- Set `ADMIN_EMAILS` if you need the internal admin page reachable for real users (in non-demo mode the stub-admin shortcut no longer applies).

### 3. Production Integrated Test — *Alpha Minimum + real integrations under test*

Everything in Alpha Minimum, **plus** one real AI provider key and whichever source / billing / email integrations you are actively testing. Add only the integrations you want live; the rest keep degrading gracefully.

**Required (Alpha Minimum):**

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=https://your-domain.example
```

**AI provider (pick one) — required to leave mock AI:**

```
AI_PROVIDER=openai          # or: anthropic
OPENAI_API_KEY=             # if AI_PROVIDER=openai
# ANTHROPIC_API_KEY=        # if AI_PROVIDER=anthropic
```

**Reddit source under test (both required together):**

```
REDDIT_CLIENT_ID=
REDDIT_CLIENT_SECRET=
REDDIT_USER_AGENT=leadparrot/0.1 by your_reddit_username
```

**Web-search source under test (any one official key — no scraping):**

```
TAVILY_API_KEY=
# EXA_API_KEY=
# SERPAPI_API_KEY=
```

**Stripe billing under test (all required for end-to-end checkout):**

```
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_STRIPE_PRICE_STARTER=
NEXT_PUBLIC_STRIPE_PRICE_PRO=
NEXT_PUBLIC_STRIPE_PRICE_AGENCY=
```

**Email digests under test (Resend):**

```
RESEND_API_KEY=
FROM_EMAIL=LeadParrot <digest@yourdomain.com>
```

**Admin page:**

```
ADMIN_EMAILS=you@yourdomain.com,teammate@yourdomain.com
```

---

## Verifying your configuration

- `npm run verify:env` — checks which integrations are detected vs. missing.
- `npm run typecheck` / `npm run lint` / `npm run test` — must pass with **zero secrets** (Local Mock).
- `npm run build` then `npm run start` — production build smoke test.

## Security reminders

- Put **secrets** (`SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, AI keys, `REDDIT_CLIENT_SECRET`, search-API keys, `RESEND_API_KEY`) only in **server-side** Vercel environment variables. Never give a secret a `NEXT_PUBLIC_` name.
- Anything `NEXT_PUBLIC_*` is shipped to the browser — treat it as public.
- The Supabase **anon** key is safe in the browser only because **RLS** (`0002_rls.sql`) restricts data; the **service-role** key bypasses RLS and is strictly server-only.
- LeadParrot never auto-posts, auto-DMs, scrapes private/paywalled sources, or runs browser automation. Source keys are for **official APIs only**.
