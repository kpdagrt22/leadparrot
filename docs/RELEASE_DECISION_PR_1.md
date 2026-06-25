# Release Decision — PR #1

PR: https://github.com/kpdagrt22/leadparrot/pull/1 · `leadparrot-mvp` → `main`

## 1. Is PR #1 safe to merge?

**SAFE WITH WARNINGS** — safe to merge **once CI is green**. The one confirmed security blocker (open redirect) is fixed; all other dimensions pass. The warnings below are expected alpha posture, not defects.

## 2. Evidence

| Check | Result |
|-------|--------|
| Unit tests | ✅ 77 passed (`npm test`) |
| Typecheck | ✅ clean (`tsc --noEmit`) |
| Lint | ✅ no warnings/errors (`npm run lint`) |
| Build | ✅ succeeds with mock AI, zero secrets (`next build`, `LEADPARROT_DEMO=1`) |
| verify:env | ✅ Local Mock exit 0; Production Alpha Minimum correctly fails when Supabase unset |
| Security audit | ✅ open-redirect (HIGH) fixed; RLS + ownership helpers verified |
| Platform-safety audit | ✅ no auto-post/DM/scraping; copy-only; disclosure enforced |
| Manual diff review | ✅ see `docs/LEADPARROT_PR_1_REVIEW.md` |
| CI | ⏳ added this pass (`.github/workflows/ci.yml`); must show green on the PR before merge |

## 3. Warnings (accepted for alpha)

- **Source integrations are placeholders** unless credentials are configured (Reddit/HN/RSS/web-search). Clearly labeled in UI + docs.
- **Real AI provider output not yet validated** — mock is the default and is deterministic; review live OpenAI/Anthropic output before enabling for customers.
- **Manual public-post input is the core v1 source** — by design.
- **Platform ToS risk** remains for any future live integration; mitigated by official-API-only design and manual review.
- **No auto-posting / no full CRM** — intentional scope.

## 4. Required before production-alpha

1. Create a Supabase project (`docs/SUPABASE_PRODUCTION_RUNBOOK.md`).
2. Apply migrations `0001_init.sql` → `0002_rls.sql`; verify tables + RLS.
3. Configure env vars (`docs/ENVIRONMENT_MATRIX.md`, "Production Alpha Minimum").
4. Deploy to Vercel (`docs/VERCEL_DEPLOYMENT_RUNBOOK.md`).
5. Run `docs/PRODUCTION_SMOKE_TEST.md` end-to-end.

## 5. Required before paid customers

- Deliver real founder **sample reports** (manual, concierge).
- If a live AI provider is enabled, **review its output** for safety/quality.
- Complete the **first 10 manual lead reports**.
- Validate **payment willingness** ($19–$49/mo) per `docs/BETA_FOUNDER_OPERATIONS.md`.

## 6. Human action

1. Wait for **CI green** on PR #1.
2. **Merge PR #1** (manual — not done automatically).
3. Create Supabase project → run migrations → configure Vercel env → deploy.
4. Run the production smoke test.
5. Send **10 free sample reports** to founders/agencies and begin validation.
