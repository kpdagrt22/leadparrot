import { cn } from "@/lib/utils";
import { scoreTier, tierMeta } from "@/lib/scoring/score";

export function ScoreBadge({ score, className }: { score: number; className?: string }) {
  const tier = scoreTier(score);
  const meta = tierMeta(tier);
  return (
    <span className={cn("badge", meta.classes, className)}>
      <strong className="tabular-nums">{score}</strong>
      <span className="opacity-70">{meta.label}</span>
    </span>
  );
}

const STAGE_LABELS: Record<string, string> = {
  research: "Research",
  "problem-aware": "Problem-aware",
  "solution-aware": "Solution-aware",
  "buying-intent": "Buying intent",
  "competitor-switching": "Competitor switching",
  "not-a-lead": "Not a lead",
};

export function StageBadge({ stage }: { stage: string }) {
  return <span className="badge border-ink-200 bg-white text-ink-600">{STAGE_LABELS[stage] ?? stage}</span>;
}

export function ScoreBars({
  relevance,
  intent,
  urgency,
  fit,
}: {
  relevance: number;
  intent: number;
  urgency: number;
  fit: number;
}) {
  const rows = [
    { label: "Relevance", value: relevance, weight: "35%" },
    { label: "Intent", value: intent, weight: "30%" },
    { label: "Urgency", value: urgency, weight: "20%" },
    { label: "Fit", value: fit, weight: "15%" },
  ];
  return (
    <div className="space-y-2">
      {rows.map((r) => (
        <div key={r.label}>
          <div className="flex items-center justify-between text-xs text-ink-600">
            <span>
              {r.label} <span className="text-ink-400">· {r.weight}</span>
            </span>
            <span className="tabular-nums font-medium">{r.value}</span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
            <div className="h-full rounded-full bg-brand-500" style={{ width: `${Math.max(0, Math.min(100, r.value))}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
