// Force a real (non-mock) provider BEFORE env loads, so getAIProvider() selects
// it; we then make the network call fail to exercise the mock fallback path.
process.env.AI_PROVIDER = "anthropic";
process.env.ANTHROPIC_API_KEY = "sk-test-key";

import { describe, it, expect, vi, afterEach } from "vitest";

const input = {
  project: {
    name: "Acme",
    product_description: "A proposal tool for freelancers",
    keywords: ["proposal"],
    competitors: [],
    negative_keywords: [],
  },
  post: {
    title: "Need a proposal tool",
    body: "Looking for templates and e-signatures.",
    source_type: "manual" as const,
  },
};

describe("scoreLead provider fallback", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("falls back to the mock (status=error) when the configured provider throws", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("network down"))));
    const { scoreLead } = await import("@/lib/ai/service");

    const res = await scoreLead(input);

    expect(res.status).toBe("error");
    expect(res.provider).toBe("mock");
    expect(res.error).toMatch(/network down/i);
    // The fallback still returns a valid, in-range score so a scan never dies.
    expect(res.output.intent_score).toBeGreaterThanOrEqual(0);
    expect(res.output.intent_score).toBeLessThanOrEqual(100);
  });
});
