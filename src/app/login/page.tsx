import Link from "next/link";
import { redirect } from "next/navigation";
import { isDemoMode } from "@/lib/env";
import { getContext } from "@/lib/auth";
import { AuthForm } from "@/components/auth-form";

export default async function LoginPage() {
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
          <h1 className="mb-1 text-xl font-bold text-ink-900">Welcome back</h1>
          <p className="mb-6 text-sm text-ink-500">Log in to your lead dashboard.</p>
          <AuthForm mode="login" demo={demo} />
        </div>
      </div>
    </div>
  );
}
