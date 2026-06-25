"use client";

import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";

/**
 * Browser Supabase client (anon key). Safe to call in client components.
 * Returns null in demo mode so callers can branch without throwing.
 */
export function createClient() {
  if (!env.supabaseUrl || !env.supabaseAnonKey) return null;
  return createBrowserClient(env.supabaseUrl, env.supabaseAnonKey);
}
