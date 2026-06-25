import type { SourceFetcher, SourceFetchResult } from "@/lib/sources/types";

/**
 * Manual source. Posts are added directly by the user (paste a public URL or
 * text); there is nothing to "fetch" on a scan, so this returns an empty set.
 * The add-post action lives in the projects/sources UI + API.
 */
export const manualFetcher: SourceFetcher = {
  type: "manual",
  label: "Manual",
  async fetch(): Promise<SourceFetchResult> {
    return {
      posts: [],
      configured: true,
      usedMock: false,
      note: "Manual sources are scored when you paste a post — there is nothing to scan automatically.",
    };
  },
};
