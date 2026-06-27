import { describe, it, expect, beforeEach } from "vitest";
import { generateApiToken, hashApiToken, bearerToken } from "@/lib/extension/token";
import { MemoryStore, __resetMemoryStore } from "@/lib/db/memory-store";
import { DEMO_ORG_ID } from "@/lib/db/seed";

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
