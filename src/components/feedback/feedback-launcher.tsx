"use client";

import { useCallback, useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import { FeedbackDialog } from "./feedback-dialog";

/**
 * The single always-mounted feedback entry point, rendered once in the app shell
 * so it appears on every authenticated screen. A floating pill that lazy-mounts
 * the dialog; offset above the mobile tab bar so it never collides. Focus returns
 * to the pill on close (handled by Dialog). `isAdmin` is accepted for parity with
 * the shell call site (admins also reach triage from /app/admin).
 */
export function FeedbackLauncher({ demo }: { isAdmin: boolean; demo: boolean }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="btn-secondary fixed bottom-24 right-4 z-40 lg:bottom-5 lg:right-5"
      >
        <MessageSquarePlus size={16} strokeWidth={1.75} aria-hidden />
        Feedback
      </button>
      {open && <FeedbackDialog open={open} onClose={close} demo={demo} />}
    </>
  );
}
