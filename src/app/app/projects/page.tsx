import Link from "next/link";
import { requireContext } from "@/lib/auth";
import { getStore } from "@/lib/db";
import { EmptyState, LinkButton, Badge } from "@/components/ui";
import { formatRelativeDate } from "@/lib/utils";

export default async function ProjectsPage() {
  const ctx = await requireContext();
  const store = await getStore();
  const projects = await store.listProjects(ctx.organization.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Projects</h1>
          <p className="text-sm text-ink-500">Each project tracks one product/service with its own keywords and sources.</p>
        </div>
        <LinkButton href="/app/projects/new">New project</LinkButton>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="A project describes one thing you sell — its keywords, competitors, and the sources to monitor."
          action={<LinkButton href="/app/projects/new">Create your first project</LinkButton>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((p) => (
            <div key={p.id} className="card flex flex-col p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-ink-900">{p.name}</h2>
                <Badge className={p.active ? "border-brand-200 bg-brand-50 text-brand-700" : ""}>
                  {p.active ? "Active" : "Paused"}
                </Badge>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-ink-600">{p.product_description}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {p.keywords.slice(0, 5).map((k) => (
                  <span key={k} className="rounded bg-ink-100 px-2 py-0.5 text-xs text-ink-600">{k}</span>
                ))}
                {p.keywords.length > 5 && <span className="text-xs text-ink-400">+{p.keywords.length - 5}</span>}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-3 text-sm">
                <span className="text-xs text-ink-400">Created {formatRelativeDate(p.created_at)}</span>
                <div className="flex gap-3">
                  <Link href={`/app/projects/${p.id}/sources`} className="text-brand-700 hover:underline">Sources</Link>
                  <Link href={`/app/projects/${p.id}`} className="text-brand-700 hover:underline">Open →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
