import { isDemoMode } from "@/lib/env";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { MemoryStore } from "@/lib/db/memory-store";
import { SupabaseStore } from "@/lib/db/supabase-store";
import type { DataStore } from "@/lib/db/store";

const memory = new MemoryStore();

/**
 * Returns the request-scoped data store. In demo mode (no Supabase configured)
 * this is the seeded in-memory store. Otherwise it is a Supabase store bound to
 * the signed-in user's session (RLS enforced).
 */
export async function getStore(): Promise<DataStore> {
  if (isDemoMode()) return memory;
  const sb = await createServerSupabase();
  if (!sb) return memory;
  return new SupabaseStore(sb);
}

/**
 * Returns a service-role store for trusted background work (source ingestion,
 * AI scoring jobs, admin reporting). Bypasses RLS — never call from untrusted
 * input paths. Falls back to memory in demo mode.
 */
export function getAdminStore(): DataStore {
  if (isDemoMode()) return memory;
  const sb = createAdminSupabase();
  if (!sb) return memory;
  return new SupabaseStore(sb);
}

export type { DataStore } from "@/lib/db/store";
export * from "@/lib/db/store";
