import { MarketingNav, MarketingFooter } from "@/components/marketing-nav";
import { DemoSearch } from "@/components/demo-search";

export const metadata = { title: "Demo search — LeadParrot" };

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />
      <section className="container-page py-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-ink-900">Try a demo lead score</h1>
          <p className="mt-2 text-ink-600">
            Describe what you sell, paste a public post, and see how LeadParrot scores it. Nothing is saved, no signup
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
