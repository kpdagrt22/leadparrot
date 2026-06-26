import { describe, it, expect } from "vitest";
import { healthStatus } from "@/lib/health";

/**
 * With no secrets configured the app must report demo mode + the mock AI
 * provider, and every optional integration must read as not-configured. This is
 * also the guard that the probe never throws while assembling its report.
 */
describe("healthStatus", () => {
  it("reports demo mode with the mock provider when nothing is configured", () => {
    const h = healthStatus();
    expect(h.status).toBe("ok");
    expect(h.mode).toBe("demo");
    expect(h.integrations.ai_provider).toBe("mock");
    expect(h.integrations.supabase).toBe(false);
    expect(h.integrations.supabase_service_role).toBe(false);
    expect(h.integrations.stripe).toBe(false);
    expect(h.integrations.cron).toBe(false);
  });

  it("includes an ISO timestamp and a complete integrations map", () => {
    const h = healthStatus();
    expect(Number.isNaN(Date.parse(h.timestamp))).toBe(false);
    expect(Object.keys(h.integrations)).toEqual([
      "supabase",
      "supabase_service_role",
      "ai_provider",
      "reddit",
      "resend",
      "stripe",
      "web_search",
      "cron",
      "error_sink",
    ]);
  });
});
