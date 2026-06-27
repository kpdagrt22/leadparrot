/**
 * Account-owner notification types.
 *
 * SAFETY INVARIANT: every alert is delivered to the ACCOUNT OWNER's own
 * verified email/phone (from their org settings) about THEIR OWN leads. A
 * notification is never sent to a prospect, a lead, or any third party. The
 * recipient is resolved only from org settings (see recipientFor in index.ts) —
 * never from lead/scraped data.
 */

export type NotifyChannel = "email" | "sms" | "whatsapp";
export type NotifyEvent = "new_high_intent_lead" | "daily_digest" | "test";

export interface NotifyPayload {
  /** Short title / email subject. */
  subject: string;
  /** Plain-text body (SMS/WhatsApp; email fallback). */
  text: string;
  /** Optional rich HTML email body. */
  html?: string;
}

export interface SendOutcome {
  ok: boolean;
  /** True when "delivered" only as a dev/console preview (channel not configured). */
  preview?: boolean;
  detail?: string;
}

export interface ChannelAdapter {
  channel: NotifyChannel;
  isConfigured(): boolean;
  /** `to` is ALWAYS the account owner's own address/number — never a lead's. */
  send(to: string, payload: NotifyPayload): Promise<SendOutcome>;
}

export interface NotifyResult {
  channel: NotifyChannel;
  status: "sent" | "skipped" | "error" | "preview";
  detail?: string;
}
