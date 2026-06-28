#!/usr/bin/env node
/**
 * PreToolUse(Bash) guard for The Leads Nest.
 *
 * Blocks shell commands that would violate repo invariants:
 *   - staging / committing real env or secret files
 *   - force-adding gitignored artifacts (node_modules, .next, .env, keys)
 *   - bypassing commit hooks (--no-verify / -n)
 *   - force-pushing (rewriting shared history)
 *
 * Protocol: exit 2 = block (stderr is shown to Claude); exit 0 = allow.
 * Fails open (exit 0) on any parse error so a hook bug never wedges the session.
 */
import { readFileSync } from "node:fs";

function stdin() {
  try {
    return readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

let cmd = "";
try {
  const payload = JSON.parse(stdin() || "{}");
  cmd = String(payload?.tool_input?.command ?? "");
} catch {
  process.exit(0);
}

if (!cmd.trim()) process.exit(0);

const deny = (reason) => {
  process.stderr.write(`[leadparrot guard] BLOCKED: ${reason}\n`);
  process.exit(2);
};

// Reference to a real env file (anything except .env.example).
const envRef = /\.env(?!\.example)(\.[a-z0-9.-]+)?\b/i.test(cmd);
const artifactRef = /(node_modules|\/\.next\b|\.next\/|\.pem\b|id_rsa|service[_-]?role)/i.test(cmd);

if (/\bgit\s+add\b/i.test(cmd) && envRef) {
  deny("attempt to `git add` a real .env file. Secrets must never be staged. Use .env.example for documented placeholders.");
}
if (/\bgit\s+add\b.*(--force|\s-f\b)/i.test(cmd) && (envRef || artifactRef)) {
  deny("force-adding a gitignored artifact (.env / node_modules / .next / key). These must stay untracked.");
}
if (/\bgit\s+commit\b/i.test(cmd) && /(--no-verify|\s-n\b)/i.test(cmd)) {
  deny("`git commit --no-verify` bypasses hooks/signing. Fix the underlying failure instead of skipping the gate.");
}
if (/\bgit\s+push\b/i.test(cmd) && /(--force\b|\s-f\b)/i.test(cmd) && !/--force-with-lease/i.test(cmd)) {
  deny("force-push detected. Use --force-with-lease at most, and never rewrite shared history without explicit instruction.");
}

process.exit(0);
