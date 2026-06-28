"use client";

import { cn } from "@/lib/utils";
import type { TicketType } from "@/lib/types";

const TABS: { value: TicketType; label: string }[] = [
  { value: "bug", label: "Bug" },
  { value: "feature", label: "Feature" },
  { value: "question", label: "Question" },
  { value: "feedback", label: "Feedback" },
];

/** Underline type selector (Crest port of docs/components/feedback/Tabs.jsx). */
export function TypeTabs({ value, onChange }: { value: TicketType; onChange: (t: TicketType) => void }) {
  return (
    <div role="tablist" aria-label="Ticket type" className="flex gap-1 border-b border-line-2">
      {TABS.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.value)}
            className={cn(
              "-mb-px border-b-2 px-3 py-2 font-mono text-2xs uppercase tracking-mono transition-colors",
              active ? "border-accent text-accent" : "border-transparent text-ink-3 hover:text-ink",
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
