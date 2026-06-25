import { describe, it, expect } from "vitest";
import {
  keywordMatches,
  matchedKeywords,
  hasAnyKeyword,
  hasNegativeKeyword,
  filterPost,
} from "@/lib/scoring/keywords";

describe("keywordMatches", () => {
  it("matches case-insensitively", () => {
    expect(keywordMatches("Looking for a Proposal Tool", "proposal tool")).toBe(true);
  });

  it("matches multi-word phrases", () => {
    expect(keywordMatches("need a client proposal fast", "client proposal")).toBe(true);
  });

  it("does not match partial words", () => {
    // "ai" should not match inside "email"
    expect(keywordMatches("send me an email", "ai")).toBe(false);
  });

  it("matches at string boundaries with punctuation", () => {
    expect(keywordMatches("proposal-tool, anyone?", "proposal-tool")).toBe(true);
    expect(keywordMatches("(proposal)", "proposal")).toBe(true);
  });

  it("returns false for empty keyword", () => {
    expect(keywordMatches("anything", "")).toBe(false);
  });
});

describe("matchedKeywords", () => {
  it("returns the unique subset that matches", () => {
    const text = "Looking for a proposal tool or proposal software";
    const result = matchedKeywords(text, ["proposal tool", "proposal software", "invoice"]);
    expect(result).toEqual(["proposal tool", "proposal software"]);
  });
});

describe("hasAnyKeyword", () => {
  it("returns true when no keywords are configured", () => {
    expect(hasAnyKeyword("anything", [])).toBe(true);
  });
  it("returns true when at least one matches", () => {
    expect(hasAnyKeyword("need a proposal tool", ["proposal tool", "x"])).toBe(true);
  });
  it("returns false when none match", () => {
    expect(hasAnyKeyword("hello world", ["proposal tool"])).toBe(false);
  });
});

describe("hasNegativeKeyword", () => {
  it("detects excluded topics", () => {
    expect(hasNegativeKeyword("planning a marriage proposal", ["marriage proposal"])).toBe(true);
    expect(hasNegativeKeyword("a business proposal", ["marriage proposal"])).toBe(false);
  });
});

describe("filterPost", () => {
  const keywords = ["proposal tool", "client proposal"];
  const negatives = ["marriage proposal", "research proposal"];

  it("blocks posts matching a negative keyword", () => {
    const r = filterPost("ideas for a marriage proposal", keywords, negatives);
    expect(r.passes).toBe(false);
    expect(r.blockedBy).toContain("marriage proposal");
  });

  it("passes posts matching a keyword", () => {
    const r = filterPost("best proposal tool for freelancers?", keywords, negatives);
    expect(r.passes).toBe(true);
    expect(r.matched).toContain("proposal tool");
  });

  it("passes everything when no keywords configured", () => {
    const r = filterPost("totally unrelated", [], negatives);
    expect(r.passes).toBe(true);
  });

  it("does not pass when keywords configured but none match", () => {
    const r = filterPost("totally unrelated", keywords, negatives);
    expect(r.passes).toBe(false);
  });

  it("negative keyword wins even if a keyword also matches", () => {
    const r = filterPost("a client proposal for a marriage proposal", keywords, negatives);
    expect(r.passes).toBe(false);
    expect(r.blockedBy).toContain("marriage proposal");
  });
});
