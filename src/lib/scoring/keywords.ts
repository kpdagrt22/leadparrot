/**
 * Lightweight keyword matching used to pre-filter raw posts before (and
 * alongside) AI scoring. Deliberately simple and dependency-free so it is easy
 * to unit test and reason about.
 *
 * Matching is case-insensitive and whole-word-ish: a keyword matches when it
 * appears as a token sequence bounded by non-alphanumeric characters. This
 * avoids "ai" matching inside "email" while still matching multi-word phrases
 * like "client proposal".
 */

function normalize(text: string): string {
  return text.toLowerCase();
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Does `keyword` appear as a bounded token (sequence) inside `text`? */
export function keywordMatches(text: string, keyword: string): boolean {
  const k = keyword.trim();
  if (!k) return false;
  const pattern = new RegExp(`(?:^|[^a-z0-9])${escapeRegExp(normalize(k))}(?:$|[^a-z0-9])`, "i");
  return pattern.test(normalize(text));
}

/** Return the subset of `keywords` that match anywhere in `text`. */
export function matchedKeywords(text: string, keywords: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const k of keywords) {
    if (keywordMatches(text, k) && !seen.has(k.toLowerCase())) {
      seen.add(k.toLowerCase());
      out.push(k);
    }
  }
  return out;
}

/** True when at least one keyword matches (or when no keywords are configured). */
export function hasAnyKeyword(text: string, keywords: string[]): boolean {
  if (keywords.length === 0) return true;
  return keywords.some((k) => keywordMatches(text, k));
}

/** True when any negative keyword matches — such posts should be filtered out. */
export function hasNegativeKeyword(text: string, negativeKeywords: string[]): boolean {
  return negativeKeywords.some((k) => keywordMatches(text, k));
}

export interface KeywordFilterResult {
  passes: boolean;
  matched: string[];
  blockedBy: string[];
  reason: string;
}

/**
 * Decide whether a post should proceed to AI scoring.
 *
 * Rules:
 *  - If any negative keyword matches → blocked.
 *  - Else if keywords are configured and at least one matches → passes.
 *  - Else if no keywords are configured → passes (let AI judge relevance).
 *  - Else → does not pass the cheap pre-filter.
 */
export function filterPost(
  text: string,
  keywords: string[],
  negativeKeywords: string[],
): KeywordFilterResult {
  const blockedBy = matchedKeywords(text, negativeKeywords);
  if (blockedBy.length > 0) {
    return {
      passes: false,
      matched: [],
      blockedBy,
      reason: `Blocked by negative keyword(s): ${blockedBy.join(", ")}`,
    };
  }

  const matched = matchedKeywords(text, keywords);
  if (keywords.length === 0) {
    return { passes: true, matched, blockedBy: [], reason: "No keywords configured; passing to AI." };
  }
  if (matched.length > 0) {
    return { passes: true, matched, blockedBy: [], reason: `Matched keyword(s): ${matched.join(", ")}` };
  }
  return { passes: false, matched: [], blockedBy: [], reason: "No configured keyword matched." };
}
