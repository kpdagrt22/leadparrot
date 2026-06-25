import Link from "next/link";
import { PLAN_ORDER, PLANS } from "@/lib/plans";
import { cn } from "@/lib/utils";

export function PricingCards({ ctaHref = "/signup" }: { ctaHref?: string }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {PLAN_ORDER.map((id) => {
        const plan = PLANS[id];
        return (
          <div
            key={id}
            className={cn(
              "card flex flex-col p-6",
              plan.highlighted && "border-brand-500 ring-1 ring-brand-500",
            )}
          >
            {plan.highlighted && (
              <span className="mb-2 inline-flex w-fit rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700">
                Most popular
              </span>
            )}
            <h3 className="text-lg font-semibold text-ink-900">{plan.name}</h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-ink-900">${plan.priceMonthly}</span>
              <span className="text-sm text-ink-500">/mo</span>
            </div>
            <p className="mt-1 text-sm text-ink-500">{plan.tagline}</p>
            <ul className="mt-4 flex-1 space-y-2 text-sm text-ink-700">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-0.5 text-brand-600" aria-hidden>✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href={ctaHref}
              className={cn("mt-6", plan.highlighted ? "btn-primary" : "btn-secondary")}
            >
              {plan.priceMonthly === 0 ? "Start free" : `Choose ${plan.name}`}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
