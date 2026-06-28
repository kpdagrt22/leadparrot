# CLAUDE.md — The Leads Nest (repo: `leadparrot`)

Operating guide for Claude Code agents working in this repository. These
instructions take precedence over default behavior. Read this before any task.

---

## 1. What this product is

**The Leads Nest** (codename LeadParrot) is a **platform-safe, manual-first
high-intent lead discovery + AI reply-draft tool.** It finds public
conversations where people are already asking for what you sell, scores buyer
intent, and drafts a helpful, transparent reply that **the user posts
themselves**.

> It is a **discovery + drafting** tool. It is **not** outreach automation, a
> scraper, or a CRM.

Primary users: AI-SaaS founders, indie hackers, agencies, consultants — anyone
doing founder-led sales who wants high-intent leads from public threads.

## 2. The rule that defines the product — never violate it

**Platform safety is the differentiator, not a feature.** The following are
permanently out of scope. If a task drifts toward any of them, **stop and flag
it** instead of implementing:

- ❌ Auto-posting, auto-commenting, auto-DM
- ❌ Private / paywalled / login-walled scraping
- ❌ Browser automation or ToS evasion to fetch content
- ❌ Google/SERP scraping without an official API
- ❌ Repeated copy-paste spam templates, fake identities, urgent/pushy CTAs
- ❌ Full CRM, scheduling, native app, cold-email/LinkedIn automation
- ❌ "Guaranteed leads" promises

Allowed sources are **official APIs + manual paste only** (Reddit official API,
Hacker News public API, public RSS, manual paste; web-search reserved for
official APIs like Tavily/Exa/SerpAPI — never scraping). Every reply draft must
carry an **affiliation disclosure** and a **platform-rules disclaimer**. See
[`docs/PLATFORM_SAFETY.md`](docs/PLATFORM_SAFETY.md) and
[`docs/COMPLIANCE.md`](docs/COMPLIANCE.md). When in doubt, run the
`platform-safety-audit` skill.

## 3. Architecture in one breath

Next.js 15 (App Router) · TypeScript · Tailwind · Supabase (Postgres/Auth/RLS) ·
Zod · Vitest · Playwright.

- **Dual DataStore behind one interface** — [`src/lib/db/store.ts`](src/lib/db/store.ts)
  defines `DataStore`; [`MemoryStore`](src/lib/db/memory-store.ts) backs demo
  mode, [`SupabaseStore`](src/lib/db/supabase-store.ts) backs production (RLS is
  the second line of defense). `getStore()` / `getAdminStore()` in
  [`src/lib/db/index.ts`](src/lib/db/index.ts) pick the right one.
- **Mock-first AI** — provider abstraction `mock | openai | anthropic`
  ([`src/lib/ai/`](src/lib/ai/)). Output is **Zod-validated before persist or
  display**; malformed output falls back safely and **never fabricates a
  high-intent lead**. `enforceReplySafety()` guarantees every draft has a
  disclosure.
- **Runs with ZERO secrets.** With no Supabase env configured (or
  `LEADPARROT_DEMO=1`), `isDemoMode()` serves seeded in-memory data + the
  deterministic mock provider, so the whole product is clickable offline. Every
  integration (Supabase, Stripe, Resend, Reddit, web-search) is **optional** and
  **degrades gracefully** — never throw at startup on a missing key.
  See [`src/lib/env.ts`](src/lib/env.ts).

Pipeline: source fetch → keyword/negative-keyword filter → AI score → lead →
reply draft. Orchestrated in [`src/lib/scan.ts`](src/lib/scan.ts).

## 4. Commands

```bash
npm run dev            # next dev (http://localhost:3000) — demo mode with no .env.local
npm run build          # next build  (CI builds with LEADPARROT_DEMO=1)
npm run typecheck      # tsc --noEmit
npm run lint           # next lint
npm run test           # vitest run (unit) — never requires real API keys
npm run test:coverage  # unit + coverage gate on core business logic
npm run test:e2e       # playwright (demo mode, offline). First: npx playwright install chromium
npm run verify:env     # validate the env profile (Local Mock by default)
```

**CI** ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) runs:
`verify:env → typecheck → lint → test:coverage → build (demo) → e2e (demo)`.
A change is not "done" until that sequence is green locally — see the
`release-gate` skill.

## 5. Conventions (match these)

- **Path alias:** `@/` → `src/`.
- **Demo-mode-first:** branch on feature detection (`isDemoMode()`,
  `isStripeConfigured()`, `isRedditConfigured()`, …) — add a graceful
  "not configured" path, never a hard failure.
- **Validate AI/external input with Zod** before persisting or rendering.
- **Never trust client-supplied org/project IDs.** Every org-scoped read/write
  goes through ownership checks **and** RLS. No service-role key client-side.
- **Mock provider stays deterministic** so tests/demos are reproducible.
- **Never commit** `.env*` (except `.env.example`), API keys, service-role keys,
  `node_modules`, `.next`, or build artifacts. (A hook enforces this.)
- **Document limitations** — never pretend an integration is complete.
- Design work follows **The Crest** system — see the `crest-design` skill and
  [`docs/SKILL.md`](docs/SKILL.md).

## 6. Data model & security invariants

Org-scoped tables: organizations/members, projects, sources/source_runs,
raw_posts, lead_candidates, reply_drafts, usage_events, subscriptions. Rules:

- RLS enabled on every org-scoped table; ownership helpers for project/source/
  raw_post/lead/reply/saved_lead. New table ⇒ add it to RLS in
  [`supabase/migrations/0002_rls.sql`](supabase/migrations/0002_rls.sql).
- No cross-org leakage through joins. No public write routes except intentional,
  safe manual/demo paths. No hidden posting endpoints. No open redirects.

Run the adversarial checklist via the `security-compliance` agent on any auth,
route, migration, or source change.

## 7. End-of-task protocol (required)

Every task ends with: **tests run · commit hash (if committed) · branch name ·
known limitations · next human steps.** Prefer fixing blockers over adding
features. **Do not merge to `main` or deploy without explicit human
instruction.**

## 8. The fleet — agents, skills, hooks

Specialized subagents live in [`.claude/agents/`](.claude/agents/) and mirror the
governance roles in [`src/lib/agents/prompts.ts`](src/lib/agents/prompts.ts).
Delegate domain work to them:

| Agent | Owns |
| --- | --- |
| `product-owner` | Scope, acceptance criteria, no-scope-creep, demo path |
| `architecture` | System design, data flow, maintainability, scale risk |
| `supabase-rls` | Migrations, RLS, ownership helpers, org isolation, seed data |
| `ai-workflow` | AI schemas, prompts, mock provider, Zod validation, fallbacks |
| `frontend-ux` | Pages, components, forms, empty states, responsiveness, polish |
| `security-compliance` | Adversarial audits: auth, IDOR, secrets, platform safety |
| `qa-test` | Unit/E2E tests, edge cases, build/typecheck/lint gates |
| `devops-release` | Git hygiene, PR review, CI, Vercel deploy, env matrix, rollback |
| `gtm-validation` | ICP, outreach, sample reports, pricing, success/kill metrics |
| `support-feedback` | Triage beta feedback into scoped backlog items |

Reusable skills in [`.claude/skills/`](.claude/skills/):
`wire-feature`, `notification-channels`, `browser-extension`,
`platform-safety-audit`, `release-gate`, `lead-scoring`, `sample-report`,
`crest-design`.

Hooks ([`.claude/settings.json`](.claude/settings.json)) protect invariants:
they block writing real env/secret files, block staging secrets or force-pushing
in Bash, and inject invariant reminders when you edit safety-critical paths.

## 9. Key references

- **Build & operate:** [docs/BUILD_PROMPT.md](docs/BUILD_PROMPT.md) (phased build,
  login → alerts → extension) · [docs/CREDENTIALS.md](docs/CREDENTIALS.md) ·
  [docs/TESTING_MASTER_PROMPT.md](docs/TESTING_MASTER_PROMPT.md) ·
  [docs/EXTENSION_BUILD_PROMPT.md](docs/EXTENSION_BUILD_PROMPT.md) ·
  [docs/DESIGN_MIGRATION_PROMPT.md](docs/DESIGN_MIGRATION_PROMPT.md) (apply theme +
  web/mobile/PWA onto `src/`) ·
  [docs/FEEDBACK_SYSTEM_PROMPT.md](docs/FEEDBACK_SYSTEM_PROMPT.md) (feedback +
  support ticketing — every web screen + mobile Help)
- Each prompt doc opens with a **Section 0 — Mandatory Corrections** from an
  adversarial review verified against live code; apply it first.
- [README.md](README.md) · [docs/PRD.md](docs/PRD.md) ·
  [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/DATABASE.md](docs/DATABASE.md)
- [docs/AI_SCORING_WORKFLOW.md](docs/AI_SCORING_WORKFLOW.md) ·
  [docs/SOURCE_INTEGRATIONS.md](docs/SOURCE_INTEGRATIONS.md)
- [docs/PLATFORM_SAFETY.md](docs/PLATFORM_SAFETY.md) ·
  [docs/COMPLIANCE.md](docs/COMPLIANCE.md) ·
  [docs/VALIDATION_PLAN.md](docs/VALIDATION_PLAN.md) ·
  [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
