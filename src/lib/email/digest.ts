import { env, isResendConfigured } from "@/lib/env";
import type { LeadCandidate } from "@/lib/types";
import { scoreTier } from "@/lib/scoring/score";

export interface DigestData {
  subject: string;
  orgName: string;
  leads: Array<{
    title: string;
    source: string;
    score: number;
    tier: string;
    reason: string;
    suggested_angle: string;
    url: string | null;
  }>;
  dashboardUrl: string;
}

/**
 * Build a daily-digest payload from the top leads. Intentionally includes ONLY
 * public post title/link/excerpt + AI analysis — never extra personal data.
 */
export function buildDigest(orgName: string, leads: LeadCandidate[]): DigestData {
  return {
    subject: "Your top 5 lead opportunities today",
    orgName,
    dashboardUrl: `${env.appUrl}/app/leads`,
    leads: leads.slice(0, 5).map((l) => ({
      title: l.title ?? "(untitled post)",
      source: l.source_type,
      score: l.overall_score,
      tier: scoreTier(l.overall_score),
      reason: l.reason ?? "",
      suggested_angle: l.suggested_angle ?? "",
      url: l.url,
    })),
  };
}

// Crest palette — inline hex (email clients can't read CSS custom properties).
// token: --ink #1C1B17 · --ink-2 #4A463C · --ink-3 #6F6A5C · --ink-4 #9A9483
//        --line #DEDACE · --accent #2E5E45 · --paper #F4F1E9 · --on-accent #F4F1E9
export function renderDigestHtml(d: DigestData): string {
  const rows = d.leads
    .map(
      (l) => `
      <tr><td style="padding:12px 0;border-bottom:1px solid #DEDACE;">
        <div style="font-weight:600;color:#1C1B17;">${escapeHtml(l.title)}</div>
        <div style="font-size:12px;color:#6F6A5C;margin:2px 0;">${escapeHtml(l.source)} · score ${l.score} (${l.tier})</div>
        <div style="font-size:13px;color:#4A463C;">${escapeHtml(l.reason)}</div>
        <div style="font-size:13px;color:#2E5E45;margin-top:4px;">Angle: ${escapeHtml(l.suggested_angle)}</div>
        ${l.url ? `<a href="${escapeHtml(l.url)}" style="font-size:12px;color:#2E5E45;">View post →</a>` : ""}
      </td></tr>`,
    )
    .join("");

  return `<div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;background:#F4F1E9;padding:24px;">
    <h2 style="color:#1C1B17;">${escapeHtml(d.subject)}</h2>
    <p style="color:#6F6A5C;font-size:14px;">Top opportunities for ${escapeHtml(d.orgName)}.</p>
    <table style="width:100%;border-collapse:collapse;">${rows}</table>
    <p style="margin-top:16px;"><a href="${escapeHtml(d.dashboardUrl)}" style="background:#2E5E45;color:#F4F1E9;padding:10px 16px;border-radius:0;text-decoration:none;font-size:14px;">Open dashboard</a></p>
    <p style="color:#9A9483;font-size:11px;margin-top:24px;">The Leads Nest helps you discover public conversations and draft replies. You are responsible for following each platform's rules before responding. You're receiving this because daily digests are enabled.</p>
  </div>`;
}

export interface SendResult {
  sent: boolean;
  previewOnly: boolean;
  error?: string;
}

/** Send the digest via Resend, or report preview-only when not configured. */
export async function sendDigest(to: string, d: DigestData): Promise<SendResult> {
  if (!isResendConfigured()) {
    return { sent: false, previewOnly: true };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.digestFromEmail,
        to,
        subject: d.subject,
        html: renderDigestHtml(d),
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return { sent: false, previewOnly: false, error: `Resend ${res.status}: ${detail.slice(0, 200)}` };
    }
    return { sent: true, previewOnly: false };
  } catch (err) {
    return { sent: false, previewOnly: false, error: err instanceof Error ? err.message : "send failed" };
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
