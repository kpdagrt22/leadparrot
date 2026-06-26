import { isWebSearchConfigured } from "@/lib/env";
import type { SourceFetcher, SourceFetchResult } from "@/lib/sources/types";
import { demoPosts } from "@/lib/sources/demo";

const SETUP_NOTE =
  "Web search is a placeholder integration. Set WEB_SEARCH_PROVIDER (serpapi | tavily | exa | bing) and WEB_SEARCH_API_KEY to enable it in a future release. Leads Nest does NOT scrape pages — this slot is reserved for official search APIs only.";

/**
 * Web search placeholder. We deliberately do NOT implement scraping. This
 * fetcher only documents the future integration surface (SerpAPI / Tavily /
 * Exa / Bing) and returns demo data so the UI is complete.
 */
export const webSearchFetcher: SourceFetcher = {
  type: "web_search_placeholder",
  label: "Web search (coming soon)",
  async fetch(): Promise<SourceFetchResult> {
    return {
      posts: demoPosts("web_search_placeholder"),
      configured: isWebSearchConfigured(),
      usedMock: true,
      note: SETUP_NOTE,
    };
  },
};
