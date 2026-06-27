import { env, isTwilioSmsConfigured } from "@/lib/env";
import type { ChannelAdapter, SendOutcome } from "./types";

/** SMS via Twilio REST (no SDK). `to` is the account owner's verified number. */
export const smsAdapter: ChannelAdapter = {
  channel: "sms",
  isConfigured: () => isTwilioSmsConfigured(),
  async send(to, payload) {
    if (!isTwilioSmsConfigured()) return { ok: false, detail: "not configured" };
    return twilioSend({ from: env.twilioSmsFrom as string, to, body: payload.text });
  },
};

/** Shared Twilio Messages API call (used by SMS and Twilio-WhatsApp). */
export async function twilioSend(opts: { from: string; to: string; body: string }): Promise<SendOutcome> {
  try {
    const sid = env.twilioAccountSid as string;
    const auth = Buffer.from(`${sid}:${env.twilioAuthToken}`).toString("base64");
    const form = new URLSearchParams({ From: opts.from, To: opts.to, Body: opts.body });
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return { ok: false, detail: `twilio ${res.status}: ${detail.slice(0, 160)}` };
    }
    return { ok: true, detail: "twilio" };
  } catch (err) {
    return { ok: false, detail: err instanceof Error ? err.message : "twilio send failed" };
  }
}
