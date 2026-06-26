// THE CREST DESIGN SYSTEM — Typography scale specimen (React + Tailwind)
// Hero serif headline vs. utility mono/sans. Demonstrates text as the
// primary interface architecture.
// Place at: src/components/crest/typography.tsx
import * as React from "react";

export function TypographySpecimen() {
  return (
    <div className="space-y-10 bg-paper p-12">
      {/* Eyebrow → Hero: the core Crest rhythm */}
      <div>
        <span className="crest-eyebrow before:h-px before:w-[18px] before:bg-current before:opacity-60">
          The Crest
        </span>
        <h1 className="mt-4 max-w-3xl font-display text-hero font-light text-ink">
          Find customers already asking for what you sell.
        </h1>
        <p className="mt-6 max-w-xl font-sans text-lg leading-normal text-ink-2">
          A striking neo-serif carries the editorial voice; a clean grotesque
          keeps long-form reading effortless.
        </p>
      </div>

      {/* Utility layer: mono metadata + buttons + data */}
      <div className="flex flex-wrap items-center gap-6 border-t border-line pt-8">
        <span className="font-mono text-2xs uppercase tracking-caps text-ink-3">
          Relevance · 35%
        </span>
        <span className="font-mono text-sm tabular-nums text-ink">
          SCORE <span className="font-medium text-accent">81</span>
        </span>
        <button className="crest-btn crest-btn--primary">Generate reply</button>
      </div>

      {/* The ladder */}
      <dl className="divide-y divide-line border-t border-line">
        {[
          { spec: "5xl · display · 300", cls: "font-display text-5xl font-light tracking-tightest", ex: "Crest" },
          { spec: "display · serif", cls: "font-display text-display", ex: "High-intent leads" },
          { spec: "lg · sans", cls: "font-sans text-lg text-ink-2", ex: "Body copy that stays calm and legible." },
          { spec: "2xs · mono", cls: "font-mono text-2xs uppercase tracking-caps text-ink-3", ex: "Utility label" },
        ].map((row) => (
          <div key={row.spec} className="flex items-baseline gap-6 py-4">
            <dt className="w-44 shrink-0 font-mono text-3xs uppercase tracking-[0.08em] text-ink-4">
              {row.spec}
            </dt>
            <dd className={row.cls}>{row.ex}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
