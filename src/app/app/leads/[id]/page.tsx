import Link from "next/link";
import { notFound } from "next/navigation";
import { requireContext } from "@/lib/auth";
import { getStore } from "@/lib/db";
import { SectionTitle, Badge } from "@/components/ui";
import { ScoreBadge, StageBadge, ScoreBars } from "@/components/score-badge";
import {
  GenerateReplyButton,
  CopyReplyButton,
  SaveLeadButton,
  StatusSelect,
} from "@/components/actions";
import { formatRelativeDate, COPY_DISCLAIMER } from "@/lib/utils";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ctx = await requireContext();
  const store = await getStore();
  const lead = await store.getLead(ctx.organization.id, id);
  if (!lead) notFound();

  const [draft, saved] = await Promise.all([
    store.getReplyDraftForLead(ctx.organization.id, id),
    store.isLeadSaved(ctx.organization.id, id),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/app/leads" className="font-mono text-2xs uppercase tracking-mono text-ink-3 hover:text-ink">← Lead inbox</Link>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <ScoreBadge score={lead.overall_score} />
          <StageBadge stage={lead.lead_stage} />
          <Badge>{lead.source_type}</Badge>
          <span className="font-mono text-2xs uppercase tracking-mono text-ink-4">Posted {formatRelativeDate(lead.posted_at)}</span>
        </div>
        <h1 className="mt-3 font-display text-3xl font-light tracking-tightest text-ink">{lead.title}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: post + reply */}
        <div className="space-y-6 lg:col-span-2">
          <div className="card p-5">
            <SectionTitle>Original post</SectionTitle>
            {lead.body_excerpt ? (
              <p className="whitespace-pre-wrap text-sm text-ink-2">{lead.body_excerpt}</p>
            ) : (
              <p className="text-sm text-ink-4">No body text captured.</p>
            )}
            {lead.url && (
              <a href={lead.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm text-accent hover:underline">
                View original post ↗
              </a>
            )}
          </div>

          {/* Reply draft */}
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <SectionTitle>Reply draft</SectionTitle>
              <GenerateReplyButton leadId={lead.id} hasDraft={!!draft} />
            </div>

            {draft ? (
              <div className="space-y-4">
                <div className="border border-line-2 bg-paper-sunk p-4">
                  <p className="whitespace-pre-wrap text-sm text-ink-2">{draft.draft_text}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <CopyReplyButton replyId={draft.id} text={draft.draft_text} />
                  {draft.status === "copied" && <span className="font-mono text-2xs uppercase tracking-mono text-accent">Copied {formatRelativeDate(draft.copied_at)}</span>}
                  <span className="font-mono text-2xs uppercase tracking-mono text-ink-4">Confidence {(draft.confidence * 100).toFixed(0)}%</span>
                </div>

                <div className="border-l-2 border-accent bg-accent-tint px-3 py-2 text-xs text-ink-2">
                  {COPY_DISCLAIMER}
                </div>

                {draft.why_this_reply && (
                  <p className="text-xs text-ink-3"><span className="font-medium text-ink-2">Why this reply:</span> {draft.why_this_reply}</p>
                )}
                {draft.suggested_disclosure && (
                  <div className="border border-accent-line bg-accent-tint px-3 py-2 text-xs text-ink-2">
                    <span className="font-medium text-accent">Suggested disclosure:</span> {draft.suggested_disclosure}
                  </div>
                )}
                {draft.safety_notes.length > 0 && (
                  <ul className="list-disc space-y-1 pl-5 text-xs text-ink-3">
                    {draft.safety_notes.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <p className="text-sm text-ink-3">
                No draft yet. Generate a helpful, transparent reply you can review and copy. The Leads Nest never posts for
                you.
              </p>
            )}
          </div>
        </div>

        {/* Right: scores + analysis + status */}
        <div className="space-y-6">
          <div className="card p-5">
            <SectionTitle>AI scores</SectionTitle>
            <div className="mb-3 flex items-baseline gap-2">
              <span className="font-display text-5xl font-light tabular-nums text-accent">{lead.overall_score}</span>
              <span className="font-mono text-2xs uppercase tracking-mono text-ink-3">overall · {(lead.confidence * 100).toFixed(0)}% conf.</span>
            </div>
            <ScoreBars
              relevance={lead.relevance_score}
              intent={lead.intent_score}
              urgency={lead.urgency_score}
              fit={lead.fit_score}
            />
          </div>

          <div className="card space-y-4 p-5">
            {lead.reason && (
              <div>
                <h4 className="text-sm font-semibold text-ink">Why it&apos;s a lead</h4>
                <p className="mt-1 text-sm text-ink-2">{lead.reason}</p>
              </div>
            )}
            {lead.suggested_angle && (
              <div>
                <h4 className="text-sm font-semibold text-ink">Suggested angle</h4>
                <p className="mt-1 text-sm text-ink-2">{lead.suggested_angle}</p>
              </div>
            )}
            <ListBlock title="Buying signals" items={lead.buying_signals} tone="brand" />
            <ListBlock title="Pain points" items={lead.pain_points} tone="ink" />
            <ListBlock title="Disqualifiers" items={lead.disqualifiers} tone="red" />
            <ListBlock title="Risk flags" items={lead.risk_flags} tone="amber" />
          </div>

          <div className="card space-y-3 p-5">
            <SectionTitle>Manage</SectionTitle>
            <div>
              <label className="label">Status</label>
              <StatusSelect leadId={lead.id} status={lead.status} />
            </div>
            <SaveLeadButton leadId={lead.id} saved={saved} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ListBlock({ title, items, tone }: { title: string; items: string[]; tone: "brand" | "ink" | "red" | "amber" }) {
  if (items.length === 0) return null;
  const cls =
    tone === "brand"
      ? "border-accent-line bg-accent-tint text-accent"
      : tone === "red"
        ? "border-line-2 text-low"
        : tone === "amber"
          ? "border-line-2 text-medium"
          : "border-line-2 text-ink-2";
  return (
    <div>
      <h4 className="font-mono text-2xs font-medium uppercase tracking-caps text-ink-3">{title}</h4>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {items.map((it) => (
          <span key={it} className={`border px-2 py-0.5 text-xs ${cls}`}>{it}</span>
        ))}
      </div>
    </div>
  );
}
