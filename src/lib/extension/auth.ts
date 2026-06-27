import { env, isDemoMode } from "@/lib/env";
import { getAdminStore } from "@/lib/db";
import type { DataStore } from "@/lib/db/store";
import { DEMO_ORG_ID } from "@/lib/db/seed";
import { bearerToken, hashApiToken, isValidTokenShape } from "./token";

export interface ExtensionAuth {
  store: DataStore;
  orgId: string;
  /** Stable rate-limit key (token id, or "demo"). */
  tokenKey: string;
  demo: boolean;
}

/**
 * Resolve a browser-extension request to an org via its Bearer token. Validates
 * the token SHAPE before any DB work, then looks it up by HASH using the
 * service-role store (no user session) and operates org-scoped. In demo mode any
 * shaped token maps to the seeded demo org so the extension is clickable offline.
 *
 * Note: in production this requires SUPABASE_SERVICE_ROLE_KEY (the hash lookup
 * bypasses RLS); without it, getAdminStore() falls back to memory and no real
 * token resolves.
 */
export async function resolveExtensionAuth(req: Request): Promise<ExtensionAuth | null> {
  const token = bearerToken(req);
  if (!token || !isValidTokenShape(token)) return null;
  const store = getAdminStore();
  if (isDemoMode()) {
    return { store, orgId: DEMO_ORG_ID, tokenKey: "demo", demo: true };
  }
  const found = await store.getApiTokenByHash(hashApiToken(token));
  if (!found) return null;
  return { store, orgId: found.organization_id, tokenKey: found.id, demo: false };
}

/** Client IP for demo-mode rate limiting (mirrors /api/demo/score). */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

/** A rate-limit key that is per-token in prod and per-IP in demo (shared token). */
export function rateKey(prefix: string, auth: ExtensionAuth, req: Request): string {
  return auth.demo ? `${prefix}-ip:${clientIp(req)}` : `${prefix}:${auth.tokenKey}`;
}

/**
 * CORS for the token-authenticated extension routes. Reflects the caller's
 * origin only when it is a browser-extension origin (chrome-extension:// /
 * moz-extension://) or an explicitly allowlisted id — never `*`, and no
 * credentials (these use a Bearer token, not cookies).
 */
export function corsHeaders(req?: Request): Record<string, string> {
  const origin = req?.headers.get("origin") ?? "";
  const allowed =
    /^chrome-extension:\/\/[a-z]+$/i.test(origin) ||
    /^moz-extension:\/\//i.test(origin) ||
    env.extensionAllowedOrigins.includes(origin);
  return {
    "Access-Control-Allow-Origin": allowed ? origin : env.appUrl,
    Vary: "Origin",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, content-type",
    "Access-Control-Max-Age": "600",
  };
}
