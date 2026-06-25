import { requireContext } from "@/lib/auth";
import { getStore } from "@/lib/db";
import { buildDigest } from "@/lib/email/digest";
import { isResendConfigured } from "@/lib/env";
import { SectionTitle, EmptyState, LinkButton } from "@/components/ui";
import { ScoreBadge } from "@/components/score-badge";

export default async function DigestPage() {
  const ctx = await requireContext();
  const store = await getStore();
  const topLeads = await store.getTopLeads(ctx.organization.id, 5);
  const digest = buildDigest(ctx.organization.name, topLeads);
  const resendReady = isResendConfigured();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Daily digest</h1>
        <p className="text-sm text-ink-500">A preview of your top opportunities email.</p>
      </div>

      <div
        className={`rounded-lg border px-4 py-3 text-sm ${
          resendReady
            ? "border-brand-200 bg-brand-50 text-brand-800"
            : "border-amber-200 bg-amber-50 text-amber-800"
        }`}
      >
        {resendReady ? (
          <>Email sending is configured. Digests can be sent to <strong>{ctx.organization.notification_email}</strong>.</>
        ) : (
          <><strong>Preview only.</strong> Add <code>RESEND_API_KEY</code> to send this digest by email. Until then it
          appears here in-app.</>
        )}
      </div>

      {topLeads.length === 0 ? (
        <EmptyState
          title="No leads to summarize yet"
          description="Run a scan or paste a public post, then your top 5 opportunities will appear here."
          action={<LinkButton href="/app/projects">Go to projects</LinkButton>}
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="border-b border-ink-200 bg-ink-50 px-5 py-3">
            <SectionTitle>{digest.subject}</SectionTitle>
            <p className="text-xs text-ink-500">Top opportunities for {digest.orgName}</p>
          </div>
          <div className="divide-y divide-ink-100">
            {digest.leads.map((l, i) => (
              <div key={i} className="px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-medium text-ink-900">{l.title}</h3>
                  <ScoreBadge score={l.score} />
                </div>
                <p className="mt-1 text-xs text-ink-400">{l.source}</p>
                {l.reason && <p className="mt-1 text-sm text-ink-600">{l.reason}</p>}
                {l.suggested_angle && <p className="mt-1 text-sm text-brand-700">Angle: {l.suggested_angle}</p>}
                {l.url && (
                  <a href={l.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-xs text-brand-700 hover:underline">
                    View post ↗
                  </a>
                )}
              </div>
            ))}
          </div>
          <div className="border-t border-ink-200 px-5 py-3 text-xs text-ink-400">
            Includes only public post title, link, excerpt, and AI analysis — no extra personal data.
          </div>
        </div>
      )}
    </div>
  );
}
