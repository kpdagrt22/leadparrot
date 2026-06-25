import { describe, it, expect } from "vitest";
import { mockProvider } from "@/lib/ai/providers/mock";
import { leadScoringSchema } from "@/lib/ai/schemas/lead-scoring";
import { replyDraftSchema } from "@/lib/ai/schemas/reply-draft";

const project = {
  name: "Acme Proposals",
  product_description: "AI proposal generator for freelancers.",
  keywords: ["proposal tool", "client proposal"],
  competitors: ["PandaDoc"],
  negative_keywords: ["marriage proposal"],
};

describe("MockAIProvider.scoreLead", () => {
  it("returns schema-valid output", async () => {
    const out = await mockProvider.scoreLead({
      project,
      post: { title: "Looking for a proposal tool", body: "any recommendations?", source_type: "reddit" },
    });
    expect(leadScoringSchema.safeParse(out).success).toBe(true);
  });

  it("is deterministic for identical input", async () => {
    const input = {
      project,
      post: { title: "Frustrated with PandaDoc pricing, alternatives?", body: "need to decide this week", source_type: "reddit" },
    };
    const a = await mockProvider.scoreLead(input);
    const b = await mockProvider.scoreLead(input);
    expect(a).toEqual(b);
  });

  it("scores competitor-switching posts as higher intent than vague ones", async () => {
    const strong = await mockProvider.scoreLead({
      project,
      post: { title: "Frustrated with PandaDoc, looking for an alternative", body: "need to decide this week", source_type: "reddit" },
    });
    const weak = await mockProvider.scoreLead({
      project,
      post: { title: "How do proposals work?", body: "just curious, learning", source_type: "reddit" },
    });
    expect(strong.overall_score).toBeGreaterThan(weak.overall_score);
  });

  it("disqualifies negative-keyword posts", async () => {
    const out = await mockProvider.scoreLead({
      project,
      post: { title: "Ideas for a marriage proposal", body: "on a hike", source_type: "reddit" },
    });
    expect(out.lead_stage).toBe("not-a-lead");
    expect(out.is_relevant).toBe(false);
  });
});

describe("MockAIProvider.draftReply", () => {
  it("returns schema-valid output that discloses affiliation", async () => {
    const out = await mockProvider.draftReply({
      tone: "founder-like",
      project: { name: "Acme Proposals", product_description: "AI proposals" },
      post: { title: "Looking for a proposal tool", body: "recommendations?", source_type: "reddit" },
      lead: { reason: "buying intent", pain_points: ["cost"], suggested_angle: "help first" },
    });
    expect(replyDraftSchema.safeParse(out).success).toBe(true);
    expect(out.suggested_disclosure.toLowerCase()).toContain("acme proposals");
    expect(out.safety_notes.length).toBeGreaterThan(0);
  });
});
