# Supabase Production Runbook

This is a step-by-step runbook for taking LeadParrot from local demo mode to a
real Supabase-backed production deployment. Follow the numbered steps in order.

> LeadParrot is platform-safe by design. It discovers leads in **public**
> conversations and drafts AI replies for a human to review. It **never**
> auto-posts, never auto-DMs, never scrapes private or paywalled sources, and
> never runs browser automation.

## Before you start: demo mode vs. production

LeadParrot runs with **zero secrets** out of the box. With no environment
variables set, the app boots in **demo mode** using in-memory mock data, and the
AI layer defaults to `AI_PROVIDER=mock` (deterministic scoring and reply drafts,
no external API calls). That is great for trying the product, but demo mode does
**not** persist anything.

To persist real users, organizations, projects, posts, and lead candidates you
need a real Supabase Postgres database. That is what this runbook sets up.

This is plain-English operational guidance, not legal advice.

---

## 1. Create a Supabase project

1. Go to <https://supabase.com> and sign in (or create a free account).
2. Click **New project**.
3. Pick an organization, give the project a name (e.g. `leadparrot-prod`).
4. Set a strong **database password** and store it in your password manager — you
   will need it for the Supabase CLI in step 8.
5. Choose the region closest to where your Vercel deployment runs.
6. Click **Create new project** and wait for provisioning to finish (~2 minutes).

---

## 2. Copy the project URL

1. In the project, open **Settings → API** (also surfaced under
   **Project Settings → Data API**).
2. Copy the **Project URL**. It looks like `https://abcdefghijklmno.supabase.co`.
3. This is your `NEXT_PUBLIC_SUPABASE_URL`.

---

## 3. Copy the anon (public) key

1. Still on **Settings → API**, find the **Project API keys** section.
2. Copy the **`anon` / `public`** key.
3. This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

The anon key is safe to expose in the browser. Row Level Security (added by
migration `0002_rls.sql`) is what actually protects your data — see step 12.

---

## 4. Copy the service role key

1. On the same **Settings → API** page, reveal and copy the **`service_role`**
   key.
2. This is your `SUPABASE_SERVICE_ROLE_KEY`.

The service role key **bypasses Row Level Security**. It is used only by trusted
server-side ingestion jobs (background source runs that write `raw_posts`,
`source_runs`, etc.).

---

## 5. Keep the service role key SERVER-ONLY

This is the single most important security rule in this runbook.

- The service role key must **never** be prefixed with `NEXT_PUBLIC_`. Anything
  with that prefix is bundled into the browser and would leak full,
  RLS-bypassing database access to every visitor.
- In LeadParrot the service role key is read in exactly one place:
  **`src/lib/supabase/admin.ts`** (the admin client). Browser-facing code uses
  the anon client (`src/lib/supabase/client.ts`) and the per-request server
  client (`src/lib/supabase/server.ts`) instead.
- Store it only as a plain (non-public) environment variable: locally in
  `.env.local`, and in Vercel as a regular (encrypted) server env var.

If the service role key is ever exposed, rotate it immediately in
**Settings → API** and update `.env.local` and Vercel.

---

## 6. Local `.env.local` setup

From the project root:

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in the three Supabase values from steps 2–4:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<your-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

Leave `AI_PROVIDER=mock` for now (no AI keys required). Every other key in
`.env.example` is optional and falls back to safe demo behavior when blank.

Validate your environment:

```bash
npm run verify:env
```

Then run the app:

```bash
npm run dev
```

Useful npm scripts: `dev`, `build`, `test`, `typecheck`, `lint`, and
`verify:env`.

---

## 7. Vercel environment setup

In your Vercel project, go to **Settings → Environment Variables** and add the
same values for the **Production** (and **Preview**, if you use it) environments:

| Variable | Value | Exposure |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL (step 2) | Public (browser) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key (step 3) | Public (browser) |
| `SUPABASE_SERVICE_ROLE_KEY` | service role key (step 4) | **Server only** |
| `AI_PROVIDER` | `mock` (or `openai` / `anthropic`) | Server only |
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.com` | Public (browser) |

Reminders:

- Do **not** add `NEXT_PUBLIC_` to the service role key (step 5).
- After changing env vars, trigger a fresh deployment so they take effect.
- All other keys in `.env.example` (Reddit, Resend, Stripe, search APIs) stay
  optional — leave them blank to keep those features in demo/placeholder mode.

---

## 8. Apply migrations via the Supabase CLI (recommended)

The CLI is the most reliable way to apply migrations in the exact order.

1. Install the CLI: <https://supabase.com/docs/guides/cli>.
2. Log in:
   ```bash
   supabase login
   ```
3. Link this repo to your project (find the ref in **Settings → General**):
   ```bash
   supabase link --project-ref <your-project-ref>
   ```
   Enter the database password from step 1 when prompted.
4. Push the migrations in `supabase/migrations/`:
   ```bash
   supabase db push
   ```

The CLI applies files in filename order, which is already the correct order
(`0001_init.sql` then `0002_rls.sql` — see step 10).

---

## 9. Apply migrations via the SQL editor (alternative)

If you cannot use the CLI, apply the same SQL by hand:

1. In Supabase, open **SQL Editor → New query**.
2. Open `supabase/migrations/0001_init.sql`, copy its entire contents, paste,
   and click **Run**.
3. Open a new query, paste the entire contents of
   `supabase/migrations/0002_rls.sql`, and click **Run**.

Run them one at a time and confirm each succeeds before moving on. Order matters
(step 10).

---

## 10. Exact migration order

Always apply in this order:

1. **`0001_init.sql`** — creates the schema: extensions (`pgcrypto`),
   the `set_updated_at()` and `handle_new_user()` helpers, the `auth.users`
   profile trigger, all 14 tables, indexes, and foreign keys.
2. **`0002_rls.sql`** — enables Row Level Security and adds the org-membership
   policies (via the `is_org_member()` security-definer function).

`0002_rls.sql` references tables created by `0001_init.sql`, so running RLS first
will fail. Never reorder them.

---

## 11. Verify the tables

After migrating, confirm all **14** application tables exist. In the SQL editor:

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
order by table_name;
```

You should see these 14 tables:

1. `profiles`
2. `organizations`
3. `organization_members`
4. `projects`
5. `sources`
6. `source_runs`
7. `raw_posts`
8. `lead_candidates`
9. `reply_drafts`
10. `saved_leads`
11. `ai_scoring_logs`
12. `digest_emails`
13. `usage_events`
14. `subscriptions`

If any are missing, re-run `0001_init.sql` (it uses `create table if not
exists`, so it is safe to re-run).

---

## 12. Verify RLS is enabled

Confirm Row Level Security is on for every app table:

```sql
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
order by tablename;
```

Every one of the 14 tables should show `rowsecurity = true`. If any show
`false`, re-run `0002_rls.sql`.

RLS is the layer that lets users only read/write rows for organizations they
belong to. The browser-facing anon key relies on it entirely; only the
server-only service role client (step 5) bypasses it for ingestion.

---

## 13. Auth redirect URL setup (`/auth/callback`)

LeadParrot completes auth at the `/auth/callback` route.

1. In Supabase, open **Authentication → URL Configuration**.
2. Under **Redirect URLs**, add:
   - `http://localhost:3000/auth/callback` (local development)
   - `https://your-domain.com/auth/callback` (production)
3. Save.

If the callback URL is not whitelisted, sign-in links and OAuth flows will fail
with a redirect error.

---

## 14. Site URL setup

1. On the same **Authentication → URL Configuration** page, set **Site URL** to
   your canonical production URL, e.g. `https://your-domain.com`.
2. For local testing you can temporarily use `http://localhost:3000`.

The Site URL is the default base Supabase uses for email links (confirmation,
magic link, password reset). Keep it in sync with `NEXT_PUBLIC_APP_URL`.

---

## 15. Create your first auth user (`/signup`)

1. Visit `/signup` on your running app.
2. Enter an email and password and submit.
3. The `handle_new_user()` trigger from `0001_init.sql` automatically creates the
   matching row in `profiles`.
4. Confirm the email if you have email confirmation enabled in Supabase.

To verify, query `select id, email from public.profiles;` in the SQL editor and
confirm your new user is present.

---

## 16. Create your first organization (`/onboarding`)

1. After signing in, go to `/onboarding`.
2. Create an organization (your workspace/company).
3. This writes one row to `organizations` and one row to
   `organization_members` linking your user as a member.

RLS keys off `organization_members`: from here on you can only see data for orgs
where you have a membership row.

---

## 17. Create your first project

1. From the dashboard, create a **project** inside your organization.
2. A project is the container for sources, raw posts, lead candidates, and reply
   drafts. This writes a row to `projects`.

You can later attach **sources** to the project. All source integrations are
optional and platform-safe: with no API keys, sources return demo data and
setup instructions rather than scraping anything.

---

## 18. Paste a manual post

You do not need any external API to test the full pipeline — you can paste a
public post by hand.

1. In your project, use the **manual / paste post** option.
2. Paste the text of a real public post (for example, a public forum question
   that sounds like a buying signal).
3. Submit. This writes a row to `raw_posts` for the project.

Manual paste is the platform-safe path: a human chooses and provides the public
content, and LeadParrot processes only what was pasted.

---

## 19. Verify lead scoring (mock AI)

With `AI_PROVIDER=mock` (the default), scoring runs deterministically and
offline:

1. After pasting the post (step 18), trigger or wait for scoring.
2. A `lead_candidates` row should appear with an intent score, and a
   corresponding entry is logged in `ai_scoring_logs`.
3. Open the lead and confirm a draft reply was generated into `reply_drafts`.
   This draft is for **human review** — LeadParrot never posts it for you.

To verify in SQL:

```sql
select count(*) from public.lead_candidates;
select count(*) from public.reply_drafts;
select count(*) from public.ai_scoring_logs;
```

When you are ready for real AI, set `AI_PROVIDER=openai` or
`AI_PROVIDER=anthropic` and add the matching API key, then redeploy.

---

## 20. Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| App shows demo/mock data and nothing persists | Supabase env vars are blank | Set the three Supabase vars (steps 2–4), redeploy |
| `npm run verify:env` complains | Missing/malformed required vars | Re-check `.env.local` against `.env.example` |
| Sign-in redirect error | Callback URL not whitelisted | Add `/auth/callback` URLs (step 13) |
| Email links point to localhost in prod | Site URL not set | Set production Site URL (step 14) |
| New user has no profile row | `handle_new_user()` trigger missing | Re-run `0001_init.sql` |
| "permission denied" / empty lists for a logged-in user | No `organization_members` row, or RLS misconfigured | Complete `/onboarding` (step 16); verify RLS (step 12) |
| RLS query shows `rowsecurity = false` | `0002_rls.sql` not applied | Re-run `0002_rls.sql` (step 9) |
| Service role key visible in browser bundle | It was prefixed `NEXT_PUBLIC_` | Remove the prefix, rotate the key, redeploy (step 5) |
| Migration fails referencing a missing table | Migrations run out of order | Apply `0001_init.sql` before `0002_rls.sql` (step 10) |
| Background ingestion can't write rows | Service role key missing on the server | Set `SUPABASE_SERVICE_ROLE_KEY` (server-only) in Vercel |

General checks: `npm run typecheck`, `npm run lint`, `npm run test`, and
`npm run verify:env` should all pass before deploying.

---

## 21. Rollback strategy

If a deploy or migration goes wrong:

- **Revert the app, not the data first.** In Vercel, roll back to the previous
  good deployment. Because LeadParrot degrades to safe demo/mock behavior when
  env vars are absent or the AI provider is `mock`, the app stays usable while
  you investigate.
- **Re-running migrations is safe.** `0001_init.sql` uses
  `create table if not exists` and `create or replace function`, and
  `0002_rls.sql` uses `create or replace` / idempotent policy definitions, so
  applying them again will not duplicate or destroy tables.
- **Take a backup / point-in-time snapshot before destructive changes.** Use
  **Supabase → Database → Backups** (or `supabase db dump`) before any manual
  schema change so you can restore.
- **For a bad data state**, prefer restoring from a Supabase backup over manual
  deletes. If you must clear test data, delete from child tables first
  (`reply_drafts`, `lead_candidates`, `raw_posts`, ...) before parents
  (`projects`, `organizations`) to respect foreign keys.
- **If a secret leaked**, rotate it in **Settings → API** immediately, then
  update `.env.local` and the Vercel env vars and redeploy. The service role key
  is the highest priority to rotate (step 5).
- **Last resort full reset (non-production / fresh project only):**
  `supabase db reset` rebuilds the database from the migrations. Never run this
  against a database holding real customer data.
