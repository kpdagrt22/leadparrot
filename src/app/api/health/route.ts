import { NextResponse } from "next/server";
import { healthStatus } from "@/lib/health";

export const dynamic = "force-dynamic";

/**
 * Public, non-sensitive status probe. Returns demo-vs-supabase mode and which
 * integrations are configured (booleans only — never secret values), so a
 * deploy can be confirmed at a glance:
 *   curl https://YOUR_DOMAIN/api/health
 * If `mode` is "demo" on production, the Supabase env vars are not all set.
 */
export function GET() {
  return NextResponse.json(healthStatus());
}
