import { isDemoMode } from "@/lib/env";
import { getAdminStore } from "@/lib/db";
import type { DataStore } from "@/lib/db/store";
import { DEMO_ORG_ID } from "@/lib/db/seed";
import { bearerToken, hashApiToken } from "./token";

export interface ExtensionAuth {
  store: DataStore;
  orgId: string;
  tokenKey: string;
}

/**
 * Resolve a browser-extension request to an org via its Bearer token. Uses the
 * service-role store to look up the token by HASH (no user session), then
 * operates org-scoped. In demo mode any token maps to the seeded demo org so the
 * extension is clickable offline. Returns null when unauthenticated.
 *
 * Note: in production this requires SUPABASE_SERVICE_ROLE_KEY (the hash lookup
 * bypasses RLS); without it, getAdminStore() falls back to memory and no real
 * token resolves.
 */
export async function resolveExtensionAuth(req: Request): Promise<ExtensionAuth | null> {
  const token = bearerToken(req);
  if (!token) return null;
  const store = getAdminStore();
  if (isDemoMode()) {
    return { store, orgId: DEMO_ORG_ID, tokenKey: "demo" };
  }
  const found = await store.getApiTokenByHash(hashApiToken(token));
  if (!found) return null;
  return { store, orgId: found.organization_id, tokenKey: found.id };
}

/**
 * CORS for the token-authenticated extension routes. These use a Bearer token,
 * not cookies, so there are no credentials to protect with a strict origin —
 * the extension legitimately calls from a `chrome-extension://` origin.
 */
export function corsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, content-type",
    "Access-Control-Max-Age": "600",
  };
}
