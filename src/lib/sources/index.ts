import type { SourceType } from "@/lib/types";
import type { SourceFetcher } from "@/lib/sources/types";
import { redditFetcher } from "@/lib/sources/reddit";
import { hackerNewsFetcher } from "@/lib/sources/hackernews";
import { rssFetcher } from "@/lib/sources/rss";
import { manualFetcher } from "@/lib/sources/manual";
import { webSearchFetcher } from "@/lib/sources/web-search";

export const FETCHERS: Record<SourceType, SourceFetcher> = {
  reddit: redditFetcher,
  hackernews: hackerNewsFetcher,
  rss: rssFetcher,
  manual: manualFetcher,
  web_search_placeholder: webSearchFetcher,
};

export function getFetcher(type: SourceType): SourceFetcher {
  return FETCHERS[type] ?? manualFetcher;
}

export interface SourceTypeMeta {
  type: SourceType;
  label: string;
  description: string;
  safe: boolean;
}

/** UI metadata for the source picker. */
export const SOURCE_TYPE_META: SourceTypeMeta[] = [
  {
    type: "manual",
    label: "Manual post / URL",
    description: "Paste a public post URL or text and score it instantly. Always available.",
    safe: true,
  },
  {
    type: "reddit",
    label: "Reddit",
    description: "Official read-only Reddit API. Configure subreddits, keywords and sort. No auto-commenting.",
    safe: true,
  },
  {
    type: "hackernews",
    label: "Hacker News",
    description: "Public HN Search API (Algolia). Search stories and comments by keyword.",
    safe: true,
  },
  {
    type: "rss",
    label: "RSS feed",
    description: "Add any public RSS/Atom feed (blogs, forums, Q&A sites that expose feeds).",
    safe: true,
  },
  {
    type: "web_search_placeholder",
    label: "Web search (coming soon)",
    description: "Reserved for SerpAPI / Tavily / Exa / Bing. Requires API keys. No scraping.",
    safe: true,
  },
];

export * from "@/lib/sources/types";
export { transition, canTransition, isTerminal } from "@/lib/sources/status";
