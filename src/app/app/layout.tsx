import Link from "next/link";
import { requireContext } from "@/lib/auth";
import { AppNav } from "@/components/app-nav";
import { getPlan } from "@/lib/plans";
import { SignOutButton } from "@/components/sign-out";
import { Wordmark } from "@/components/crest/brand-mark";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const ctx = await requireContext();
  const plan = getPlan(ctx.subscription.plan);

  return (
    <div className="min-h-screen bg-paper">
      <div className="flex">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-line-2 bg-surface p-4 lg:flex">
          <Link href="/app" className="mb-6 px-2" aria-label="The Leads Nest home">
            <Wordmark />
          </Link>
          <AppNav isAdmin={ctx.isAdmin} />
          <div className="mt-auto space-y-3 pt-4">
            <div className="border border-line-2 bg-paper-sunk px-3 py-2 text-xs text-ink-3">
              <div className="font-medium text-ink">{ctx.organization.name}</div>
              <div className="mt-0.5 font-mono text-2xs uppercase tracking-mono">{plan.name} plan</div>
            </div>
            {ctx.demo && (
              <div className="border-l-2 border-accent bg-accent-tint px-3 py-2 text-xs text-ink-2">
                Demo mode — data is in-memory and resets on restart.
              </div>
            )}
            <SignOutButton />
          </div>
        </aside>

        {/* Main */}
        <div className="flex min-h-screen w-full flex-col">
          {/* Mobile top bar */}
          <header className="flex items-center justify-between border-b border-line-2 bg-surface px-4 py-3 lg:hidden">
            <Link href="/app" aria-label="The Leads Nest home">
              <Wordmark size={20} />
            </Link>
            <Link href="/app/projects/new" className="btn-primary text-xs">New project</Link>
          </header>
          <main className="container-page flex-1 py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
