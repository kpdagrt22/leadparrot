import type { SourceType } from "@/lib/types";

/** A normalized post fetched from any source, before AI scoring. */
export interface FetchedPost {
  external_id: string;
  source_type: SourceType;
  title?: string | null;
  body?: string | null;
  author_display?: string | null;
  url?: string | null;
  permalink?: string | null;
  posted_at?: string | null;
  raw_json?: Record<string, unknown>;
}

export interface SourceFetchResult {
  posts: FetchedPost[];
  /** Whether the integration has the credentials/config it needs. */
  configured: boolean;
  /** True when demo/mock data was returned instead of live data. */
  usedMock: boolean;
  /** Setup instructions to show when not configured. */
  note?: string;
}

export interface SourceFetchOptions {
  /** Free-form per-source config (subreddits, sort, query, feed url, etc.). */
  config?: Record<string, unknown>;
  identifier?: string | null;
  url?: string | null;
  /** Project keywords, used by sources that support server-side search. */
  keywords?: string[];
  /** Soft cap on how many posts to return in one run. */
  limit?: number;
}

export interface SourceFetcher {
  type: SourceType;
  label: string;
  fetch(opts: SourceFetchOptions): Promise<SourceFetchResult>;
}
