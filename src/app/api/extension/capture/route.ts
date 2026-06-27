import { NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";
import { resolveExtensionAuth, corsHeaders } from "@/lib/extension/auth";
import { rateLimit } from "@/lib/ratelimit";
import { scoreManualPost } from "@/lib/scan";
import { scoreTier } from "@/lib/scoring/score";

export const dynamic = "force-dynamic";

/**
 * Browser-extension capture: score ONE public post the user is actively viewing
 * (sent by the extension on an explicit click) and persist it as a lead. This is
 * the same manual-scoring pipeline as the app — read-only, no posting. Auth is a
 * per-user hashed Bearer token; org-scoped + rate-limited.
 */
const schema = z.object({
  title: z.string().max(500).optional(),
  body: z.string().min(1).max(8000),
  url: z.string().url().max(2000).optional(),
  author: z.string().max(200).optional(),
});

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function POST(req: Request) {
  const cors = corsHeaders();
  const auth = await resolveExtensionAuth(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: cors });

  const rl = rateLimit(`ext-capture:${auth.tokenKey}`, { limit: 30, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429, headers: { ...cors, "Retry-After": "60" } });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400, headers: cors });

  const { store, orgId } = auth;
  const projects = await store.listProjects(orgId);
  const project = projects[0];
  if (!project) {
    return NextResponse.json(
      { error: "Create a project in The Leads Nest first.", needsProject: true },
      { status: 409, headers: cors },
    );
  }

  const sub = await store.getSubscription(orgId);
  const sources = await store.listSources(orgId, project.id);
  const manual = sources.find((s) => s.source_type === "manual");

  const { lead, limitReached, error } = await scoreManualPost(store, orgId, sub.plan, project, manual?.id ?? null, {
    title: parsed.data.title,
    body: parsed.data.body,
    url: parsed.data.url,
    author_display: parsed.data.author,
  });

  if (limitReached) return NextResponse.json({ error: "Monthly scan limit reached." }, { status: 402, headers: cors });
  if (error || !lead) return NextResponse.json({ error: error ?? "Scoring failed" }, { status: 500, headers: cors });

  return NextResponse.json(
    {
      lead_id: lead.id,
      project: project.name,
      overall: lead.overall_score,
      tier: scoreTier(lead.overall_score),
      scores: {
        relevance: lead.relevance_score,
        intent: lead.intent_score,
        urgency: lead.urgency_score,
        fit: lead.fit_score,
      },
      lead_stage: lead.lead_stage,
      reason: lead.reason,
      suggested_angle: lead.suggested_angle,
      buying_signals: lead.buying_signals,
      app_url: `${env.appUrl}/app/leads/${lead.id}`,
    },
    { headers: cors },
  );
}
