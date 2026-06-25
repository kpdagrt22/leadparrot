import { describe, it, expect } from "vitest";
import { parseReplyDraft, safeParseReplyDraft } from "@/lib/ai/schemas/reply-draft";

const valid = {
  reply_text: "Here's a genuinely helpful suggestion, plus a light, disclosed mention of my product.",
  why_this_reply: "Helpful first.",
  safety_notes: ["Disclose affiliation."],
  suggested_disclosure: "I'm building a tool in this space.",
  confidence: 0.5,
};

describe("replyDraftSchema", () => {
  it("accepts a valid reply", () => {
    const parsed = parseReplyDraft(valid);
    expect(parsed.reply_text.length).toBeGreaterThan(0);
  });

  it("requires non-empty reply_text", () => {
    const r = safeParseReplyDraft({ ...valid, reply_text: "" });
    expect(r.success).toBe(false);
  });

  it("defaults optional fields", () => {
    const r = parseReplyDraft({ reply_text: "hi", confidence: 0.2 });
    expect(r.safety_notes).toEqual([]);
    expect(r.suggested_disclosure).toBe("");
  });

  it("rejects confidence outside 0..1", () => {
    expect(safeParseReplyDraft({ ...valid, confidence: 2 }).success).toBe(false);
  });
});
