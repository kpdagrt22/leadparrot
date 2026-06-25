"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AuthForm({ mode, demo }: { mode: "login" | "signup"; demo: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  if (demo) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-ink-600">
          You&apos;re in <strong>demo mode</strong> — no account needed. Jump straight into a seeded workspace.
        </p>
        <Link href="/app" className="btn-primary w-full">Enter demo workspace →</Link>
        <p className="text-xs text-ink-400">
          To enable real accounts, configure Supabase keys in <code>.env.local</code>.
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        setNotice(null);
        const form = new FormData(e.currentTarget);
        const email = String(form.get("email") ?? "");
        const password = String(form.get("password") ?? "");
        const fullName = String(form.get("full_name") ?? "");

        start(async () => {
          const supabase = createClient();
          if (!supabase) {
            setError("Auth is not configured.");
            return;
          }
          if (mode === "signup") {
            const { error } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: { full_name: fullName },
                emailRedirectTo: `${window.location.origin}/auth/callback`,
              },
            });
            if (error) return setError(error.message);
            setNotice("Check your email to confirm your account, then log in.");
            return;
          }
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) return setError(error.message);
          router.push("/app");
          router.refresh();
        });
      }}
    >
      {mode === "signup" && (
        <div>
          <label className="label" htmlFor="full_name">Your name</label>
          <input id="full_name" name="full_name" className="input" placeholder="Jane Founder" required />
        </div>
      )}
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" className="input" placeholder="you@company.com" required />
      </div>
      <div>
        <label className="label" htmlFor="password">Password</label>
        <input id="password" name="password" type="password" className="input" placeholder="••••••••" minLength={6} required />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {notice && <p className="text-sm text-brand-700">{notice}</p>}

      <button type="submit" className="btn-primary w-full" disabled={pending}>
        {pending ? "Please wait…" : mode === "signup" ? "Create account" : "Log in"}
      </button>

      <p className="text-center text-sm text-ink-500">
        {mode === "signup" ? (
          <>Already have an account? <Link href="/login" className="text-brand-700 hover:underline">Log in</Link></>
        ) : (
          <>New to LeadParrot? <Link href="/signup" className="text-brand-700 hover:underline">Sign up</Link></>
        )}
      </p>
    </form>
  );
}
