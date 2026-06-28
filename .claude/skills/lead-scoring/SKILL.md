---
name: lead-scoring
description: Understand and safely tune The Leads Nest lead-scoring model — the weighted formula, tiers, keyword/negative-keyword matching, disqualifiers, and the mock provider's deterministic scoring. Use when changing how leads are scored or classified, or when a lead's score looks wrong.
user-invocable: true
---

# Lead scoring

## The model (source of truth: `src/lib/scoring/score.ts`)
- `overall = relevance·0.35 + intent·0.30 + urgency·0.20 + fit·0.15`
  (sub-scores 0–100, rounded + clamped to 0–100).
- Tiers: **high ≥ 70**, **medium 40–69**, **low < 40** (`scoreTier`).
- Keyword / negative-keyword matching lives in `src/lib/scoring/keywords.ts`.
- The deterministic **mock provider** (`src/lib/ai/providers/mock.ts`) produces
  sub-scores from post text + project keywords/competitors — keep it
  reproducible (no randomness, no clock, no network).

## Guardrails when tuning
- **Do not classify everything as a lead.** Negative keywords must lower the
  score; academic/joke/hiring/"showing off" posts must be **disqualified**, not
  scored high.
- Keep the AI output schema (`src/lib/ai/schemas/lead-scoring.ts`) and the
  weighted formula in sync — both are Zod/validated and unit-tested.
- A retune is only complete when `tests/unit/score.test.ts` and
  `keywords.test.ts` are updated to lock the new behavior.

## Recipe
1. Decide what should move (weights? thresholds? keyword rules? a new
   disqualifier?). Change the smallest piece.
2. Update the mock provider so demo data still tells the right story.
3. Update/extend the unit tests, then run `npm run test` + `npm run typecheck`.
4. Sanity-check the demo dashboard so the example leads still rank sensibly.
   Output: what changed, before/after on a sample post, tests run.
