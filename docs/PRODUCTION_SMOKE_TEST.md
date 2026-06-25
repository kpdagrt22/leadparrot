# LeadParrot — Production Smoke Test

A manual, click-through checklist to run before (and right after) every production
deploy. It walks the whole product the way a real user would: sign up, set up a
project, score a post, review the AI analysis, draft a reply, and confirm the
safety guarantees hold.

LeadParrot is **platform-safe by design**: it never auto-posts, never auto-DMs,
never scrapes private or paywalled sources, and does no browser automation. A big
part of this checklist is verifying those promises are still true in the running app.

## How to use this

- Work top to bottom. Each `[ ]` is a thing to check; tick it when it passes.
- Run it twice when possible: once in **demo mode** (zero secrets) and once against
  your **real production environment** (Supabase + chosen AI provider configured).
- If a step fails, stop and note what you saw. Don't tick a box you "think" passes.

### Environments at a glance

- **Demo mode** runs with **zero secrets**. With no Supabase configured (or
  `LEADPARROT_DEMO=1`), the app serves seeded in-memory data and a stub demo user,
  so the entire product is clickable offline. In demo mode the seeded user is always
  treated as admin so the internal page is reachable.
- **AI defaults to `AI_PROVIDER=mock`**, which returns deterministic demo scoring and
  replies with no external API calls. Set `AI_PROVIDER=openai` or `anthropic` (with a
  matching API key) to exercise the real provider.
- Every integration is optional. Missing Supabase, Stripe, Resend, Reddit, or search
  keys must degrade gracefully — never crash.

### Pre-flight (run once before the checklist)

- [ ] `npm run verify:env` reports the expected configuration (or confirms demo mode).
- [ ] `npm run typecheck` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run test` passes.
- [ ] `npm run build` succeeds, then `npm run start` (or `npm run dev`) boots cleanly.

> Tip: `npm run verify` is a convenient umbrella if your environment aliases it; the
> individual scripts above are the source of truth.

---

## 1. Public routes

Pages anyone can reach without logging in.

- [ ] Landing page `/` loads and renders the hero/value proposition.
- [ ] Pricing page `/pricing` loads and lists the plans.
- [ ] Demo page `/demo` loads and is clickable.
- [ ] Browser console shows **no errors** on `/`, `/pricing`, and `/demo`.
- [ ] No 404s for CSS/JS/font/image assets in the Network tab.
- [ ] Layout is **mobile responsive** (~375px wide): no horizontal scroll, nav usable,
      text readable, buttons tappable.
- [ ] Primary calls-to-action (sign up / get started) link to the right places.

## 2. Auth

- [ ] `/signup` renders and a new account can be created.
- [ ] `/login` renders and an existing account can log in.
- [ ] Logout works via `/auth/signout` and returns to a logged-out state.
- [ ] Visiting a protected route (e.g. `/app`, `/app/leads`, `/app/projects`) while
      **unauthenticated redirects to `/login`** (and `/onboarding` bounces to `/login`
      when there's no session).
- [ ] After login, the post-login redirect lands somewhere **safe and same-origin**
      (a `/app/...` path or onboarding) — never an external URL or an open redirect
      injected via a query parameter.
- [ ] Note: in **demo mode** there is no real auth wall — a stub demo user is always
      "logged in." Verify the redirect behavior against a **real Supabase** environment.

## 3. Onboarding

The onboarding form (`/onboarding`) creates the organization and saves the business
profile in one step.

- [ ] After signup, a first-time user reaches `/onboarding`.
- [ ] Submitting "Create my workspace" with a **Business name** succeeds.
- [ ] An **organization is created** and the user lands in `/app`.
- [ ] The **business profile is saved**: business name, website, business type,
      "what do you sell?", target geography, reply tone, notification email, and the
      daily-digest preference all persist.
- [ ] If the optional first project fields were filled (name, product description,
      ICP, competitors, keywords, negative keywords), that project is created too.
- [ ] Revisiting `/onboarding` after setup redirects to `/app` (no duplicate org).

## 4. Project setup

- [ ] From the dashboard, "Create project" opens `/app/projects/new`.
- [ ] **Create a project** with a name and product/service description (both required).
- [ ] Add an **ideal customer profile (ICP)**.
- [ ] Add **keywords** (comma/newline separated).
- [ ] Add **negative keywords**.
- [ ] Optionally add competitors and target geography.
- [ ] **Save** succeeds and redirects to the project detail page `/app/projects/[id]`.
- [ ] The project detail page shows the product/service, ICP, keywords, negative
      keywords (red chips), and competitors (amber chips) exactly as entered.
- [ ] The on-form safety notice is present ("only monitors public/allowed sources and
      never posts on your behalf").

## 5. Manual post — score a real example

Use the project's **Sources** page (`/app/projects/[id]/sources`) → "Score a post
manually" form. Paste this **exact** sample post:

- **Title:** `Looking for a better proposal tool for my small agency`
- **Body:**
  ```
  We spend too much time writing proposals from scratch. PandaDoc feels too heavy
  and expensive. Is there a lightweight tool for agencies that can create polished
  proposals quickly?
  ```

- [ ] The "Score a post manually" form accepts the title and body.
- [ ] **Submit** runs the AI/mock scoring (with `AI_PROVIDER=mock` this is deterministic).
- [ ] Scoring completes without error and a **lead appears** (in the lead inbox and on
      the project's "Top leads" list).
- [ ] The lead has an overall score plus the component bars (relevance, intent,
      urgency, fit).
- [ ] The Sources page's safety notice is visible ("official APIs and public feeds
      only … never scrapes private pages, auto-comments, or DMs").

## 6. Lead detail

Open the new lead at `/app/leads/[id]`.

- [ ] The **original post** title and body excerpt are shown.
- [ ] The **score breakdown** is visible: overall score, confidence %, and the
      relevance / intent / urgency / fit bars.
- [ ] **Buying signals** are listed (brand-colored chips).
- [ ] **Disqualifiers** are listed when present (red chips); pain points and risk
      flags render when present.
- [ ] A **suggested angle** ("Suggested angle") and "Why it's a lead" reason are shown.
- [ ] The "View original post" link (when a URL exists) opens in a new tab with
      `rel="noopener noreferrer"`.

## 7. Reply draft

On the lead detail page, in the "Reply draft" card.

- [ ] Clicking **Generate** produces a draft reply (text appears in the draft box).
- [ ] A **disclosure** is shown ("Suggested disclosure") so the user can be transparent
      about who they are.
- [ ] **Safety notes** are shown (the bulleted safety list and/or "Why this reply").
- [ ] The amber **copy disclaimer** is visible (review before posting; LeadParrot does
      not post for you).
- [ ] **Copy** works: clicking copy puts the draft on the clipboard and the UI confirms
      ("Copied …").
- [ ] **There is NO post / send / submit-to-platform button anywhere** on this page.
      The only actions are Generate, Copy, Save lead, and change Status.
- [ ] When no draft exists yet, the empty state explicitly states "LeadParrot never
      posts for you."

## 8. Lead inbox

At `/app/leads`.

- [ ] All scored leads list as cards, with a result count ("N leads match your filters").
- [ ] **Filters** work: by project (`?project=`), tier (`?tier=`), source (`?source=`),
      stage (`?stage=`), and status (`?status=`).
- [ ] **Search** works (`?q=` free-text narrows the list).
- [ ] **Sort** toggles between score and newest.
- [ ] **Status updates** from the lead detail page persist and are reflected back in the
      inbox (and status filtering then finds the lead).
- [ ] Saving a lead marks it saved; the saved state is reflected on the card.
- [ ] Empty state appears when filters match nothing, with a way back to projects.

## 9. Usage limits

- [ ] The dashboard `/app` shows **"This month's usage"** meters: posts scanned, reply
      drafts, and projects, each as `used / limit`.
- [ ] The billing page `/app/billing` shows the same usage meters.
- [ ] The numbers **increment** after scoring a post (section 5) and generating a reply
      (section 7).
- [ ] Limits are **enforced or clearly warned**: on the free/current plan, exceeding a
      quota (posts, replies, or projects) is blocked or surfaces a clear message rather
      than silently failing or 500-ing.
- [ ] Meters reflect the current plan's limits and the "resets monthly" note is shown.

## 10. Digest

At `/app/digest`.

- [ ] The page renders a **preview** of the top-opportunities email (subject + up to 5
      top leads with score, source, reason, and suggested angle).
- [ ] When Resend is **not** configured, the amber "Preview only" banner explains how to
      enable email (`RESEND_API_KEY`) and the digest stays in-app — **no send attempt,
      no crash**.
- [ ] When Resend **is** configured, the banner shows the destination notification email.
- [ ] The footer privacy note is present ("only public post title, link, excerpt, and AI
      analysis — no extra personal data").
- [ ] Empty state appears (with a link to projects) when there are no leads yet.

## 11. Billing

- [ ] `/pricing` (public) renders all plans with prices and features.
- [ ] `/app/billing` lists plans and the current plan is indicated.
- [ ] When Stripe is **not** configured, the amber **"Billing not configured"** banner
      appears, explaining the needed keys (`STRIPE_SECRET_KEY`,
      `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, and per-plan price IDs). Plans still render
      for reference and **nothing crashes**.
- [ ] Clicking upgrade/checkout with Stripe missing does **not** throw a raw error —
      it's a safe no-op or a clear "not configured" message.
- [ ] When Stripe **is** configured, checkout (`/api/stripe/checkout`) starts and the
      `?status=success` / `?status=cancelled` banners render on return.

## 12. Admin / debug

The internal admin page is `/app/admin`.

- [ ] In a **real (non-demo) environment**, a user whose email is **not** in
      `ADMIN_EMAILS` is **blocked** from `/app/admin`.
- [ ] A user whose email **is** in `ADMIN_EMAILS` can reach `/app/admin`.
- [ ] In **demo mode**, the page is intentionally reachable (the seeded demo user is
      treated as admin) — confirm this is demo-only behavior.
- [ ] The admin page shows **aggregate metrics only** (org/project/source-run counts, AI
      errors, top sources, recent signups, usage by org). No per-author personal data.
- [ ] **No secrets are shown** anywhere — no API keys, service-role key, Stripe secret,
      or env values rendered in the UI or page source.

## 13. Error handling

Confirm failures degrade gracefully and never leak internals.

- [ ] **AI failure is graceful:** if the AI provider errors/times out (try a bad
      `OPENAI_API_KEY`/`ANTHROPIC_API_KEY` with the matching provider, or force a
      failure), scoring/reply generation shows a friendly message — no crash, no
      half-broken page. (`mock` should never fail.)
- [ ] **Supabase error is graceful:** with bad/unreachable Supabase credentials the app
      surfaces a clear error or falls back to demo behavior rather than white-screening.
- [ ] A missing/invalid lead or project id renders the app's **not-found** page
      (`not-found.tsx`), not a stack trace.
- [ ] **No raw stack traces, file paths, env var values, or SQL** are ever shown to the
      user in any error state.
- [ ] Server-side errors return clean error UI; the browser console has no unhandled
      exceptions during normal navigation.

---

## Reference

- **Routes exercised:** `/`, `/pricing`, `/demo`, `/signup`, `/login`,
  `/auth/signout`, `/onboarding`, `/app`, `/app/projects`, `/app/projects/new`,
  `/app/projects/[id]`, `/app/projects/[id]/sources`, `/app/leads`, `/app/leads/[id]`,
  `/app/billing`, `/app/settings`, `/app/digest`, `/app/admin`,
  `/api/stripe/checkout`, `/api/stripe/webhook`, `/api/demo/score`.
- **Database:** schema in `supabase/migrations/0001_init.sql`; row-level security
  policies in `supabase/migrations/0002_rls.sql`. Run via the Supabase CLI
  (`supabase db reset`).
- **Defaults:** demo mode runs with zero secrets; `AI_PROVIDER=mock` by default.
- **Useful scripts:** `npm run dev`, `npm run build`, `npm run test`,
  `npm run typecheck`, `npm run lint`, `npm run verify:env`.

> This is an operational checklist, not legal advice. The platform-safety guarantees
> (no auto-posting, no auto-DMs, no scraping of private/paywalled sources, no browser
> automation) are product invariants — if any step here suggests they've been violated,
> treat it as a release blocker.
