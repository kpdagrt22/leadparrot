import { env, resolvedEmailProvider } from "@/lib/env";
import type { ChannelAdapter, NotifyPayload, SendOutcome } from "./types";

/**
 * Email adapter. Transport resolves to SMTP (nodemailer) → Resend → console
 * preview, per resolvedEmailProvider(). Never throws; returns an outcome.
 */
export const emailAdapter: ChannelAdapter = {
  channel: "email",
  isConfigured() {
    return resolvedEmailProvider() !== "console";
  },
  async send(to, payload) {
    const provider = resolvedEmailProvider();
    if (provider === "smtp") return sendSmtp(to, payload);
    if (provider === "resend") return sendResend(to, payload);
    // eslint-disable-next-line no-console
    console.info(`[notify:email:preview] to=${to} :: ${payload.subject}`);
    return { ok: true, preview: true, detail: "console preview (email not configured)" };
  },
};

async function sendSmtp(to: string, payload: NotifyPayload): Promise<SendOutcome> {
  try {
    // Dynamic import so nodemailer (Node-only) never reaches the client bundle.
    const nodemailer = (await import("nodemailer")).default;
    const transport = nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpSecure,
      auth: env.smtpUser ? { user: env.smtpUser, pass: env.smtpPass } : undefined,
    });
    await transport.sendMail({
      from: env.smtpFrom,
      to,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    });
    return { ok: true, detail: "smtp" };
  } catch {
    return { ok: false, detail: "smtp send failed" };
  }
}

async function sendResend(to: string, payload: NotifyPayload): Promise<SendOutcome> {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.resendApiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: env.smtpFrom,
        to,
        subject: payload.subject,
        html: payload.html ?? payload.text,
        text: payload.text,
      }),
    });
    if (!res.ok) {
      // Do not echo the provider's response body (may contain request details).
      return { ok: false, detail: `resend error ${res.status}` };
    }
    return { ok: true, detail: "resend" };
  } catch {
    return { ok: false, detail: "resend send failed" };
  }
}
