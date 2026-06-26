"use client";

import { useActionState, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  runScanAction,
  scoreManualPostFormAction,
  generateReplyAction,
  copyReplyAction,
  saveLeadAction,
  updateLeadStatusAction,
  type ActionResult,
} from "@/lib/actions";

function Feedback({ result }: { result: ActionResult | null }) {
  if (!result?.message) return null;
  return (
    <span className={cn("text-xs", result.ok ? "text-brand-700" : "text-red-600")}>{result.message}</span>
  );
}

export function RunScanButton({ sourceId, label = "Run scan" }: { sourceId: string; label?: string }) {
  const [pending, start] = useTransition();
  const [result, setResult] = useState<ActionResult | null>(null);
  const router = useRouter();
  return (
    <div className="flex items-center gap-2">
      <button
        className="btn-primary"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const r = await runScanAction(sourceId);
            setResult(r);
            router.refresh();
          })
        }
      >
        {pending ? "Scanning…" : label}
      </button>
      <Feedback result={result} />
    </div>
  );
}

export function GenerateReplyButton({ leadId, hasDraft }: { leadId: string; hasDraft: boolean }) {
  const [pending, start] = useTransition();
  const [result, setResult] = useState<ActionResult | null>(null);
  const router = useRouter();
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        className="btn-primary"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const r = await generateReplyAction(leadId);
            setResult(r);
            router.refresh();
          })
        }
      >
        {pending ? "Drafting…" : hasDraft ? "Regenerate reply draft" : "Generate reply draft"}
      </button>
      <Feedback result={result} />
    </div>
  );
}

export function CopyReplyButton({ replyId, text }: { replyId: string; text: string }) {
  const [pending, start] = useTransition();
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  return (
    <button
      className="btn-secondary"
      disabled={pending}
      onClick={() =>
        start(async () => {
          try {
            await navigator.clipboard.writeText(text);
          } catch {
            /* clipboard may be blocked; still mark as copied */
          }
          await copyReplyAction(replyId);
          setCopied(true);
          router.refresh();
        })
      }
    >
      {copied ? "Copied ✓" : "Copy reply"}
    </button>
  );
}

export function SaveLeadButton({ leadId, saved }: { leadId: string; saved: boolean }) {
  const [pending, start] = useTransition();
  const [isSaved, setIsSaved] = useState(saved);
  const router = useRouter();
  return (
    <button
      className={isSaved ? "btn-secondary" : "btn-ghost"}
      disabled={pending || isSaved}
      onClick={() =>
        start(async () => {
          await saveLeadAction(leadId);
          setIsSaved(true);
          router.refresh();
        })
      }
    >
      {isSaved ? "Saved ✓" : "Save lead"}
    </button>
  );
}

const STATUSES = ["new", "saved", "contacted", "not_relevant", "won", "lost"] as const;

export function StatusSelect({ leadId, status }: { leadId: string; status: string }) {
  const [pending, start] = useTransition();
  const [value, setValue] = useState(status);
  const router = useRouter();
  return (
    <select
      className="input max-w-[180px]"
      disabled={pending}
      value={value}
      onChange={(e) => {
        const next = e.target.value;
        setValue(next);
        start(async () => {
          await updateLeadStatusAction(leadId, next);
          router.refresh();
        });
      }}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s.replace("_", " ")}
        </option>
      ))}
    </select>
  );
}

export function MarkNotRelevantButton({ leadId }: { leadId: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <button
      className="btn-ghost text-red-600 hover:bg-red-50"
      disabled={pending}
      onClick={() =>
        start(async () => {
          await updateLeadStatusAction(leadId, "not_relevant");
          router.refresh();
        })
      }
    >
      Not relevant
    </button>
  );
}

function ScoreSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="btn-primary" disabled={pending} type="submit">
      {pending ? "Scoring…" : "Score this post"}
    </button>
  );
}

export function ManualPostForm({ projectId }: { projectId: string }) {
  // Server-action form: works before hydration (native POST → redirect on
  // success), so there is no client-only submit race. useActionState surfaces
  // limit/error feedback inline; success redirects to the new lead.
  const [result, formAction] = useActionState(scoreManualPostFormAction, null);
  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="project_id" value={projectId} />
      <div>
        <label className="label" htmlFor="mp-title">Post title</label>
        <input id="mp-title" name="title" className="input" placeholder="Looking for a proposal tool…" />
      </div>
      <div>
        <label className="label" htmlFor="mp-body">Post text</label>
        <textarea id="mp-body" name="body" className="input min-h-[100px]" placeholder="Paste the public post text here." />
      </div>
      <div>
        <label className="label" htmlFor="mp-url">Public URL (optional)</label>
        <input id="mp-url" name="url" className="input" placeholder="https://www.reddit.com/r/…" />
      </div>
      <div className="flex items-center gap-3">
        <ScoreSubmitButton />
        <Feedback result={result} />
      </div>
    </form>
  );
}
