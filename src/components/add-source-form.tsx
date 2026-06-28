"use client";

import { useState } from "react";
import { addSourceAction } from "@/lib/actions";
import type { SourceType } from "@/lib/types";

const TYPES: Array<{ value: SourceType; label: string }> = [
  { value: "manual", label: "Manual post / URL" },
  { value: "reddit", label: "Reddit (official API)" },
  { value: "hackernews", label: "Hacker News (public search)" },
  { value: "rss", label: "RSS feed" },
  { value: "web_search_placeholder", label: "Web search (coming soon)" },
];

export function AddSourceForm({ projectId }: { projectId: string }) {
  const [type, setType] = useState<SourceType>("reddit");

  return (
    <form action={addSourceAction} className="space-y-4">
      <input type="hidden" name="project_id" value={projectId} />
      <div>
        <label className="label" htmlFor="source_type">Source type</label>
        <select
          id="source_type"
          name="source_type"
          className="input"
          value={type}
          onChange={(e) => setType(e.target.value as SourceType)}
        >
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="label" htmlFor="name">Display name</label>
        <input id="name" name="name" className="input" placeholder="e.g. r/freelance + r/Upwork" />
      </div>

      {type === "reddit" && (
        <div className="space-y-3 border border-line-2 bg-surface p-3">
          <div>
            <label className="label" htmlFor="subreddits">Subreddits</label>
            <input id="subreddits" name="subreddits" className="input" placeholder="freelance, Upwork, smallbusiness" />
            <p className="hint">Comma separated, without r/. Leave blank to search site-wide.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="sort">Sort</label>
              <select id="sort" name="sort" className="input">
                <option value="new">New</option>
                <option value="hot">Hot</option>
                <option value="top">Top</option>
              </select>
            </div>
            <div>
              <label className="label" htmlFor="time_window">Time window</label>
              <select id="time_window" name="time_window" className="input">
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label" htmlFor="source_keywords">Search keywords (optional)</label>
            <input id="source_keywords" name="source_keywords" className="input" placeholder="proposal OR contract" />
          </div>
        </div>
      )}

      {type === "hackernews" && (
        <div className="border border-line-2 bg-surface p-3">
          <label className="label" htmlFor="query">Search query</label>
          <input id="query" name="query" className="input" placeholder="proposal software" />
          <p className="hint">Searches HN stories + comments via the public Algolia API.</p>
        </div>
      )}

      {type === "rss" && (
        <div className="border border-line-2 bg-surface p-3">
          <label className="label" htmlFor="url">Feed URL</label>
          <input id="url" name="url" className="input" placeholder="https://example.com/feed.xml" />
          <p className="hint">Any public RSS/Atom feed.</p>
        </div>
      )}

      {type === "manual" && (
        <p className="border border-line-2 bg-surface p-3 text-sm text-ink-2">
          Manual sources let you paste public posts to score on demand — there&apos;s nothing to configure.
        </p>
      )}

      {type === "web_search_placeholder" && (
        <p className="border-l-2 border-accent bg-accent-tint p-3 text-sm text-ink-2">
          Web search is a placeholder for a future SerpAPI / Tavily / Exa / Bing integration. It requires API keys and
          never scrapes pages.
        </p>
      )}

      <button type="submit" className="btn-primary">Add source</button>
    </form>
  );
}
