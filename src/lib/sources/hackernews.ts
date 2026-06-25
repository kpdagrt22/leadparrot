import type { SourceFetcher, SourceFetchOptions, SourceFetchResult, FetchedPost } from "@/lib/sources/types";
import { demoPosts } from "@/lib/sources/demo";

/**
 * Hacker News source via the PUBLIC Algolia HN Search API
 * (https://hn.algolia.com/api). No authentication required and explicitly
 * provided for public search, so this is a safe, allowed integration.
 *
 * We search stories + comments matching the project's keywords. If the request
 * fails (offline / rate limited) we fall back to deterministic demo posts.
 */
export const hackerNewsFetcher: SourceFetcher = {
  type: "hackernews",
  label: "Hacker News",

  async fetch(opts: SourceFetchOptions): Promise<SourceFetchResult> {
    const query = (opts.config?.query as string) || opts.keywords?.[0] || "";
    const limit = opts.limit ?? 20;

    if (!query) {
      return {
        posts: demoPosts("hackernews"),
        configured: true,
        usedMock: true,
        note: "Add a search query or project keywords to fetch live Hacker News results.",
      };
    }

    try {
      const url = new URL("https://hn.algolia.com/api/v1/search");
      url.searchParams.set("query", query);
      url.searchParams.set("tags", "(story,comment)");
      url.searchParams.set("hitsPerPage", String(Math.min(limit, 50)));

      const res = await fetch(url, {
        headers: { "User-Agent": "leadparrot/0.1 (public HN search)" },
        // HN Algolia API is cacheable; keep it gentle.
        next: { revalidate: 300 },
      });
      if (!res.ok) throw new Error(`HN API ${res.status}`);
      const data = (await res.json()) as { hits?: HNHit[] };
      const posts: FetchedPost[] = (data.hits ?? []).map(mapHit);
      return { posts, configured: true, usedMock: false };
    } catch (err) {
      return {
        posts: demoPosts("hackernews"),
        configured: true,
        usedMock: true,
        note: `Live HN fetch failed (${err instanceof Error ? err.message : "unknown"}); showing demo data.`,
      };
    }
  },
};

interface HNHit {
  objectID: string;
  title?: string | null;
  story_title?: string | null;
  comment_text?: string | null;
  story_text?: string | null;
  url?: string | null;
  author?: string | null;
  created_at?: string | null;
  points?: number | null;
  num_comments?: number | null;
}

function mapHit(hit: HNHit): FetchedPost {
  const title = hit.title ?? hit.story_title ?? "(comment)";
  const body = stripHtml(hit.comment_text ?? hit.story_text ?? "");
  return {
    external_id: hit.objectID,
    source_type: "hackernews",
    title,
    body,
    author_display: hit.author ?? null,
    url: hit.url ?? `https://news.ycombinator.com/item?id=${hit.objectID}`,
    permalink: `https://news.ycombinator.com/item?id=${hit.objectID}`,
    posted_at: hit.created_at ?? null,
    raw_json: { points: hit.points ?? null, num_comments: hit.num_comments ?? null },
  };
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/\s+/g, " ")
    .trim();
}
