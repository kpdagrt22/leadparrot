import { requireContext } from "@/lib/auth";
import { updateSettingsAction } from "@/lib/actions";
import { SectionTitle } from "@/components/ui";
import { TestAlertButtons } from "@/components/notification-settings";
import {
  isEmailChannelConfigured,
  isTwilioSmsConfigured,
  isWhatsAppConfigured,
} from "@/lib/env";

const TONES = ["helpful", "expert", "casual", "founder-like", "professional"];

function VerifiedBadge({ verified }: { verified: boolean }) {
  return verified ? (
    <span className="badge border-accent-line bg-accent-tint text-accent">Verified</span>
  ) : (
    <span className="badge border-line-2 text-ink-3">Unverified</span>
  );
}

export default async function SettingsPage() {
  const ctx = await requireContext();
  const org = ctx.organization;
  const emailLive = isEmailChannelConfigured();
  const smsLive = isTwilioSmsConfigured();
  const waLive = isWhatsAppConfigured();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-light tracking-tightest text-ink">Settings</h1>
        <p className="text-sm text-ink-3">Organization, reply tone, and account-owner alerts.</p>
      </div>

      <form action={updateSettingsAction} className="card space-y-6 p-6">
        <fieldset className="space-y-4">
          <legend className="font-mono text-2xs font-medium uppercase tracking-caps text-ink-3">Organization</legend>
          <div>
            <label className="label" htmlFor="name">Business name</label>
            <input id="name" name="name" className="input" defaultValue={org.name} />
          </div>
          <div>
            <label className="label" htmlFor="website">Website</label>
            <input id="website" name="website" className="input" defaultValue={org.website ?? ""} placeholder="https://…" />
          </div>
          <div>
            <label className="label" htmlFor="target_geography">Target geography</label>
            <input id="target_geography" name="target_geography" className="input" defaultValue={org.target_geography ?? ""} placeholder="US, Canada, UK" />
          </div>
          <div>
            <label className="label" htmlFor="reply_tone">Default reply tone</label>
            <select id="reply_tone" name="reply_tone" className="input" defaultValue={org.reply_tone}>
              {TONES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <p className="hint">Used when generating reply drafts.</p>
          </div>
        </fieldset>

        <fieldset className="space-y-4 border-t border-line pt-5">
          <legend className="font-mono text-2xs font-medium uppercase tracking-caps text-ink-3">
            Alerts — to you, about your own leads
          </legend>
          <p className="text-xs text-ink-3">
            We alert you about your own new high-intent leads and digests. We never message a lead or anyone else.
          </p>

          {/* Email channel */}
          <div className="space-y-2 border border-line-2 p-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-ink-2">
                <input type="checkbox" name="notify_email_enabled" defaultChecked={org.notify_email_enabled} className="h-4 w-4" />
                Email alerts
              </label>
              <VerifiedBadge verified={org.notify_email_verified} />
            </div>
            <input
              name="notification_email"
              type="email"
              className="input"
              defaultValue={org.notification_email ?? ""}
              placeholder="you@yourdomain.com"
            />
            <p className="hint">{emailLive ? "Email sending is configured on the server." : "Add SMTP or Resend keys to send for real; until then it previews in-app."}</p>
          </div>

          {/* Phone (SMS + WhatsApp share the owner's verified number) */}
          <div className="space-y-2 border border-line-2 p-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-2xs uppercase tracking-mono text-ink-3">Phone (SMS / WhatsApp)</span>
              <VerifiedBadge verified={org.notify_phone_verified} />
            </div>
            <input name="notify_phone" className="input" defaultValue={org.notify_phone ?? ""} placeholder="+1 555 0100" />
            <div className="flex flex-wrap gap-4 pt-1">
              <label className="flex items-center gap-2 text-sm text-ink-2">
                <input type="checkbox" name="notify_sms_enabled" defaultChecked={org.notify_sms_enabled} className="h-4 w-4" />
                SMS alerts
              </label>
              <label className="flex items-center gap-2 text-sm text-ink-2">
                <input type="checkbox" name="notify_whatsapp_enabled" defaultChecked={org.notify_whatsapp_enabled} className="h-4 w-4" />
                WhatsApp alerts
              </label>
            </div>
            <p className="hint">
              {smsLive ? "SMS is configured." : "Add Twilio keys for SMS."} {waLive ? "WhatsApp is configured." : "Add Twilio/Meta keys for WhatsApp."}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="high_intent_threshold">High-intent threshold</label>
              <input id="high_intent_threshold" name="high_intent_threshold" type="number" min={0} max={100} className="input" defaultValue={org.high_intent_threshold} />
              <p className="hint">Alert when a new lead scores at or above this (0–100).</p>
            </div>
            <div>
              <label className="label" htmlFor="digest_hour">Digest hour (UTC)</label>
              <input id="digest_hour" name="digest_hour" type="number" min={0} max={23} className="input" defaultValue={org.digest_hour} />
              <p className="hint">When the daily digest is sent (0–23 UTC).</p>
            </div>
            <div>
              <label className="label" htmlFor="quiet_hours_start">Quiet hours start (UTC)</label>
              <input id="quiet_hours_start" name="quiet_hours_start" type="number" min={0} max={23} className="input" defaultValue={org.quiet_hours_start ?? ""} placeholder="—" />
            </div>
            <div>
              <label className="label" htmlFor="quiet_hours_end">Quiet hours end (UTC)</label>
              <input id="quiet_hours_end" name="quiet_hours_end" type="number" min={0} max={23} className="input" defaultValue={org.quiet_hours_end ?? ""} placeholder="—" />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-ink-2">
            <input type="checkbox" name="daily_digest" defaultChecked={org.daily_digest_enabled} className="h-4 w-4" />
            Send a daily digest of top leads
          </label>
        </fieldset>

        <button type="submit" className="btn-primary">Save settings</button>
      </form>

      <div className="card space-y-3 p-6">
        <SectionTitle subtitle="Save first, then send a test to confirm a channel before it goes live.">Verify your channels</SectionTitle>
        <TestAlertButtons />
      </div>

      <div className="card p-6">
        <SectionTitle>Data &amp; privacy</SectionTitle>
        <p className="text-sm text-ink-2">
          The Leads Nest stores only the minimum needed: public post title, link, excerpt, and AI analysis. We do not
          collect or store extra personal data about post authors, and alerts go only to you — never to a lead.
        </p>
      </div>
    </div>
  );
}
