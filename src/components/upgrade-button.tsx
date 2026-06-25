"use client";

import { useState, useTransition } from "react";
import type { PlanId } from "@/lib/types";

export function UpgradeButton({
  plan,
  current,
  label,
  highlighted,
}: {
  plan: PlanId;
  current: boolean;
  label: string;
  highlighted?: boolean;
}) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  if (current) {
    return <button className="btn-secondary mt-6 w-full" disabled>Current plan</button>;
  }
  if (plan === "free") {
    return <button className="btn-ghost mt-6 w-full" disabled>Default plan</button>;
  }

  return (
    <div className="mt-6">
      <button
        className={highlighted ? "btn-primary w-full" : "btn-secondary w-full"}
        disabled={pending}
        onClick={() =>
          start(async () => {
            setMsg(null);
            const res = await fetch("/api/stripe/checkout", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ plan }),
            });
            const data = (await res.json()) as { url?: string; error?: string; notConfigured?: boolean };
            if (data.url) {
              window.location.href = data.url;
            } else if (data.notConfigured) {
              setMsg("Billing not configured. Add Stripe keys to enable checkout.");
            } else {
              setMsg(data.error ?? "Could not start checkout.");
            }
          })
        }
      >
        {pending ? "Starting checkout…" : label}
      </button>
      {msg && <p className="mt-2 text-center text-xs text-amber-700">{msg}</p>}
    </div>
  );
}
