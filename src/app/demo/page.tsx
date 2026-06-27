import { MarketingNav, MarketingFooter } from "@/components/marketing-nav";
import { DemoSearch } from "@/components/demo-search";

export const metadata = { title: "Demo search — The Leads Nest" };

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-surface-raised">
      <MarketingNav />
      <section className="container-page py-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-ink">Try a demo lead score</h1>
          <p className="mt-2 text-ink-2">
            Describe what you sell, paste a public post, and see how The Leads Nest scores it. Nothing is saved, no signup
            required. (Runs on the mock AI provider unless a real key is configured.)
          </p>
          <div className="mt-8">
            <DemoSearch />
          </div>
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}
