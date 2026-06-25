# Vercel Deployment Runbook

A step-by-step guide for deploying **LeadParrot** (Next.js App Router + TypeScript + Tailwind + Supabase) to Vercel.

LeadParrot is platform-safe by design: it discovers leads from **public** conversations and drafts AI replies for a human to review and post manually. It **never** auto-posts, auto-DMs, scrapes private or paywalled sources, or runs browser automation. Keep that in mind when configuring source integrations below — every external integration uses an **official API** or returns demo data.

The most important thing to know up front: **LeadParrot runs end-to-end with zero secrets.** With no Supabase keys set, the app boots in **demo mode** (seeded in-memory data) and the AI layer defaults to `AI_PROVIDER=mock` (deterministic, no API calls). That means your very first deploy can succeed before you have wired up a single external service — useful for a public demo, but not for real customers.

This runbook deploys via the Vercel dashboard (GitHub import). For terminology and an alternate Railway path, see [`DEPLOYMENT.md`](./DEPLOYMENT.md).

---

## 1. Import the GitHub repo into Vercel

1. Go to the Vercel dashboard → **Add New… → Project**.
2. Choose **Import Git Repository** and authorize Vercel for the GitHub account/org that owns the LeadParrot repo.
3. Select the LeadParrot repository from the list and click **Import**.

If the repo doesn't appear, edit the Vercel GitHub App configuration to grant access to that repository.

## 2. Select the project

1. After import, you land on the **Configure Project** screen.
2. Confirm the **Root Directory** is the repository root (where `package.json` lives). LeadParrot is a single-package app, so leave Root Directory at the default `./`.
3. Pick the Vercel **Team / scope** that should own the project.

## 3. Framework preset: Next.js

- Vercel auto-detects **Next.js** from `next` in `package.json` (Next 15, React 19).
- Confirm the **Framework Preset** dropdown reads **Next.js**. If it shows "Other," change it to **Next.js** so routing, the Edge middleware, and image optimization are configured correctly.

## 4. Install command

- Leave the **Install Command** on the Vercel default. Vercel runs `npm ci` automatically when a `package-lock.json` is present (it is), which is the reproducible, lockfile-respecting install you want for CI/CD.
- If you ever need to override it explicitly, use `npm ci` (preferred) or `npm install`.
- Node version: `package.json` declares `engines.node >= 18.18.0`; CI uses Node 22. Set the Vercel project's Node.js version to **22.x** (Project → Settings → General → Node.js Version) to match CI.

## 5. Build command

- Leave the **Build Command** on the default for the Next.js preset, which is `next build` (equivalent to `npm run build`).
- Do not override this unless you have a reason to. The build produces the standard `.next` output that Vercel consumes.

## 6. Output settings

- Leave **Output Directory** empty / default. The Next.js preset uses `.next` automatically; Vercel handles routing, serverless/edge functions, and static assets from there.
- Do **not** set a custom output directory — that is only for static-export setups, which LeadParrot is not.

## 7. Required environment variables

These four are the minimum for **real** (non-demo) auth + data. Set them in **Project → Settings → Environment Variables**. Reference: [`.env.example`](../.env.example).

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (client + server). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key (browser auth). |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key for background ingestion. **Bypasses RLS — never expose to the client.** |
| `NEXT_PUBLIC_APP_URL` | Public base URL of the deployment (see step 11). |

Notes:
- `NEXT_PUBLIC_*` variables are inlined into the client bundle at build time. If you change one, you must **redeploy** for it to take effect.
- If you omit the Supabase variables entirely, the deployment boots in **demo mode** (see the intro). `src/lib/env.ts` decides this via `isSupabaseConfigured()` / `isDemoMode()`.
- Set each variable for the environments you intend to use (**Production** and **Preview** at minimum).

## 8. Optional environment variables

Everything below is optional. When a key is missing, the related feature degrades gracefully (mock data, "requires API key," or "not configured") rather than crashing.

**AI providers** (only needed if `AI_PROVIDER` is `openai` or `anthropic`):
- `OPENAI_API_KEY`, `OPENAI_MODEL` (default `gpt-4o-mini`)
- `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL` (default `claude-haiku-4-5-20251001`)

**Reddit** (official API; without it the Reddit source returns mock posts + setup instructions):
- `REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET`, `REDDIT_USER_AGENT`

**Web-search source providers** (official search APIs only — **no scraping**; placeholders in v1, return demo data without a key):
- `TAVILY_API_KEY`, `EXA_API_KEY`, `SERPAPI_API_KEY`

**Email digests** (Resend; without it the daily digest renders as an in-app preview only):
- `RESEND_API_KEY`, `FROM_EMAIL` (legacy `DIGEST_FROM_EMAIL` is still accepted)

**Stripe billing** (without it the billing UI shows "Billing not configured"):
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_STRIPE_PRICE_STARTER`, `NEXT_PUBLIC_STRIPE_PRICE_PRO`, `NEXT_PUBLIC_STRIPE_PRICE_AGENCY`

**Admin / misc:**
- `ADMIN_EMAILS` (comma-separated emails allowed to view `/app/admin`)

## 9. Preview deployments

- Every pull request and every push to a non-production branch produces a **Preview Deployment** with its own unique URL.
- Make sure your env vars are set for the **Preview** environment too, or previews will silently fall back to demo mode / disabled features.
- A useful pattern: leave Preview without Supabase keys (or set `LEADPARROT_DEMO=1`) so PR previews always run the fully clickable demo without touching production data.

## 10. Production deployment

- Pushes to the production branch (`main`) trigger a **Production Deployment**.
- The first production deploy can be triggered from the **Configure Project** screen by clicking **Deploy**, or later via **Deployments → Redeploy**.
- Confirm the **Production** environment has all four required env vars (step 7) plus any optional ones you intend to enable.
- After deploy, run the smoke checklist (steps 16–17).

## 11. `NEXT_PUBLIC_APP_URL` setup

- Set `NEXT_PUBLIC_APP_URL` to the **public production origin** of the deployment, e.g. `https://leadparrot.com` (custom domain) or your `https://<project>.vercel.app` URL — no trailing slash.
- This value is read in `src/lib/env.ts` as `env.appUrl` (default `http://localhost:3000`) and is used to build absolute links (digests, redirects, etc.).
- Because it is a `NEXT_PUBLIC_*` var, **redeploy** after changing it. For Preview, you can point it at the preview URL or leave it as the production domain depending on your needs.

## 12. Supabase callback URL update

Auth redirects flow through the route `src/app/auth/callback/route.ts` (it exchanges the OAuth/email `code` for a session, then redirects into the app). For this to work in production:

1. In the **Supabase dashboard → Authentication → URL Configuration**:
   - Set **Site URL** to your production domain (matching `NEXT_PUBLIC_APP_URL`).
   - Add `https://<your-domain>/auth/callback` to **Redirect URLs**.
2. If you use Preview deployments for auth testing, also add the preview origin's `/auth/callback` (or a wildcard if your Supabase plan supports it).
3. Enable Email auth (and any OAuth providers) you intend to use.

If the callback URL is not registered, sign-in/sign-up will fail with a redirect/`redirect_uri` mismatch error from Supabase.

## 13. Stripe test-environment placeholder

For non-production testing, use **Stripe test mode** keys so no real charges occur:
- `STRIPE_SECRET_KEY` → `sk_test_...`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` → `pk_test_...`
- Create the three recurring **test** prices and set `NEXT_PUBLIC_STRIPE_PRICE_STARTER/PRO/AGENCY`.
- Webhook endpoint → `https://<domain>/api/stripe/webhook`; put the test signing secret in `STRIPE_WEBHOOK_SECRET`. Recommended events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`.

> Placeholder reminder: billing requires both `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (`isStripeConfigured()`). With either missing, the billing page shows "Billing not configured" and checkout is disabled — which is the expected default until you fill these in.

## 14. `AI_PROVIDER=mock` setup (default)

- The AI layer defaults to **mock**: `env.aiProvider` falls back to `"mock"` when `AI_PROVIDER` is unset (`src/lib/env.ts`).
- In mock mode, lead scoring and reply drafts are **deterministic demo output with no external API calls** — no key required, zero cost.
- This is the right default for a public demo deploy. You can set `AI_PROVIDER=mock` explicitly to make the intent obvious in the Vercel env list.

## 15. Real OpenAI / Anthropic setup placeholder

When you're ready for real AI scoring/drafting, switch the provider and add the matching key:
- **OpenAI:** `AI_PROVIDER=openai` + `OPENAI_API_KEY` (optional `OPENAI_MODEL`, default `gpt-4o-mini`).
- **Anthropic:** `AI_PROVIDER=anthropic` + `ANTHROPIC_API_KEY` (optional `ANTHROPIC_MODEL`, default `claude-haiku-4-5-20251001`).

> Placeholder reminder: setting `AI_PROVIDER` to a real provider **without** the corresponding API key will leave the AI calls unconfigured. Add the key in the same environment (Production/Preview) and redeploy. Until then, keep `AI_PROVIDER=mock`.

## 16. Health / smoke route

LeadParrot has **no dedicated `/healthz` endpoint**. Use these existing routes as the smoke / liveness checks:

- **`/`** — the marketing landing page. A `200` here confirms the app booted and is serving.
- **`/demo`** — the public "Try a demo lead score" page (`src/app/demo/page.tsx`). It posts to the API route **`/api/demo/score`** (`src/app/api/demo/score/route.ts`), which exercises the AI scoring path end-to-end (mock by default). A working score on this page is the strongest single smoke signal — it confirms routing, server actions/route handlers, and the AI layer are all alive without needing auth or Supabase.

Recommended quick check after any deploy: open `/` (loads) → open `/demo` → run a sample score (returns a result).

## 17. Smoke test checklist

After each production deploy, run the full smoke test. See **[`PRODUCTION_SMOKE_TEST.md`](./PRODUCTION_SMOKE_TEST.md)** for the authoritative checklist. At minimum:

- [ ] `/` landing loads.
- [ ] `/demo` scores a sample public post (via `/api/demo/score`).
- [ ] Sign up → confirm email → onboarding → `/app` (requires Supabase configured + callback URL from step 12).
- [ ] Create a project, add a source, run a scan, see lead candidates.
- [ ] Generate and copy a reply draft.
- [ ] `/app/billing` reflects Stripe config; `/app/admin` is reachable for an `ADMIN_EMAILS` account.
- [ ] **RLS isolation:** a second account cannot see the first org's data (enforced by `0002_rls.sql`).

## 18. Rollback

Vercel keeps every prior deployment, so rollback is instant and does not require a rebuild:

1. Go to **Project → Deployments**.
2. Find the last known-good **Production** deployment.
3. Use the **⋯ menu → Promote to Production** (instant rollback — Vercel re-points the production alias to that immutable build).
4. Verify with the smoke route (step 16).

Because builds are immutable, promoting an old deployment is safe and reversible. If the issue was an env var (not code), fix the variable and **Redeploy** instead — env changes alone do not require a code rollback, but remember `NEXT_PUBLIC_*` changes need a fresh build.

---

## 19. Common build errors

| Symptom | Likely cause / fix |
| --- | --- |
| Type errors fail the build | `next build` type-checks. Run `npm run typecheck` (`tsc --noEmit`) locally first. CI runs this too. |
| Lint errors fail the build | Run `npm run lint` locally. CI runs `next lint`. |
| Module not found / install mismatch | Ensure `package-lock.json` is committed; Vercel uses `npm ci`. Re-run `npm install` locally and commit the lockfile. |
| Node version mismatch | Set the Vercel Node.js Version to **22.x** to match CI (`engines.node >= 18.18.0`). |
| Edge middleware `process.version` notice | Benign. The `@supabase/ssr` import emits a build-time notice on the Edge runtime; it does not affect runtime. |
| Missing `NEXT_PUBLIC_*` value at runtime | These are inlined at **build** time — set them before building and **redeploy** after changing them. |

Tip: the whole CI gate is reproducible locally with the npm scripts `dev`, `build`, `test`, `typecheck`, `lint`, and `verify:env`. The repo's `verify:env` script validates the environment for the "Local Mock" profile.

## 20. Common Supabase errors

| Symptom | Likely cause / fix |
| --- | --- |
| App unexpectedly shows demo/seed data in production | Supabase vars missing → `isDemoMode()` is true. Set `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` and redeploy. |
| Sign-in redirect / `redirect_uri` mismatch | Add `https://<domain>/auth/callback` to Supabase **Redirect URLs** and set **Site URL** (step 12). |
| User can't see expected data / empty dashboards | Migrations not applied, or RLS membership missing. Apply `0001_init.sql` then `0002_rls.sql`. The `handle_new_org()` trigger makes the org owner a member so RLS checks pass. |
| Background ingestion writes nothing / permission denied | `SUPABASE_SERVICE_ROLE_KEY` missing or wrong. Ingestion uses the service role to bypass RLS (`hasServiceRole()`). Keep it **server-side only**. |
| Cross-tenant data leak fears | By design, every policy in `0002_rls.sql` is gated on `is_org_member(organization_id)`; the service role is the only RLS bypass. Verify the service-role key is never exposed to the client. |

## 21. Common AI errors

| Symptom | Likely cause / fix |
| --- | --- |
| Scores/drafts look canned or identical | You're in **mock** mode (`AI_PROVIDER` unset or `mock`). Expected default — switch to a real provider (step 15) for live output. |
| Provider set but calls don't run / fall back | `AI_PROVIDER=openai`/`anthropic` set **without** the matching key. Add `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` and redeploy. |
| Model not found / unexpected model | Set `OPENAI_MODEL` / `ANTHROPIC_MODEL`. Defaults are `gpt-4o-mini` / `claude-haiku-4-5-20251001`. |
| `/demo` score errors | Check `/api/demo/score` logs in Vercel. In mock mode this should always succeed; if it fails the issue is routing/build, not the AI key. |

## 22. Common source-integration errors

Remember: LeadParrot only uses **official APIs** and never scrapes. A missing key degrades to demo data — it should not crash.

| Symptom | Likely cause / fix |
| --- | --- |
| Reddit source returns mock posts + "setup" text | `REDDIT_CLIENT_ID` / `REDDIT_CLIENT_SECRET` missing (`isRedditConfigured()`). Add an official Reddit API app's credentials and a descriptive `REDDIT_USER_AGENT`. |
| Web-search source shows "requires API key" / demo data | No official search key set. Add one of `TAVILY_API_KEY`, `EXA_API_KEY`, or `SERPAPI_API_KEY` (`isWebSearchConfigured()`). These are placeholders in v1 — no scraping fallback. |
| Daily digest only previews in-app, never emails | `RESEND_API_KEY` missing (`isResendConfigured()`). Add it plus a verified-domain `FROM_EMAIL`. |
| Billing/checkout disabled | Stripe not fully configured — see step 13. |
| Source returns nothing after a scan | Check the relevant key, then the `source_runs` row's `status` / `error_message` in Supabase for the specific failure. |

---

## CI reference

Continuous integration runs via **`.github/workflows/ci.yml`** on pushes to `main`/`leadparrot-mvp` and PRs to `main`. The pipeline (Node 22, `npm ci`) runs, in order: `verify:env` → `tsc --noEmit` → `lint` → `test` → `build` (with `LEADPARROT_DEMO=1`, proving the app builds with **zero secrets** in mock/demo mode). If CI is green, a Vercel build of the same commit should succeed too.
