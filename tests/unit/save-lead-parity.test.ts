import { describe, it, expect, beforeEach } from "vitest";
import { MemoryStore, __resetMemoryStore } from "@/lib/db/memory-store";
import { DEMO_ORG_ID } from "@/lib/db/seed";

/**
 * saveLead must behave identically across both stores (T-01). The observable
 * contract verified here is mirrored by SupabaseStore.saveLead:
 *  - saving a "new" lead promotes it to "saved" (leaves the triage queue);
 *  - a lead in any other status is never demoted;
 *  - re-saving is idempotent and preserves existing notes unless new ones are
 *    explicitly provided.
 */
describe("saveLead status parity", () => {
  let store: MemoryStore;
  beforeEach(() => {
    __resetMemoryStore();
    store = new MemoryStore();
  });

  it("promotes a new lead to saved", async () => {
    const lead = (await store.listLeads(DEMO_ORG_ID))[0];
    await store.updateLeadStatus(DEMO_ORG_ID, lead.id, "new");
    await store.saveLead(DEMO_ORG_ID, lead.id);
    const after = await store.getLead(DEMO_ORG_ID, lead.id);
    expect(after?.status).toBe("saved");
    expect(await store.isLeadSaved(DEMO_ORG_ID, lead.id)).toBe(true);
  });

  it("never demotes a lead that is past 'new'", async () => {
    const lead = (await store.listLeads(DEMO_ORG_ID))[0];
    await store.updateLeadStatus(DEMO_ORG_ID, lead.id, "contacted");
    await store.saveLead(DEMO_ORG_ID, lead.id);
    const after = await store.getLead(DEMO_ORG_ID, lead.id);
    expect(after?.status).toBe("contacted");
  });

  it("is idempotent and preserves notes on re-save", async () => {
    const lead = (await store.listLeads(DEMO_ORG_ID))[0];
    await store.saveLead(DEMO_ORG_ID, lead.id, "call them Tuesday");
    await store.saveLead(DEMO_ORG_ID, lead.id); // notes omitted
    const saved = (await store.listSavedLeads(DEMO_ORG_ID)).find((s) => s.lead_candidate_id === lead.id);
    expect(saved?.notes).toBe("call them Tuesday");
  });

  it("rejects saving a lead from another org", async () => {
    const other = await store.createOrganization({ owner_id: "user-2", name: "Other Co" });
    const lead = (await store.listLeads(DEMO_ORG_ID))[0];
    await expect(store.saveLead(other.id, lead.id)).rejects.toThrow(/not found/i);
  });
});
