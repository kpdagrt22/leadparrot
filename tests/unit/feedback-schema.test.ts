import { describe, it, expect } from "vitest";
import { ticketCreateSchema, ticketMessageSchema, ticketStatusSchema } from "@/lib/feedback/schema";

const base = { type: "bug", subject: "Valid subject", body: "A sufficiently long body." };

describe("ticketCreateSchema", () => {
  it("accepts a valid payload", () => {
    expect(ticketCreateSchema.safeParse(base).success).toBe(true);
  });
  it("rejects an unknown type", () => {
    expect(ticketCreateSchema.safeParse({ ...base, type: "rant" }).success).toBe(false);
  });
  it("rejects subject < 3 or > 120", () => {
    expect(ticketCreateSchema.safeParse({ ...base, subject: "ab" }).success).toBe(false);
    expect(ticketCreateSchema.safeParse({ ...base, subject: "x".repeat(121) }).success).toBe(false);
  });
  it("rejects body < 10 or > 4000", () => {
    expect(ticketCreateSchema.safeParse({ ...base, body: "short" }).success).toBe(false);
    expect(ticketCreateSchema.safeParse({ ...base, body: "x".repeat(4001) }).success).toBe(false);
  });
  it("strips the query string from page_path", () => {
    const r = ticketCreateSchema.parse({ ...base, page_path: "/app/leads?token=secret" });
    expect(r.page_path).toBe("/app/leads");
  });
  it("drops a non-leading-slash page_path → undefined (no external url leaks in)", () => {
    const r = ticketCreateSchema.parse({ ...base, page_path: "evil.com/x" });
    expect(r.page_path).toBeUndefined();
  });
});

describe("ticketMessageSchema + ticketStatusSchema", () => {
  it("message requires 1..4000 chars", () => {
    expect(ticketMessageSchema.safeParse({ body: "" }).success).toBe(false);
    expect(ticketMessageSchema.safeParse({ body: "hi" }).success).toBe(true);
    expect(ticketMessageSchema.safeParse({ body: "x".repeat(4001) }).success).toBe(false);
  });
  it("status accepts only the four enum values", () => {
    expect(ticketStatusSchema.safeParse({ status: "resolved" }).success).toBe(true);
    expect(ticketStatusSchema.safeParse({ status: "wip" }).success).toBe(false);
  });
});
