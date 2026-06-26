// THE CREST DESIGN SYSTEM — Lead Detail Card (React + Tailwind)
// Demonstrates the bento-grid structure and data hierarchy:
// editorial serif score, mono metadata, hairline-seam metric grid,
// and a 1px-border container with no drop shadow.
// Place at: src/components/crest/lead-detail-card.tsx
import * as React from "react";

// In the LeadParrot repo, replace this with: import { cn } from "@/lib/utils";
// (inlined here so the file is self-contained outside the repo)
function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

interface LeadDetailCardProps {
  title: string;
  source: string;        // "Reddit" | "Hacker News" | …
  subreddit: string;     // "r/agency"
  author: string;        // "u/agency_ops"
  postedAt: string;      // "1d ago"
  score: number;         // 0–100
  scores: { relevance: number; intent: number; urgency: number; fit: number };
  reason: string;
}

function tier(score: number) {
  if (score >= 70) return { label: "High intent", className: "text-high" };
  if (score >= 40) return { label: "Medium", className: "text-medium" };
  return { label: "Low", className: "text-low" };
}

const WEIGHTS = [
  { key: "relevance", label: "Relevance", weight: "35%" },
  { key: "intent", label: "Intent", weight: "30%" },
  { key: "urgency", label: "Urgency", weight: "20%" },
  { key: "fit", label: "Fit", weight: "15%" },
] as const;

export function LeadDetailCard({
  title, source, subreddit, author, postedAt, score, scores, reason,
}: LeadDetailCardProps) {
  const t = tier(score);

  return (
    <article className="rounded-none border border-line-2 bg-surface">
      {/* Header: mono metadata + editorial score */}
      <header className="flex items-start justify-between gap-6 border-b border-line p-6">
        <div className="min-w-0">
          <div className="mb-3 flex items-center gap-2">
            <span className="crest-badge border-accent bg-accent text-accent-fg">
              {source}
            </span>
            <span className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-ink-4">
              {subreddit} · {author} · {postedAt}
            </span>
          </div>
          <h3 className="font-display text-2xl leading-tight tracking-tightest text-ink">
            {title}
          </h3>
        </div>
        {/* The score as an editorial unit, not a chip */}
        <div className="flex flex-col items-end">
          <span className={cn("font-display text-5xl leading-none tracking-tightest tabular-nums", t.className)}>
            {score}
          </span>
          <span className={cn("mt-1 font-mono text-[10px] uppercase tracking-caps", t.className)}>
            {t.label}
          </span>
        </div>
      </header>

      {/* Bento: weighted-score breakdown as a hairline-seam grid */}
      <div className="grid grid-cols-4 gap-px border-b border-line bg-line">
        {WEIGHTS.map((w) => (
          <div key={w.key} className="bg-surface p-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3">
              {w.label} <span className="text-ink-4">· {w.weight}</span>
            </div>
            <div className="mt-2 font-display text-3xl leading-none tabular-nums text-ink">
              {scores[w.key]}
            </div>
            <div className="mt-3 h-1 w-full bg-paper-sunk">
              <div
                className="h-full bg-accent-soft"
                style={{ width: `${Math.max(0, Math.min(100, scores[w.key]))}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Reasoning + actions */}
      <div className="flex items-start justify-between gap-6 p-6">
        <p className="max-w-prose text-sm leading-relaxed text-ink-2">
          <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.1em] text-accent">
            Why
          </span>
          {reason}
        </p>
        <div className="flex shrink-0 gap-2">
          <button className="crest-btn crest-btn--secondary">Save</button>
          <button className="crest-btn crest-btn--primary">Generate reply</button>
        </div>
      </div>
    </article>
  );
}
