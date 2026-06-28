import Link from "next/link";
import { Wordmark } from "@/components/crest/brand-mark";

export const metadata = { title: "Offline — The Leads Nest" };

/**
 * Offline fallback served by the service worker when a navigation fails and
 * nothing is cached. Static + zero-secrets so it always renders.
 */
export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-paper px-6 text-center">
      <Wordmark size={28} />
      <p className="crest-eyebrow">No connection</p>
      <h1 className="max-w-md text-2xl text-ink">You&apos;re offline</h1>
      <p className="max-w-sm text-sm text-ink-3">
        The Leads Nest needs a connection to fetch live leads. Your saved work is safe — reconnect and reopen the
        workspace.
      </p>
      <Link href="/app" className="btn-secondary text-xs">
        Retry
      </Link>
    </main>
  );
}
