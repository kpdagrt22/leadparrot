import Link from "next/link";
import { notFound } from "next/navigation";
import { requireContext } from "@/lib/auth";
import { getStore } from "@/lib/db";
import { LinkButton, SectionTitle } from "@/components/ui";
import { ScoreBadge } from "@/components/score-badge";
import { formatRelativeDate, truncate } from "@/lib/utils";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ctx = await requireContext();
  const store = await getStore();
  const project = await store.getProject(ctx.organization.id, id);
  if (!project) notFound();

  const [sources, leads] = await Promise.all([
    store.listSources(ctx.organization.id, id),
    store.listLeads(ctx.organization.id, { project_id: id, sort: "score", limit: 5 }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/app/projects" className="text-sm text-ink-500 hover:text-ink-900">← Projects</Link>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-ink-900">{project.name}</h1>
          <div className="flex gap-2">
            <LinkButton href={`/app/projects/${id}/sources`} variant="secondary">Manage sources</LinkButton>
            <LinkButton href={`/app/leads?project=${id}`} variant="primary">View leads</LinkButton>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="card p-5">
            <SectionTitle>Product / service</SectionTitle>
            <p className="text-sm text-ink-700">{project.product_description}</p>
            {project.ideal_customer_profile && (
              <p className="mt-3 text-sm text-ink-600">
                <span className="font-medium text-ink-800">ICP:</span> {project.ideal_customer_profile}
              </p>
            )}
          </div>

          <div className="card p-5">
            <SectionTitle>Top leads</SectionTitle>
            {leads.length === 0 ? (
              <p className="text-sm text-ink-500">No leads yet. Add a source and run a scan.</p>
            ) : (
              <div className="space-y-2">
                {leads.map((l) => (
                  <Link key={l.id} href={`/app/leads/${l.id}`} className="flex items-center gap-3 rounded-lg border border-ink-100 px-3 py-2 hover:border-brand-300">
                    <ScoreBadge score={l.overall_score} />
                    <span className="min-w-0 flex-1 truncate text-sm text-ink-800">{l.title}</span>
                    <span className="hidden text-xs text-ink-400 sm:inline">{formatRelativeDate(l.posted_at)}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <SectionTitle>Keywords</SectionTitle>
            <Chips items={project.keywords} empty="No keywords" />
            <h4 className="mt-4 text-sm font-medium text-ink-700">Negative keywords</h4>
            <Chips items={project.negative_keywords} empty="None" className="mt-1" tone="red" />
            <h4 className="mt-4 text-sm font-medium text-ink-700">Competitors</h4>
            <Chips items={project.competitors} empty="None" className="mt-1" tone="amber" />
          </div>

          <div className="card p-5">
            <SectionTitle>Sources ({sources.length})</SectionTitle>
            <ul className="space-y-1 text-sm">
              {sources.map((s) => (
                <li key={s.id} className="flex items-center justify-between">
                  <span className="text-ink-700">{s.name || s.source_type}</span>
                  <span className="text-xs text-ink-400">{s.source_type}</span>
                </li>
              ))}
            </ul>
            <LinkButton href={`/app/projects/${id}/sources`} variant="ghost" className="mt-3 w-full">
              Manage sources →
            </LinkButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function Chips({
  items,
  empty,
  className,
  tone = "ink",
}: {
  items: string[];
  empty: string;
  className?: string;
  tone?: "ink" | "red" | "amber";
}) {
  const toneCls =
    tone === "red" ? "bg-red-50 text-red-700" : tone === "amber" ? "bg-amber-50 text-amber-700" : "bg-ink-100 text-ink-600";
  if (items.length === 0) return <p className={`text-sm text-ink-400 ${className ?? ""}`}>{empty}</p>;
  return (
    <div className={`flex flex-wrap gap-1 ${className ?? ""}`}>
      {items.map((k) => (
        <span key={k} className={`rounded px-2 py-0.5 text-xs ${toneCls}`}>{k}</span>
      ))}
    </div>
  );
}
