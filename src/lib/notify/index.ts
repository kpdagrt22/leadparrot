import type { DataStore } from "@/lib/db/store";
import type { Organization } from "@/lib/types";
import { emailAdapter } from "./email";
import { smsAdapter } from "./sms";
import { whatsappAdapter } from "./whatsapp";
import type { ChannelAdapter, NotifyChannel, NotifyEvent, NotifyPayload, NotifyResult } from "./types";

export type { NotifyChannel, NotifyEvent, NotifyPayload, NotifyResult };
export { emailAdapter, smsAdapter, whatsappAdapter };

const ADAPTERS: Record<NotifyChannel, ChannelAdapter> = {
  email: emailAdapter,
  sms: smsAdapter,
  whatsapp: whatsappAdapter,
};

/**
 * Owner-only recipient resolution. Reads ONLY from the org's own settings —
 * email goes to the org notification_email, SMS/WhatsApp to the org notify_phone.
 * No code path here can address a lead/prospect; this is the platform-safety
 * boundary the audit checks.
 */
export function recipientFor(channel: NotifyChannel, org: Organization): string | null {
  if (channel === "email") return org.notification_email;
  return org.notify_phone; // sms + whatsapp → owner's verified phone
}

/** Channels enabled AND verified for lead alerts. */
export function alertChannels(org: Organization): NotifyChannel[] {
  const out: NotifyChannel[] = [];
  if (org.notify_email_enabled && org.notify_email_verified) out.push("email");
  if (org.notify_sms_enabled && org.notify_phone_verified) out.push("sms");
  if (org.notify_whatsapp_enabled && org.notify_phone_verified) out.push("whatsapp");
  return out;
}

/** True when `hourUtc` (0-23) falls within the org's quiet-hours window. */
export function inQuietHours(org: Organization, hourUtc: number): boolean {
  const a = org.quiet_hours_start;
  const b = org.quiet_hours_end;
  if (a == null || b == null || a === b) return false;
  return a < b ? hourUtc >= a && hourUtc < b : hourUtc >= a || hourUtc < b; // wraps midnight
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Compose the "new high-intent lead(s)" alert. */
export function leadAlertPayload(projectName: string, count: number, appUrl: string): NotifyPayload {
  const s = count === 1 ? "" : "s";
  const url = `${appUrl}/app/leads?tier=high`;
  return {
    subject: `${count} new high-intent lead${s} · ${projectName}`,
    text: `The Leads Nest found ${count} new high-intent lead${s} in "${projectName}". Review and reply: ${url}`,
    html: `<div style="font-family:system-ui,sans-serif;max-width:520px">
      <p style="font-size:15px;color:#1C1B17">${count} new high-intent lead${s} in <b>${escapeHtml(projectName)}</b>.</p>
      <p><a href="${url}" style="color:#2E5E45;font-weight:600">Review them in your dashboard →</a></p>
      <p style="color:#6F6A5C;font-size:12px;margin-top:18px">You're receiving this because lead alerts are enabled in your settings. The Leads Nest never posts or messages anyone on your behalf.</p>
    </div>`,
  };
}

/** Compose a short multi-channel digest summary (the rich email is the digest HTML). */
export function digestAlertPayload(orgName: string, leadCount: number, dashboardUrl: string): NotifyPayload {
  return {
    subject: `Your top ${leadCount} lead opportunities today`,
    text: `The Leads Nest: ${leadCount} top opportunities for ${orgName}. Open your dashboard: ${dashboardUrl}`,
  };
}

/** Compose a verification test alert. */
export function testPayload(orgName: string): NotifyPayload {
  return {
    subject: "The Leads Nest — test alert",
    text: `Test alert from The Leads Nest for ${orgName}. If you received this, your alert channel works. We only ever message you about your own leads.`,
  };
}

export interface NotifyOptions {
  /** Override the channel set (used by per-channel test sends). */
  channels?: NotifyChannel[];
  /** Skip if a "sent" for this event happened within N minutes. */
  dedupeWindowMinutes?: number;
  /** Skip when the org is in quiet hours. */
  respectQuietHours?: boolean;
}

/**
 * Fan out an alert to the account owner over their enabled channels. Loads the
 * org for settings + recipient, applies dedupe/quiet-hours, and swallows
 * per-channel failures (one channel down never blocks the others). Records every
 * attempt to the notifications log.
 */
export async function notify(
  store: DataStore,
  orgId: string,
  event: NotifyEvent,
  payload: NotifyPayload,
  opts: NotifyOptions = {},
): Promise<NotifyResult[]> {
  const org = await store.getOrganizationById(orgId);
  if (!org) return [];

  if (opts.dedupeWindowMinutes && opts.dedupeWindowMinutes > 0) {
    const last = await store.getLastNotificationAt(orgId, event);
    if (last && Date.now() - new Date(last).getTime() < opts.dedupeWindowMinutes * 60_000) {
      return [{ channel: "email", status: "skipped", detail: "deduped" }];
    }
  }

  if (opts.respectQuietHours && inQuietHours(org, new Date().getUTCHours())) {
    return [{ channel: "email", status: "skipped", detail: "quiet hours" }];
  }

  const channels = opts.channels ?? alertChannels(org);
  const results: NotifyResult[] = [];

  for (const channel of channels) {
    const to = recipientFor(channel, org);
    const adapter = ADAPTERS[channel];
    if (!to) {
      results.push({ channel, status: "skipped", detail: "no owner recipient set" });
      await store.recordNotification(orgId, { channel, event, status: "skipped", detail: "no recipient" });
      continue;
    }
    if (!adapter.isConfigured()) {
      results.push({ channel, status: "skipped", detail: "channel not configured" });
      await store.recordNotification(orgId, { channel, event, status: "skipped", target: to, detail: "not configured" });
      continue;
    }
    try {
      const r = await adapter.send(to, payload);
      const status: NotifyResult["status"] = r.ok ? (r.preview ? "preview" : "sent") : "error";
      results.push({ channel, status, detail: r.detail });
      await store.recordNotification(orgId, { channel, event, status, target: to, detail: r.detail ?? null });
    } catch (err) {
      const detail = err instanceof Error ? err.message : "send failed";
      results.push({ channel, status: "error", detail });
      await store.recordNotification(orgId, { channel, event, status: "error", target: to, detail });
    }
  }

  return results;
}
