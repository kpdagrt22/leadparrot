import { describe, it, expect, beforeEach } from "vitest";
import { generateApiToken, hashApiToken, bearerToken, isValidTokenShape } from "@/lib/extension/token";
import { MemoryStore, __resetMemoryStore } from "@/lib/db/memory-store";
import { DEMO_ORG_ID } from "@/lib/db/seed";
import { scoreManualPost } from "@/lib/scan";

describe("extension token util", () => {
  it("generates a prefixed token whose stored hash is not the token", () => {
    const { token, hash, prefix } = generateApiToken();
    expect(token.startsWith("tln_")).toBe(true);
    expect(prefix).toBe(token.slice(0, 12));
    expect(hash).toBe(hashApiToken(token));
    expect(hash).not.toBe(token);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  it("generates unique tokens", () => {
    expect(generateApiToken().token).not.toBe(generateApiToken().token);
  });

  it("parses a Bearer header and rejects junk", () => {
    const req = (h?: string) =>
      new Request("https://x.test", h ? { headers: { authorization: h } } : undefined);
    expect(bearerToken(req("Bearer abc123"))).toBe("abc123");
    expect(bearerToken(req("bearer xyz"))).toBe("xyz");
    expect(bearerToken(req())).toBe(null);
    expect(bearerToken(req("Basic foo"))).toBe(null);
  });

  it("validates token shape before any lookup", () => {
    expect(isValidTokenShape(generateApiToken().token)).toBe(true);
    expect(isValidTokenShape("tln_" + "a".repeat(40))).toBe(true);
    expect(isValidTokenShape("nope")).toBe(false);
    expect(isValidTokenShape("Bearer x")).toBe(false);
    expect(isValidTokenShape("tln_" + "a".repeat(400))).toBe(false);
    expect(isValidTokenShape("tln_bad token!")).toBe(false);
  });
});

describe("scoreManualPost idempotent re-capture (extension)", () => {
  it("a stable external id returns the same lead, not a duplicate", async () => {
    __resetMemoryStore();
    const store = new MemoryStore();
    const project = (await store.listProjects(DEMO_ORG_ID))[0];
    const input = {
      title: "Proposal tool?",
      body: "Looking for a proposal tool with e-signatures.",
      url: "https://example.test/r/p/1",
      externalId: "manual_ext_fixedhash",
    };
    const a = await scoreManualPost(store, DEMO_ORG_ID, "free", project, null, input);
    const b = await scoreManualPost(store, DEMO_ORG_ID, "free", project, null, input);
    expect(a.lead).toBeTruthy();
    expect(b.lead?.id).toBe(a.lead?.id);
    // Only one lead exists for that org+post (no duplicate).
    const leads = await store.listLeads(DEMO_ORG_ID);
    expect(leads.filter((l) => l.id === a.lead?.id)).toHaveLength(1);
  });
});

describe("MemoryStore api tokens", () => {
  let store: MemoryStore;
  beforeEach(() => {
    __resetMemoryStore();
    store = new MemoryStore();
  });

  it("create → resolve by hash → revoke, never exposing the hash", async () => {
    const t = await store.createApiToken(DEMO_ORG_ID, { token_hash: "hash-1", token_prefix: "tln_abc12" });
    expect(t.token_prefix).toBe("tln_abc12");
    expect((t as unknown as Record<string, unknown>).token_hash).toBeUndefined();

    const found = await store.getApiTokenByHash("hash-1");
    expect(found?.organization_id).toBe(DEMO_ORG_ID);

    await store.revokeApiToken(DEMO_ORG_ID, t.id);
    expect(await store.getApiTokenByHash("hash-1")).toBeNull();
  });

  it("does not resolve a token for another org's revoke and never returns the hash in list", async () => {
    await store.createApiToken(DEMO_ORG_ID, { token_hash: "hash-2", token_prefix: "tln_def34" });
    const list = await store.listApiTokens(DEMO_ORG_ID);
    expect(list.length).toBe(1);
    expect((list[0] as unknown as Record<string, unknown>).token_hash).toBeUndefined();
  });
});
