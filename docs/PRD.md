# Product Requirements (PRD)

## One-liner

**LeadParrot** finds public online conversations where people are already asking for help, recommendations, alternatives, services, or products — scores buyer intent, summarizes why each is a potential lead, and drafts a helpful reply you review and post yourself.

## Core promise

> Find people already asking for what you sell — and get a useful reply draft before your competitors see the thread.

## Who it's for

SaaS founders, agencies, consultants, B2B service businesses, AI tools, and niche service businesses in US / EU / Canada / Australia.

## What it explicitly is NOT

Not a generic social-listening platform, not a spam/automation tool, not a CRM, not LinkedIn/auto-DM/auto-comment automation, not a scraper of private/logged-in sources, not browser automation.

## Product principles

1. **Safe & platform-conscious.** Official APIs + public feeds only. Never post/DM for the user. Disclosure-first replies.
2. **Validation-first.** Runs end-to-end with zero secrets (demo mode + mock AI). Narrow before broad.
3. **Lean & self-serve.** Low support, simple metering, clear empty states.
4. **Working vertical slice over abstractions.**

## MVP feature set

1. **Landing page** — hero, problem, solution, how-it-works, use cases, safety positioning, pricing, FAQ.
2. **Auth & onboarding** — Supabase Auth; collect business + ICP + keywords + tone + digest prefs.
3. **Database + RLS** — organization-scoped schema, no cross-org leakage.
4. **Dashboard** — totals, high-intent count, avg score, saved, replies copied, active projects, last run, recent leads, usage meters.
5. **Projects** — product description, ICP, competitors, keywords, negative keywords, geography.
6. **Sources** — manual, Reddit (official API), Hacker News (public), RSS, web-search placeholder; each with "Run scan".
7. **Scan + scoring** — keyword pre-filter → AI scoring (Zod-validated) → weighted overall score → lead candidate.
8. **Reply drafting** — helpful, disclosed, non-pushy drafts with safety notes.
9. **Lead inbox** — filter by project/source/score/stage/status, search, sort.
10. **Lead detail** — full analysis, reply draft, copy (no posting), status, notes.
11. **Daily digest** — email via Resend, or in-app preview.
12. **Billing** — Free/Starter/Pro/Agency; Stripe abstraction; "not configured" fallback.
13. **Usage limits** — monthly posts scanned, reply drafts, project count.
14. **Admin** — aggregate internal metrics, gated by `ADMIN_EMAILS`.

## Scoring model

`overall = relevance*0.35 + intent*0.30 + urgency*0.20 + fit*0.15` (each 0–100).
Tiers: **high ≥ 70**, **medium 40–69**, **low < 40**. Lead stages: research, problem-aware, solution-aware, buying-intent, competitor-switching, not-a-lead.

## Plans & limits

| Plan | Price | Projects | Posts/mo | Reply drafts/mo |
| --- | --- | --- | --- | --- |
| Free | $0 | 1 | 20 | 10 |
| Starter | $19 | 3 | 500 | 100 |
| Pro | $49 | 10 | 3,000 | 1,000 |
| Agency | $99 | 25 | 10,000 | 5,000 |

## Acceptance criteria

Sign up/login · create org · create project (ICP/keywords/competitors/negatives) · add manual source/post · run mock AI scoring · lead inbox · generate reply draft · copy reply manually · save/mark leads · dashboard metrics · digest preview · billing/pricing abstraction · usage limits · RLS protection · platform-safety docs · validation plan · core tests pass.

## Out of scope (v1)

Scheduled background scans, live web-search integration, team invites/roles UI, white-label digest, CRM features, outbound email/DM automation.

## Success metric

See [VALIDATION_PLAN.md](VALIDATION_PLAN.md): ≥ 3 of 10 trial users agree to pay $19–$49/mo; pivot/kill if < 2 of 10 find value.
