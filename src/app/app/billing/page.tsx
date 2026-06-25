import { requireContext } from "@/lib/auth";
import { getStore } from "@/lib/db";
import { PLAN_ORDER, PLANS, getPlan } from "@/lib/plans";
import { isStripeConfigured } from "@/lib/env";
import { usagePercents } from "@/lib/usage/limits";
import { UpgradeButton } from "@/components/upgrade-button";
import { SectionTitle } from "@/components/ui";
import { cn } from "@/lib/utils";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const ctx = await requireContext();
  const store = await getStore();
  const usage = await store.getUsageSnapshot(ctx.organization.id);
  const meters = usagePercents(ctx.subscription.plan, usage);
  const { status } = await searchParams;
  const currentPlan = getPlan(ctx.subscription.plan);
  const stripeReady = isStripeConfigured();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Billing &amp; plans</h1>
        <p className="text-sm text-ink-500">You&apos;re on the {currentPlan.name} plan.</p>
      </div>

      {status === "success" && (
        <div className="rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800">
          Checkout complete — your subscription will update shortly.
        </div>
      )}
      {status === "cancelled" && (
        <div className="rounded-lg border border-ink-200 bg-ink-50 px-4 py-3 text-sm text-ink-600">
          Checkout cancelled. No changes were made.
        </div>
      )}
      {!stripeReady && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <strong>Billing not configured.</strong> Add <code>STRIPE_SECRET_KEY</code>,{" "}
          <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code>, and per-plan price IDs to enable checkout. Plans below are
          shown for reference.
        </div>
      )}

      <div className="card p-5">
        <SectionTitle subtitle="Usage resets at the start of each month.">Current usage</SectionTitle>
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            { label: "Posts scanned", m: meters.posts },
            { label: "Reply drafts", m: meters.replies },
            { label: "Projects", m: meters.projects },
          ].map(({ label, m }) => (
            <div key={label}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-600">{label}</span>
                <span className="tabular-nums text-ink-800">{m.used} / {m.limit}</span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-ink-100">
                <div className="h-full rounded-full bg-brand-500" style={{ width: `${m.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {PLAN_ORDER.map((id) => {
          const plan = PLANS[id];
          const current = id === ctx.subscription.plan;
          return (
            <div
              key={id}
              className={cn("card flex flex-col p-6", plan.highlighted && "border-brand-500 ring-1 ring-brand-500")}
            >
              <h3 className="text-lg font-semibold text-ink-900">{plan.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-ink-900">${plan.priceMonthly}</span>
                <span className="text-sm text-ink-500">/mo</span>
              </div>
              <ul className="mt-4 flex-1 space-y-2 text-sm text-ink-700">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-0.5 text-brand-600" aria-hidden>✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <UpgradeButton
                plan={id}
                current={current}
                highlighted={plan.highlighted}
                label={`Choose ${plan.name}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
