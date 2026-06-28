import Link from "next/link";
import { requireContext } from "@/lib/auth";
import { getStore } from "@/lib/db";
import { SectionTitle, EmptyState } from "@/components/ui";
import { StatusBadge, TypeBadge } from "@/components/feedback/ticket-badges";
import { formatRelativeDate, cn } from "@/lib/utils";
import type { TicketStatus } from "@/lib/types";

export const metadata = { title: "Support — The Leads Nest" };

const FILTERS: { value: string; label: string; status?: TicketStatus }[] = [
  { value: "all", label: "All" },
  { value: "open", label: "Open", status: "open" },
  { value: "in_progress", label: "In progress", status: "in_progress" },
  { value: "resolved", label: "Resolved", status: "resolved" },
];

export default async function FeedbackPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const ctx = await requireContext();
  const store = await getStore();
  const sp = await searchParams;
  const active = FILTERS.find((f) => f.value === sp.status) ?? FILTERS[0];
  const tickets = await store.listTickets(ctx.organization.id, {
    created_by: ctx.user.id,
    status: active.status,
    sort: "updated",
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <SectionTitle subtitle="Raise a bug, request a feature, or send feedback. Internal support only — we never message your leads.">
        Support
      </SectionTitle>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value === "all" ? "/app/feedback" : `/app/feedback?status=${f.value}`}
            aria-current={active.value === f.value ? "page" : undefined}
            className={cn(
              "border px-3 py-1.5 font-mono text-2xs uppercase tracking-mono transition-colors",
              active.value === f.value
                ? "border-accent bg-accent-tint text-accent"
                : "border-line-2 text-ink-3 hover:text-ink",
            )}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {tickets.length === 0 ? (
        <EmptyState
          title="No tickets yet"
          description="Use the Feedback button (bottom-right) to raise your first ticket — bug, feature, question, or general feedback."
        />
      ) : (
        <div className="card divide-y divide-line-2 p-0">
          {tickets.map((t) => (
            <Link
              key={t.id}
              href={`/app/feedback/${t.id}`}
              className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-paper-sunk"
            >
              <StatusBadge status={t.status} />
              <TypeBadge type={t.type} />
              <span className="min-w-0 flex-1 truncate text-sm text-ink">{t.subject}</span>
              <span className="shrink-0 font-mono text-3xs uppercase tracking-mono text-ink-4">
                {formatRelativeDate(t.updated_at)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
