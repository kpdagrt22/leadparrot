"use client";

import { useState, useTransition } from "react";
import { updateTicketStatusAction } from "@/lib/feedback/actions";
import { Notice } from "@/components/ui";
import type { TicketStatus } from "@/lib/types";

const STATUSES: { value: TicketStatus; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

/**
 * Status triage control. Calls updateTicketStatusAction, which re-asserts
 * owner/admin server-side — this UI is a convenience, not the authorization gate.
 */
export function AdminTriageControls({ ticketId, current }: { ticketId: string; current: TicketStatus }) {
  const [status, setStatus] = useState<TicketStatus>(current);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function apply(next: TicketStatus) {
    const prev = status;
    setStatus(next);
    start(async () => {
      const r = await updateTicketStatusAction(ticketId, next);
      if (!r.ok) setStatus(prev);
      setMsg({ ok: r.ok, text: r.message ?? (r.ok ? "Status updated." : "Failed.") });
    });
  }

  return (
    <div className="space-y-2">
      <label htmlFor={`triage-${ticketId}`} className="label">
        Status
      </label>
      <select
        id={`triage-${ticketId}`}
        value={status}
        disabled={pending}
        onChange={(e) => apply(e.target.value as TicketStatus)}
        className="input max-w-xs"
      >
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      {msg && <Notice tone={msg.ok ? "accent" : "danger"}>{msg.text}</Notice>}
    </div>
  );
}
