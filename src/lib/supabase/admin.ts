import { createClient } from "@supabase/supabase-js";
import { env, hasServiceRole } from "@/lib/env";

/**
 * Service-role Supabase client. BYPASSES RLS — use ONLY in trusted server-side
 * background jobs (source ingestion, AI scoring, admin reporting). Never expose
 * to the browser. Returns null if the service role key is not configured.
 */
export function createAdminSupabase() {
  if (!hasServiceRole()) return null;
  return createClient(env.supabaseUrl!, env.supabaseServiceRoleKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
