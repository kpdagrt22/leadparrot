import Link from "next/link";
import type { LeadCandidate } from "@/lib/types";
import { ScoreBadge, StageBadge } from "@/components/score-badge";
import { SaveLeadButton, MarkNotRelevantButton } from "@/components/actions";
import { formatRelativeDate, truncate } from "@/lib/utils";

export function LeadCard({ lead, saved }: { lead: LeadCandidate; saved: boolean }) {
  return (
    <div className="card p-4">
      <div className="flex flex-wrap items-center gap-2">
        <ScoreBadge score={lead.overall_score} />
        <StageBadge stage={lead.lead_stage} />
        <span className="badge border-line bg-surface-raised text-ink-3">{lead.source_type}</span>
        <span className="badge border-line bg-surface-raised capitalize text-ink-3">{lead.status.replace("_", " ")}</span>
        <span className="ml-auto text-xs text-ink-4">{formatRelativeDate(lead.posted_at)}</span>
      </div>

      <Link href={`/app/leads/${lead.id}`} className="mt-2 block">
        <h3 className="font-medium text-ink hover:text-accent">{lead.title}</h3>
      </Link>
      <p className="mt-1 text-sm text-ink-2">{truncate(lead.body_excerpt, 200)}</p>

      {lead.reason && (
        <p className="mt-2 text-xs text-ink-3">
          <span className="font-medium text-ink-2">Why:</span> {truncate(lead.reason, 180)}
        </p>
      )}

      {lead.pain_points.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {lead.pain_points.slice(0, 3).map((p) => (
            <span key={p} className="bg-paper-sunk px-2 py-0.5 text-xs text-ink-2">{p}</span>
          ))}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line-2 pt-3">
        <Link href={`/app/leads/${lead.id}`} className="btn-primary text-xs">View &amp; reply</Link>
        <SaveLeadButton leadId={lead.id} saved={saved} />
        <MarkNotRelevantButton leadId={lead.id} />
        {lead.url && (
          <a href={lead.url} target="_blank" rel="noopener noreferrer" className="btn-ghost text-xs">
            Open post ↗
          </a>
        )}
      </div>
    </div>
  );
}
