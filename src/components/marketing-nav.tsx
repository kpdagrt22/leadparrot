import Link from "next/link";
import { BrandMark, Wordmark } from "@/components/crest/brand-mark";

const NAV_LINK = "font-mono text-2xs uppercase tracking-mono text-ink-3 transition-colors hover:text-ink";

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-line-2 bg-paper/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" aria-label="Leads Nest home">
          <Wordmark />
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          <a href="/#how" className={NAV_LINK}>How it works</a>
          <a href="/#use-cases" className={NAV_LINK}>Use cases</a>
          <Link href="/pricing" className={NAV_LINK}>Pricing</Link>
          <a href="/#faq" className={NAV_LINK}>FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="btn-ghost hidden sm:inline-flex">Log in</Link>
          <Link href="/signup" className="btn-primary">Start finding leads</Link>
        </div>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-line-2 bg-surface">
      <div className="container-page flex flex-col items-center justify-between gap-4 py-8 text-sm text-ink-3 sm:flex-row">
        <div className="flex items-center gap-2">
          <BrandMark size={18} />
          <span>© {new Date().getFullYear()} Leads Nest</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-5 font-mono text-2xs uppercase tracking-mono">
          <Link href="/pricing" className="text-ink-3 hover:text-ink">Pricing</Link>
          <Link href="/demo" className="text-ink-3 hover:text-ink">Demo search</Link>
          <Link href="/login" className="text-ink-3 hover:text-ink">Log in</Link>
          <span className="text-ink-4">No auto-posting · No auto-DMs</span>
        </div>
      </div>
    </footer>
  );
}
