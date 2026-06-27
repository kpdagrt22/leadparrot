"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { sendTestAlertAction } from "@/lib/actions";
import type { NotifyChannel } from "@/lib/notify";

const CHANNELS: Array<{ key: NotifyChannel; label: string }> = [
  { key: "email", label: "Test email" },
  { key: "sms", label: "Test SMS" },
  { key: "whatsapp", label: "Test WhatsApp" },
];

/** Owner-only test/verify buttons. Each sends a test alert to the owner's own
 * saved address/number and, on a real send, marks that channel verified. */
export function TestAlertButtons() {
  const [pending, start] = useTransition();
  const [active, setActive] = useState<NotifyChannel | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const router = useRouter();

  const test = (channel: NotifyChannel) =>
    start(async () => {
      setActive(channel);
      const r = await sendTestAlertAction(channel);
      setMsg({ ok: r.ok, text: r.message ?? "" });
      router.refresh();
    });

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {CHANNELS.map((c) => (
          <button
            key={c.key}
            type="button"
            className="btn-secondary"
            disabled={pending}
            onClick={() => test(c.key)}
          >
            {pending && active === c.key ? "Sending…" : c.label}
          </button>
        ))}
      </div>
      {msg && (
        <p className={`font-mono text-2xs uppercase tracking-mono ${msg.ok ? "text-accent" : "text-low"}`}>{msg.text}</p>
      )}
      <p className="hint">
        Save your settings first. A test goes to your own address/number — never to a lead.
      </p>
    </div>
  );
}
