import { describe, it, expect } from "vitest";
import {
  computeOverallScore,
  scoreTier,
  clampScore,
  isHighIntent,
  SCORE_WEIGHTS,
  HIGH_INTENT_THRESHOLD,
  MEDIUM_INTENT_THRESHOLD,
} from "@/lib/scoring/score";

describe("scoring weights", () => {
  it("weights sum to 1", () => {
    const total = SCORE_WEIGHTS.relevance + SCORE_WEIGHTS.intent + SCORE_WEIGHTS.urgency + SCORE_WEIGHTS.fit;
    expect(total).toBeCloseTo(1, 5);
  });

  it("uses the documented split (35/30/20/15)", () => {
    expect(SCORE_WEIGHTS).toEqual({ relevance: 0.35, intent: 0.3, urgency: 0.2, fit: 0.15 });
  });
});

describe("clampScore", () => {
  it("clamps below 0 and above 100", () => {
    expect(clampScore(-10)).toBe(0);
    expect(clampScore(150)).toBe(100);
  });
  it("rounds to the nearest integer", () => {
    expect(clampScore(72.4)).toBe(72);
    expect(clampScore(72.6)).toBe(73);
  });
  it("treats NaN as 0", () => {
    expect(clampScore(Number.NaN)).toBe(0);
  });
});

describe("computeOverallScore", () => {
  it("computes the weighted average", () => {
    const overall = computeOverallScore({
      relevance_score: 100,
      intent_score: 100,
      urgency_score: 100,
      fit_score: 100,
    });
    expect(overall).toBe(100);
  });

  it("matches a hand-computed example", () => {
    // 80*.35 + 70*.30 + 60*.20 + 50*.15 = 28 + 21 + 12 + 7.5 = 68.5 -> 69
    const overall = computeOverallScore({
      relevance_score: 80,
      intent_score: 70,
      urgency_score: 60,
      fit_score: 50,
    });
    expect(overall).toBe(69);
  });

  it("clamps out-of-range sub-scores before weighting", () => {
    const overall = computeOverallScore({
      relevance_score: 200,
      intent_score: -50,
      urgency_score: 50,
      fit_score: 50,
    });
    // relevance->100, intent->0, urgency->50, fit->50
    // 100*.35 + 0 + 50*.20 + 50*.15 = 35 + 10 + 7.5 = 52.5 -> 53
    expect(overall).toBe(53);
  });
});

describe("scoreTier / isHighIntent", () => {
  it("classifies tiers at the documented thresholds", () => {
    expect(scoreTier(HIGH_INTENT_THRESHOLD)).toBe("high");
    expect(scoreTier(HIGH_INTENT_THRESHOLD - 1)).toBe("medium");
    expect(scoreTier(MEDIUM_INTENT_THRESHOLD)).toBe("medium");
    expect(scoreTier(MEDIUM_INTENT_THRESHOLD - 1)).toBe("low");
    expect(scoreTier(0)).toBe("low");
  });

  it("isHighIntent is true only at >= 70", () => {
    expect(isHighIntent(70)).toBe(true);
    expect(isHighIntent(69)).toBe(false);
  });
});
