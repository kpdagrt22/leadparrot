import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink-50 px-4 text-center">
      <span className="text-4xl" aria-hidden>🦜</span>
      <h1 className="mt-4 text-2xl font-bold text-ink-900">Page not found</h1>
      <p className="mt-1 text-sm text-ink-500">That page flew away.</p>
      <div className="mt-6 flex gap-2">
        <Link href="/" className="btn-secondary">Home</Link>
        <Link href="/app" className="btn-primary">Dashboard</Link>
      </div>
    </div>
  );
}
