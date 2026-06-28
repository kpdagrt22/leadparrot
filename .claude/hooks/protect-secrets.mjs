#!/usr/bin/env node
/**
 * PreToolUse(Write|Edit) guard for The Leads Nest.
 *
 * Refuses to let an agent create or modify real secret material:
 *   - .env, .env.local, .env.production, .env.*.local  (but ALLOWS .env.example)
 *   - private keys (*.pem, *.key, id_rsa)
 *
 * Env/secret files are gitignored and must be edited by a human. Documented
 * placeholders belong in .env.example.
 *
 * Protocol: exit 2 = block (stderr shown to Claude); exit 0 = allow. Fails open.
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

if (!filePath) process.exit(0);

const base = filePath.replace(/\\/g, "/").split("/").pop() ?? "";

const isEnvSecret = /^\.env(\..+)?$/.test(base) && base !== ".env.example";
const isKeyMaterial = /\.(pem|key)$/i.test(base) || /id_rsa/i.test(base);

if (isEnvSecret || isKeyMaterial) {
  process.stderr.write(
    `[leadparrot guard] BLOCKED: refusing to write secret file "${base}". ` +
      `Env/key files are gitignored and human-owned. Put documented placeholders in .env.example instead.\n`,
  );
  process.exit(2);
}

process.exit(0);
