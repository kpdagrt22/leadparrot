# LeadParrot — Final Adversarial Alpha Audit

Date: 2026-06-26 · Branch: `leadparrot-mvp` (PR #1) · Gates at audit time: **77 unit tests · typecheck · lint · build · verify:env all green.**

Post-hardening adversarial pass. Per category: result · evidence · remaining risk · blocks validation? · file references.

| # | Category | Result | Blocks validation? |
|---|----------|--------|--------------------|
| 1 | Security | ✅ PASS | No |
| 2 | RLS / data isolation | ✅ PASS | No |
| 3 | Platform safety | ✅ PASS | No |
| 4 | AI safety | ✅ PASS | No |
| 5 | Lead-scoring workflow | ✅ PASS | No |
| 6 | Reply-draft workflow | ✅ PASS | No |
| 7 | Usage limits | ✅ PASS | No |
| 8 | Source integration safety | ✅ PASS | No |
| 9 | Supabase readiness | ✅ PASS | No |
| 10 | Vercel deployment readiness | ✅ PASS | No |
| 11 | Billing readiness | ✅ PASS | No |
| 12 | Demo readiness | ✅ PASS | No |
| 13 | Validation readiness | ✅ PASS | No |
| 14 | Test coverage | ✅ PASS | No |
| 15 | Git hygiene | ✅ PASS | No |
| 16 | Scope discipline | ✅ PASS | No |

## 1. Security — PASS
- **Open redirect fixed**: `src/app/auth/callback/route.ts` now routes `next` through `safeRedirectPath()` (`src/lib/utils.ts`); covered by `tests/unit/redirect.test.ts` (6 tests).
- Centralized ownership helpers: `src/lib/auth/organizations.ts` (`requireOrganizationMember`, `requireOrganizationOwnerOrAdmin`, `assert{Project,Source,RawPost,Lead,ReplyDraft,SavedLead}BelongsToOrg`) + `tests/unit/organizations-auth.test.ts` (6 tests).
- Service-role client is server-only (`src/lib/supabase/admin.ts`); admin page gated by `ADMIN_EMAILS`.
- **Remaining risk:** low. No auth-endpoint rate limiting (Supabase-managed).

## 2. RLS / data isolation — PASS
- RLS on all org tables (`supabase/migrations/0002_rls.sql`), `is_org_member` SECURITY DEFINER; store getters all org-scoped. **Remaining risk:** low — run the live two-account cross-tenant check from the smoke test.

## 3. Platform safety — PASS
- No posting/DM/scraping/browser-automation code anywhere (`src/lib/sources/*`, `src/lib/ai/*`). Reply flow is copy-only (`COPY_DISCLAIMER`, `src/lib/utils.ts`). Disclosure enforced in reply output + UI. Honest source placeholders (`docs/SOURCE_INTEGRATIONS.md`). **Remaining risk:** user responsibility for platform rules — documented.

## 4. AI safety — PASS
- Deterministic mock default; Zod-validated scoring + reply; malformed → fallback (no crash, no fabricated lead); server-recomputed weighted score; disqualifiers/risk-flags/low-confidence surfaced. Tests need no keys (`tests/unit/mock-provider.test.ts`, `lead-scoring-schema.test.ts`, `reply-draft-schema.test.ts`). **Remaining risk:** live provider output unreviewed (mock is default).

## 5. Lead-scoring workflow — PASS
- `overall = relevance*0.35 + intent*0.30 + urgency*0.20 + fit*0.15`; tiers high≥70 / medium 40–69 / low<40 (`src/lib/scoring/score.ts`, `tests/unit/score.test.ts` with hand-computed cases). Negative keywords disqualify (`tests/unit/keywords.test.ts`). AI failure never fabricates high intent.

## 6. Reply-draft workflow — PASS
- Schema: `reply_text`, `why_this_reply`, `safety_notes[]`, `suggested_disclosure`, `confidence`. Disclosure present when own product mentioned; UI shows safety notes + "review platform rules; LeadParrot does not post for you"; **copy button only — no post/DM button or route**. Malformed handled.

## 7. Usage limits — PASS
- Plans + caps correct; enforced at scan/reply/project-create; `tests/unit/usage-limits.test.ts` (8). App works with no Stripe config.

## 8. Source integration safety — PASS
- Manual (core), RSS (public feeds), HN (public API) live; Reddit official read-only API (placeholder until creds); web-search placeholder only (Tavily/Exa/SerpAPI keys; **no scraping**). State machine `tests/unit/source-status.test.ts`. **Remaining risk:** platform ToS for future live use — documented.

## 9. Supabase readiness — PASS
- Ordered migrations; RLS; demo/seed path; `docs/SUPABASE_PRODUCTION_RUNBOOK.md`.

## 10. Vercel deployment readiness — PASS
- Builds with mock + zero keys; no secrets via `NEXT_PUBLIC_`; CI added (`.github/workflows/ci.yml`); `docs/VERCEL_DEPLOYMENT_RUNBOOK.md` + `docs/ENVIRONMENT_MATRIX.md`.

## 11. Billing readiness — PASS
- Stripe optional; checkout + webhook placeholders safe; "Billing not configured" message; no hardcoded secrets/price ids; `verify:env` reports status.

## 12. Demo readiness — PASS
- Zero-secret demo mode + seeded data + `/demo`; < 5-minute walkthrough in `docs/BETA_FOUNDER_OPERATIONS.md` and `docs/PRODUCTION_SMOKE_TEST.md`.

## 13. Validation readiness — PASS
- `docs/VALIDATION_PLAN.md` + `docs/BETA_FOUNDER_OPERATIONS.md` (niche, prospecting, offers, outreach scripts, demo, pricing test, success/kill metrics, feedback questions).

## 14. Test coverage — PASS
- 11 unit files / **77 tests**: scoring, keywords/negatives, schemas (lead + reply), usage limits, source status, scan flow, store, redirect safety, ownership helpers. Playwright E2E happy path. No real keys required.

## 15. Git hygiene — PASS
- Work on `leadparrot-mvp`; no secrets / `.env` / `node_modules` / `.next` committed; only `.env.example` placeholders. No force-push; `main` untouched; PR #1 updated (not merged).

## 16. Scope discipline — PASS
- No auto-post/auto-DM/browser-automation/LinkedIn/cold-email/CRM/private-scraping code added. Changes are hardening + the specified alpha gaps only.

## Bottom line
**No category blocks validation.** PR #1 is safe to merge after CI green; deploy via the runbooks, run the smoke test, and start the 10-founder beta.
