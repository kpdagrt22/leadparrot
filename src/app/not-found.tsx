import Link from "next/link";
import { BrandMark } from "@/components/crest/brand-mark";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-4 text-center">
      <BrandMark size={44} />
      <h1 className="mt-6 font-display text-3xl font-light tracking-tightest text-ink">Page not found</h1>
      <p className="mt-2 text-sm text-ink-3">That page is no longer in the nest.</p>
      <div className="mt-7 flex gap-2">
        <Link href="/" className="btn-secondary">Home</Link>
        <Link href="/app" className="btn-primary">Dashboard</Link>
      </div>
    </div>
  );
}
