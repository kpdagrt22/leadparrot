// Set the secret BEFORE the env module is imported (env reads process.env once
// at module load), then import the verifier dynamically inside the suite.
process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_secret";

import { describe, it, expect, beforeAll } from "vitest";
import crypto from "node:crypto";

const SECRET = "whsec_test_secret";

let verifyWebhook: typeof import("@/lib/billing/stripe").verifyWebhook;

beforeAll(async () => {
  ({ verifyWebhook } = await import("@/lib/billing/stripe"));
});

function signed(body: string, t = 1_700_000_000): string {
  const sig = crypto.createHmac("sha256", SECRET).update(`${t}.${body}`, "utf8").digest("hex");
  return `t=${t},v1=${sig}`;
}

describe("verifyWebhook", () => {
  it("accepts a correctly signed payload", () => {
    const body = JSON.stringify({ type: "checkout.session.completed", data: { object: {} } });
    const event = verifyWebhook(body, signed(body));
    expect(event.type).toBe("checkout.session.completed");
  });

  it("rejects a tampered body", () => {
    const body = JSON.stringify({ type: "x", data: { object: {} } });
    expect(() => verifyWebhook(`${body} tampered`, signed(body))).toThrow(/verification failed/i);
  });

  it("rejects a missing signature header", () => {
    expect(() => verifyWebhook("{}", null)).toThrow(/missing/i);
  });

  it("rejects a malformed signature header", () => {
    expect(() => verifyWebhook("{}", "not-a-valid-header")).toThrow(/malformed/i);
  });
});
