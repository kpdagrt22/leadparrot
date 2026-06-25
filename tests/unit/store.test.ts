import { describe, it, expect, beforeEach } from "vitest";
import { MemoryStore, __resetMemoryStore } from "@/lib/db/memory-store";
import { DEMO_ORG_ID } from "@/lib/db/seed";

/**
 * Store-level guarantees that protect multi-tenant integrity. These mirror the
 * fixes applied after the pre-push audit:
 *  - saveLead must reject an unknown lead (no orphaned saved_leads rows).
 *  - raw-post de-dupe is PER ORGANIZATION, never global/cross-tenant.
 */
describe("MemoryStore tenant integrity", () => {
  let store: MemoryStore;
  beforeEach(() => {
    __resetMemoryStore();
    store = new MemoryStore();
  });

  it("saveLead throws when the lead does not exist", async () => {
    await expect(store.saveLead(DEMO_ORG_ID, "does-not-exist")).rejects.toThrow(/not found/i);
  });

  it("saveLead succeeds and links the correct project for a real lead", async () => {
    const leads = await store.listLeads(DEMO_ORG_ID);
    const lead = leads[0];
    const saved = await store.saveLead(DEMO_ORG_ID, lead.id);
    expect(saved.lead_candidate_id).toBe(lead.id);
    expect(saved.project_id).toBe(lead.project_id);
    expect(saved.project_id.length).toBeGreaterThan(0);
  });

  it("de-dupes raw posts within an org but not across orgs", async () => {
    const other = await store.createOrganization({ owner_id: "user-2", name: "Other Co" });
    const project = (await store.listProjects(DEMO_ORG_ID))[0];

    const a = await store.upsertRawPost(DEMO_ORG_ID, {
      project_id: project.id,
      source_id: null,
      source_type: "reddit",
      external_id: "shared_thread_123",
      title: "shared public post",
    });
    expect(a.created).toBe(true);

    // Same source_type + external_id, SAME org → duplicate.
    const aAgain = await store.upsertRawPost(DEMO_ORG_ID, {
      project_id: project.id,
      source_id: null,
      source_type: "reddit",
      external_id: "shared_thread_123",
      title: "shared public post",
    });
    expect(aAgain.created).toBe(false);
    expect(aAgain.post.id).toBe(a.post.id);

    // Same source_type + external_id, DIFFERENT org → its own copy.
    const b = await store.upsertRawPost(other.id, {
      project_id: project.id,
      source_id: null,
      source_type: "reddit",
      external_id: "shared_thread_123",
      title: "shared public post",
    });
    expect(b.created).toBe(true);
    expect(b.post.organization_id).toBe(other.id);
    expect(b.post.id).not.toBe(a.post.id);
  });
});
