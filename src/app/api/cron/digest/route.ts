import { NextResponse } from "next/server";
import { env, isResendConfigured } from "@/lib/env";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { buildDigest, renderDigestHtml } from "@/lib/email/digest";
import { emailAdapter } from "@/lib/notify";
import { captureError } from "@/lib/observability";
import type { LeadCandidate, Organization } from "@/lib/types";

export const dynamic = "force-dynamic";

/** Start of the current UTC day, used for once-per-day idempotency. */
function startOfTodayIso(): string {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

/**
 * Daily digest sender. Intended to be invoked once per day by a scheduler
 * (Vercel Cron — see vercel.json). Authenticated with CRON_SECRET.
 *
 * Idempotent: an organization that already has a digest_emails row for the
 * current UTC day is skipped, so an accidental re-run never double-sends.
 *
 * Safe by construction: refuses to run without CRON_SECRET, no-ops cleanly when
 * the Supabase service role is unconfigured (demo / local), and records a
 * "preview" row (without sending) when Resend is not configured.
 */
export async function GET(req: Request) {
  return run(req);
}

export async function POST(req: Request) {
  return run(req);
}

async function run(req: Request) {
  if (!env.cronSecret) {
    return NextResponse.json({ ran: false, reason: "CRON_SECRET not configured" }, { status: 503 });
  }
  if (req.headers.get("authorization") !== `Bearer ${env.cronSecret}`) {
    return NextResponse.json({ ran: false, reason: "Unauthorized" }, { status: 401 });
  }

  const sb = createAdminSupabase();
  if (!sb) {
    return NextResponse.json({ ran: false, reason: "Supabase service role not configured" });
  }

  const since = startOfTodayIso();
  const summary = { ran: true, processed: 0, sent: 0, previews: 0, skipped: 0, errors: 0 };

  try {
    const { data: orgs, error } = await sb
      .from("organizations")
      .select("*")
      .eq("daily_digest_enabled", true)
      .not("notification_email", "is", null);
    if (error) throw error;

    for (const org of (orgs as Organization[]) ?? []) {
      try {
        // Idempotency: skip orgs that already received a digest today.
        const { count } = await sb
          .from("digest_emails")
          .select("id", { count: "exact", head: true })
          .eq("organization_id", org.id)
          .gte("created_at", since);
        if ((count ?? 0) > 0) {
          summary.skipped += 1;
          continue;
        }

        const { data: leads } = await sb
          .from("lead_candidates")
          .select("*")
          .eq("organization_id", org.id)
          .order("overall_score", { ascending: false })
          .limit(5);
        const top = (leads as LeadCandidate[]) ?? [];
        if (top.length === 0) {
          summary.skipped += 1;
          continue;
        }

        const digest = buildDigest(org.name, top);
        const to = org.notification_email as string;
        // Deliver through the notify email adapter (SMTP → Resend → console).
        const result = await emailAdapter.send(to, {
          subject: digest.subject,
          text: `Your top ${top.length} lead opportunities for ${org.name}. Open ${digest.dashboardUrl}`,
          html: renderDigestHtml(digest),
        });
        const status = result.ok ? (result.preview ? "preview" : "sent") : "error";

        await sb.from("digest_emails").insert({
          organization_id: org.id,
          subject: digest.subject,
          sent_to: to,
          lead_count: top.length,
          status,
          sent_at: status === "sent" ? new Date().toISOString() : null,
        });

        summary.processed += 1;
        if (status === "sent") summary.sent += 1;
        else if (status === "preview") summary.previews += 1;
        else summary.errors += 1;
      } catch (err) {
        summary.errors += 1;
        captureError(err, { scope: "cron-digest", orgId: org.id });
      }
    }
  } catch (err) {
    captureError(err, { scope: "cron-digest" });
    return NextResponse.json({ ran: false, reason: "digest run failed" }, { status: 500 });
  }

  return NextResponse.json({ ...summary, resendConfigured: isResendConfigured() });
}
