import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind-aware className combiner. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Deterministic id generator that does not rely on Math.random/Date.now. */
let __counter = 0;
export function nextId(prefix = "id"): string {
  __counter += 1;
  return `${prefix}_${__counter.toString(36)}_${(__counter * 2654435761 % 1e9).toString(36)}`;
}

export function truncate(text: string | null | undefined, max = 240): string {
  if (!text) return "";
  const t = text.trim();
  return t.length <= max ? t : `${t.slice(0, max - 1).trimEnd()}…`;
}

export function formatRelativeDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "—";
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

/** Parse a comma/newline separated string into a trimmed, de-duplicated list. */
export function parseList(input: string | null | undefined): string[] {
  if (!input) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of input.split(/[\n,]/)) {
    const v = part.trim();
    if (v && !seen.has(v.toLowerCase())) {
      seen.add(v.toLowerCase());
      out.push(v);
    }
  }
  return out;
}

export function formatCurrency(amount: number): string {
  return amount === 0 ? "$0" : `$${amount}`;
}

/**
 * Returns a safe, same-origin, root-relative redirect path or the fallback.
 * Prevents open-redirect attacks (?next=https://evil.com, protocol-relative
 * //evil.com, and /\evil.com tricks) by only allowing paths that begin with a
 * single "/" and contain no control/whitespace characters.
 */
export function safeRedirectPath(
  value: string | null | undefined,
  fallback = "/app",
): string {
  if (!value || typeof value !== "string") return fallback;
  if (value[0] !== "/") return fallback; // must be root-relative
  if (value[1] === "/" || value[1] === "\\") return fallback; // block //host and /\host
  // Reject any control character or whitespace (code point <= 0x20).
  for (let i = 0; i < value.length; i++) {
    if (value.charCodeAt(i) <= 0x20) return fallback;
  }
  return value;
}

export const SAFETY_DISCLAIMER =
  "LeadParrot helps you discover public conversations and draft replies. You are responsible for following each platform's rules before responding.";

export const COPY_DISCLAIMER =
  "LeadParrot does not post for you. Review the platform's rules before responding.";
