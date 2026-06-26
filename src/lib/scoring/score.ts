import type { ScoreTier } from "@/lib/types";

/**
 * Weighted scoring model for The Leads Nest.
 *
 * overall = relevance*0.35 + intent*0.30 + urgency*0.20 + fit*0.15
 *
 * All sub-scores are 0-100. The overall is rounded to the nearest integer and
 * clamped to 0-100. Tiers: high >= 70, medium 40-69, low < 40.
 */
export const SCORE_WEIGHTS = {
  relevance: 0.35,
  intent: 0.3,
  urgency: 0.2,
  fit: 0.15,
} as const;

export const HIGH_INTENT_THRESHOLD = 70;
export const MEDIUM_INTENT_THRESHOLD = 40;

export interface SubScores {
  relevance_score: number;
  intent_score: number;
  urgency_score: number;
  fit_score: number;
}

export function clampScore(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

/** Clamp a confidence/probability value to the [0, 1] range. */
export function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

/** Combine the four sub-scores into a single weighted overall score. */
export function computeOverallScore(scores: SubScores): number {
  const relevance = clampScore(scores.relevance_score);
  const intent = clampScore(scores.intent_score);
  const urgency = clampScore(scores.urgency_score);
  const fit = clampScore(scores.fit_score);

  const overall =
    relevance * SCORE_WEIGHTS.relevance +
    intent * SCORE_WEIGHTS.intent +
    urgency * SCORE_WEIGHTS.urgency +
    fit * SCORE_WEIGHTS.fit;

  return clampScore(overall);
}

export function scoreTier(overall: number): ScoreTier {
  const s = clampScore(overall);
  if (s >= HIGH_INTENT_THRESHOLD) return "high";
  if (s >= MEDIUM_INTENT_THRESHOLD) return "medium";
  return "low";
}

export function isHighIntent(overall: number): boolean {
  return clampScore(overall) >= HIGH_INTENT_THRESHOLD;
}

/** Human label + tailwind color token for a tier. */
export function tierMeta(tier: ScoreTier): { label: string; classes: string } {
  switch (tier) {
    case "high":
      return { label: "High intent", classes: "border-accent-line bg-accent-tint text-accent" };
    case "medium":
      return { label: "Medium", classes: "border-[#DCC79C] bg-[#F2E8D4] text-medium" };
    case "low":
    default:
      return { label: "Low", classes: "border-line-2 bg-paper-sunk text-low" };
  }
}
