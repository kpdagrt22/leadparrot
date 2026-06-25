import Link from "next/link";
import { redirect } from "next/navigation";
import { isDemoMode } from "@/lib/env";
import { getContext } from "@/lib/auth";
import { AuthForm } from "@/components/auth-form";

export default async function SignupPage() {
  const demo = isDemoMode();
  if (!demo) {
    const ctx = await getContext();
    if (ctx) redirect("/app");
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2 text-lg font-semibold text-ink-900">
          <span aria-hidden>🦜</span> LeadParrot
        </Link>
        <div className="card p-8">
          <h1 className="mb-1 text-xl font-bold text-ink-900">Start finding leads</h1>
          <p className="mb-6 text-sm text-ink-500">Create your account — no credit card required.</p>
          <AuthForm mode="signup" demo={demo} />
        </div>
        <p className="mt-4 text-center text-xs text-ink-400">
          No auto-posting · No auto-DMs · You stay in control.
        </p>
      </div>
    </div>
  );
}
