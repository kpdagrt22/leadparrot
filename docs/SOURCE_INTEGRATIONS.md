# Source Integrations

All fetchers implement `SourceFetcher` ([`src/lib/sources/types.ts`](../src/lib/sources/types.ts)) and return normalized `FetchedPost[]` plus `{ configured, usedMock, note }`. When an integration isn't configured (or a live call fails), it returns **deterministic demo posts + a setup note** instead of breaking the scan — never scraping.

Registry: [`src/lib/sources/index.ts`](../src/lib/sources/index.ts). Orchestration: [`src/lib/scan.ts`](../src/lib/scan.ts).

---

## Manual (always available)

Paste a public post URL or text on a project's sources page; it's scored on demand and added to the inbox. No external calls. This is the most reliable path and powers the validation-first manual MVP.

---

## Reddit — official API (safe)

[`src/lib/sources/reddit.ts`](../src/lib/sources/reddit.ts)

- Uses Reddit's **official OAuth API**, application-only (`client_credentials`) grant — **read-only**.
- Supports `subreddits`, `sort` (new/hot/top), `time_window`, and search `keywords` via per-source `config`.
- Caches the app token; respects a conservative result cap per scan.
- **Never** scrapes logged-in/private pages, **never** comments, **never** DMs.

**Setup:** create a *script* app at <https://www.reddit.com/prefs/apps>, then set:

```bash
REDDIT_CLIENT_ID=...
REDDIT_CLIENT_SECRET=...
REDDIT_USER_AGENT=leadparrot/0.1 by your_reddit_username
```

Without credentials, Reddit scans return demo posts + the setup note.

---

## Hacker News — public API

[`src/lib/sources/hackernews.ts`](../src/lib/sources/hackernews.ts)

- Uses the **public Algolia HN Search API** (`https://hn.algolia.com/api/v1/search`) — no auth.
- Searches stories + comments by the project's `query`/keywords; stores title, text, url, points, num_comments.
- Gentle revalidation; falls back to demo data on failure.

---

## RSS — public feeds

[`src/lib/sources/rss.ts`](../src/lib/sources/rss.ts)

- Parses any public RSS/Atom feed (via `rss-parser`): title, excerpt, link, published date.
- Add the feed URL to the source's `url`. Pure public data, no auth.

---

## Web search — placeholder (no scraping)

[`src/lib/sources/web-search.ts`](../src/lib/sources/web-search.ts)

- **Not implemented in v1 by design.** This slot is reserved for **official search APIs** (SerpAPI / Tavily / Exa / Bing), gated behind `WEB_SEARCH_PROVIDER` + `WEB_SEARCH_API_KEY`.
- Returns demo data + a clear "requires API keys, no scraping" note.

---

## Run lifecycle

Each scan creates a `source_runs` row and walks a guarded state machine ([`status.ts`](../src/lib/sources/status.ts)):

```
pending → running → success
                  ↘ error
```

Illegal transitions throw (so background bugs surface loudly). `items_found`, `error_message`, and timestamps are recorded for the run-history table.

## Adding a new source

1. Implement `SourceFetcher` in `src/lib/sources/<name>.ts`.
2. Return demo data + a `note` when not configured.
3. Register it in `FETCHERS` and add `SOURCE_TYPE_META` for the picker.
4. Add the `source_type` to the DB check constraint if it's a new persisted type.
5. Keep it safe: official APIs, rate limits, no scraping, no auto-posting.
