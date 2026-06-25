# LeadParrot — PR #1 Review

- **PR:** https://github.com/kpdagrt22/leadparrot/pull/1
- **Base branch:** `main` (empty initial commit `6da46b4`)
- **Head branch:** `leadparrot-mvp`
- **Commits:** `63ed9f0` (MVP) + this alpha-hardening commit
- **State:** OPEN · **Mergeable:** MERGEABLE · **Review decision:** none yet
- **CI status:** none at review time → **CI added** in this pass (`.github/workflows/ci.yml`: verify:env · typecheck · lint · test · build)
- **Files changed:** the diff is the entire first build (main started empty) — 111 MVP files + this hardening pass.

## Mergeability & readiness

PR #1 is **safe to review and merge after CI is green**. The MVP was already strong; this hardening pass fixed the one confirmed security blocker and closed the alpha gaps (ownership helpers, env verification, source-provider env, CI). Nothing is merged automatically; `main` is untouched.

## Diff Review Findings

Reviewed `git diff origin/main...origin/leadparrot-mvp` (the whole MVP) across the required areas. Each area: status · files · issue · severity · blocker · fixed-here.

| Area | Status | Files | Issue / note | Severity | Blocker | Fixed here |
|------|--------|-------|--------------|----------|---------|------------|
| Database migrations | PASS | `supabase/migrations/0001_init.sql` | 14 tables, indexes, triggers | — | No | n/a |
| RLS policies | PASS | `supabase/migrations/0002_rls.sql` | RLS on all org tables; `is_org_member` SECURITY DEFINER | — | No | n/a |
| Org membership checks | PASS | `src/lib/auth.ts`, `src/lib/db/*` | org-scoped getters everywhere | — | No | n/a |
| Project/object ownership | PASS→improved | `src/lib/auth/organizations.ts` (new) | centralized `assert*BelongsToOrg` added | LOW | No | ✅ |
| Manual post input | PASS | `src/lib/scan.ts`, `src/app/app/projects/[id]/sources` | validated, dedup via unique key | — | No | n/a |
| AI lead scoring | PASS | `src/lib/ai/*`, `src/lib/scoring/*` | full schema, weighted model, fallback | — | No | n/a |
| AI reply generation | PASS | `src/lib/ai/schemas/reply-draft.ts` | disclosure + safety notes | — | No | n/a |
| Reply safety / no-post | PASS | lead detail UI | copy-only, no post/DM button or route | — | No | n/a |
| Lead inbox & detail | PASS | `src/app/app/leads/*` | filters, score breakdown, statuses | — | No | n/a |
| Usage limits | PASS | `src/lib/usage/*`, `src/lib/plans.ts` | enforced; plans correct | — | No | n/a |
| Pricing / billing | PASS | `src/lib/billing/stripe.ts`, `api/stripe/*` | optional; "not configured" safe | — | No | n/a |
| Source placeholders | PASS | `src/lib/sources/*` | honest placeholders; no scraping | — | No | n/a |
| Platform-safety docs | PASS | `docs/PLATFORM_SAFETY.md`, `COMPLIANCE.md` | present | — | No | n/a |
| Env handling | PASS→improved | `src/lib/env.ts`, `.env.example` | added TAVILY/EXA/SERPAPI, FROM_EMAIL, NEXT_PUBLIC price ids, `verify:env` | LOW | No | ✅ |
| Public routes | **WARN→PASS** | `src/app/auth/callback/route.ts` | **open redirect via `next` param** | **HIGH** | **Yes** | ✅ fixed (`safeRedirectPath`) |
| Internal/admin routes | PASS | `src/app/app/admin/page.tsx` | gated by `ADMIN_EMAILS` | — | No | n/a |
| Tests | PASS→improved | `tests/unit/*` | 65 → **77** (redirect, ownership) | — | No | ✅ |
| CI | **WARN→PASS** | `.github/workflows/ci.yml` (new) | no CI existed | MED | No | ✅ added |
| Docs | PASS→improved | `docs/*` | added runbooks/matrix/smoke/beta/audit | — | No | ✅ |

### The one blocker (fixed)
**Open redirect** in `src/app/auth/callback/route.ts` — the `next` query param was used in `NextResponse.redirect` without validation, allowing `?next=//evil.com`. **Fixed** by routing it through `safeRedirectPath()` (root-relative only; blocks `//host`, `/\host`, control/whitespace). Covered by `tests/unit/redirect.test.ts`.

## Is the PR ready after this hardening pass?
**Yes — safe to merge once CI passes.** See `docs/RELEASE_DECISION_PR_1.md`.

## Required human action
1. Wait for CI (the new workflow) to go green on the PR.
2. Review the diff, then **merge PR #1** (squash or merge — not done automatically here).
3. Follow `docs/SUPABASE_PRODUCTION_RUNBOOK.md` + `docs/VERCEL_DEPLOYMENT_RUNBOOK.md` to deploy.
4. Run `docs/PRODUCTION_SMOKE_TEST.md`, then begin beta validation (`docs/BETA_FOUNDER_OPERATIONS.md`).
