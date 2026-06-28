# The Leads Nest — Credentials Required (Definitive Reference)

> Codename: LeadParrot. Platform-safe lead-discovery SaaS. Single source of truth
> for every credential the app reads, what each turns on, and how to obtain it.
> Verified against `src/lib/env.ts`, `.env.example`, `scripts/verify-env.ts`,
> `vercel.json`, and the route handlers.

---

## 1. You need ZERO credentials to start

The app runs end-to-end with **no secrets**. Out of the box it boots in **demo
mode**: Supabase unset → seeded in-memory data + a stub admin user; `AI_PROVIDER`
defaults to `mock` → deterministic, free AI; every source/billing/email/alert
channel sits in a "not configured" state that **degrades to a setup note instead
of crashing**. Clone → `npm install` → run → click the whole product, and even
ship a Vercel preview, with zero keys. Everything below is for **turning on real
features and deploying** — add credentials one feature at a time.

---

## 2. The three tiers

The app feature-detects each variable individually at runtime (there is no
"profile" in code). `npm run verify:env` encodes the tiers via `--prod` /
`--integrated` flags (default = demo). **The checker is presence-only** — it does
not validate key/URL format, Stripe completeness, or whether migrations ran.

### Tier A — Nothing (demo mode)
Services: **none**. `verify:env` (no flag) can never fail.

### Tier B — Minimum to deploy a real alpha
Services: **Supabase + a host (Vercel)**. Exactly **4 required vars**
(`verify:env -- --prod` fails if any is missing):

| Var | Service |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase |
| `NEXT_PUBLIC_APP_URL` | App config |

Real Postgres + Auth + RLS + real accounts. AI stays `mock`; everything else
degrades. Strongly recommended (not enforced): `ADMIN_EMAILS` (admin page
reachable in real mode) and `CRON_SECRET` (so the digest can run).

### Tier C — Full production (AI + billing + alerts)
Tier-B vars **plus** the AI key matching `AI_PROVIDER`, Stripe, an email sender,
and any alert channels you want.

> **`--integrated` adds exactly ONE hard requirement over `--prod`:** the single
> AI key matching `AI_PROVIDER` (`openai`→`OPENAI_API_KEY`,
> `anthropic`→`ANTHROPIC_API_KEY`). If `AI_PROVIDER` is `mock`/unset, it requires
> the same 4 vars as `--prod`. All other Tier-C vars stay "optional" in the
> checker even though the feature needs them to actually work.

---

## 3. Per-service detail

### 3.1 Supabase — Postgres + Auth + RLS  *(required to leave demo mode)*

| Env var | Required? | Purpose | Format |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Tier B | Project URL; presence (with anon key) leaves demo mode. | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Tier B | Public, browser-facing key; RLS-enforced. | JWT `eyJhbGci...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Tier B | **Server-only**; **bypasses RLS** for cron digest, webhook writes, ingestion. | JWT `eyJhbGci...` |

Detectors: `isSupabaseConfigured()` = URL **and** anon key. `hasServiceRole()` =
URL **and** service-role key.

**Get it:** supabase.com → **New project** (set a strong DB password, pick a
region near Vercel) → **Settings → API** → copy **Project URL**, the **`anon`
public** key, and the **`service_role`** key.

**Provider-side setup:**
- **Migrations:** CLI `supabase login` → `supabase link --project-ref <ref>`
  (ref under Settings → General) → `supabase db push`. Or paste
  `supabase/migrations/0001_init.sql` then `0002_rls.sql` into the SQL editor —
  **in that order** (RLS references init's tables).
- **Auth → URL Configuration:** Site URL = your prod URL (match
  `NEXT_PUBLIC_APP_URL`); add Redirect URLs
  `https://your-domain/auth/callback` and `http://localhost:3000/auth/callback`;
  enable **Email** auth.

**Cost:** free tier fine for alpha; ~$25/mo for always-on prod.

**Security:** anon key is **public-safe** (RLS protects data). Service-role key
**bypasses RLS** (used only in `src/lib/supabase/admin.ts`) — **never** give it a
`NEXT_PUBLIC_` prefix; rotate immediately if leaked.

**Missing →** no URL+anon = demo mode; no service role = cron digest no-ops and
the Stripe webhook skips the DB write (still 200).

### 3.2 AI provider — OpenAI **or** Anthropic *(default `mock`)*

| Env var | Required? | Purpose | Format |
|---|---|---|---|
| `AI_PROVIDER` | Optional (default `mock`) | `mock` \| `openai` \| `anthropic`. | `mock` |
| `OPENAI_API_KEY` | If `openai` | Real OpenAI provider. | `sk-proj-...` |
| `OPENAI_MODEL` | Optional | default `gpt-4o-mini`. | model id |
| `ANTHROPIC_API_KEY` | If `anthropic` | Real Anthropic provider. | `sk-ant-api03-...` |
| `ANTHROPIC_MODEL` | Optional | default `claude-haiku-4-5-20251001`. | model id |

No `isXConfigured()` helper — `getAIProvider()` uses `AI_PROVIDER` + the matching
key, and **falls back to `mock` if the key is missing** (never crashes).

**Get it:** OpenAI → platform.openai.com/api-keys → **Create secret key** (+ add
billing). Anthropic → console.anthropic.com → **Settings → API Keys → Create Key**
(+ add credit).

**Cost:** pay-as-you-go, no real free tier; `mock` is free. **Security:** both
keys server-only.

### 3.3 Reddit — official app-only API *(optional source)*

| Env var | Required? | Purpose | Format |
|---|---|---|---|
| `REDDIT_CLIENT_ID` | Optional | OAuth client id (read-only). | ~22 chars |
| `REDDIT_CLIENT_SECRET` | Optional | OAuth client secret. | ~27 chars |
| `REDDIT_USER_AGENT` | Optional | Required UA string; default `leadparrot/0.1`. | `leadparrot/0.1 by u/you` |

Detector: `isRedditConfigured()` = id **and** secret (UA not part of the gate).

**Get it:** reddit.com/prefs/apps → **create another app** → type **script**,
redirect uri `http://localhost:3000` → the string under the name is the
**client id**, the `secret` field is the **secret**.

**Missing →** Reddit fetcher returns demo posts + setup note. **Never scrapes.**

### 3.4 Email — Resend (digests) and/or SMTP (alerts)

Two paths. `resolvedEmailProvider()` picks: explicit `EMAIL_PROVIDER`, else
**SMTP if configured, else Resend, else `console`** (in-app/log preview).

| Env var | Required? | Purpose | Format |
|---|---|---|---|
| `RESEND_API_KEY` | Optional | Send digests via Resend. | `re_...` |
| `FROM_EMAIL` | Optional | Verified sender (falls back to `DIGEST_FROM_EMAIL`, then a code default). | `Name <digest@you.com>` |
| `DIGEST_FROM_EMAIL` | Optional (legacy) | Alias, used only if `FROM_EMAIL` unset. | same |
| `EMAIL_PROVIDER` | Optional | `smtp` \| `resend` \| `console` (blank = auto). | `smtp` |
| `SMTP_HOST` | If using SMTP | SMTP server host. | `smtp.gmail.com` |
| `SMTP_USER` | If using SMTP | Login/username. | `apikey` (SendGrid) / address |
| `SMTP_PASS` | If using SMTP | Password / app password / API key. | secret |
| `SMTP_PORT` | Optional (default `587`) | Port. | `587` / `465` |
| `SMTP_SECURE` | Optional (default `false`) | TLS mode. | `true` for 465 |
| `SMTP_FROM` | Optional (has default) | From address. | `Name <alerts@you.com>` |

Detectors: `isResendConfigured()` = `RESEND_API_KEY`. **`isSmtpConfigured()` =
`SMTP_HOST` AND `SMTP_USER` AND `SMTP_PASS`** (port/secure/from have defaults and
are **not** in the gate). `isEmailChannelConfigured()` = SMTP **or** Resend.

**Get Resend:** resend.com → **verify your sending domain** (add SPF/DKIM DNS) →
**API Keys → Create** (`re_...`). Generous free tier.

**Get SMTP (pick one):** Gmail → enable 2FA → **App passwords** (host
`smtp.gmail.com`, 587, secure false, user = your address). SendGrid → API key,
host `smtp.sendgrid.net`, user literally `apikey`. AWS SES → **SMTP settings →
Create SMTP credentials**, host `email-smtp.<region>.amazonaws.com`.

**Missing →** no Resend = digest is `previewOnly`; SMTP incomplete falls back to
Resend → console. Email is never a hard failure.

### 3.5 SMS — Twilio *(optional alert channel)*

| Env var | Required? | Purpose | Format |
|---|---|---|---|
| `TWILIO_ACCOUNT_SID` | For SMS | Twilio account SID. | `AC...` (34 ch) |
| `TWILIO_AUTH_TOKEN` | For SMS | Auth token. | 32-char hex |
| `TWILIO_SMS_FROM` | For SMS | Twilio-owned sending number (E.164). | `+1XXXXXXXXXX` |

Detector: `isTwilioSmsConfigured()` = SID **and** token **and** `TWILIO_SMS_FROM`.

**Get it:** twilio.com → Console dashboard shows **Account SID** + **Auth Token**
→ **Phone Numbers → Buy a number** (SMS-capable). On a trial account, add the
owner's number under **Verified Caller IDs**.

**Missing →** channel disabled with a setup note. **Owner-only:** alerts go only
to the owner's verified number.

### 3.6 WhatsApp — Twilio **or** Meta Cloud API *(pick one)*

| Env var | Required? | Purpose | Format |
|---|---|---|---|
| `TWILIO_WHATSAPP_FROM` | Twilio path | WhatsApp sender; reuses Twilio SID/token. | `whatsapp:+14155238886` |
| `WHATSAPP_TOKEN` | Meta path | Permanent access token. | opaque |
| `WHATSAPP_PHONE_NUMBER_ID` | Meta path | Phone-number ID. | `109...` |
| `WHATSAPP_TEMPLATE_NAMESPACE` | **Optional** | Template namespace (used at send time, **not** part of the config gate). | GUID-like |

Detector: `isWhatsAppConfigured()` = (`TWILIO_WHATSAPP_FROM` **and** Twilio SID
**and** token) **OR** (`WHATSAPP_TOKEN` **and** `WHATSAPP_PHONE_NUMBER_ID`).
Namespace is **not** required to be "configured".

**Get it (Twilio):** Console → **Messaging → Try WhatsApp** (sandbox
`whatsapp:+14155238886`); prod via **Messaging → Senders → WhatsApp senders**.
**Get it (Meta):** developers.facebook.com → create a Business app → add
**WhatsApp** → API Setup gives the phone-number ID; create a permanent **System
User** token; **WhatsApp Manager → Message templates** to create/approve the alert
template (its namespace → `WHATSAPP_TEMPLATE_NAMESPACE`).

**Missing →** disabled with a setup note. **Owner-only**, and business-initiated
messages must use a **pre-approved template** ("You have N new high-intent leads
in {{project}}"), not free text.

### 3.7 Stripe — billing *(optional)*

| Env var | Required? | Purpose | Format |
|---|---|---|---|
| `STRIPE_SECRET_KEY` | For billing | Checkout + REST. | `sk_live_` / `sk_test_` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | For billing | Public key; with secret, flips `isStripeConfigured()`. | `pk_live_` / `pk_test_` |
| `STRIPE_WEBHOOK_SECRET` | Conditional | HMAC-verifies webhook events. | `whsec_...` |
| `NEXT_PUBLIC_STRIPE_PRICE_STARTER/PRO/AGENCY` | Optional | Plan price ids (preferred). | `price_...` |
| `STRIPE_PRICE_STARTER/PRO/AGENCY` | Optional (legacy) | Server-only aliases, used if the `NEXT_PUBLIC_` one is unset. | `price_...` |

Detector: `isStripeConfigured()` = secret **and** publishable (price ids and
webhook secret are **not** in this gate).

**Get it:** dashboard.stripe.com → **Developers → API keys** (publishable +
secret; use Test mode for non-prod). **Product catalog** → create
Starter/Pro/Agency products with **recurring** prices → copy each price **API ID**.
**Developers → Webhooks → Add endpoint** → URL
`https://<domain>/api/stripe/webhook` → events `checkout.session.completed`,
`customer.subscription.updated`, `customer.subscription.deleted` → copy the
**Signing secret** (`whsec_...`).

**Missing →** unconfigured = "Billing not configured", checkout is a safe no-op.
**Webhook nuance:** if Stripe is fully unconfigured **and** no webhook secret,
the webhook is a safe 200 no-op; but if Stripe is otherwise configured while the
secret is missing, it **refuses with 500** (won't trust unverified events).

### 3.8 Web-search — Tavily / Exa / SerpAPI *(optional, v1 placeholder)*

| Env var | Required? | Purpose | Format |
|---|---|---|---|
| `WEB_SEARCH_PROVIDER` | Optional | Generic selector. | `tavily` |
| `WEB_SEARCH_API_KEY` | Optional | Generic key. | provider key |
| `TAVILY_API_KEY` | Optional | Tavily. | `tvly-...` |
| `EXA_API_KEY` | Optional | Exa. | UUID-ish |
| `SERPAPI_API_KEY` | Optional | SerpAPI. | 64-char hex |

Detector: `isWebSearchConfigured()` = any one of Tavily/Exa/SerpAPI **or**
(`WEB_SEARCH_PROVIDER` **and** `WEB_SEARCH_API_KEY`).

**Get it:** Tavily app.tavily.com → API Keys; Exa dashboard.exa.ai → Create key;
SerpAPI serpapi.com → Dashboard → private key. **Never scrapes** — official APIs
only. In v1 the source returns demo data + a setup note even with a key set.
(Note: `WEB_SEARCH_PROVIDER`/`WEB_SEARCH_API_KEY` are read by `env.ts` but are
**not** in `.env.example` or `verify-env.ts`.)

### 3.9 Jobs / cron + observability

| Env var | Required? | Purpose | Format |
|---|---|---|---|
| `CRON_SECRET` | Conditional | Bearer token for `/api/cron/digest`; Vercel Cron sends it automatically. | `openssl rand -hex 32` |
| `ERROR_WEBHOOK_URL` | Optional | POST target for captured errors (Slack/collector). | `https://hooks.slack.com/...` |
| `LEADPARROT_DEMO` | Optional | Force demo mode (`1`); used by E2E/CI. | `1` |
| `CI` | Optional | Auto-set by CI; tunes Playwright. | — |
| `PLAYWRIGHT_BASE_URL` | Optional | Override E2E base URL. | `http://localhost:3000` |

`vercel.json` already schedules `/api/cron/digest` **daily at 13:00 UTC**. You
**generate `CRON_SECRET` yourself** (`openssl rand -hex 32`) and set it in Vercel
env. Route: no secret → 503 (can't run anonymously); wrong bearer → 401; correct
but no service role → clean no-op; idempotent per UTC day.

### 3.10 App config / admin

| Env var | Required? | Purpose | Format |
|---|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Tier B | Public base URL (Stripe return URLs, digest links, OG metadata). **Inlined at build → redeploy after changing.** | `https://leadparrot.com` (no trailing slash) |
| `ADMIN_EMAILS` | Optional (recommended) | Comma-separated admin allow-list. | `you@x.com,ops@x.com` |

`isAdminEmail()` = always true in demo mode; in real mode, true only if the email
is in `ADMIN_EMAILS`.

---

### 3.11 Browser extension — distribution accounts (Phase 10)

The extension introduces **no new server env var** — it authenticates with a
**per-user, revocable, hashed API token** minted in `/app/settings` and stored in
the database (migration `0005_extension_tokens.sql`). What it needs:

| Account | Cost | Purpose |
|---|---|---|
| Chrome Web Store developer account | **one-time $5** | Publish to Chrome/Edge users. |
| Microsoft Edge Add-ons account | free | Optional Edge listing. |
| Firefox AMO account | free | Optional; `moz-extension://<id>` (CORS allowlist) is known only **after AMO signing**. |

Store review also requires a **published privacy policy** (single-purpose +
minimal-permission justification). The extension is configured client-side with
the app's **API base URL** (user pastes their token + origin in the Options page).
Full spec: `docs/EXTENSION_BUILD_PROMPT.md`. **Security:** the token is a bearer
secret — server-only at rest (hashed), revocable, never `NEXT_PUBLIC_`.

---

## 4. Consolidated checklist — every env var

Secret = `yes` means **server-only, never commit, never `NEXT_PUBLIC_`**.

| Env var | Service | Tier | Required? | Secret? |
|---|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase | alpha | Required (real) | no |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase | alpha | Required (real) | no (RLS-safe) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase | alpha | Required (real) | **yes** |
| `NEXT_PUBLIC_APP_URL` | App | alpha | Required (prod) | no |
| `ADMIN_EMAILS` | App | alpha | Recommended | **yes** |
| `CRON_SECRET` | Cron | alpha | Conditional | **yes** |
| `AI_PROVIDER` | AI | prod | Optional (`mock`) | no |
| `OPENAI_API_KEY` | AI | prod | If `openai` | **yes** |
| `OPENAI_MODEL` | AI | prod | Optional | no |
| `ANTHROPIC_API_KEY` | AI | prod | If `anthropic` | **yes** |
| `ANTHROPIC_MODEL` | AI | prod | Optional | no |
| `REDDIT_CLIENT_ID` | Reddit | prod | Optional | **yes** |
| `REDDIT_CLIENT_SECRET` | Reddit | prod | Optional | **yes** |
| `REDDIT_USER_AGENT` | Reddit | prod | Optional | no |
| `RESEND_API_KEY` | Email | prod | Optional | **yes** |
| `FROM_EMAIL` | Email | prod | Optional | no |
| `DIGEST_FROM_EMAIL` | Email (legacy) | prod | Optional | no |
| `EMAIL_PROVIDER` | Email | prod | Optional | no |
| `SMTP_HOST` | Email/SMTP | prod | If SMTP | no |
| `SMTP_USER` | Email/SMTP | prod | If SMTP | **yes** |
| `SMTP_PASS` | Email/SMTP | prod | If SMTP | **yes** |
| `SMTP_PORT` | Email/SMTP | prod | Optional (587) | no |
| `SMTP_SECURE` | Email/SMTP | prod | Optional (false) | no |
| `SMTP_FROM` | Email/SMTP | prod | Optional (default) | no |
| `TWILIO_ACCOUNT_SID` | SMS | prod | If SMS | **yes** |
| `TWILIO_AUTH_TOKEN` | SMS | prod | If SMS | **yes** |
| `TWILIO_SMS_FROM` | SMS | prod | If SMS | no |
| `TWILIO_WHATSAPP_FROM` | WhatsApp | prod | Twilio path | no |
| `WHATSAPP_TOKEN` | WhatsApp | prod | Meta path | **yes** |
| `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp | prod | Meta path | no |
| `WHATSAPP_TEMPLATE_NAMESPACE` | WhatsApp | prod | Optional | no |
| `STRIPE_SECRET_KEY` | Stripe | prod | For billing | **yes** |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe | prod | For billing | no |
| `STRIPE_WEBHOOK_SECRET` | Stripe | prod | Conditional | **yes** |
| `NEXT_PUBLIC_STRIPE_PRICE_STARTER` | Stripe | prod | Optional | no |
| `NEXT_PUBLIC_STRIPE_PRICE_PRO` | Stripe | prod | Optional | no |
| `NEXT_PUBLIC_STRIPE_PRICE_AGENCY` | Stripe | prod | Optional | no |
| `STRIPE_PRICE_STARTER/PRO/AGENCY` | Stripe (legacy) | prod | Optional | **yes** |
| `WEB_SEARCH_PROVIDER` | Web-search | prod | Optional | no |
| `WEB_SEARCH_API_KEY` | Web-search | prod | Optional | **yes** |
| `TAVILY_API_KEY` | Web-search | prod | Optional | **yes** |
| `EXA_API_KEY` | Web-search | prod | Optional | **yes** |
| `SERPAPI_API_KEY` | Web-search | prod | Optional | **yes** |
| `ERROR_WEBHOOK_URL` | Observability | prod | Optional | **yes** |
| `LEADPARROT_DEMO` | Demo/CI | demo | Optional | no |
| `CI` | CI | demo | Optional | no |
| `PLAYWRIGHT_BASE_URL` | E2E | demo | Optional | no |

---

## 5. Security rules

1. **Never commit `.env.local`.** The repo ships `.env.example` with all
   **secrets blank** (non-secret config like `SMTP_PORT=587`, `AI_PROVIDER=mock`,
   the model names, and `NEXT_PUBLIC_APP_URL` ship with sensible defaults).
2. **`NEXT_PUBLIC_*` is public** — inlined into the browser bundle. Only the
   Supabase URL + **anon** key, Stripe **publishable** key + price ids, and the
   app URL belong there.
3. **Server-only secrets must never get a `NEXT_PUBLIC_` prefix** — the
   service-role key (bypasses RLS), every `*_SECRET` / `*_TOKEN` / `*_PASS`, and
   all provider API keys.
4. **Rotate on leak**, in the provider dashboard, then update Vercel.
5. **Alerts target the account owner only** — their own verified email/number,
   about their own leads, sourced only from org settings. No adapter may be
   invoked with a non-owner recipient; channels go live only after a verification
   step. WhatsApp business-initiated alerts use a **pre-approved template**.
6. **Never scrapes, never auto-posts.** Missing credentials always degrade to a
   safe demo/preview state.

---

## 6. Notification layer — exact build status (important)

The env **plumbing** for alerts is already in place; the **delivery code is not**.
Specifically:

- ✅ `src/lib/env.ts` reads all `EMAIL_PROVIDER` / `SMTP_*` / `TWILIO_*` /
  `WHATSAPP_*` vars and exports the detectors `isSmtpConfigured`,
  `isEmailChannelConfigured`, `resolvedEmailProvider`, `isTwilioSmsConfigured`,
  `isWhatsAppConfigured`.
- ✅ `.env.example` documents all of them.
- ✅ `package.json` **declares** `nodemailer` (`^6.10.0`) + `@types/nodemailer`.
- ❌ **`nodemailer` is declared but NOT installed** in `node_modules` — run
  `npm install` before using it.
- ❌ **No `twilio` SDK dependency** — SMS/WhatsApp will need the `twilio` package
  added (or implement raw Twilio/Meta REST calls).
- ❌ **No delivery adapter code yet** — there is no `src/lib/notify/` (or
  `notifications/`) dispatcher/adapters, and no `/app/settings` channel UI. This
  is Phase 8 of `docs/BUILD_PROMPT.md`; use the `notification-channels` skill.
- ❌ `scripts/verify-env.ts` does **not** check any notification var (they're all
  optional).

So: to actually send alerts you need (1) `npm install`, (2) the `twilio` dep if
using SMS/WhatsApp, (3) the adapter + dispatcher + settings UI built, (4) the
credentials above set per channel.

---

## 7. Known doc discrepancies (cosmetic)

- `FROM_EMAIL` default differs across three files: `env.ts` →
  `The Leads Nest <digest@theleadsnest.com>`; `.env.example` →
  `LeadParrot <digest@yourdomain.com>`; `docs/ENVIRONMENT_MATRIX.md` →
  `LeadParrot <digest@example.com>`. The code (`env.ts`) is authoritative.
- `WEB_SEARCH_PROVIDER` / `WEB_SEARCH_API_KEY` are read by `env.ts` but are not
  listed in `.env.example` or `verify-env.ts`.

**Sources:** `src/lib/env.ts`, `.env.example`, `scripts/verify-env.ts`,
`vercel.json`, `src/app/api/cron/digest/route.ts`,
`src/app/api/stripe/webhook/route.ts`, `src/lib/supabase/admin.ts`,
`docs/DEPLOYMENT.md`, `docs/SUPABASE_PRODUCTION_RUNBOOK.md`,
`docs/VERCEL_DEPLOYMENT_RUNBOOK.md`.
