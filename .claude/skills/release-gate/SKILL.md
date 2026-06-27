---
name: release-gate
description: Run the full local verification sequence for The Leads Nest before opening a PR, merging, or deploying — verify:env, typecheck, lint, test:coverage, build (demo), and e2e. Use when the user asks to "run the gate", "is this release-ready", "check before PR/merge/deploy", or after finishing a feature.
user-invocable: true
---

# Release gate

A change is not "done" until this sequence is green — it mirrors CI
(`.github/workflows/ci.yml`). Run from the repo root.

## The sequence (stop at the first failure and fix it)
```bash
npm run verify:env       # 1. env profile sane (Local Mock by default)
npm run typecheck        # 2. tsc --noEmit
npm run lint             # 3. next lint
npm run test:coverage    # 4. unit tests + coverage gate on core logic
LEADPARROT_DEMO=1 npm run build   # 5. production build, demo mode, zero secrets
npm run test:e2e         # 6. Playwright happy path (demo). First run: npx playwright install chromium
```
On Windows PowerShell, set the build env inline:
`$env:LEADPARROT_DEMO=1; npm run build`

## Gate rules
- **Report real output.** Never claim a step passed that you did not run/see.
- A failure is a blocker — fix the root cause; do not skip a step or use
  `--no-verify`.
- Before a PR/merge, also run the `platform-safety-audit` skill and (for
  auth/route/migration/source/notification changes) the `security-compliance`
  agent.
- **Do not merge to `main` or deploy without explicit human approval**, even
  when everything is green.

## Output
A checklist with each step's result, the commit/branch under test, any
remaining blockers, and the next human step.
