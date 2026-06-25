# Deployment

LeadParrot deploys cleanly to **Vercel** or **Railway**. It needs a Supabase project for real (non-demo) usage.

## 0. Prerequisites

- A Supabase project (Postgres + Auth).
- Optional: AI provider key, Reddit API app, Resend, Stripe.

## 1. Supabase

1. Create a project; note the **URL**, **anon key**, **service-role key**.
2. Apply migrations:
   ```bash
   supabase link --project-ref <ref>
   supabase db push
   ```
   (or paste `supabase/migrations/0001_init.sql` then `0002_rls.sql` into the SQL editor).
3. In **Authentication → URL Configuration**, set the Site URL to your domain and add `https://<domain>/auth/callback` as a redirect URL.
4. Enable Email auth (and any OAuth providers).

## 2. Environment variables

Set these in your host's dashboard (see [`.env.example`](../.env.example)). Minimum for real auth + data:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=https://your-domain
AI_PROVIDER=mock            # or openai / anthropic (+ key)
ADMIN_EMAILS=you@example.com
```

Add Reddit/Resend/Stripe keys to enable those features; omit to keep them gracefully disabled.

> If Supabase vars are omitted, the deployment runs in **demo mode** (in-memory data) — useful for a public demo, not for real customers.

## 3. Vercel

1. Import the repo. Framework preset: **Next.js** (auto-detected).
2. Add the env vars (Production + Preview).
3. Deploy. Build command `next build`, output is handled by Vercel.
4. Set `NEXT_PUBLIC_APP_URL` to the production domain and redeploy if needed.

## 4. Railway

1. New project → deploy from repo.
2. Build: `npm run build`; Start: `npm run start`. Set `PORT` (Railway provides it; Next respects it).
3. Add env vars. Deploy.

## 5. Stripe (optional)

1. Create the three recurring prices and set `STRIPE_PRICE_STARTER/PRO/AGENCY`.
2. Set `STRIPE_SECRET_KEY` + `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
3. Add a webhook endpoint → `https://<domain>/api/stripe/webhook`, events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`. Put the signing secret in `STRIPE_WEBHOOK_SECRET`.
4. Without these, the billing page shows "Billing not configured" and checkout is disabled.

## 6. Resend (optional)

Set `RESEND_API_KEY` and `DIGEST_FROM_EMAIL` (a verified domain). Without it, the daily digest renders as an in-app preview only.

## 7. Post-deploy checks

- [ ] `/` landing loads; `/demo` scores a sample post.
- [ ] Sign up → confirm email → onboarding → `/app`.
- [ ] Create a project, add a source, run a scan, see leads.
- [ ] Generate + copy a reply draft.
- [ ] `/app/billing` reflects Stripe config; `/app/admin` reachable for `ADMIN_EMAILS`.
- [ ] RLS: a second account cannot see the first org's data.

## 8. Background scans (future)

v1 scans on demand (the "Run scan" button). To schedule recurring scans later, add a cron (Vercel Cron / Railway cron / Supabase scheduled function) that calls the service-role ingestion path per enabled source. Keep rate limits conservative.

## Notes

- The middleware runs on the Edge runtime; the `@supabase/ssr` import emits a benign `process.version` build notice — it does not affect runtime.
- `npm run typecheck`, `npm run test`, and `npm run build` should all pass before deploying.
