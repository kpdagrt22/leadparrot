"use client";

import { useActionState, useEffect, useRef } from "react";
import { Notice } from "@/components/ui";
import { addTicketMessageAction } from "@/lib/feedback/actions";
import type { ActionResult } from "@/lib/actions";

/**
 * Reply box for a ticket thread. Progressive-enhancement form bound to
 * addTicketMessageAction (ticketId pre-bound). Closed tickets render a notice
 * instead of an input — the server enforces the same rule.
 */
export function AddTicketComment({
  ticketId,
  disabled,
  asAdmin,
}: {
  ticketId: string;
  disabled?: boolean;
  asAdmin?: boolean;
}) {
  const bound = addTicketMessageAction.bind(null, ticketId);
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(bound, null);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state?.ok]);

  if (disabled) {
    return <Notice tone="neutral">This ticket is closed. Reopen it to add a message.</Notice>;
  }

  return (
    <form ref={ref} action={formAction} className="space-y-2">
      <label htmlFor={`reply-${ticketId}`} className="label">
        {asAdmin ? "Reply as support" : "Add a reply"}
      </label>
      <textarea
        id={`reply-${ticketId}`}
        name="body"
        required
        maxLength={4000}
        rows={3}
        className="input"
        placeholder="Write a reply…"
      />
      {state && !state.ok && <Notice tone="danger">{state.message}</Notice>}
      <div className="flex justify-end">
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Sending…" : "Send reply"}
        </button>
      </div>
    </form>
  );
}
