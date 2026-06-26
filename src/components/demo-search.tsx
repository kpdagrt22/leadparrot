"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ScoreBadge } from "@/components/score-badge";
import { BrandMark } from "@/components/crest/brand-mark";

interface DemoResult {
  overall: number;
  scores: { relevance: number; intent: number; urgency: number; fit: number };
  lead_stage: string;
  reason: string;
  pain_points: string[];
  buying_signals: string[];
  suggested_angle: string;
  risk_flags: string[];
}

const EXAMPLE = {
  product: "AI proposal generator for freelancers with templates and e-signatures.",
  keywords: "proposal tool, client proposal, Upwork proposal, freelance proposal",
  competitors: "PandaDoc, Proposify",
  negativeKeywords: "marriage proposal, research proposal",
  postTitle: "Frustrated with PandaDoc pricing — any cheaper alternatives?",
  postBody:
    "We've been using PandaDoc but the per-seat pricing is getting expensive as our agency grows. Anyone switched to something cheaper that still does proposals and contracts well? Need to decide this week.",
};

export function DemoSearch() {
  const [pending, start] = useTransition();
  const [result, setResult] = useState<DemoResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(EXAMPLE);

  const set = (k: keyof typeof EXAMPLE) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form
        className="card space-y-4 p-5"
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          start(async () => {
            const res = await fetch("/api/demo/score", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(form),
            });
            if (!res.ok) {
              setError("Something went wrong. Check your inputs.");
              return;
            }
            setResult((await res.json()) as DemoResult);
          });
        }}
      >
        <div>
          <label className="label">What do you sell?</label>
          <textarea className="input min-h-[70px]" value={form.product} onChange={set("product")} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Keywords</label>
            <input className="input" value={form.keywords} onChange={set("keywords")} />
          </div>
          <div>
            <label className="label">Competitors</label>
            <input className="input" value={form.competitors} onChange={set("competitors")} />
          </div>
        </div>
        <div>
          <label className="label">Negative keywords</label>
          <input className="input" value={form.negativeKeywords} onChange={set("negativeKeywords")} />
        </div>
        <div>
          <label className="label">Post title</label>
          <input className="input" value={form.postTitle} onChange={set("postTitle")} />
        </div>
        <div>
          <label className="label">Post text</label>
          <textarea className="input min-h-[100px]" value={form.postBody} onChange={set("postBody")} required />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={pending}>
          {pending ? "Scoring…" : "Score this post"}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>

      <div className="card p-5">
        {!result ? (
          <div className="flex h-full min-h-[260px] flex-col items-center justify-center text-center text-sm text-ink-4">
            <BrandMark size={36} />
            <p className="mt-3">Your lead score will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-5xl font-light tabular-nums text-ink">{result.overall}</span>
                <span className="font-mono text-2xs uppercase tracking-mono text-ink-3">overall</span>
              </div>
              <ScoreBadge score={result.overall} />
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(result.scores).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between rounded bg-ink-50 px-2 py-1">
                  <span className="capitalize text-ink-600">{k}</span>
                  <span className="tabular-nums font-medium">{v}</span>
                </div>
              ))}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-ink-800">Stage</h4>
              <p className="text-sm text-ink-600">{result.lead_stage}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-ink-800">Why</h4>
              <p className="text-sm text-ink-600">{result.reason}</p>
            </div>
            {result.suggested_angle && (
              <div>
                <h4 className="text-sm font-semibold text-ink-800">Suggested angle</h4>
                <p className="text-sm text-brand-700">{result.suggested_angle}</p>
              </div>
            )}
            <div className="rounded-lg bg-brand-50 px-3 py-2 text-center text-sm text-brand-800">
              Want this for real conversations?{" "}
              <Link href="/signup" className="font-medium underline">Start free →</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
