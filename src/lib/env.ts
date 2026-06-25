/**
 * Centralized environment access + feature detection.
 *
 * LeadParrot is "validation-first": every integration is optional and the app
 * must run end-to-end with zero secrets. These helpers let the rest of the code
 * branch cleanly on what is actually configured instead of throwing at startup.
 */

function str(value: string | undefined): string | undefined {
  const v = value?.trim();
  return v && v.length > 0 ? v : undefined;
}

export const env = {
  // Supabase
  supabaseUrl: str(process.env.NEXT_PUBLIC_SUPABASE_URL),
  supabaseAnonKey: str(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  supabaseServiceRoleKey: str(process.env.SUPABASE_SERVICE_ROLE_KEY),

  // AI
  aiProvider: (str(process.env.AI_PROVIDER) ?? "mock").toLowerCase(),
  openaiApiKey: str(process.env.OPENAI_API_KEY),
  openaiModel: str(process.env.OPENAI_MODEL) ?? "gpt-4o-mini",
  anthropicApiKey: str(process.env.ANTHROPIC_API_KEY),
  anthropicModel: str(process.env.ANTHROPIC_MODEL) ?? "claude-haiku-4-5-20251001",

  // Reddit
  redditClientId: str(process.env.REDDIT_CLIENT_ID),
  redditClientSecret: str(process.env.REDDIT_CLIENT_SECRET),
  redditUserAgent: str(process.env.REDDIT_USER_AGENT) ?? "leadparrot/0.1",

  // Email — accept FROM_EMAIL (preferred) or legacy DIGEST_FROM_EMAIL.
  resendApiKey: str(process.env.RESEND_API_KEY),
  digestFromEmail:
    str(process.env.FROM_EMAIL) ??
    str(process.env.DIGEST_FROM_EMAIL) ??
    "LeadParrot <digest@example.com>",

  // Stripe — public price ids preferred (used client-side at checkout); fall
  // back to the legacy server-only names.
  stripeSecretKey: str(process.env.STRIPE_SECRET_KEY),
  stripeWebhookSecret: str(process.env.STRIPE_WEBHOOK_SECRET),
  stripePublishableKey: str(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
  stripePriceStarter:
    str(process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER) ?? str(process.env.STRIPE_PRICE_STARTER),
  stripePricePro:
    str(process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO) ?? str(process.env.STRIPE_PRICE_PRO),
  stripePriceAgency:
    str(process.env.NEXT_PUBLIC_STRIPE_PRICE_AGENCY) ?? str(process.env.STRIPE_PRICE_AGENCY),

  // Web search placeholders (NOT implemented in v1 — no scraping). Reserved for
  // official search APIs only: Tavily / Exa / SerpAPI.
  webSearchProvider: str(process.env.WEB_SEARCH_PROVIDER),
  webSearchApiKey: str(process.env.WEB_SEARCH_API_KEY),
  tavilyApiKey: str(process.env.TAVILY_API_KEY),
  exaApiKey: str(process.env.EXA_API_KEY),
  serpapiApiKey: str(process.env.SERPAPI_API_KEY),

  // App
  appUrl: str(process.env.NEXT_PUBLIC_APP_URL) ?? "http://localhost:3000",
  adminEmails: (str(process.env.ADMIN_EMAILS) ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),

  // Background jobs + observability
  cronSecret: str(process.env.CRON_SECRET),
  errorWebhookUrl: str(process.env.ERROR_WEBHOOK_URL),

  // Explicit demo toggle (used by E2E / first-run click-through).
  forceDemo: str(process.env.LEADPARROT_DEMO) === "1",
};

/** True when real Supabase auth/storage is wired up. */
export function isSupabaseConfigured(): boolean {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}

/** True when the service-role key is available for background ingestion. */
export function hasServiceRole(): boolean {
  return Boolean(env.supabaseUrl && env.supabaseServiceRoleKey);
}

/**
 * Demo mode: no Supabase configured (or explicitly forced). The app serves
 * seeded in-memory data and a stub demo user so the entire product is
 * clickable with zero setup.
 */
export function isDemoMode(): boolean {
  return env.forceDemo || !isSupabaseConfigured();
}

export function isStripeConfigured(): boolean {
  return Boolean(env.stripeSecretKey && env.stripePublishableKey);
}

export function isResendConfigured(): boolean {
  return Boolean(env.resendApiKey);
}

export function isRedditConfigured(): boolean {
  return Boolean(env.redditClientId && env.redditClientSecret);
}

export function isWebSearchConfigured(): boolean {
  // Configured when an official search-API key is present. No scraping fallback.
  return Boolean(
    env.tavilyApiKey ||
      env.exaApiKey ||
      env.serpapiApiKey ||
      (env.webSearchProvider && env.webSearchApiKey),
  );
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  // In demo mode, the seeded demo user is always treated as admin so the
  // internal page is reachable for evaluation.
  if (isDemoMode()) return true;
  return env.adminEmails.includes(email.toLowerCase());
}
