import Link from "next/link";
import { notFound } from "next/navigation";
import { requireContext } from "@/lib/auth";
import { getStore } from "@/lib/db";
import { Card, Notice } from "@/components/ui";
import { StatusBadge, TypeBadge, SeverityBadge } from "@/components/feedback/ticket-badges";
import { AddTicketComment } from "@/components/feedback/add-ticket-comment";
import { formatRelativeDate, cn } from "@/lib/utils";

export default async function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const ctx = await requireContext();
  const { id } = await params;
  const store = await getStore();
  const ticket = await store.getTicket(ctx.organization.id, id);
  if (!ticket) notFound(); // org-scoped query → cross-org id is a 404

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/app/feedback" className="font-mono text-2xs uppercase tracking-mono text-ink-3 hover:text-ink">
        ← All tickets
      </Link>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <TypeBadge type={ticket.type} />
          <SeverityBadge severity={ticket.severity} />
          <StatusBadge status={ticket.status} />
        </div>
        <h1 className="font-display text-2xl font-normal tracking-tightest text-ink">{ticket.subject}</h1>
        <p className="font-mono text-3xs uppercase tracking-mono text-ink-4">
          Opened {formatRelativeDate(ticket.created_at)}
        </p>
      </div>

      <Card>
        <p className="whitespace-pre-wrap text-sm text-ink-2">{ticket.body}</p>
      </Card>

      {ticket.page_context?.route && (
        <Notice tone="neutral" title="Captured context">
          Reported from {ticket.page_context.route} — we attach the page route and your browser only, never lead data.
        </Notice>
      )}

      <div className="space-y-3">
        <h2 className="font-mono text-2xs uppercase tracking-caps text-ink-3">Thread</h2>
        {ticket.messages.length === 0 ? (
          <p className="text-sm text-ink-3">No replies yet.</p>
        ) : (
          <div className="space-y-3">
            {ticket.messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "border-l-2 px-4 py-3",
                  m.author_role === "admin" ? "border-accent bg-accent-tint" : "border-line-2 bg-surface",
                )}
              >
                <div className="mb-1 flex items-center gap-2 font-mono text-3xs uppercase tracking-mono text-ink-4">
                  <span>{m.author_role === "admin" ? "Support" : "You"}</span>
                  <span aria-hidden>·</span>
                  <span>{formatRelativeDate(m.created_at)}</span>
                </div>
                <p className="whitespace-pre-wrap text-sm text-ink-2">{m.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddTicketComment ticketId={ticket.id} disabled={ticket.status === "closed"} />
    </div>
  );
}
