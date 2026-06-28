import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("next/cache", () => ({ revalidatePath: () => {} }));
vi.mock("next/headers", () => ({ headers: async () => new Headers({ "user-agent": "vitest-agent" }) }));

import { MemoryStore, __resetMemoryStore } from "@/lib/db/memory-store";
import { __resetRateLimit } from "@/lib/ratelimit";
import { DEMO_ORG_ID, DEMO_USER_ID } from "@/lib/db/seed";
import { submitTicketAction, addTicketMessageAction, updateTicketStatusAction } from "@/lib/feedback/actions";

function fd(obj: Record<string, string>): FormData {
  const f = new FormData();
  for (const [k, v] of Object.entries(obj)) f.append(k, v);
  return f;
}

describe("feedback demo-mode round-trip (zero secrets)", () => {
  let store: MemoryStore;
  beforeEach(() => {
    __resetMemoryStore();
    __resetRateLimit();
    store = new MemoryStore();
  });

  it("file → list → reply → triage works end to end against MemoryStore", async () => {
    const created = await submitTicketAction(
      null,
      fd({ type: "question", subject: "How do I export?", body: "Looking for a CSV export option." }),
    );
    expect(created.ok).toBe(true);
    expect(created.ticketId).toBeTruthy();

    const mine = await store.listTickets(DEMO_ORG_ID, { created_by: DEMO_USER_ID });
    expect(mine.some((t) => t.id === created.ticketId)).toBe(true);

    const reply = await addTicketMessageAction(created.ticketId!, null, fd({ body: "Use the export button on Saved." }));
    expect(reply.ok).toBe(true);

    // Demo user is owner+admin → triage allowed.
    const triaged = await updateTicketStatusAction(created.ticketId!, "resolved");
    expect(triaged.ok).toBe(true);

    const after = await store.getTicket(DEMO_ORG_ID, created.ticketId!);
    expect(after?.status).toBe("resolved");
    expect(after?.messages.length).toBe(1);
  });

  it("seed exposes the two demo tickets with a thread", async () => {
    const all = await store.listAllTickets({});
    expect(all.length).toBeGreaterThanOrEqual(2);
    const withThread = all.find((t) => t.type === "bug");
    expect(withThread).toBeTruthy();
    const full = await store.getTicket(DEMO_ORG_ID, withThread!.id);
    expect(full!.messages.length).toBeGreaterThanOrEqual(2);
  });

  it("intake makes no outbound call when ERROR_WEBHOOK_URL is unset (default/demo)", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const r = await submitTicketAction(null, fd({ type: "bug", subject: "No webhook", body: "Ensure no outbound call here." }));
    expect(r.ok).toBe(true);
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});
