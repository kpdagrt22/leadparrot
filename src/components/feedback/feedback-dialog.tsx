"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { X } from "lucide-react";
import { Dialog } from "./dialog";
import { TypeTabs } from "./tabs";
import { Notice } from "@/components/ui";
import { submitTicketAction, type SubmitTicketResult } from "@/lib/feedback/actions";
import type { TicketType } from "@/lib/types";

/**
 * The type-tabbed feedback composer. Progressive-enhancement form (useActionState
 * → submitTicketAction); the server re-derives org/user/url and validates with
 * the shared Zod schema — the client values here are diagnostics only.
 */
export function FeedbackDialog({ open, onClose, demo }: { open: boolean; onClose: () => void; demo: boolean }) {
  const id = useId();
  const pathname = usePathname();
  const [type, setType] = useState<TicketType>("bug");
  const [state, action, pending] = useActionState<SubmitTicketResult | null, FormData>(submitTicketAction, null);

  useEffect(() => {
    if (state?.ok) {
      const t = setTimeout(onClose, 1600);
      return () => clearTimeout(t);
    }
  }, [state?.ok, onClose]);

  return (
    <Dialog open={open} onClose={onClose} labelledBy={`${id}-title`}>
      <form action={action} className="flex max-h-[88vh] flex-col">
        <div className="flex items-start justify-between border-b border-line-2 px-5 py-4">
          <div>
            <p className="crest-eyebrow">Support</p>
            <h2 id={`${id}-title`} className="mt-1 font-display text-xl font-normal tracking-tightest text-ink">
              How can we help?
            </h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="btn-ghost px-2 py-2">
            <X size={16} strokeWidth={1.75} aria-hidden />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          <TypeTabs value={type} onChange={setType} />
          <input type="hidden" name="type" value={type} />
          <input type="hidden" name="page_path" value={pathname} />

          <div>
            <label className="label" htmlFor={`${id}-subject`}>
              Subject
            </label>
            <input
              id={`${id}-subject`}
              name="subject"
              required
              minLength={3}
              maxLength={120}
              className="input"
              placeholder="Short summary"
            />
          </div>

          <div>
            <label className="label" htmlFor={`${id}-body`}>
              Details
            </label>
            <textarea
              id={`${id}-body`}
              name="body"
              required
              minLength={10}
              maxLength={4000}
              rows={5}
              className="input"
              placeholder="What happened, or what would you like to see?"
            />
          </div>

          {type === "bug" && (
            <div>
              <label className="label" htmlFor={`${id}-sev`}>
                Severity
              </label>
              <select id={`${id}-sev`} name="severity" defaultValue="normal" className="input">
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>
          )}

          <Notice tone="neutral" title="Sent with this screen">
            {pathname} · we attach the page route, app version, and your browser — nothing else. Internal support
            only: we never message your leads. Please don&apos;t paste anyone else&apos;s private data.
          </Notice>

          {demo && (
            <Notice tone="caution" title="Demo mode">
              Tickets are in-memory and reset on restart — go ahead, this works end to end.
            </Notice>
          )}
          {state && !state.ok && (
            <Notice tone="danger" title="Couldn't send">
              {state.message}
            </Notice>
          )}
          {state?.ok && (
            <Notice tone="accent" title="Thanks">
              {state.message}{" "}
              <Link href="/app/feedback" className="underline">
                View my tickets
              </Link>
            </Notice>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-line-2 px-5 py-4">
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button type="submit" disabled={pending} className="btn-primary">
            {pending ? "Sending…" : "Send"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
