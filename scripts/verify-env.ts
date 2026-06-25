/**
 * LeadParrot — environment verification.
 *
 * Prints a configured / missing report for every environment variable WITHOUT
 * revealing any secret value. Exits non-zero only when a REQUIRED variable for
 * the selected profile is missing.
 *
 *   npm run verify:env                 # Local Mock (default) — warnings only
 *   npm run verify:env -- --prod       # Production Alpha Minimum
 *   npm run verify:env -- --integrated # Production Integrated Test
 *
 * Profiles:
 *   Local Mock                 → nothing required; app runs in demo mode + mock AI.
 *   Production Alpha Minimum   → Supabase (url/anon/service-role) + APP_URL.
 *   Production Integrated Test → above + the API key for the selected AI_PROVIDER.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

type Req = "always" | "prod" | "integrated" | "ai" | "optional";
type Group = { title: string; vars: { key: string; required: Req; note: string }[] };

// ── Load .env.local then .env (never overwrite already-set process.env) ───────
function loadEnvFile(file: string): void {
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let val = m[2];
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (process.env[m[1]] === undefined) process.env[m[1]] = val;
  }
}
loadEnvFile(resolve(process.cwd(), ".env.local"));
loadEnvFile(resolve(process.cwd(), ".env"));

const mode: "local" | "prod" | "integrated" = process.argv.includes("--integrated")
  ? "integrated"
  : process.argv.includes("--prod")
    ? "prod"
    : "local";
const provider = (process.env.AI_PROVIDER ?? "mock").toLowerCase();
const has = (k: string): boolean => Boolean(process.env[k] && process.env[k]!.trim() !== "");

const GROUPS: Group[] = [
  {
    title: "Supabase (database + auth)",
    vars: [
      { key: "NEXT_PUBLIC_SUPABASE_URL", required: "prod", note: "demo mode without it" },
      { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", required: "prod", note: "public anon key" },
      { key: "SUPABASE_SERVICE_ROLE_KEY", required: "prod", note: "server-only; background ingestion" },
    ],
  },
  {
    title: "AI provider",
    vars: [
      { key: "AI_PROVIDER", required: "optional", note: "mock | openai | anthropic (default mock)" },
      { key: "OPENAI_API_KEY", required: "ai", note: "required when AI_PROVIDER=openai" },
      { key: "ANTHROPIC_API_KEY", required: "ai", note: "required when AI_PROVIDER=anthropic" },
    ],
  },
  {
    title: "Source integrations (optional — placeholders in v1)",
    vars: [
      { key: "REDDIT_CLIENT_ID", required: "optional", note: "official read-only API" },
      { key: "REDDIT_CLIENT_SECRET", required: "optional", note: "server-only" },
      { key: "REDDIT_USER_AGENT", required: "optional", note: "required by Reddit API" },
      { key: "TAVILY_API_KEY", required: "optional", note: "official search API (no scraping)" },
      { key: "EXA_API_KEY", required: "optional", note: "official search API (no scraping)" },
      { key: "SERPAPI_API_KEY", required: "optional", note: "official search API (no scraping)" },
    ],
  },
  {
    title: "Email (optional — Resend)",
    vars: [
      { key: "RESEND_API_KEY", required: "optional", note: "digest emails; preview-only without it" },
      { key: "FROM_EMAIL", required: "optional", note: "verified sender" },
    ],
  },
  {
    title: "Stripe (optional — billing)",
    vars: [
      { key: "STRIPE_SECRET_KEY", required: "optional", note: "billing off without it" },
      { key: "STRIPE_WEBHOOK_SECRET", required: "optional", note: "verifies webhooks" },
      { key: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", required: "optional", note: "public" },
      { key: "NEXT_PUBLIC_STRIPE_PRICE_STARTER", required: "optional", note: "price id" },
      { key: "NEXT_PUBLIC_STRIPE_PRICE_PRO", required: "optional", note: "price id" },
      { key: "NEXT_PUBLIC_STRIPE_PRICE_AGENCY", required: "optional", note: "price id" },
    ],
  },
  {
    title: "App",
    vars: [
      { key: "NEXT_PUBLIC_APP_URL", required: "prod", note: "public base URL" },
      { key: "ADMIN_EMAILS", required: "optional", note: "comma-separated admin allow-list" },
    ],
  },
];

function required(req: Req): boolean {
  if (req === "always") return true;
  if (req === "prod") return mode === "prod" || mode === "integrated";
  return false; // "ai" handled inline; "optional"/integrated never hard-required generically
}

const G = "\x1b[32m", R = "\x1b[31m", Y = "\x1b[33m", D = "\x1b[2m", X = "\x1b[0m";
const PROFILE = { local: "Local Mock", prod: "Production Alpha Minimum", integrated: "Production Integrated Test" }[mode];
console.log(`\nLeadParrot — environment check  (${PROFILE}, AI_PROVIDER=${provider})\n`);

let missingRequired = 0;
let missingOptional = 0;
for (const group of GROUPS) {
  console.log(`${D}${group.title}${X}`);
  for (const v of group.vars) {
    const present = has(v.key);
    const isReq =
      v.required === "ai"
        ? mode === "integrated" &&
          ((v.key === "OPENAI_API_KEY" && provider === "openai") ||
            (v.key === "ANTHROPIC_API_KEY" && provider === "anthropic"))
        : required(v.required);
    let mark: string;
    if (present) mark = `${G}configured${X}`;
    else if (isReq) {
      mark = `${R}MISSING (required)${X}`;
      missingRequired++;
    } else {
      mark = `${Y}not set (optional)${X}`;
      missingOptional++;
    }
    console.log(`  ${mark}  ${v.key}  ${D}${v.note}${X}`);
  }
  console.log("");
}

console.log(`Summary: ${missingRequired} required missing, ${missingOptional} optional not set.`);
if (missingRequired > 0) {
  console.log(`${R}Environment is NOT ready for "${PROFILE}".${X}\n`);
  process.exit(1);
}
console.log(`${G}Environment OK for "${PROFILE}"${X} — mock/demo applies where optional keys are unset.\n`);
