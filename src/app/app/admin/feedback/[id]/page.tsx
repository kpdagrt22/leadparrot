import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getAdminStore } from "@/lib/db";
import { Card, Notice } from "@/components/ui";
import { StatusBadge, TypeBadge, SeverityBadge } from "@/components/feedback/ticket-badges";
import { AddTicketComment } from "@/components/feedback/add-ticket-comment";
import { AdminTriageControls } from "@/components/feedback/admin-triage-controls";
import { formatRelativeDate, cn } from "@/lib/utils";

export const metadata = { title: "Triage — The Leads Nest" };

/** Admin triage detail. Cross-org via the service-role store (RLS bypass). */
export default async function AdminTicketPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const store = getAdminStore();
  const ticket = await store.getTicketAnyOrg(id);
  if (!ticket) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/app/admin" className="font-mono text-2xs uppercase tracking-mono text-ink-3 hover:text-ink">
        ← Admin
      </Link>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <TypeBadge type={ticket.type} />
          <SeverityBadge severity={ticket.severity} />
          <StatusBadge status={ticket.status} />
        </div>
        <h1 className="font-display text-2xl font-normal tracking-tightest text-ink">{ticket.subject}</h1>
        <p className="font-mono text-3xs uppercase tracking-mono text-ink-4">
          {ticket.creator_name ?? "Member"} · opened {formatRelativeDate(ticket.created_at)}
        </p>
      </div>

      <Card>
        <p className="whitespace-pre-wrap text-sm text-ink-2">{ticket.body}</p>
      </Card>

      <Notice tone="neutral" title="Captured context">
        {ticket.page_context?.route ?? "—"} · {ticket.page_context?.user_agent ?? "unknown browser"}. Route/browser
        only — no lead data is attached to any ticket.
      </Notice>

      <Card>
        <AdminTriageControls ticketId={ticket.id} current={ticket.status} />
      </Card>

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
                  <span>{m.author_role === "admin" ? "Support" : "Member"}</span>
                  <span aria-hidden>·</span>
                  <span>{formatRelativeDate(m.created_at)}</span>
                </div>
                <p className="whitespace-pre-wrap text-sm text-ink-2">{m.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddTicketComment ticketId={ticket.id} asAdmin />
    </div>
  );
}
