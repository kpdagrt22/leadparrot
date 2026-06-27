import crypto from "node:crypto";

/**
 * Per-user, revocable extension API tokens. We store ONLY the SHA-256 hash; the
 * plaintext is shown to the owner exactly once at mint time.
 */

export interface GeneratedToken {
  token: string;
  hash: string;
  prefix: string;
}

export function generateApiToken(): GeneratedToken {
  const token = `tln_${crypto.randomBytes(24).toString("base64url")}`;
  return { token, hash: hashApiToken(token), prefix: token.slice(0, 12) };
}

export function hashApiToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/** Extract a Bearer token from an Authorization header. */
export function bearerToken(req: Request): string | null {
  const h = req.headers.get("authorization");
  if (!h) return null;
  const m = /^Bearer\s+(.+)$/i.exec(h.trim());
  return m ? m[1].trim() : null;
}
