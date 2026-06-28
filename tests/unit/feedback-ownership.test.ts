import { describe, it, expect, beforeEach, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Server-action runtime shims (no request scope in unit tests).
vi.mock("next/cache", () => ({ revalidatePath: () => {} }));
vi.mock("next/headers", () => ({ headers: async () => new Headers({ "user-agent": "vitest-agent" }) }));
// Force the demo user to be a NON-admin so the owner/admin gates are exercised
// (demo isAdminEmail() is otherwise true). isDemoMode stays real (→ true).
vi.mock("@/lib/env", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/env")>();
  return { ...actual, isAdminEmail: () => false };
});

import { MemoryStore, __resetMemoryStore } from "@/lib/db/memory-store";
import { __resetRateLimit } from "@/lib/ratelimit";
import { DEMO_ORG_ID, DEMO_USER_ID } from "@/lib/db/seed";
import { AuthorizationError, assertTicketBelongsToOrg } from "@/lib/auth/organizations";
import { submitTicketAction, addTicketMessageAction, updateTicketStatusAction } from "@/lib/feedback/actions";

function fd(obj: Record<string, string>): FormData {
  const f = new FormData();
  for (const [k, v] of Object.entries(obj)) f.append(k, v);
  return f;
}

describe("feedback ownership + IDOR", () => {
  let store: MemoryStore;
  beforeEach(() => {
    __resetMemoryStore();
    __resetRateLimit();
    store = new MemoryStore();
  });

  it("assertTicketBelongsToOrg throws for a cross-org id, passes in-org", async () => {
    const other = await store.createOrganization({ owner_id: "user-2", name: "Other Co" });
    const seedTicket = (await store.listTickets(DEMO_ORG_ID, {}))[0];
    await expect(assertTicketBelongsToOrg(seedTicket.id, other.id)).rejects.toBeInstanceOf(AuthorizationError);
    await expect(assertTicketBelongsToOrg(seedTicket.id, DEMO_ORG_ID)).resolves.toBeUndefined();
  });

  it("submitTicketAction ignores client-sent org/user/url and uses the session", async () => {
    const res = await submitTicketAction(
      null,
      fd({
        type: "feedback",
        subject: "Great tool",
        body: "Really enjoying The Leads Nest so far.",
        organization_id: "00000000-0000-4000-8000-0000000000ff",
        created_by: "attacker",
        url: "https://evil.example/leak",
        page_path: "/app/settings?token=abc",
      }),
    );
    expect(res.ok).toBe(true);
    const created = (await store.listTickets(DEMO_ORG_ID, {})).find((t) => t.id === res.ticketId);
    expect(created).toBeTruthy();
    expect(created!.organization_id).toBe(DEMO_ORG_ID); // not the forged org
    expect(created!.created_by).toBe(DEMO_USER_ID); // not "attacker"
    expect(created!.page_context.url).toBeNull(); // client url never trusted
    expect(created!.page_context.route).toBe("/app/settings"); // query stripped
  });

  it("rejects a non-admin message on a closed ticket", async () => {
    const t = await store.createTicket(DEMO_ORG_ID, {
      created_by: DEMO_USER_ID,
      type: "bug",
      subject: "Closed item",
      body: "This one is going to be closed.",
    });
    await store.updateTicketStatus(DEMO_ORG_ID, t.id, "closed");
    const res = await addTicketMessageAction(t.id, null, fd({ body: "please reopen" }));
    expect(res.ok).toBe(false);
  });

  it("rejects a non-admin status update on a ticket outside the caller's org", async () => {
    // Foreign ticket id the demo (non-admin) user can't see → not authorized.
    const other = await store.createOrganization({ owner_id: "user-2", name: "Other Co" });
    const foreign = await store.createTicket(other.id, {
      created_by: "user-2",
      type: "bug",
      subject: "Their bug",
      body: "Belongs to another tenant entirely.",
    });
    const res = await updateTicketStatusAction(foreign.id, "resolved");
    expect(res.ok).toBe(false);
    expect(await store.getTicket(other.id, foreign.id)).not.toBeNull(); // unchanged-ish
    expect((await store.getTicket(other.id, foreign.id))!.status).toBe("open");
  });

  it("allows the org owner to triage their own ticket", async () => {
    const t = await store.createTicket(DEMO_ORG_ID, {
      created_by: DEMO_USER_ID,
      type: "question",
      subject: "Owner can triage",
      body: "The demo user owns the demo org.",
    });
    const res = await updateTicketStatusAction(t.id, "resolved");
    expect(res.ok).toBe(true);
    expect((await store.getTicket(DEMO_ORG_ID, t.id))!.status).toBe("resolved");
  });
});

describe("feedback platform-safety boundary", () => {
  it("feedback modules never import the lead-alert notify path", () => {
    const files = [
      "src/lib/feedback/actions.ts",
      "src/lib/feedback/intake.ts",
      "src/lib/feedback/schema.ts",
      "src/app/api/feedback/tickets/route.ts",
      "src/app/api/feedback/tickets/[id]/messages/route.ts",
    ];
    // Match actual import statements, not the safety comments that mention the
    // banned path by name. recipientFor() lives only in @/lib/notify, so blocking
    // the import blocks the function too.
    const importRe = /\b(?:from|require\()\s*["']@\/lib\/notify["']/;
    for (const f of files) {
      const src = readFileSync(resolve(process.cwd(), f), "utf8");
      expect(src, `${f} must not import @/lib/notify`).not.toMatch(importRe);
    }
  });
});
