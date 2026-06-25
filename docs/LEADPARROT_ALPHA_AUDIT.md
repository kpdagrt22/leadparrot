# LeadParrot — Alpha Current-State Audit

Date: 2026-06-26 · Branch: `leadparrot-mvp` · Method: 9-dimension parallel code audit of the actual source, each finding file-referenced. Gates after this pass: **77 unit tests · typecheck · lint · build · verify:env all green.**

## Verdict

**8 of 9 dimensions PASS; 1 WARN (Security)** — a single confirmed HIGH open-redirect, now fixed. LeadParrot is a platform-safe discovery + reply-draft tool with strong RLS, honest source placeholders, and disclosure-first replies. Alpha-ready after this hardening pass.

## Scorecard

| Dimension | Result |
|-----------|--------|
| 1. Feature completeness | ✅ PASS |
| 2. Lead-discovery workflow | ✅ PASS |
| 3. Platform safety | ✅ PASS |
| 4. Security & RLS | ⚠️ WARN → ✅ (open redirect fixed) |
| 5. AI readiness | ✅ PASS |
| 6. Usage / billing | ✅ PASS |
| 7. Supabase readiness | ✅ PASS |
| 8. Deployment readiness | ✅ PASS (CI added) |
| 9. Validation readiness | ✅ PASS (beta kit added) |

## Findings & fixes (this task)

| Severity | Dimension | Finding | File | Fix | Fixed |
|----------|-----------|---------|------|-----|-------|
| **HIGH** | Security | Open redirect via `next` param in OAuth callback | `src/app/auth/callback/route.ts` | `safeRedirectPath()` validation | ✅ |
| LOW | Security | No centralized ownership-helper module | `src/lib/auth/organizations.ts` (new) | `requireOrganizationMember/OwnerOrAdmin`, `assert*BelongsToOrg` + by-id store getters + tests | ✅ |
| LOW | Env | Missing `TAVILY/EXA/SERPAPI_API_KEY`, `FROM_EMAIL`, `NEXT_PUBLIC_STRIPE_PRICE_*`; no env verifier | `src/lib/env.ts`, `.env.example`, `scripts/verify-env.ts` | added all + `npm run verify:env` (3 profiles) | ✅ |
| MED | Deployment | No CI | `.github/workflows/ci.yml` (new) | verify:env · typecheck · lint · test · build | ✅ |
| — | Docs | Missing runbooks/matrix/smoke/beta/review docs | `docs/*` | created | ✅ |

## Dimension detail

### 1. Feature completeness — PASS
Landing, pricing, demo search; Supabase auth + onboarding; org + project setup with ICP/keywords/negative-keywords/competitors; manual public-post input; mock-AI scoring; lead inbox + detail; reply-draft generation + copy; save/status workflow; usage limits; daily-digest preview; Stripe + source placeholders; platform-safety docs; tests. CI added this pass.

### 2. Lead-discovery workflow — PASS
Create project → define product/ICP → keywords + negative keywords → paste public post → AI scores → score breakdown + reason/buying-signals/disqualifiers visible → generate reply draft → copy manually → mark saved/contacted/not-relevant. Verified across `src/app/app/*` and `src/lib/scan.ts`.

### 3. Platform safety — PASS
No posting/DM endpoints anywhere; replies are **copy-only** (status `copied`); all sources use official/public APIs or honest placeholders (no scraping/browser automation); affiliation disclosure is baked into the reply prompt + UI; "No auto-posting / No auto-DMs" disclaimers across UI and marketing; risk flags + safety notes surfaced before any manual action.

### 4. Security & RLS — WARN → fixed
RLS on every org table; membership-based policies (`is_org_member` SECURITY DEFINER); anon vs service-role clients separated (service role server-only); admin gated by `ADMIN_EMAILS`. **One HIGH open redirect** (OAuth callback) — fixed. Added centralized ownership helpers as defense-in-depth.

### 5. AI readiness — PASS
Deterministic mock default; OpenAI/Anthropic placeholders; Zod-validated scoring + reply schemas; malformed output → graceful fallback (no crash, no fabricated high-intent lead); server-side recompute of the canonical weighted overall score; disqualifiers + risk flags + low-confidence surfaced; tests need no API keys. (`lead_stage` uses hyphenated slugs — semantically identical to the spec's underscored names; kept consistent across schema/DB/tests/UI by design.)

### 6. Usage / billing — PASS
Plans Free(1/20/10) · Starter $19(3/500/100) · Pro $49(10/3000/1000) · Agency $99(25/10000/5000); usage helpers + enforcement; app fully functional with NO Stripe keys; checkout + webhook placeholders safe; no hardcoded secrets/price ids.

### 7. Supabase readiness — PASS
Ordered migrations `0001_init` + `0002_rls`; RLS enabled; demo/seed path (in-memory demo mode) runs with zero secrets; runbook added (`SUPABASE_PRODUCTION_RUNBOOK.md`).

### 8. Deployment readiness — PASS
Builds with mock AI + zero optional keys; no server secrets via `NEXT_PUBLIC_`; `.gitignore` covers `.env`/`.next`/`node_modules`. Added CI + `VERCEL_DEPLOYMENT_RUNBOOK.md` + `ENVIRONMENT_MATRIX.md`.

### 9. Validation readiness — PASS
< 5-minute demo via demo mode + sample post; `docs/VALIDATION_PLAN.md` present; added `docs/BETA_FOUNDER_OPERATIONS.md` (niche, prospecting, offers, outreach scripts, demo script, pricing test, success/kill metrics, feedback questions) and `docs/PRODUCTION_SMOKE_TEST.md`.

## Residual risk (non-blocking)
- Real OpenAI/Anthropic output not yet validated against live keys (mock is default).
- Source integrations beyond manual are placeholders unless credentials configured — clearly labeled.
- Platform ToS risk applies to any future live integration; manual input is the safe v1 core.
