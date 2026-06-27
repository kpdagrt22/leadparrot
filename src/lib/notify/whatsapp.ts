import { env, isWhatsAppConfigured } from "@/lib/env";
import type { ChannelAdapter, NotifyPayload, SendOutcome } from "./types";
import { twilioSend } from "./sms";

/**
 * WhatsApp via Twilio WhatsApp OR Meta Cloud API. `to` is the account owner's
 * verified number.
 *
 * NOTE: Meta business-initiated messages outside the 24h customer-service window
 * require a PRE-APPROVED template. The free-text path below works inside an open
 * session (and Twilio's sandbox); for production template sends, set
 * WHATSAPP_TEMPLATE_NAMESPACE and switch metaSend() to a template payload.
 */
export const whatsappAdapter: ChannelAdapter = {
  channel: "whatsapp",
  isConfigured: () => isWhatsAppConfigured(),
  async send(to, payload) {
    if (!isWhatsAppConfigured()) return { ok: false, detail: "not configured" };
    if (env.twilioWhatsappFrom && env.twilioAccountSid) {
      return twilioSend({ from: env.twilioWhatsappFrom, to: `whatsapp:${to}`, body: payload.text });
    }
    return metaSend(to, payload);
  },
};

async function metaSend(to: string, payload: NotifyPayload): Promise<SendOutcome> {
  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${env.whatsappPhoneNumberId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${env.whatsappToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: to.replace(/[^0-9]/g, ""),
        type: "text",
        text: { body: payload.text },
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return { ok: false, detail: `meta ${res.status}: ${detail.slice(0, 160)}` };
    }
    return { ok: true, detail: "meta" };
  } catch (err) {
    return { ok: false, detail: err instanceof Error ? err.message : "whatsapp send failed" };
  }
}
