import { env, isRedditConfigured } from "@/lib/env";
import type { SourceFetcher, SourceFetchOptions, SourceFetchResult, FetchedPost } from "@/lib/sources/types";
import { demoPosts } from "@/lib/sources/demo";

const REDDIT_SETUP_NOTE =
  "Reddit is not configured. Create a 'script' app at https://www.reddit.com/prefs/apps, then set REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET and REDDIT_USER_AGENT. The Leads Nest uses Reddit's official read-only API and never auto-comments or scrapes private pages.";

/**
 * Reddit source — SAFE implementation.
 *
 * - Uses Reddit's OFFICIAL OAuth API (application-only / client_credentials),
 *   read-only listing + search endpoints. Never scrapes logged-in/private
 *   pages, never comments, never DMs.
 * - Respects sort/time-window config and a conservative result cap.
 * - If credentials are missing, returns deterministic demo posts plus setup
 *   instructions instead of failing.
 */
export const redditFetcher: SourceFetcher = {
  type: "reddit",
  label: "Reddit",

  async fetch(opts: SourceFetchOptions): Promise<SourceFetchResult> {
    if (!isRedditConfigured()) {
      return { posts: demoPosts("reddit"), configured: false, usedMock: true, note: REDDIT_SETUP_NOTE };
    }

    const config = opts.config ?? {};
    const subreddits = parseSubreddits(config.subreddits ?? opts.identifier);
    const sort = normalizeSort(config.sort);
    const timeWindow = (config.time_window as string) || "week";
    const query = (config.keywords as string) || opts.keywords?.join(" OR ") || "";
    const limit = Math.min(opts.limit ?? 20, 50);

    try {
      const token = await getAppToken();
      const posts: FetchedPost[] = [];

      if (subreddits.length === 0) {
        // No subreddits given: do a site-wide search by keyword.
        posts.push(...(await searchReddit(token, undefined, query, sort, timeWindow, limit)));
      } else {
        for (const sub of subreddits) {
          const found = query
            ? await searchReddit(token, sub, query, sort, timeWindow, limit)
            : await listSubreddit(token, sub, sort, limit);
          posts.push(...found);
        }
      }

      return { posts: posts.slice(0, limit * Math.max(1, subreddits.length)), configured: true, usedMock: false };
    } catch (err) {
      return {
        posts: demoPosts("reddit"),
        configured: true,
        usedMock: true,
        note: `Live Reddit fetch failed (${err instanceof Error ? err.message : "unknown"}); showing demo data. Check credentials and rate limits.`,
      };
    }
  },
};

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAppToken(): Promise<string> {
  // Reuse the app-only token until ~1 minute before expiry.
  if (cachedToken && cachedToken.expiresAt - 60_000 > nowMs()) {
    return cachedToken.token;
  }
  const basic = Buffer.from(`${env.redditClientId}:${env.redditClientSecret}`).toString("base64");
  const res = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": env.redditUserAgent,
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error(`Reddit auth ${res.status}`);
  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { token: data.access_token, expiresAt: nowMs() + data.expires_in * 1000 };
  return data.access_token;
}

async function searchReddit(
  token: string,
  subreddit: string | undefined,
  query: string,
  sort: string,
  timeWindow: string,
  limit: number,
): Promise<FetchedPost[]> {
  const path = subreddit ? `/r/${subreddit}/search` : "/search";
  const url = new URL(`https://oauth.reddit.com${path}`);
  url.searchParams.set("q", query || "*");
  url.searchParams.set("sort", sort === "hot" ? "relevance" : sort);
  url.searchParams.set("t", timeWindow);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("type", "link");
  if (subreddit) url.searchParams.set("restrict_sr", "true");
  return fetchListing(token, url);
}

async function listSubreddit(token: string, subreddit: string, sort: string, limit: number): Promise<FetchedPost[]> {
  const url = new URL(`https://oauth.reddit.com/r/${subreddit}/${sort}`);
  url.searchParams.set("limit", String(limit));
  return fetchListing(token, url);
}

async function fetchListing(token: string, url: URL): Promise<FetchedPost[]> {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, "User-Agent": env.redditUserAgent },
  });
  if (!res.ok) throw new Error(`Reddit API ${res.status}`);
  const data = (await res.json()) as RedditListing;
  return (data.data?.children ?? []).map((c) => mapReddit(c.data));
}

interface RedditListing {
  data?: { children?: Array<{ data: RedditPost }> };
}
interface RedditPost {
  id: string;
  title: string;
  selftext?: string;
  author?: string;
  url?: string;
  permalink?: string;
  created_utc?: number;
  subreddit?: string;
  num_comments?: number;
  score?: number;
}

function mapReddit(p: RedditPost): FetchedPost {
  return {
    external_id: p.id,
    source_type: "reddit",
    title: p.title,
    body: p.selftext ?? "",
    author_display: p.author ? `u/${p.author}` : null,
    url: p.url ?? null,
    permalink: p.permalink ? `https://www.reddit.com${p.permalink}` : null,
    posted_at: p.created_utc ? new Date(p.created_utc * 1000).toISOString() : null,
    raw_json: { subreddit: p.subreddit, num_comments: p.num_comments, score: p.score },
  };
}

function parseSubreddits(input: unknown): string[] {
  if (Array.isArray(input)) return input.map((s) => String(s).replace(/^r\//, "").trim()).filter(Boolean);
  if (typeof input === "string") {
    return input
      .split(/[\s,]+/)
      .map((s) => s.replace(/^r\//, "").trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeSort(input: unknown): "new" | "hot" | "top" {
  const s = String(input ?? "new").toLowerCase();
  return s === "hot" || s === "top" ? (s as "hot" | "top") : "new";
}

// Wrapper so we never call Date.now() at module-eval time (kept inside fns).
function nowMs(): number {
  return Date.now();
}
