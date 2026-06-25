import { describe, it, expect, beforeEach } from "vitest";
import { MemoryStore, __resetMemoryStore } from "@/lib/db/memory-store";
import { DEMO_ORG_ID, DEMO_PROJECT_ID } from "@/lib/db/seed";
import {
  AuthorizationError,
  requireOrganizationMember,
  requireOrganizationOwnerOrAdmin,
  assertProjectBelongsToOrg,
  assertSourceBelongsToOrg,
  assertLeadBelongsToOrg,
  assertReplyDraftBelongsToOrg,
} from "@/lib/auth/organizations";

/**
 * Runs in demo mode (no Supabase env => isDemoMode() true), so getContext()
 * resolves the seeded demo user + org and the assert helpers query the seeded
 * in-memory store.
 */
const OTHER_ORG = "00000000-0000-4000-8000-0000000000ff";

describe("organization ownership helpers", () => {
  let store: MemoryStore;
  beforeEach(() => {
    __resetMemoryStore();
    store = new MemoryStore();
  });

  it("requireOrganizationMember accepts the user's own org", async () => {
    const ctx = await requireOrganizationMember(DEMO_ORG_ID);
    expect(ctx.organization.id).toBe(DEMO_ORG_ID);
  });

  it("requireOrganizationMember rejects a foreign org", async () => {
    await expect(requireOrganizationMember(OTHER_ORG)).rejects.toBeInstanceOf(AuthorizationError);
  });

  it("requireOrganizationOwnerOrAdmin accepts the owner", async () => {
    const ctx = await requireOrganizationOwnerOrAdmin(DEMO_ORG_ID);
    expect(ctx.organization.id).toBe(DEMO_ORG_ID);
  });

  it("assertProjectBelongsToOrg passes for a real project, throws for a forged id", async () => {
    await expect(assertProjectBelongsToOrg(DEMO_PROJECT_ID, DEMO_ORG_ID)).resolves.toBeUndefined();
    await expect(assertProjectBelongsToOrg("not-a-real-id", DEMO_ORG_ID)).rejects.toBeInstanceOf(
      AuthorizationError,
    );
  });

  it("assertLeadBelongsToOrg / assertReplyDraftBelongsToOrg validate ownership", async () => {
    const leads = await store.listLeads(DEMO_ORG_ID, { sort: "score" });
    const lead = leads[0];
    await expect(assertLeadBelongsToOrg(lead.id, DEMO_ORG_ID)).resolves.toBeUndefined();
    await expect(assertLeadBelongsToOrg("forged", DEMO_ORG_ID)).rejects.toBeInstanceOf(AuthorizationError);

    const draft = await store.getReplyDraftForLead(DEMO_ORG_ID, lead.id);
    if (draft) {
      await expect(assertReplyDraftBelongsToOrg(draft.id, DEMO_ORG_ID)).resolves.toBeUndefined();
    }
    await expect(assertReplyDraftBelongsToOrg("forged", DEMO_ORG_ID)).rejects.toBeInstanceOf(
      AuthorizationError,
    );
  });

  it("assertSourceBelongsToOrg throws for a forged source id", async () => {
    await expect(assertSourceBelongsToOrg("forged", DEMO_ORG_ID)).rejects.toBeInstanceOf(
      AuthorizationError,
    );
  });
});
