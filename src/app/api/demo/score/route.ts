import { NextResponse } from "next/server";
import { z } from "zod";
import { scoreLead } from "@/lib/ai/service";
import { computeOverallScore } from "@/lib/scoring/score";
import { parseList } from "@/lib/utils";

const bodySchema = z.object({
  product: z.string().min(1).max(2000),
  keywords: z.string().max(1000).optional(),
  competitors: z.string().max(1000).optional(),
  negativeKeywords: z.string().max(1000).optional(),
  postTitle: z.string().max(500).optional(),
  postBody: z.string().min(1).max(5000),
});

/**
 * Public, unauthenticated demo scoring endpoint. Uses the configured AI
 * provider (mock by default) to score a pasted post against a described
 * product. No data is persisted.
 */
export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const b = parsed.data;

  const { output } = await scoreLead({
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
