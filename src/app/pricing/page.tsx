import Link from "next/link";
import { MarketingNav, MarketingFooter } from "@/components/marketing-nav";
import { PricingCards } from "@/components/pricing-cards";

const FAQS = [
  { q: "Can I cancel anytime?", a: "Yes — plans are month-to-month and you can cancel whenever you like." },
  { q: "What counts as a scanned post?", a: "Each public post we run AI scoring on counts once toward your monthly limit." },
  { q: "Do you auto-post replies?", a: "Never. The Leads Nest only drafts replies you copy and post yourself." },
  { q: "What sources are included?", a: "Manual posts on every plan; Reddit (official API), Hacker News, and RSS on paid plans." },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-surface-raised">
      <MarketingNav />
      <section className="border-b border-line bg-gradient-to-b from-accent-tint/60 to-surface-raised py-16">
        <div className="container-page text-center">
          <h1 className="text-3xl font-bold text-ink sm:text-4xl">Simple, founder-friendly pricing</h1>
          <p className="mx-auto mt-3 max-w-xl text-ink-2">
            Start free. Upgrade when The Leads Nest is finding you real opportunities. No contracts, cancel anytime.
          </p>
        </div>
      </section>

      <section className="container-page py-12">
        <PricingCards />
      </section>

      <section className="border-t border-line bg-paper-sunk/60 py-16">
        <div className="container-page mx-auto max-w-2xl">
          <h2 className="text-center text-2xl font-bold text-ink">Pricing FAQ</h2>
          <div className="mt-8 divide-y divide-line">
            {FAQS.map((f) => (
              <div key={f.q} className="py-5">
                <h3 className="font-semibold text-ink">{f.q}</h3>
                <p className="mt-1 text-sm text-ink-2">{f.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/signup" className="btn-primary px-6 py-3 text-base">Start Finding Leads</Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
