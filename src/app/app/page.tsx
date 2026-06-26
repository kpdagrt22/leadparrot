import Link from "next/link";
import { requireContext } from "@/lib/auth";
import { getStore } from "@/lib/db";
import { Stat, SectionTitle, EmptyState, SafetyNotice, LinkButton } from "@/components/ui";
import { ScoreBadge, StageBadge } from "@/components/score-badge";
import { usagePercents } from "@/lib/usage/limits";
import { formatRelativeDate, truncate } from "@/lib/utils";

export default async function DashboardPage() {
  const ctx = await requireContext();
  const store = await getStore();
  const [stats, usage, projects] = await Promise.all([
    store.getDashboardStats(ctx.organization.id),
    store.getUsageSnapshot(ctx.organization.id),
    store.listProjects(ctx.organization.id),
  ]);
  const meters = usagePercents(ctx.subscription.plan, usage);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-light tracking-tightest text-ink">Dashboard</h1>
          <p className="text-sm text-ink-3">Welcome back to {ctx.organization.name}.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <LinkButton href="/app/projects/new" variant="primary">Create project</LinkButton>
          <LinkButton href="/app/leads" variant="secondary">View lead inbox</LinkButton>
        </div>
      </div>

      <SafetyNotice />

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Total leads" value={stats.totalLeads} />
        <Stat label="High-intent" value={stats.highIntentLeads} hint="score ≥ 70" />
        <Stat label="Avg score" value={stats.averageScore} />
        <Stat label="Leads saved" value={stats.savedLeads} />
        <Stat label="Replies copied" value={stats.repliesCopied} />
        <Stat label="Active projects" value={stats.activeProjects} />
        <Stat
          label="Last source run"
          value={stats.lastRun ? <span className="text-base">{formatRelativeDate(stats.lastRun.created_at)}</span> : "—"}
          hint={stats.lastRun?.status}
        />
        <Stat label="Plan" value={<span className="text-base capitalize">{ctx.subscription.plan}</span>} />
      </div>

      {/* Usage meters */}
      <div className="card p-5">
        <SectionTitle subtitle="Resets monthly. Upgrade for higher limits.">This month&apos;s usage</SectionTitle>
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            { label: "Posts scanned", m: meters.posts },
            { label: "Reply drafts", m: meters.replies },
            { label: "Projects", m: meters.projects },
          ].map(({ label, m }) => (
            <div key={label}>
              <div className="flex items-center justify-between font-mono text-2xs uppercase tracking-mono">
                <span className="text-ink-3">{label}</span>
                <span className="tabular-nums text-ink">
                  {m.used} / {m.limit}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden bg-paper-sunk">
                <div className="h-full bg-accent-soft" style={{ width: `${m.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent high-intent leads */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <SectionTitle>Recent high-intent leads</SectionTitle>
          <Link href="/app/leads?tier=high" className="font-mono text-2xs uppercase tracking-mono text-accent hover:text-accent-press">View all →</Link>
        </div>
        {stats.recentHighIntent.length === 0 ? (
          projects.length === 0 ? (
            <EmptyState
              title="Create your first project"
              description="Describe what you sell and your ideal customer, then scan a source to start finding leads."
              action={<LinkButton href="/app/projects/new">Create project</LinkButton>}
            />
          ) : (
            <EmptyState
              title="No high-intent leads yet"
              description="Run a source scan or paste a public post to see scored leads here."
              action={<LinkButton href="/app/projects">Go to projects</LinkButton>}
            />
          )
        ) : (
          <div className="space-y-3">
            {stats.recentHighIntent.map((lead) => (
              <Link key={lead.id} href={`/app/leads/${lead.id}`} className="card block p-4 transition-colors hover:border-ink">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <ScoreBadge score={lead.overall_score} />
                      <StageBadge stage={lead.lead_stage} />
                      <span className="font-mono text-2xs uppercase tracking-mono text-ink-4">{lead.source_type} · {formatRelativeDate(lead.posted_at)}</span>
                    </div>
                    <h3 className="mt-2 truncate font-display text-lg font-normal tracking-tightest text-ink">{lead.title}</h3>
                    <p className="mt-0.5 text-sm text-ink-3">{truncate(lead.reason, 160)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
