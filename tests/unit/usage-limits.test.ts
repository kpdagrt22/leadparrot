import { describe, it, expect } from "vitest";
import { checkUsage, usagePercents, type UsageSnapshot } from "@/lib/usage/limits";

const free: UsageSnapshot = {
  posts_scanned_this_month: 0,
  reply_drafts_this_month: 0,
  projects_count: 0,
};

describe("checkUsage", () => {
  it("allows usage under the limit", () => {
    const r = checkUsage("free", "posts_scanned", { ...free, posts_scanned_this_month: 5 });
    expect(r.allowed).toBe(true);
    expect(r.remaining).toBe(15); // free = 20/month
  });

  it("blocks at the limit", () => {
    const r = checkUsage("free", "posts_scanned", { ...free, posts_scanned_this_month: 20 });
    expect(r.allowed).toBe(false);
    expect(r.remaining).toBe(0);
    expect(r.reason).toMatch(/limit/i);
  });

  it("respects per-plan project limits", () => {
    expect(checkUsage("free", "projects", { ...free, projects_count: 1 }).allowed).toBe(false);
    expect(checkUsage("starter", "projects", { ...free, projects_count: 1 }).allowed).toBe(true);
    expect(checkUsage("agency", "projects", { ...free, projects_count: 24 }).allowed).toBe(true);
    expect(checkUsage("agency", "projects", { ...free, projects_count: 25 }).allowed).toBe(false);
  });

  it("honors the reply-draft limits per plan", () => {
    expect(checkUsage("free", "reply_drafts", { ...free, reply_drafts_this_month: 10 }).allowed).toBe(false);
    expect(checkUsage("pro", "reply_drafts", { ...free, reply_drafts_this_month: 999 }).allowed).toBe(true);
  });

  it("supports checking a batch of N units", () => {
    const r = checkUsage("starter", "posts_scanned", { ...free, posts_scanned_this_month: 499 }, 5);
    expect(r.allowed).toBe(false); // 499 + 5 > 500
  });

  it("falls back to the free plan for unknown plan ids", () => {
    const r = checkUsage("enterprise-mega", "projects", { ...free, projects_count: 1 });
    expect(r.allowed).toBe(false);
    expect(r.limit).toBe(1);
  });
});

describe("usagePercents", () => {
  it("computes meter percentages", () => {
    const p = usagePercents("starter", {
      posts_scanned_this_month: 250,
      reply_drafts_this_month: 50,
      projects_count: 3,
    });
    expect(p.posts.pct).toBe(50);
    expect(p.replies.pct).toBe(50);
    expect(p.projects.pct).toBe(100);
  });

  it("caps percentage at 100", () => {
    const p = usagePercents("free", { posts_scanned_this_month: 999, reply_drafts_this_month: 0, projects_count: 0 });
    expect(p.posts.pct).toBe(100);
  });
});
