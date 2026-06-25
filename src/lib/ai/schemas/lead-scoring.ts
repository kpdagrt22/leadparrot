import { z } from "zod";

/** Score field: integer 0-100, tolerant of floats/strings from model output. */
const score = z.coerce.number().int().min(0).max(100);
const confidence = z.coerce.number().min(0).max(1);

export const leadStageSchema = z.enum([
  "research",
  "problem-aware",
  "solution-aware",
  "buying-intent",
  "competitor-switching",
  "not-a-lead",
]);

/**
 * Schema for AI lead-scoring output. The provider must return JSON matching
 * this shape; we validate before persisting. `.passthrough()` is intentionally
 * NOT used — unknown keys are stripped to keep stored data minimal.
 */
export const leadScoringSchema = z.object({
  is_relevant: z.boolean(),
  intent_score: score,
  relevance_score: score,
  urgency_score: score,
  fit_score: score,
  // overall_score is recomputed server-side from the weighted model, but we
  // accept the model's suggestion too (it is overwritten downstream).
  overall_score: score.optional().default(0),
  lead_stage: leadStageSchema,
  reason: z.string().min(1).max(1200),
  pain_points: z.array(z.string().min(1)).max(12).default([]),
  buying_signals: z.array(z.string().min(1)).max(12).default([]),
  disqualifiers: z.array(z.string().min(1)).max(12).default([]),
  suggested_angle: z.string().max(1200).default(""),
  risk_flags: z.array(z.string().min(1)).max(12).default([]),
  should_generate_reply: z.boolean(),
  confidence,
});

export type LeadScoringInput = {
  project: {
    name: string;
    product_description: string;
    ideal_customer_profile?: string | null;
    competitors?: string[];
    keywords?: string[];
    negative_keywords?: string[];
    target_geography?: string | null;
  };
  post: {
    title?: string | null;
    body?: string | null;
    url?: string | null;
    source_type: string;
    author_display?: string | null;
  };
};

export type LeadScoringOutput = z.infer<typeof leadScoringSchema>;

/** Parse + validate raw model output, throwing a readable error on mismatch. */
export function parseLeadScoring(raw: unknown): LeadScoringOutput {
  return leadScoringSchema.parse(raw);
}

export function safeParseLeadScoring(raw: unknown) {
  return leadScoringSchema.safeParse(raw);
}
