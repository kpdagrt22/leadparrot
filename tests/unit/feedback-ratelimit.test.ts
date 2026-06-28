import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("next/cache", () => ({ revalidatePath: () => {} }));
vi.mock("next/headers", () => ({ headers: async () => new Headers({ "user-agent": "vitest-agent" }) }));

import { MemoryStore, __resetMemoryStore } from "@/lib/db/memory-store";
import { __resetRateLimit } from "@/lib/ratelimit";
import { DEMO_ORG_ID } from "@/lib/db/seed";
import { submitTicketAction, addTicketMessageAction } from "@/lib/feedback/actions";
import { POST as createTicketRoute } from "@/app/api/feedback/tickets/route";

function fd(obj: Record<string, string>): FormData {
  const f = new FormData();
  for (const [k, v] of Object.entries(obj)) f.append(k, v);
  return f;
}

describe("feedback rate limiting", () => {
  let store: MemoryStore;
  beforeEach(() => {
    __resetMemoryStore();
    __resetRateLimit();
    store = new MemoryStore();
  });

  it("create action is blocked gracefully after 5 in the window", async () => {
    for (let i = 0; i < 5; i++) {
      const r = await submitTicketAction(null, fd({ type: "bug", subject: `Issue ${i}`, body: "A sufficiently long body." }));
      expect(r.ok).toBe(true);
    }
    const sixth = await submitTicketAction(null, fd({ type: "bug", subject: "Issue 6", body: "A sufficiently long body." }));
    expect(sixth.ok).toBe(false);
    expect(sixth.message).toMatch(/too quickly/i);
  });

  it("message action is blocked after 20 in the window", async () => {
    const t = (await store.listTickets(DEMO_ORG_ID, {})).find((x) => x.status !== "closed")!;
    for (let i = 0; i < 20; i++) {
      const r = await addTicketMessageAction(t.id, null, fd({ body: `reply ${i}` }));
      expect(r.ok).toBe(true);
    }
    const blocked = await addTicketMessageAction(t.id, null, fd({ body: "reply 21" }));
    expect(blocked.ok).toBe(false);
  });

  it("mobile route returns 429 + Retry-After after the create limit", async () => {
    const make = () =>
      new Request("https://x.test/api/feedback/tickets", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type: "bug", subject: "Rate me", body: "A sufficiently long body." }),
      });
    let last: Response | undefined;
    for (let i = 0; i < 6; i++) last = await createTicketRoute(make());
    expect(last!.status).toBe(429);
    expect(last!.headers.get("Retry-After")).toBe("60");
  });
});
