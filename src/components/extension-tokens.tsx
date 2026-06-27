"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createExtensionTokenAction, revokeExtensionTokenAction } from "@/lib/actions";
import type { ApiToken } from "@/lib/types";

export function ExtensionTokens({ tokens }: { tokens: ApiToken[] }) {
  const [pending, start] = useTransition();
  const [fresh, setFresh] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const active = tokens.filter((t) => !t.revoked_at);

  const mint = () =>
    start(async () => {
      setCopied(false);
      const r = await createExtensionTokenAction();
      if (r.ok && r.token) setFresh(r.token);
      router.refresh();
    });

  const revoke = (id: string) =>
    start(async () => {
      await revokeExtensionTokenAction(id);
      router.refresh();
    });

  const copy = async () => {
    if (!fresh) return;
    try {
      await navigator.clipboard.writeText(fresh);
      setCopied(true);
    } catch {
      /* clipboard may be blocked */
    }
  };

  return (
    <div className="space-y-4">
      {fresh && (
        <div className="border-l-2 border-accent bg-accent-tint p-3">
          <p className="font-mono text-2xs font-medium uppercase tracking-caps text-accent">
            Copy this token now — it won&apos;t be shown again
          </p>
          <div className="mt-2 flex items-center gap-2">
            <code className="block w-full overflow-x-auto border border-line-2 bg-surface-raised px-2 py-1.5 font-mono text-xs text-ink">
              {fresh}
            </code>
            <button type="button" className="btn-secondary shrink-0" onClick={copy}>
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      )}

      <button type="button" className="btn-primary" disabled={pending} onClick={mint}>
        {pending ? "Working…" : "Generate extension token"}
      </button>

      {active.length > 0 && (
        <ul className="divide-y divide-line border border-line-2">
          {active.map((t) => (
            <li key={t.id} className="flex items-center justify-between gap-3 px-3 py-2">
              <div className="min-w-0">
                <span className="font-mono text-xs text-ink">{t.token_prefix}…</span>
                <span className="ml-2 font-mono text-2xs uppercase tracking-mono text-ink-4">
                  {t.last_used_at ? "active" : "never used"}
                </span>
              </div>
              <button type="button" className="btn-ghost text-low" disabled={pending} onClick={() => revoke(t.id)}>
                Revoke
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
