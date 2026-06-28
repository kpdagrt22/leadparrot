import { describe, it, expect, beforeEach } from "vitest";
import { MemoryStore, __resetMemoryStore } from "@/lib/db/memory-store";
import { DEMO_ORG_ID, DEMO_USER_ID } from "@/lib/db/seed";

/**
 * Ticket store contract. MemoryStore is the demo path verified here; SupabaseStore
 * mirrors the same observable contract (org-scoped filters, message-bumps-parent,
 * cross-org admin reads). The one documented divergence: creator_name resolves in
 * memory + the service-role triage path, but is null under user-scoped Supabase RLS.
 */
describe("ticket store parity", () => {
  let store: MemoryStore;
  beforeEach(() => {
    __resetMemoryStore();
    store = new MemoryStore();
  });

  it("create → list/filter → getTicket-with-messages → addMessage bumps parent → updateStatus", async () => {
    const created = await store.createTicket(DEMO_ORG_ID, {
      created_by: DEMO_USER_ID,
      type: "bug",
      subject: "CSV export 500s",
      body: "Exporting a large saved-lead list returns a 500.",
      page_context: { route: "/app/leads" },
      severity: "high",
    });
    expect(created.status).toBe("open");
    expect(created.organization_id).toBe(DEMO_ORG_ID);
    // page_context normalized to all three keys (url/user_agent default null).
    expect(created.page_context).toEqual({ route: "/app/leads", url: null, user_agent: null });

    const open = await store.listTickets(DEMO_ORG_ID, { created_by: DEMO_USER_ID, status: "open" });
    expect(open.some((t) => t.id === created.id)).toBe(true);
    const bugs = await store.listTickets(DEMO_ORG_ID, { type: "bug" });
    expect(bugs.every((t) => t.type === "bug")).toBe(true);
    const found = await store.listTickets(DEMO_ORG_ID, { search: "CSV export" });
    expect(found.some((t) => t.id === created.id)).toBe(true);

    const got = await store.getTicket(DEMO_ORG_ID, created.id);
    expect(got).not.toBeNull();
    expect(got!.messages).toEqual([]);
    expect(got!.creator_name).toBe("Demo Founder"); // memory resolves it; supabase user-scoped → null

    const before = (await store.getTicket(DEMO_ORG_ID, created.id))!.updated_at;
    await new Promise((r) => setTimeout(r, 4));
    const msg = await store.addTicketMessage(DEMO_ORG_ID, created.id, { author_id: DEMO_USER_ID, body: "Repro on 1k rows." });
    expect(msg.author_role).toBe("user");
    const after = await store.getTicket(DEMO_ORG_ID, created.id);
    expect(after!.messages).toHaveLength(1);
    expect(after!.updated_at >= before).toBe(true); // child insert bumps parent

    const updated = await store.updateTicketStatus(DEMO_ORG_ID, created.id, "in_progress");
    expect(updated.status).toBe("in_progress");
  });

  it("is org-scoped: cross-org getTicket → null, listTickets excludes foreign tickets", async () => {
    const other = await store.createOrganization({ owner_id: "user-2", name: "Other Co" });
    const t = await store.createTicket(DEMO_ORG_ID, {
      created_by: DEMO_USER_ID,
      type: "feature",
      subject: "Dark mode",
      body: "Would love a dark theme option for late nights.",
    });
    expect(await store.getTicket(other.id, t.id)).toBeNull();
    expect((await store.listTickets(other.id, {})).some((x) => x.id === t.id)).toBe(false);
  });

  it("listAllTickets / getTicketAnyOrg are cross-org with org name (admin triage path)", async () => {
    const all = await store.listAllTickets({});
    expect(all.length).toBeGreaterThanOrEqual(2); // seed has 2 demo tickets
    expect(all.every((t) => typeof t.organization_name === "string")).toBe(true);
    const any = await store.getTicketAnyOrg(all[0].id);
    expect(any?.id).toBe(all[0].id);
  });
});
