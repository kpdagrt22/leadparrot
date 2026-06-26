import Link from "next/link";
import { redirect } from "next/navigation";
import { isDemoMode } from "@/lib/env";
import { getContext } from "@/lib/auth";
import { AuthForm } from "@/components/auth-form";
import { Wordmark } from "@/components/crest/brand-mark";

export default async function SignupPage() {
  const demo = isDemoMode();
  if (!demo) {
    const ctx = await getContext();
    if (ctx) redirect("/app");
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex justify-center" aria-label="Leads Nest home">
          <Wordmark />
        </Link>
        <div className="card p-8">
          <h1 className="mb-1 font-display text-2xl font-normal tracking-tightest text-ink">Start finding leads</h1>
          <p className="mb-6 text-sm text-ink-3">Create your account — no credit card required.</p>
          <AuthForm mode="signup" demo={demo} />
        </div>
        <p className="mt-4 text-center font-mono text-2xs uppercase tracking-mono text-ink-4">
          No auto-posting · No auto-DMs · You stay in control.
        </p>
      </div>
    </div>
  );
}
