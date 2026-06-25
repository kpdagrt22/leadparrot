import { describe, it, expect } from "vitest";
import { enforceReplySafety } from "@/lib/ai/safety";
import type { ReplyDraftOutput } from "@/lib/ai/schemas/reply-draft";

const base: ReplyDraftOutput = {
  reply_text: "Here is a genuinely helpful answer to your question.",
  why_this_reply: "",
  safety_notes: [],
  suggested_disclosure: "",
  confidence: 0.5,
};

describe("enforceReplySafety", () => {
  it("fills an empty disclosure with a default that names the project", () => {
    const out = enforceReplySafety(base, "Acme");
    expect(out.suggested_disclosure).toMatch(/Acme/);
    expect(out.suggested_disclosure.trim().length).toBeGreaterThan(0);
  });

  it("keeps a disclosure the provider already supplied", () => {
    const out = enforceReplySafety({ ...base, suggested_disclosure: "I built ToolX." }, "Acme");
    expect(out.suggested_disclosure).toBe("I built ToolX.");
  });

  it("always includes a disclosure reminder in safety notes", () => {
    const out = enforceReplySafety(base, "Acme");
    expect(out.safety_notes.some((n) => /disclos/i.test(n))).toBe(true);
  });

  it("does not duplicate the reminder when one already exists", () => {
    const out = enforceReplySafety(
      { ...base, safety_notes: ["Please disclose your affiliation first."] },
      "Acme",
    );
    const reminders = out.safety_notes.filter((n) => /disclos/i.test(n));
    expect(reminders.length).toBe(1);
  });

  it("falls back to a generic name when the project name is blank", () => {
    const out = enforceReplySafety({ ...base }, "   ");
    expect(out.suggested_disclosure.trim().length).toBeGreaterThan(0);
  });
});
