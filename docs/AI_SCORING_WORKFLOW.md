# AI Scoring Workflow

## Provider abstraction

```
src/lib/ai/
  service.ts            # getAIProvider(), scoreLead(), draftReply()
  prompts.ts            # system + user prompt builders
  providers/
    types.ts            # AIProvider interface
    mock.ts             # deterministic, offline, default
    openai.ts           # Chat Completions JSON mode (fetch)
    anthropic.ts        # Messages API (fetch)
  schemas/
    lead-scoring.ts     # Zod schema + parse helpers
    reply-draft.ts      # Zod schema + parse helpers
```

`getAIProvider()` reads `AI_PROVIDER` (`mock` | `openai` | `anthropic`). If the selected provider lacks its API key, it **falls back to the mock** so the app never hard-fails. `scoreLead()`/`draftReply()` also catch provider errors and fall back to the mock, recording the error in `ai_scoring_logs`.

## Scoring flow

For each candidate post the orchestrator ([`src/lib/scan.ts`](../src/lib/scan.ts)) does:

1. **Keyword pre-filter** — skip if a negative keyword matches; require ≥1 keyword match when keywords are configured (cheap, no AI cost).
2. **Usage check** — enforce the plan's monthly `posts_scanned` budget.
3. **De-dupe** — `raw_posts(source_type, external_id)` is unique; already-seen posts are skipped.
4. **AI score** — provider returns the scoring object; validated by Zod.
5. **Recompute overall** — the canonical `overall_score` is always recomputed server-side from the weighted model (the model's own `overall_score` is advisory only).
6. **Persist** — `lead_candidates` row + `ai_scoring_logs` + `usage_events(post_scanned)`.

## Output schema (lead scoring)

Validated by `leadScoringSchema`:

| Field | Type | Notes |
| --- | --- | --- |
| `is_relevant` | boolean | |
| `intent_score`/`relevance_score`/`urgency_score`/`fit_score` | int 0–100 | coerced from strings/floats |
| `overall_score` | int 0–100 | recomputed server-side |
| `lead_stage` | enum | research, problem-aware, solution-aware, buying-intent, competitor-switching, not-a-lead |
| `reason` | string | why it's (not) a lead |
| `pain_points` / `buying_signals` / `disqualifiers` / `risk_flags` | string[] | default `[]` |
| `suggested_angle` | string | how to approach |
| `should_generate_reply` | boolean | |
| `confidence` | 0–1 | |

Unknown keys are **stripped** (minimal stored data).

## Weighted model

```
overall = relevance*0.35 + intent*0.30 + urgency*0.20 + fit*0.15   (each 0–100, clamped/rounded)
```

Tiers: **high ≥ 70**, **medium 40–69**, **low < 40**. Implemented + unit-tested in [`src/lib/scoring/score.ts`](../src/lib/scoring/score.ts).

## Reply drafting

`draftReply()` produces a `reply_text` plus `why_this_reply`, `safety_notes[]`, `suggested_disclosure`, and `confidence` (schema `replyDraftSchema`). The system prompt enforces:

- Answer the question / acknowledge the problem **first**.
- 1–2 genuinely useful suggestions **before** any product mention.
- **Always disclose affiliation.**
- No fake identity, fake testimonials, false claims, or aggressive CTAs.
- Avoid mass-template phrasing.

**Bad:** "Use my tool now, it is best."
**Good:** "One way to approach this is to track mentions manually for a week so you know which communities matter. If you want to automate that later, tools like X/Y can help. I'm building a small tool in this space too, happy to share if useful."

## The mock provider

[`mock.ts`](../src/lib/ai/providers/mock.ts) derives stable scores from the post text and the project's keywords/competitors/negatives:

- Relevance from keyword coverage + competitor mentions.
- Intent from buying-language phrases ("looking for", "alternative to", "frustrated with"…).
- Urgency from time phrases ("asap", "this week", "deadline"…).
- Fit from ICP/keyword heuristics.
- Negative-keyword posts → `not-a-lead`.

It is **deterministic** (no `Math.random`/`Date.now`), so demos and tests are reproducible.

## Using a real provider

```bash
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-haiku-4-5-20251001
# or
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

Both providers request a single JSON object, validate it with the same Zod schema, and recompute the overall score. Swap models via the `*_MODEL` env vars.
