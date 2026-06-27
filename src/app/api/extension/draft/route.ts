import { NextResponse } from "next/server";
import { z } from "zod";
import { resolveExtensionAuth, corsHeaders } from "@/lib/extension/auth";
import { rateLimit } from "@/lib/ratelimit";
import { generateReplyForLead } from "@/lib/scan";
import { COPY_DISCLAIMER } from "@/lib/utils";

export const dynamic = "force-dynamic";

/**
 * Browser-extension reply draft: generate a helpful, DISCLOSED reply for a lead
 * the extension captured. Copy-only — there is no send/post path anywhere. Auth
 * is the per-user hashed Bearer token; the lead is verified org-scoped.
 */
const schema = z.object({ lead_id: z.string().min(1).max(100) });

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function POST(req: Request) {
  const cors = corsHeaders();
  const auth = await resolveExtensionAuth(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: cors });

  const rl = rateLimit(`ext-draft:${auth.tokenKey}`, { limit: 20, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429, headers: { ...cors, "Retry-After": "60" } });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400, headers: cors });

  const { store, orgId } = auth;
  const lead = await store.getLead(orgId, parsed.data.lead_id);
  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404, headers: cors });

  const org = await store.getOrganizationById(orgId);
  const sub = await store.getSubscription(orgId);
  const { draft, limitReached, error } = await generateReplyForLead(store, orgId, sub.plan, lead.id, org?.reply_tone);

  if (limitReached) return NextResponse.json({ error: "Monthly reply-draft limit reached." }, { status: 402, headers: cors });
  if (error || !draft) return NextResponse.json({ error: error ?? "Draft failed" }, { status: 500, headers: cors });

  return NextResponse.json(
    {
      draft_text: draft.draft_text,
      disclosure: draft.suggested_disclosure,
      safety_notes: draft.safety_notes,
      why: draft.why_this_reply,
      disclaimer: COPY_DISCLAIMER,
    },
    { headers: cors },
  );
}
