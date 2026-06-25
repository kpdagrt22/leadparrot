import Link from "next/link";

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink-200 bg-white/80 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-ink-900">
          <span className="text-xl" aria-hidden>🦜</span>
          <span>LeadParrot</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-ink-600 md:flex">
          <a href="/#how" className="hover:text-ink-900">How it works</a>
          <a href="/#use-cases" className="hover:text-ink-900">Use cases</a>
          <Link href="/pricing" className="hover:text-ink-900">Pricing</Link>
          <a href="/#faq" className="hover:text-ink-900">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="btn-ghost hidden sm:inline-flex">Log in</Link>
          <Link href="/signup" className="btn-primary">Start Finding Leads</Link>
        </div>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-ink-200 bg-white">
      <div className="container-page flex flex-col items-center justify-between gap-4 py-8 text-sm text-ink-500 sm:flex-row">
        <div className="flex items-center gap-2">
          <span aria-hidden>🦜</span>
          <span>© {new Date().getFullYear()} LeadParrot</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/pricing" className="hover:text-ink-900">Pricing</Link>
          <Link href="/demo" className="hover:text-ink-900">Demo search</Link>
          <Link href="/login" className="hover:text-ink-900">Log in</Link>
          <span className="text-ink-400">No auto-posting · No auto-DMs</span>
        </div>
      </div>
    </footer>
  );
}
