#!/usr/bin/env node
/**
 * PostToolUse(Write|Edit) reminder for The Leads Nest.
 *
 * Non-blocking. When a safety-critical path is edited, it injects the
 * invariant(s) for that area back into the conversation as additionalContext,
 * so the agent keeps the guardrails in view right when they matter.
 */
import { readFileSync } from "node:fs";

function stdin() {
  try {
    return readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

let filePath = "";
try {
  const payload = JSON.parse(stdin() || "{}");
  filePath = String(payload?.tool_input?.file_path ?? "");
} catch {
  process.exit(0);
}

const fp = filePath.replace(/\\/g, "/");
const rules = [];

if (/src\/lib\/ai\//.test(fp)) {
  rules.push(
    "AI layer: Zod-validate output before persist/display; malformed output must fall back safely and NEVER fabricate a high-intent lead. Keep enforceReplySafety() disclosure intact. Mock provider stays deterministic.",
  );
}
if (/src\/lib\/scoring\//.test(fp)) {
  rules.push(
    "Scoring: weights are relevance .35 / intent .30 / urgency .20 / fit .15; tiers high>=70, medium>=40. If retuning intentionally, update tests/unit/score.test.ts.",
  );
}
if (/src\/lib\/sources\//.test(fp)) {
  rules.push(
    "Sources: official APIs + manual paste ONLY. No scraping, no auto-post/DM. Must degrade to demo data + a setup note when the integration is unconfigured.",
  );
}
if (/src\/lib\/(email|notif|sms|whatsapp)/.test(fp) || /notif/i.test(fp)) {
  rules.push(
    "Notifications: alerts go to the ACCOUNT OWNER about their own leads — NEVER to the prospects/leads. No outbound messaging to third parties. Degrade safely when the channel is unconfigured.",
  );
}
if (/supabase\/migrations\//.test(fp)) {
  rules.push(
    "Migration: org-scope the table and add matching RLS in 0002_rls.sql; never trust client-supplied IDs; no cross-org leakage via joins.",
  );
}
if (/src\/lib\/usage\//.test(fp) || /src\/lib\/billing\//.test(fp)) {
  rules.push("Usage/billing: must behave safely (no crash) when Stripe is unconfigured; enforce plan limits server-side.");
}
if (/src\/(app|components)\//.test(fp)) {
  rules.push("UI: follow The Crest — Cloud-Dancer paper, one Verdigris accent, Newsreader/IBM Plex; 0px or full-pill corners; 1px borders not shadows; no emoji/hype.");
}

if (rules.length === 0) process.exit(0);

const additionalContext =
  "Reminder for the file you just edited — run `npm run test` (and `npm run typecheck`) before considering this done. Invariants in play: " +
  rules.join(" ");

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: { hookEventName: "PostToolUse", additionalContext },
  }),
);
process.exit(0);
