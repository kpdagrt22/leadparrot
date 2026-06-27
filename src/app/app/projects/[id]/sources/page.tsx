import Link from "next/link";
import { notFound } from "next/navigation";
import { requireContext } from "@/lib/auth";
import { getStore } from "@/lib/db";
import { SectionTitle, SafetyNotice, Badge } from "@/components/ui";
import { AddSourceForm } from "@/components/add-source-form";
import { ManualPostForm, RunScanButton } from "@/components/actions";
import { isRedditConfigured } from "@/lib/env";
import { formatRelativeDate } from "@/lib/utils";
import { SOURCE_TYPE_META } from "@/lib/sources";

export default async function SourcesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ctx = await requireContext();
  const store = await getStore();
  const project = await store.getProject(ctx.organization.id, id);
  if (!project) notFound();

  const [sources, runs] = await Promise.all([
    store.listSources(ctx.organization.id, id),
    store.listSourceRuns(ctx.organization.id, { projectId: id, limit: 8 }),
  ]);

  const redditReady = isRedditConfigured();

  return (
    <div className="space-y-6">
      <div>
        <Link href={`/app/projects/${id}`} className="text-sm text-ink-3 hover:text-ink">← {project.name}</Link>
        <h1 className="mt-1 text-2xl font-bold text-ink">Sources</h1>
        <p className="text-sm text-ink-3">Connect public/allowed sources, then run a scan to find leads.</p>
      </div>

      <SafetyNotice>
        The Leads Nest uses official APIs and public feeds only. It never scrapes private pages, auto-comments, or DMs.
        Respect each platform&apos;s rate limits and rules.
      </SafetyNotice>

      {!redditReady && sources.some((s) => s.source_type === "reddit") && (
        <div className="border border-line-2 bg-medium-tint px-4 py-3 text-sm text-medium">
          <strong>Reddit not configured.</strong> Set <code>REDDIT_CLIENT_ID</code>, <code>REDDIT_CLIENT_SECRET</code> and{" "}
          <code>REDDIT_USER_AGENT</code> to fetch live data. Until then, Reddit scans return demo posts so you can try
          the workflow.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Configured sources */}
        <div className="space-y-4 lg:col-span-2">
          <SectionTitle>Configured sources</SectionTitle>
          {sources.length === 0 ? (
            <p className="text-sm text-ink-3">No sources yet. Add one on the right.</p>
          ) : (
            <div className="space-y-3">
              {sources.map((s) => (
                <div key={s.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-ink">{s.name || s.source_type}</span>
                      <Badge>{s.source_type}</Badge>
                      {!s.enabled && <Badge className="bg-paper-sunk text-ink-3">disabled</Badge>}
                    </div>
                    <div className="mt-0.5 text-xs text-ink-4">
                      {s.identifier ? `${s.identifier} · ` : ""}
                      Last checked {formatRelativeDate(s.last_checked_at)}
                    </div>
                  </div>
                  {s.source_type === "manual" ? (
                    <span className="text-xs text-ink-4">Use the form below to score posts</span>
                  ) : (
                    <RunScanButton sourceId={s.id} />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Manual post scoring */}
          <div className="card p-5">
            <SectionTitle subtitle="Paste any public post to score it instantly against this project.">
              Score a post manually
            </SectionTitle>
            <ManualPostForm projectId={id} />
          </div>

          {/* Run history */}
          <div className="card p-5">
            <SectionTitle>Recent scan runs</SectionTitle>
            {runs.length === 0 ? (
              <p className="text-sm text-ink-3">No scans yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-ink-4">
                    <th className="pb-2">When</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Leads</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {runs.map((r) => (
                    <tr key={r.id}>
                      <td className="py-2 text-ink-2">{formatRelativeDate(r.created_at)}</td>
                      <td className="py-2">
                        <StatusPill status={r.status} />
                        {r.error_message && <span className="ml-2 text-xs text-danger">{r.error_message}</span>}
                      </td>
                      <td className="py-2 text-right tabular-nums text-ink">{r.items_found}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Add source */}
        <div className="space-y-4">
          <div className="card p-5">
            <SectionTitle>Add a source</SectionTitle>
            <AddSourceForm projectId={id} />
          </div>
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-ink">Supported sources</h3>
            <ul className="mt-2 space-y-2 text-xs text-ink-2">
              {SOURCE_TYPE_META.map((m) => (
                <li key={m.type}>
                  <span className="font-medium text-ink">{m.label}.</span> {m.description}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    success: "bg-accent-tint text-accent",
    error: "bg-danger-tint text-danger",
    running: "bg-medium-tint text-medium",
    pending: "bg-paper-sunk text-ink-2",
  };
  return <span className={`badge border-transparent ${map[status] ?? "bg-paper-sunk text-ink-2"}`}>{status}</span>;
}
