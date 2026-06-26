import {
  env,
  isDemoMode,
  isSupabaseConfigured,
  hasServiceRole,
  isRedditConfigured,
  isResendConfigured,
  isStripeConfigured,
  isWebSearchConfigured,
} from "@/lib/env";
import { activeAIProviderName } from "@/lib/ai/service";

export interface HealthStatus {
  status: "ok";
  /** "demo" = in-memory seeded data; "supabase" = real Postgres + RLS. */
  mode: "demo" | "supabase";
  integrations: {
    supabase: boolean;
    supabase_service_role: boolean;
    /** The EFFECTIVE provider: "mock" when the chosen provider lacks a key. */
    ai_provider: string;
    reddit: boolean;
    resend: boolean;
    stripe: boolean;
    web_search: boolean;
    cron: boolean;
    error_sink: boolean;
  };
  timestamp: string;
}

/**
 * Non-sensitive deployment status. Reports WHICH integrations are configured
 * (booleans + the active AI provider name) so you can confirm at a glance that
 * a deploy actually picked up its Supabase config and isn't silently running in
 * demo mode. Never includes secret values, URLs, or keys.
 */
export function healthStatus(): HealthStatus {
  return {
    status: "ok",
    mode: isDemoMode() ? "demo" : "supabase",
    integrations: {
      supabase: isSupabaseConfigured(),
      supabase_service_role: hasServiceRole(),
      ai_provider: activeAIProviderName(),
      reddit: isRedditConfigured(),
      resend: isResendConfigured(),
      stripe: isStripeConfigured(),
      web_search: isWebSearchConfigured(),
      cron: Boolean(env.cronSecret),
      error_sink: Boolean(env.errorWebhookUrl),
    },
    timestamp: new Date().toISOString(),
  };
}
