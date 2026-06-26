import Link from "next/link";
import { MarketingNav, MarketingFooter } from "@/components/marketing-nav";
import { PricingCards } from "@/components/pricing-cards";

const USE_CASES = [
  { title: "SaaS founders", body: "Catch people comparing tools or asking for alternatives to your competitors." },
  { title: "Agencies", body: "Find businesses publicly asking for the exact services you deliver." },
  { title: "Consultants", body: "Spot problem-aware posts where your expertise is the answer." },
  { title: "B2B services", body: "Surface buying-intent threads in niche communities you can't watch all day." },
  { title: "AI tools", body: "Be first to helpful workflows people are trying to automate." },
  { title: "Niche services", body: "Monitor the handful of forums where your customers actually hang out." },
];

const STEPS = [
  { n: "1", title: "Describe your business", body: "Product, ideal customer, keywords, competitors, and negative keywords." },
  { n: "2", title: "Pick topics & communities", body: "Reddit, Hacker News, RSS feeds, or paste posts manually. Public sources only." },
  { n: "3", title: "Get daily high-intent leads", body: "AI scores relevance, intent, urgency and fit, then ranks the best opportunities." },
  { n: "4", title: "Copy a helpful reply draft", body: "Review a transparent, non-spammy draft and decide whether to respond." },
];

const FAQS = [
  { q: "Does Leads Nest auto-post?", a: "No. Leads Nest never posts, comments, or DMs for you. It drafts a reply you copy and post yourself, manually." },
  { q: "Does it scrape private communities?", a: "No. We only use official APIs and public RSS/search endpoints, and we respect platform rules and rate limits." },
  { q: "Can I use it for Reddit?", a: "Yes — through Reddit's official read-only API and manual replies only. We do not auto-comment or scrape logged-in pages." },
  { q: "Is this a CRM?", a: "No. Leads Nest is a lead-discovery and reply-assist tool, not a CRM or outreach-automation system." },
  { q: "Can I cancel anytime?", a: "Yes. Plans are month-to-month and you can cancel whenever you like." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line-2 bg-gradient-to-b from-accent-tint to-paper">
        <div className="container-page py-24 text-center">
          <span className="crest-eyebrow justify-center">
            <span aria-hidden className="h-px w-[18px] bg-current opacity-60" />
            Lead discovery + reply drafts · No auto-posting
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-light tracking-tightest text-ink sm:text-5xl lg:text-hero">
            Find customers already asking for what you sell.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-normal text-ink-2">
            Leads Nest monitors public conversations, scores buyer intent, and drafts helpful replies — so you can show up at the right moment.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup" className="btn-primary px-6 py-3.5">Start finding leads</Link>
            <Link href="/demo" className="btn-secondary px-6 py-3.5">Try demo search</Link>
          </div>
          <p className="mt-5 font-mono text-2xs uppercase tracking-mono text-ink-3">
            A reply draft before your competitors even see the thread.
          </p>
        </div>
      </section>

      {/* Problem */}
      <section className="container-page py-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-ink-900">Your next customers are already asking — in public.</h2>
            <p className="mt-3 text-ink-600">
              Every day, people post on Reddit, forums, and communities asking for recommendations, alternatives, and
              help with the exact problem you solve. You miss most of those conversations — and by the time you find
              them, someone else has replied.
            </p>
          </div>
          <div className="card space-y-3 p-6">
            {[
              "“Looking for a proposal tool — anything better than Word?”",
              "“Frustrated with [competitor] pricing, any alternatives?”",
              "“How do I track which communities actually send clients?”",
            ].map((quote) => (
              <div key={quote} className="rounded-lg bg-ink-50 px-4 py-3 text-sm text-ink-700">{quote}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="border-y border-ink-200 bg-ink-50/60 py-16">
        <div className="container-page text-center">
          <h2 className="text-2xl font-bold text-ink-900">From public conversation to helpful reply, in one place.</h2>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 md:flex-row">
            {["Public conversations", "AI relevance scoring", "Lead dashboard", "Reply draft"].map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <div className="card flex-1 px-5 py-4 text-sm font-medium text-ink-800">{step}</div>
                {i < 3 && <span className="hidden text-brand-500 md:inline" aria-hidden>→</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="container-page py-16">
        <h2 className="text-center text-2xl font-bold text-ink-900">How it works</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="card p-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                {s.n}
              </div>
              <h3 className="mt-4 font-semibold text-ink-900">{s.title}</h3>
              <p className="mt-1 text-sm text-ink-600">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Use cases */}
      <section id="use-cases" className="border-y border-ink-200 bg-ink-50/60 py-16">
        <div className="container-page">
          <h2 className="text-center text-2xl font-bold text-ink-900">Built for people who sell by being helpful</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {USE_CASES.map((u) => (
              <div key={u.title} className="card p-5">
                <h3 className="font-semibold text-ink-900">{u.title}</h3>
                <p className="mt-1 text-sm text-ink-600">{u.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety positioning */}
      <section className="container-page py-16">
        <div className="card mx-auto max-w-3xl border-brand-200 bg-brand-50/50 p-8 text-center">
          <h2 className="text-2xl font-bold text-ink-900">No auto-posting. No auto-DMs. You stay in control.</h2>
          <p className="mt-3 text-ink-700">
            Leads Nest is a discovery and drafting tool — not an automation bot. We use official APIs and public feeds,
            respect platform rules and rate limits, and never message anyone on your behalf. Every reply is reviewed and
            posted by you.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-ink-200 bg-ink-50/60 py-16">
        <div className="container-page">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-ink-900">Simple, founder-friendly pricing</h2>
            <p className="mt-2 text-ink-600">Start free. Upgrade when Leads Nest is finding you real opportunities.</p>
          </div>
          <div className="mt-10">
            <PricingCards />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="container-page py-16">
        <h2 className="text-center text-2xl font-bold text-ink-900">Frequently asked questions</h2>
        <div className="mx-auto mt-8 max-w-2xl divide-y divide-ink-200">
          {FAQS.map((f) => (
            <div key={f.q} className="py-5">
              <h3 className="font-semibold text-ink-900">{f.q}</h3>
              <p className="mt-1 text-sm text-ink-600">{f.a}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/signup" className="btn-primary px-6 py-3.5">Start finding leads</Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
