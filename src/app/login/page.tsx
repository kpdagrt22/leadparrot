import Link from "next/link";
import { redirect } from "next/navigation";
import { isDemoMode } from "@/lib/env";
import { getContext } from "@/lib/auth";
import { AuthForm } from "@/components/auth-form";
import { Wordmark } from "@/components/crest/brand-mark";

export default async function LoginPage() {
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
          <h1 className="mb-1 font-display text-2xl font-normal tracking-tightest text-ink">Welcome back</h1>
          <p className="mb-6 text-sm text-ink-3">Log in to your lead dashboard.</p>
          <AuthForm mode="login" demo={demo} />
        </div>
      </div>
    </div>
  );
}
