import { requireContext } from "@/lib/auth";
import { getStore } from "@/lib/db";
import { LeadFilters } from "@/components/lead-filters";
import { LeadCard } from "@/components/lead-card";
import { EmptyState, LinkButton } from "@/components/ui";
import type { LeadFilters as LeadFilterType } from "@/lib/db/store";
import type { ScoreTier, SourceType, LeadStage, LeadStatus } from "@/lib/types";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const ctx = await requireContext();
  const store = await getStore();
  const sp = await searchParams;

  const filters: LeadFilterType = {
    project_id: sp.project || undefined,
    tier: (sp.tier as ScoreTier) || undefined,
    source_type: (sp.source as SourceType) || undefined,
    lead_stage: (sp.stage as LeadStage) || undefined,
    status: (sp.status as LeadStatus) || undefined,
    search: sp.q || undefined,
    sort: sp.sort === "newest" ? "newest" : "score",
  };

  const [leads, projects, saved] = await Promise.all([
    store.listLeads(ctx.organization.id, filters),
    store.listProjects(ctx.organization.id),
    store.listSavedLeads(ctx.organization.id),
  ]);
  const savedIds = new Set(saved.map((s) => s.lead_candidate_id));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Lead inbox</h1>
          <p className="text-sm text-ink-3">{leads.length} lead{leads.length === 1 ? "" : "s"} match your filters.</p>
        </div>
        <LinkButton href="/app/projects" variant="secondary">Run a scan</LinkButton>
      </div>

      <LeadFilters projects={projects} />

      {leads.length === 0 ? (
        <EmptyState
          title="No leads match"
          description="Try clearing filters, or run a source scan / paste a public post from one of your projects."
          action={<LinkButton href="/app/projects">Go to projects</LinkButton>}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} saved={savedIds.has(lead.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
