# The Leads Nest — Master Build Prompt

The phased prompt for building **all functionality** and **wiring it to the
backend**, from login through SMTP email / SMS / WhatsApp alerts — themed to
**The Crest** (the dashboard screenshot: Cloud-Dancer paper, one Verdigris
accent, Newsreader + IBM Plex, 0px/pill corners, 1px borders).

> How to use this file: run **one phase at a time**. Paste the phase's prompt,
> let the listed agent drive it, finish with the listed skills/gates, then move
> on. Each phase is independently shippable in demo mode (zero secrets).

---

## Operating rules (apply to every phase)

1. **Read first:** `CLAUDE.md`, then the relevant `docs/`. Summarize the goal
   before editing.
2. **Wire every feature through all layers** — use the `wire-feature` skill:
   route → form (RHF + Zod) → server action / API route → Zod validation →
   org ownership check → `DataStore` method in **both** `MemoryStore` and
   `SupabaseStore` (kept at parity) → env feature-flag + graceful demo fallback
   → tests.
3. **Demo-mode-first:** the whole app must run end-to-end with **zero secrets**.
   Every integration is optional and degrades to a "not configured" state +
   setup note — never a crash.
4. **Platform safety is law:** no auto-post, no auto-DM, no scraping, no ToS
   evasion. Every reply draft carries an affiliation disclosure. **Alerts go to
   the account owner only, never to a lead.** Run `platform-safety-audit` on any
   source/reply/notification change.
5. **Theme:** all UI via the `crest-design` skill / `docs/handoff/`.
6. **Done = `release-gate` green** (verify:env · typecheck · lint ·
   test:coverage · build · e2e) + security check for sensitive changes.
   **Never merge to `main` or deploy without explicit human approval.**
7. End every phase with: files changed · tests run · demo path · known
   limitations · next human steps.

Delegate with the fleet in `.claude/agents/`:
`product-owner` (scope) · `architecture` (design) · `supabase-rls` (DB/RLS) ·
`ai-workflow` (AI) · `frontend-ux` (UI) · `security-compliance` (audit) ·
`qa-test` (tests) · `devops-release` (CI/deploy) · `gtm-validation` /
`support-feedback` (validation).

---

## Phase 0 — Baseline audit (do this first)

> **Prompt:** "Act as the `architecture` agent. Read `CLAUDE.md` and map the
> CURRENT state of The Leads Nest against the functional spec in
> `docs/BUILD_PROMPT.md`. For each feature area (auth, projects, sources, scan,
> leads, reply, digest, notifications, settings, billing, admin, health), report:
> implemented / partial / missing, the files involved, and the gaps to wire.
> Output a build order. Do not change code yet."

**Acceptance:** a feature-by-feature status table + an ordered backlog. This tells
you which phases below are net-new vs. finish-the-wiring.

---

## Phase 1 — Auth, onboarding & route protection

**Goal:** a user can sign up, sign in (and enter demo with zero config), land in
an org, and reach only their own data.

**Routes:** `/login`, `/signup`, `/onboarding`, `/auth/callback`,
`/auth/signout`, plus `src/middleware.ts` protecting `/app/*`.

**Wire to backend:**
- Supabase email auth (+ optional OAuth) via `src/lib/supabase/*`; demo mode
  serves a stub user so `/login` → "Enter demo workspace" works offline.
- First login creates a `Profile` + `Organization` (DB trigger already does
  auto-profile/auto-membership — verify); onboarding collects org + first
  project.
- `auth/callback` must reject open redirects (validate `next=` is same-origin —
  there's a `redirect` test pattern).

**Owner:** `frontend-ux` + `supabase-rls`. **Audit:** `security-compliance`
(auth, redirect, session). **Acceptance:** signed-out users are bounced from
`/app/*`; demo workspace is reachable with no env; no cross-org access.

> **Prompt:** "Implement Phase 1 (auth, onboarding, route protection) per
> `docs/BUILD_PROMPT.md` using the `wire-feature` skill. Keep demo mode working.
> Then run `security-compliance` on auth + redirect, and `release-gate`."

---

## Phase 2 — Projects (ICP, keywords, competitors)

**Goal:** CRUD projects that hold the scoring context.

**Routes:** `/app/projects`, `/app/projects/new`, `/app/projects/[id]`.

**Wire:** `CreateProjectInput` / `updateProject` on both stores (parity); RHF +
Zod form for name, product_description, ICP, keywords, negative_keywords,
competitors, target_geography. Enforce plan project-limits via `src/lib/usage/`.

**Owner:** `frontend-ux` + `supabase-rls`. **Acceptance:** a project has enough
context to score; limits enforced; demo seed shows realistic projects.

---

## Phase 3 — Sources & scanning

**Goal:** add sources and run a scan that produces leads — safely.

**Routes:** `/app/projects/[id]/sources`; scan trigger (server action) and
`/api/demo/score` for the public demo.

**Wire:** `manual | reddit | hackernews | rss | web-search` adapters in
`src/lib/sources/` behind the source status machine; `src/lib/scan.ts`
orchestrates source → keyword/negative filter → AI score → lead. Unconfigured
sources return **demo posts + a setup note**. **Read-only — no posting code.**

**Owner:** `ai-workflow` (scan/scoring) + `frontend-ux`. **Audit:**
`platform-safety-audit` (official APIs only, no scraping/posting, safe degrade).
**Acceptance:** a manual paste scores to a lead; each source degrades gracefully.

---

## Phase 4 — Lead inbox & lead detail

**Goal:** find the best opportunities and understand why.

**Routes:** `/app/leads` (filter/search/sort), `/app/leads/[id]`.

**Wire:** `listLeads(filters)` + `getLead` on both stores; lead detail shows the
score breakdown (relevance/intent/urgency/fit), tier, buying signals,
disqualifiers, suggested angle, risk flags, confidence. Save-lead +
status updates wired (parity-tested).

**Owner:** `frontend-ux`. **Theme:** match the screenshot — Newsreader score +
title, Mono source/stage chips (`REDDIT · R/AGENCY · COMPETITOR-SWITCHING · 1D
AGO`), accent for high-intent. **Acceptance:** user can filter to high-intent and
read the full "why".

---

## Phase 5 — Reply drafting (copy-only)

**Goal:** generate a helpful, disclosed reply the user copies and posts.

**Routes:** action on `/app/leads/[id]`.

**Wire:** `ai-workflow` reply-draft schema + prompt + mock; `enforceReplySafety`
guarantees a non-empty disclosure + safety notes; `markReplyCopied` records the
copy. **No send/post endpoint exists.** Malformed AI output falls back safely.

**Owner:** `ai-workflow` + `frontend-ux`. **Audit:** `platform-safety-audit`.
**Acceptance:** every draft has a disclosure + "you post this yourself"
disclaimer; copy is tracked; nothing is ever posted for the user.

---

## Phase 6 — Daily digest

**Goal:** a digest of top lead opportunities, in-app and (optionally) delivered.

**Routes:** `/app/digest`; `GET|POST /api/cron/digest`.

**Wire:** `getTopLeads`; the cron route requires `Authorization: Bearer
$CRON_SECRET`, is idempotent per UTC day, and no-ops without the service role.
Delivery uses the notification dispatcher from Phase 8 (email/SMS/WhatsApp);
without any channel configured it's an in-app preview only.

**Owner:** `ai-workflow`/`devops-release`. **Acceptance:** preview works in demo;
cron refuses anonymous calls; no duplicate sends per day.

---

## Phase 7 — Billing, usage limits, admin, health

**Goal:** plans gate usage; internal visibility; liveness.

**Routes:** `/pricing`, `/app/billing`, `/api/stripe/checkout`,
`/api/stripe/webhook`, `/app/admin`, `/api/health`.

**Wire:** plan limits in `src/lib/usage/` + `src/lib/plans.ts`; Stripe via REST
abstraction (`src/lib/billing/stripe.ts`) — "Billing not configured" when unset,
webhook **refuses unverified events** when configured. Admin gated by
`isAdminEmail` (demo user = admin for eval). `/api/health` returns status.

**Owner:** `devops-release` + `supabase-rls`. **Audit:** `security-compliance`
(webhook signature, admin gating, no secret leakage). **Acceptance:** limits
enforced server-side; safe with Stripe absent.

---

## Phase 8 — Notifications: SMTP email, SMS, WhatsApp alerts ⭐

**Goal:** alert the **account owner** about their own new high-intent leads and
daily digests, over the channels they enable. **Never message a lead.**

**Use the `notification-channels` skill** — it has the full architecture, the env
vars, and the safety rule. Summary:

**Backend (`src/lib/notify/`):**
- `notify(orgId, event, payload)` dispatcher: reads the org's channel prefs +
  thresholds + quiet hours, fans out to enabled adapters, logs results, and
  swallows per-channel failures.
- Adapters, each `isConfigured()`-gated and degrade-safe:
  - **Email** — `EMAIL_PROVIDER = smtp | resend | console`. SMTP via nodemailer
    (`SMTP_HOST/PORT/SECURE/USER/PASS/SMTP_FROM`); falls back to Resend, then
    console/in-app preview.
  - **SMS** — Twilio (`TWILIO_ACCOUNT_SID/AUTH_TOKEN/TWILIO_SMS_FROM`) to the
    owner's **verified** number.
  - **WhatsApp** — Twilio WhatsApp (`TWILIO_WHATSAPP_FROM`) or Meta Cloud API
    (`WHATSAPP_TOKEN/PHONE_NUMBER_ID/TEMPLATE_NAMESPACE`); business-initiated
    messages use **approved templates** ("You have N new high-intent leads in
    {{project}}").
- Add `isSmtpConfigured()`, `isTwilioSmsConfigured()`, `isWhatsAppConfigured()`
  to `src/lib/env.ts`; add placeholders to `.env.example`.
- Trigger points: the scan pipeline on a new high-intent lead (respect threshold
  + dedupe + quiet hours) and the digest cron.

**Settings UI (`/app/settings`):**
- Per-channel enable + owner address/number + a **verification step** (test
  email; confirm-code for SMS/WhatsApp) before going live.
- High-intent threshold, digest on/off + time, quiet hours.
- Persist on the organization (extend `CreateOrganizationInput` /
  `updateOrganization` + migration + RLS; MemoryStore + SupabaseStore parity).

**Owner:** `architecture` (design) → `supabase-rls` (settings storage) →
`ai-workflow`/`devops-release` (adapters + dispatcher) → `frontend-ux`
(settings). **Audit (mandatory):** `security-compliance` + `platform-safety-audit`
— prove **no adapter can be called with a non-owner recipient**, no secrets
leak, every channel degrades safely.

**Tests (no real keys):** dispatcher routing/dedupe/quiet-hours; each adapter's
`isConfigured()` gating + message formatting against mocked transports; the
owner-only-recipient invariant.

> **Prompt:** "Implement Phase 8 using the `notification-channels` and
> `wire-feature` skills: build `src/lib/notify/` (email SMTP+Resend+console, SMS
> Twilio, WhatsApp Twilio/Meta), the `notify()` dispatcher with thresholds/quiet
> hours/dedupe, org notification settings (migration + RLS + both stores +
> `/app/settings` UI with verification), and wire triggers in the scan pipeline
> and digest cron. Keep everything degrade-safe and demo-mode clickable. Add the
> env placeholders. Then run `platform-safety-audit`, `security-compliance`, and
> `release-gate`."

---

## Phase 9 — Validation & release

**Goal:** ship the alpha and run the validation campaign.

- `devops-release`: open/finish the PR, run the full gate + final audit, then
  (on human approval only) Supabase migrations + Vercel env matrix + Stripe
  webhook + cron schedule + production smoke test.
- `gtm-validation` + `sample-report`: deliver 10 free sample reports; track the
  success/kill metrics.

**Acceptance:** alpha deployed and smoke-tested; ≥5/10 reports show a useful
lead; no platform-safety violation.

---

## Phase 10 — Browser extension (manual capture companion) ⭐

**Goal:** a Chrome/Edge (Firefox-compatible) **MV3** extension that lets the
founder, while viewing a **public** thread, capture the **single post on screen**
with one click, see its lead score, and **copy** a disclosed reply draft to post
themselves. A discovery companion — **not** automation. Full spec:
**`docs/EXTENSION_BUILD_PROMPT.md`** + the `browser-extension` skill.

**SAFETY CONTRACT (non-negotiable — embed verbatim in the build):**
- ✅ Allowed: user-invoked, single-post capture of the page the user is actively
  viewing (title/body/url/author handle); show score + breakdown; copy a
  **disclosed** reply draft; deep-link into the app.
- ❌ Banned: background crawling / feed scraping, auto-scroll harvesting, reading
  DMs/private/paywalled content, any programmatic click/submit/post/DM on the
  host platform, modifying the host page beyond the extension's own UI,
  `<all_urls>` or broad host permissions.
- Enforced by: `activeTab` + user gesture only; explicit `host_permissions`
  limited to the app's API origin; read-only DOM capture; copy-only drafts with
  affiliation disclosure. Run `platform-safety-audit` on every change.

**Workspace/routes:** new `extension/` MV3 workspace (service worker + content
script + popup + options). Backend: `POST /api/extension/capture`
(+ `/api/extension/draft`) reusing the scan/scoring + reply pipeline.

**Wire to backend:** Zod-validated, org-scoped, rate-limited route; auth via a
**per-user, revocable, hashed extension API token** minted in `/app/settings`;
graceful demo-mode response; CORS/host_permissions limited to the app origin.

**Credentials:** no new **server env var** (the token is DB-stored). For
distribution: a **Chrome Web Store developer account (one-time $5)**; Edge
Add-ons and Firefox AMO are free. The extension is configured with the app's API
base URL. A **privacy policy** is required for Web Store review.

**Owner:** `frontend-ux` (popup/UX + Crest) + `ai-workflow` / `supabase-rls`
(API + token). **Audit (mandatory):** `security-compliance` +
`platform-safety-audit`. **Skills:** `wire-feature`, `crest-design`,
`platform-safety-audit`, `release-gate`.

**Acceptance:** capture works on a public post via explicit click; no broad
permissions; no posting/scraping path exists anywhere; token is revocable;
copy-only draft carries a disclosure; demo mode returns a sensible mock.

> **Prompt:** "Implement Phase 10 (browser extension) per
> `docs/EXTENSION_BUILD_PROMPT.md` using `wire-feature` + `crest-design`. Embed
> the SAFETY CONTRACT verbatim and enforce it technically. Build the `extension/`
> MV3 workspace, the `/api/extension/*` routes with per-user revocable token
> auth, and the popup/capture UX in The Crest. Then run `platform-safety-audit`,
> `security-compliance`, and `release-gate`."

---

## Env additions introduced by this plan (all optional, demo-safe)

```
# Email (Phase 8) — SMTP preferred, then Resend, then console/in-app
EMAIL_PROVIDER=          # smtp | resend | console
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM=The Leads Nest <alerts@yourdomain.com>

# SMS (Phase 8) — Twilio, alerts to the account owner's verified number
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_SMS_FROM=

# WhatsApp (Phase 8) — Twilio WhatsApp OR Meta Cloud API
TWILIO_WHATSAPP_FROM=
WHATSAPP_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_TEMPLATE_NAMESPACE=
```
Existing optional vars (Supabase, AI, Reddit, Resend, Stripe, web-search,
`CRON_SECRET`, `ERROR_WEBHOOK_URL`, `ADMIN_EMAILS`, `NEXT_PUBLIC_APP_URL`) are in
`.env.example`. When you add the above, update `.env.example` **and** the
feature-detectors in `src/lib/env.ts` — never commit a real `.env.local`.
```
