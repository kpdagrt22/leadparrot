# `.claude/` — The Leads Nest operating layer

This directory configures how Claude Code works in this repo. Start from
[`../CLAUDE.md`](../CLAUDE.md).

## Agents (`agents/`)
Routable subagents mirroring the governance roles in
[`../src/lib/agents/prompts.ts`](../src/lib/agents/prompts.ts). Delegate domain
work to them: `product-owner`, `architecture`, `supabase-rls`, `ai-workflow`,
`frontend-ux`, `security-compliance`, `qa-test`, `devops-release`,
`gtm-validation`, `support-feedback`.

## Skills (`skills/`)
Reusable procedures (invoke with `/<name>` or let them auto-trigger):
- `wire-feature` — add a feature end-to-end (route → backend → store → tests).
- `notification-channels` — wire email (SMTP/Resend), SMS, WhatsApp alerts.
- `browser-extension` — build the MV3 manual-capture extension (safety-contracted).
- `platform-safety-audit` — the no-auto-post / no-scrape / disclosure gate.
- `release-gate` — the full pre-PR/merge/deploy verification sequence.
- `lead-scoring` — understand and safely tune the scoring model.
- `crest-design` — build UI with The Crest design system.
- `sample-report` — generate a founder sample lead report (validation).

## Hooks (`hooks/` + `settings.json`)
- `guard-bash.mjs` (PreToolUse/Bash) — blocks staging secrets, force-adding
  artifacts, `--no-verify`, and force-push.
- `protect-secrets.mjs` (PreToolUse/Write|Edit) — blocks writing real `.env*`
  and key files (allows `.env.example`).
- `safety-context.mjs` (PostToolUse/Write|Edit) — injects the relevant invariant
  when you edit a safety-critical path.

`settings.json` also allow-lists safe read/test/build commands to cut prompts.

## Build & operate docs
- [`../docs/BUILD_PROMPT.md`](../docs/BUILD_PROMPT.md) — phased build (login →
  SMTP/SMS/WhatsApp alerts → Phase 10 browser extension).
- [`../docs/EXTENSION_BUILD_PROMPT.md`](../docs/EXTENSION_BUILD_PROMPT.md) — the
  full MV3 extension build prompt (apply its Section 0 corrections first).
- [`../docs/TESTING_MASTER_PROMPT.md`](../docs/TESTING_MASTER_PROMPT.md) — the
  master testing prompt (apply its Section 0 corrections first).
- [`../docs/DESIGN_MIGRATION_PROMPT.md`](../docs/DESIGN_MIGRATION_PROMPT.md) — apply
  the new theme + web/mobile/PWA design onto `src/` (apply its Section 0 first).
- [`../docs/FEEDBACK_SYSTEM_PROMPT.md`](../docs/FEEDBACK_SYSTEM_PROMPT.md) — feedback
  + support ticketing on every web screen + mobile Help (apply its Section 0 first).
- [`../docs/CREDENTIALS.md`](../docs/CREDENTIALS.md) — every credential, by tier.
