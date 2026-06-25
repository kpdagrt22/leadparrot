# Source Integrations

LeadParrot finds high-intent leads in **public** conversations and drafts a reply you can review and post yourself. It is platform-safe by design: it **never auto-posts, never auto-DMs, never scrapes private or paywalled content, and never drives a browser**. This document explains exactly what each source can do today, what is just a placeholder, how to set it up, and where we intentionally draw the line.

> **TL;DR honesty:** Manual, RSS, and Hacker News work right now with zero or minimal setup. Reddit works only after you add official API credentials — otherwise it returns clearly-labeled demo data. Web search is a **placeholder** with no real implementation; it always returns demo data.

---

## How sources work (the contract)

Every fetcher implements `SourceFetcher` ([`src/lib/sources/types.ts`](../src/lib/sources/types.ts)) and returns a normalized `FetchedPost[]` plus a status object:

```ts
interface SourceFetchResult {
  posts: FetchedPost[];
  configured: boolean;  // does this source have the creds/config it needs?
  usedMock: boolean;    // was demo/mock data returned instead of live data?
  note?: string;        // setup or fallback message to surface in the UI
}
```

Two guarantees follow from this design:

1. **Nothing breaks a scan.** When a source isn't configured, or a live call fails, the fetcher returns **deterministic demo posts + a clear note** (`usedMock: true`) instead of throwing. The demo data is seeded, not scraped.
2. **Zero-secret demo mode.** The whole product runs end-to-end with no environment variables at all. With no Supabase keys the app is in demo mode (see [`src/lib/env.ts`](../src/lib/env.ts) → `isDemoMode()`), `AI_PROVIDER` defaults to `mock`, and every source falls back to demo posts. Copy [`.env.example`](../.env.example) to `.env.local` only when you want to wire up real services.

- Registry of fetchers: [`src/lib/sources/index.ts`](../src/lib/sources/index.ts) (`FETCHERS`, `SOURCE_TYPE_META`)
- Orchestration: [`src/lib/scan.ts`](../src/lib/scan.ts)
- Status state machine: [`src/lib/sources/status.ts`](../src/lib/sources/status.ts)

The source types registered today are: `manual`, `reddit`, `hackernews`, `rss`, and `web_search_placeholder`.

---

## Manual — fully supported (core v1)

[`src/lib/sources/manual.ts`](../src/lib/sources/manual.ts)

| | |
|---|---|
| **Status** | Fully supported. This is the core v1 path. |
| **Setup** | None. No API keys, no external services. |

Paste a **public** post URL or some text on a project's sources page. It is scored on demand by the AI layer and added to your inbox, where you can review the suggested reply. There is nothing to "scan" on a schedule, so `manualFetcher.fetch()` returns an empty set — the add-post action lives in the projects/sources UI and API.

- **Platform safety:** No external calls of any kind. You bring the content (something you can already see publicly).
- **Rate limits:** None — there is no upstream API.
- **Not supported:** It does not log into anything or fetch behind a login on your behalf. If you paste a URL, you are responsible for it being public content you're allowed to reference.

This is the most reliable path and powers the validation-first manual MVP.

---

## RSS — fully supported (public feeds only)

[`src/lib/sources/rss.ts`](../src/lib/sources/rss.ts)

| | |
|---|---|
| **Status** | Supported. |
| **Setup** | Add a public RSS/Atom feed URL to the source (`url`, or `config.url`). No auth. |

Parses any **public** RSS or Atom feed using the [`rss-parser`](https://www.npmjs.com/package/rss-parser) library (a project dependency). For each item it extracts title, an excerpt, the link, the author, and the published date. Up to 25 items per run by default.

- **Platform safety:** It only reads feeds the publisher has chosen to expose. This is **not** scraping — it requests the feed URL you provide and parses standard RSS/Atom XML. It does not follow links into article bodies, render HTML, or run JavaScript.
- **Rate limits:** No upstream auth or quota, but be reasonable about how many feeds and how often you scan. Requests use a 10-second timeout and a `leadparrot/0.1` User-Agent. If a feed can't be parsed, the source returns demo data plus a note instead of failing.
- **Not supported:** No private/authenticated feeds, no paywalled feeds, no "discover the feed by crawling the site," and no scraping of pages that don't publish a feed.

---

## Hacker News — fully supported (public API, no auth)

[`src/lib/sources/hackernews.ts`](../src/lib/sources/hackernews.ts)

| | |
|---|---|
| **Status** | Supported. |
| **Setup** | None beyond a search query. No API key. |

Uses the **public Algolia HN Search API** (`https://hn.algolia.com/api/v1/search`), which is published specifically for public search. It searches **stories and comments** matching the source's query (`config.query`) or the project's first keyword, and stores title, text, url, author, points, and comment count.

- **Platform safety:** Official public search endpoint, designed for exactly this use. No authentication, no login, no scraping of the HN site itself.
- **Rate limits:** Responses are cached (`revalidate: 300`, i.e. ~5 minutes) to stay gentle on the API, and results are capped at 50 hits per request. On any failure it returns demo data plus a note.
- **Behavior with no query:** If neither a query nor project keywords are set, it returns demo posts and a note asking you to add a query, rather than dumping the firehose.
- **Not supported:** No posting, no voting, no commenting, no logged-in actions.

---

## Reddit — placeholder until you add official API credentials

[`src/lib/sources/reddit.ts`](../src/lib/sources/reddit.ts)

| | |
|---|---|
| **Status** | **Live code is implemented, but it is inert (demo data) until you add credentials.** Treat it as "configure-to-enable." |
| **Setup** | Requires `REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET`, and `REDDIT_USER_AGENT`. Without `REDDIT_CLIENT_ID` **and** `REDDIT_CLIENT_SECRET`, it returns demo posts + a setup note. |

LeadParrot uses Reddit's **official OAuth API** with the application-only `client_credentials` grant — that is, **read-only** access. It supports per-source `config`: `subreddits`, `sort` (`new` / `hot` / `top`), `time_window`, and search `keywords`. With no subreddits it does a keyword search site-wide; with subreddits it lists or searches each one.

**Setup steps:**

1. Create a **"script"** app at <https://www.reddit.com/prefs/apps>.
2. Set these in `.env.local` (see [`.env.example`](../.env.example)):

```bash
REDDIT_CLIENT_ID=...
REDDIT_CLIENT_SECRET=...
REDDIT_USER_AGENT=leadparrot/0.1 by your_reddit_username
```

`isRedditConfigured()` in [`src/lib/env.ts`](../src/lib/env.ts) gates the live path. (`REDDIT_USER_AGENT` falls back to `leadparrot/0.1` if unset, but Reddit expects a descriptive, identifying User-Agent — set it.)

- **Platform safety:** Official API only. It **never** scrapes logged-in or private pages, **never** auto-comments, **never** DMs, and does **no** browser automation. It only reads public listings and public search results.
- **Rate limits:** The app-only OAuth token is cached and reused until ~1 minute before expiry, and each run honors a conservative result cap (default 20, max 50 per subreddit). Respect Reddit's API rate limits and Terms of Service. On an auth failure or rate-limit error, it returns demo data plus a note pointing you at credentials/limits.
- **Not supported:** Anything write-related (commenting, voting, posting, messaging), anything that requires a logged-in user session, and anything behind private subreddits.

---

## Web search — PLACEHOLDER ONLY (no implementation, no scraping)

[`src/lib/sources/web-search.ts`](../src/lib/sources/web-search.ts)

| | |
|---|---|
| **Status** | **Placeholder. Not implemented in v1 by design.** It always returns demo data and a note. |
| **Setup** | None will make it fetch live data today. The env slots exist only to reserve the future surface. |

This source is intentionally a stub. It exists so the source picker is complete and so the future integration surface is documented — **it performs no real search and no scraping.** It is reserved for **official search APIs** only: **Tavily**, **Exa**, **SerpAPI** (with Bing also envisioned).

The reserved environment variables are recognized by `isWebSearchConfigured()` ([`src/lib/env.ts`](../src/lib/env.ts)):

```bash
# Reserved for a FUTURE release — present here as placeholders only.
TAVILY_API_KEY=
EXA_API_KEY=
SERPAPI_API_KEY=
# Or a generic provider pairing:
WEB_SEARCH_PROVIDER=   # serpapi | tavily | exa | bing
WEB_SEARCH_API_KEY=
```

Even when one of these keys is set, the fetcher still returns demo data with a note — the live querying logic is not built yet. The keys only flip the reported `configured` flag.

- **Platform safety:** When this is eventually implemented, it will call an **official search API** that returns results under that provider's terms. It will **never** scrape Google (or any search engine) directly, and **never** scrape the result/landing pages.
- **Rate limits:** N/A today. A real implementation would respect the chosen provider's quotas.
- **Not supported (now and after implementation):** Direct Google scraping, headless-browser searching, and crawling/scraping the pages behind search results. There is **no scraping fallback** — if no official API key is configured, there is simply no live web search.

---

## What we will never do

These are hard product boundaries, not roadmap gaps:

- **Never auto-post.** Replies are drafts. You review and post them yourself, manually, on the platform.
- **Never auto-DM.** No automated direct messages to anyone, ever.
- **Never run browser automation.** No headless browsers, no Puppeteer/Playwright-driven posting or scraping, no simulated clicks on third-party sites.
- **Never scrape private or paywalled content.** No logged-in pages, no private subreddits/groups, no authenticated feeds, nothing behind a paywall.
- **Never scrape Google (or any search engine) directly,** and never scrape search result/landing pages. Web search, if enabled, only goes through an official search API.

When we add a source, the bar is: official API, read-only, rate-limit-respecting, public data only, with a clear demo fallback. If a source can't meet that bar, it doesn't ship.

---

## Run lifecycle

Each scan creates a `source_runs` row and walks a guarded state machine ([`src/lib/sources/status.ts`](../src/lib/sources/status.ts)):

```
pending → running → success
                  ↘ error
```

Illegal transitions throw, so background bugs surface loudly. `items_found`, `error_message`, and timestamps are recorded for the run-history table.

---

## Adding a new source

1. Implement `SourceFetcher` in `src/lib/sources/<name>.ts`.
2. Return demo data + a `note` (and `usedMock: true`) whenever it isn't configured or a live call fails.
3. Register it in `FETCHERS` and add an entry to `SOURCE_TYPE_META` for the picker.
4. Add the `source_type` to the DB check constraint if it's a new persisted type (see [`supabase/migrations/0001_init.sql`](../supabase/migrations/0001_init.sql); row-level security lives in [`supabase/migrations/0002_rls.sql`](../supabase/migrations/0002_rls.sql)).
5. Keep it safe: official APIs, read-only, respect rate limits, no scraping, no auto-posting, no browser automation.

---

## Quick reference

| Source | Status | Needs setup? | Live data today? | Hard limits |
|---|---|---|---|---|
| Manual | Fully supported (core v1) | No | Yes (you paste it) | Public content only |
| RSS | Supported | Feed URL | Yes | Public feeds only, no scraping |
| Hacker News | Supported | A query | Yes (public Algolia API) | No auth, cached, capped |
| Reddit | Configure-to-enable | `REDDIT_CLIENT_ID` + `SECRET` + `USER_AGENT` | Only with creds; else demo | Official read-only API, rate-limited |
| Web search | **Placeholder only** | N/A (no impl) | **No — always demo** | No scraping; official API only, later |

---

## Local development

With zero secrets the app runs in demo mode and every source returns deterministic demo data, so you can click through the whole product offline.

```bash
npm run dev          # start the dev server
npm run build        # production build
npm run test         # unit tests (vitest)
npm run typecheck    # tsc --noEmit
npm run lint         # next lint
npm run verify:env   # sanity-check environment configuration
```

`AI_PROVIDER` defaults to `mock` (deterministic demo scoring/replies, no API calls). Set it to `openai` or `anthropic` with the matching key only when you want real model output.
