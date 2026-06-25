import { describe, it, expect, beforeEach } from "vitest";
import { rateLimit, __resetRateLimit } from "@/lib/ratelimit";

describe("rateLimit (fixed window)", () => {
  beforeEach(() => __resetRateLimit());

  it("allows requests under the limit and decrements remaining", () => {
    const r1 = rateLimit("k", { limit: 3, windowMs: 1000 }, 0);
    const r2 = rateLimit("k", { limit: 3, windowMs: 1000 }, 10);
    expect(r1.allowed).toBe(true);
    expect(r1.remaining).toBe(2);
    expect(r2.allowed).toBe(true);
    expect(r2.remaining).toBe(1);
  });

  it("blocks once the limit is exceeded", () => {
    rateLimit("k", { limit: 2, windowMs: 1000 }, 0);
    rateLimit("k", { limit: 2, windowMs: 1000 }, 1);
    const r3 = rateLimit("k", { limit: 2, windowMs: 1000 }, 2);
    expect(r3.allowed).toBe(false);
    expect(r3.remaining).toBe(0);
  });

  it("resets after the window elapses", () => {
    rateLimit("k", { limit: 1, windowMs: 1000 }, 0);
    expect(rateLimit("k", { limit: 1, windowMs: 1000 }, 500).allowed).toBe(false);
    expect(rateLimit("k", { limit: 1, windowMs: 1000 }, 1000).allowed).toBe(true);
  });

  it("tracks separate keys independently", () => {
    expect(rateLimit("a", { limit: 1, windowMs: 1000 }, 0).allowed).toBe(true);
    expect(rateLimit("b", { limit: 1, windowMs: 1000 }, 0).allowed).toBe(true);
  });
});
