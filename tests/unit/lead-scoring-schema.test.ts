import { describe, it, expect } from "vitest";
import { parseLeadScoring, safeParseLeadScoring, leadStageSchema } from "@/lib/ai/schemas/lead-scoring";

const valid = {
  is_relevant: true,
  intent_score: 80,
  relevance_score: 90,
  urgency_score: 60,
  fit_score: 70,
  overall_score: 80,
  lead_stage: "buying-intent",
  reason: "Strong buying signals.",
  pain_points: ["cost"],
  buying_signals: ["looking for"],
  disqualifiers: [],
  suggested_angle: "Be helpful first.",
  risk_flags: [],
  should_generate_reply: true,
  confidence: 0.6,
};

describe("leadScoringSchema", () => {
  it("accepts a valid payload", () => {
    const parsed = parseLeadScoring(valid);
    expect(parsed.intent_score).toBe(80);
    expect(parsed.lead_stage).toBe("buying-intent");
  });

  it("coerces numeric strings to numbers", () => {
    const parsed = parseLeadScoring({ ...valid, intent_score: "75", confidence: "0.4" });
    expect(parsed.intent_score).toBe(75);
    expect(parsed.confidence).toBeCloseTo(0.4);
  });

  it("defaults optional arrays to empty", () => {
    const { pain_points, ...rest } = valid;
    void pain_points;
    const parsed = parseLeadScoring(rest);
    expect(parsed.pain_points).toEqual([]);
  });

  it("rejects out-of-range scores", () => {
    const r = safeParseLeadScoring({ ...valid, intent_score: 150 });
    expect(r.success).toBe(false);
  });

  it("rejects an invalid lead_stage", () => {
    const r = safeParseLeadScoring({ ...valid, lead_stage: "definitely-buying" });
    expect(r.success).toBe(false);
  });

  it("rejects a missing required boolean", () => {
    const { is_relevant, ...rest } = valid;
    void is_relevant;
    const r = safeParseLeadScoring(rest);
    expect(r.success).toBe(false);
  });

  it("strips unknown keys (keeps stored data minimal)", () => {
    const parsed = parseLeadScoring({ ...valid, secret_field: "leak" });
    expect("secret_field" in parsed).toBe(false);
  });

  it("enumerates all documented stages", () => {
    expect(leadStageSchema.options).toEqual([
      "research",
      "problem-aware",
      "solution-aware",
      "buying-intent",
      "competitor-switching",
      "not-a-lead",
    ]);
  });
});
