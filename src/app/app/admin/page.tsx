import { requireAdmin } from "@/lib/auth";
import { getAdminStore } from "@/lib/db";
import { Stat, SectionTitle } from "@/components/ui";
import { formatRelativeDate } from "@/lib/utils";

export default async function AdminPage() {
  await requireAdmin();
  const store = getAdminStore();
  const stats = await store.getAdminStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Internal admin</h1>
        <p className="text-sm text-ink-3">Protected by ADMIN_EMAILS (or demo mode). Aggregate metrics only.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Organizations" value={stats.totalOrganizations} />
        <Stat label="Projects" value={stats.totalProjects} />
        <Stat label="Source runs" value={stats.totalSourceRuns} />
        <Stat label="AI errors" value={stats.aiErrors} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <SectionTitle>Top sources</SectionTitle>
          {stats.topSources.length === 0 ? (
            <p className="text-sm text-ink-3">No sources yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {stats.topSources.map((s) => (
                <li key={s.source_type} className="flex items-center justify-between">
                  <span className="text-ink-2">{s.source_type}</span>
                  <span className="tabular-nums text-ink">{s.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-5">
          <SectionTitle>Recent signups</SectionTitle>
          {stats.recentSignups.length === 0 ? (
            <p className="text-sm text-ink-3">No signups yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {stats.recentSignups.map((o) => (
                <li key={o.id} className="flex items-center justify-between">
                  <span className="text-ink-2">{o.name}</span>
                  <span className="text-xs text-ink-4">{formatRelativeDate(o.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="card p-5">
        <SectionTitle>Usage by organization</SectionTitle>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-ink-4">
              <th className="pb-2">Organization</th>
              <th className="pb-2 text-right">Posts scanned</th>
              <th className="pb-2 text-right">Reply drafts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-2">
            {stats.usageByOrg.map((u) => (
              <tr key={u.organization}>
                <td className="py-2 text-ink-2">{u.organization}</td>
                <td className="py-2 text-right tabular-nums">{u.posts}</td>
                <td className="py-2 text-right tabular-nums">{u.replies}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
