import { NextResponse } from "next/server";
import { z } from "zod";
import { mockProvider } from "@/lib/ai/providers/mock";
import { computeOverallScore } from "@/lib/scoring/score";
import { parseList } from "@/lib/utils";
import { rateLimit } from "@/lib/ratelimit";

const bodySchema = z.object({
  product: z.string().min(1).max(2000),
  keywords: z.string().max(1000).optional(),
  competitors: z.string().max(1000).optional(),
  negativeKeywords: z.string().max(1000).optional(),
  postTitle: z.string().max(500).optional(),
  postBody: z.string().min(1).max(5000),
});

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

/**
 * Public, unauthenticated demo scoring endpoint. No data is persisted.
 *
 * Two safety properties for an endpoint anyone can call:
 *  - Per-IP rate limiting, so it can't be used to run up cost or as a DoS.
 *  - It ALWAYS uses the deterministic mock provider, never a paid provider —
 *    an unauthenticated endpoint must not be able to spend API budget.
 */
export async function POST(req: Request) {
  const rl = rateLimit(`demo-score:${clientIp(req)}`, { limit: 20, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down and try again shortly." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const b = parsed.data;

  const output = await mockProvider.scoreLead({
    project: {
      name: "Demo",
      product_description: b.product,
      keywords: parseList(b.keywords),
      competitors: parseList(b.competitors),
      negative_keywords: parseList(b.negativeKeywords),
    },
    post: {
      title: b.postTitle ?? null,
      body: b.postBody,
      source_type: "manual",
    },
  });

  return NextResponse.json({
    overall: computeOverallScore(output),
    scores: {
      relevance: output.relevance_score,
      intent: output.intent_score,
      urgency: output.urgency_score,
      fit: output.fit_score,
    },
    lead_stage: output.lead_stage,
    reason: output.reason,
    pain_points: output.pain_points,
    buying_signals: output.buying_signals,
    suggested_angle: output.suggested_angle,
    risk_flags: output.risk_flags,
  });
}
