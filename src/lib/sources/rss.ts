import Parser from "rss-parser";
import type { SourceFetcher, SourceFetchOptions, SourceFetchResult, FetchedPost } from "@/lib/sources/types";
import { demoPosts } from "@/lib/sources/demo";

/**
 * RSS source — parses any public RSS/Atom feed the user adds. Pure public data,
 * no auth. Extracts title, excerpt, link and published date.
 */
const parser = new Parser({
  timeout: 10_000,
  headers: { "User-Agent": "leadparrot/0.1 (+https://leadparrot.app)" },
});

export const rssFetcher: SourceFetcher = {
  type: "rss",
  label: "RSS feed",

  async fetch(opts: SourceFetchOptions): Promise<SourceFetchResult> {
    const feedUrl = opts.url || (opts.config?.url as string);
    if (!feedUrl) {
      return {
        posts: demoPosts("rss"),
        configured: false,
        usedMock: true,
        note: "Add a public RSS/Atom feed URL to this source to fetch live items.",
      };
    }

    try {
      const feed = await parser.parseURL(feedUrl);
      const limit = opts.limit ?? 25;
      const posts: FetchedPost[] = (feed.items ?? []).slice(0, limit).map((item, i) => ({
        external_id: item.guid || item.link || `${feedUrl}#${i}`,
        source_type: "rss",
        title: item.title ?? "(untitled)",
        body: stripHtml(item.contentSnippet || item.content || item.summary || ""),
        author_display: item.creator || item.author || feed.title || null,
        url: item.link ?? null,
        permalink: item.link ?? null,
        posted_at: item.isoDate ?? (item.pubDate ? new Date(item.pubDate).toISOString() : null),
        raw_json: { feed: feed.title ?? null, categories: item.categories ?? [] },
      }));
      return { posts, configured: true, usedMock: false };
    } catch (err) {
      return {
        posts: demoPosts("rss"),
        configured: true,
        usedMock: true,
        note: `Could not parse feed (${err instanceof Error ? err.message : "unknown"}); showing demo data.`,
      };
    }
  },
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 1500);
}
