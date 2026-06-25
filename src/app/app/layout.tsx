import Link from "next/link";
import { requireContext } from "@/lib/auth";
import { AppNav } from "@/components/app-nav";
import { getPlan } from "@/lib/plans";
import { SignOutButton } from "@/components/sign-out";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const ctx = await requireContext();
  const plan = getPlan(ctx.subscription.plan);

  return (
    <div className="min-h-screen bg-ink-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-ink-200 bg-white p-4 lg:flex">
          <Link href="/app" className="mb-6 flex items-center gap-2 px-2 font-semibold text-ink-900">
            <span className="text-xl" aria-hidden>🦜</span>
            <span>LeadParrot</span>
          </Link>
          <AppNav isAdmin={ctx.isAdmin} />
          <div className="mt-auto space-y-3 pt-4">
            <div className="rounded-lg bg-ink-50 px-3 py-2 text-xs text-ink-600">
              <div className="font-medium text-ink-800">{ctx.organization.name}</div>
              <div className="mt-0.5">{plan.name} plan</div>
            </div>
            {ctx.demo && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                Demo mode — data is in-memory and resets on restart.
              </div>
            )}
            <SignOutButton />
          </div>
        </aside>

        {/* Main */}
        <div className="flex min-h-screen w-full flex-col">
          {/* Mobile top bar */}
          <header className="flex items-center justify-between border-b border-ink-200 bg-white px-4 py-3 lg:hidden">
            <Link href="/app" className="flex items-center gap-2 font-semibold text-ink-900">
              <span aria-hidden>🦜</span> LeadParrot
            </Link>
            <Link href="/app/projects/new" className="btn-primary text-xs">New project</Link>
          </header>
          <main className="container-page flex-1 py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
