---
name: notification-channels
description: Add or wire account-owner alert channels for The Leads Nest — Email (SMTP or Resend), SMS (Twilio), and WhatsApp (Twilio or Meta Cloud API) — for new-high-intent-lead and daily-digest alerts. Use for "set up SMTP/email", "SMS alerts", "WhatsApp alerts", notification settings, or the notify() dispatcher. Enforces that alerts go ONLY to the account owner, never to leads.
user-invocable: true
---

# Notification channels (account-owner alerts)

Alerts tell the **founder** about **their own** new leads and digests. They are a
notification system, not an outreach system.

## The one rule that keeps this platform-safe
> **Every alert is sent to the account owner's own verified address/number,
> about their own leads. A notification is NEVER sent to a prospect, a lead, or
> any third party.** Recipient contact info comes only from the org's own
> settings — never from lead/scraped data. This is what keeps the no-auto-DM
> boundary intact. The `platform-safety-audit` skill checks it.

## Architecture (follow the existing provider-abstraction pattern)
Build a unified dispatcher, mock-first and degrade-safe like the AI layer:

```
src/lib/notify/
  types.ts        # NotifyEvent, NotifyPayload, Channel, ChannelAdapter
  index.ts        # notify(orgId, event, payload): reads org prefs + enabled
                  #   channels, fans out to adapters, records a notify log,
                  #   swallows per-channel failures (one channel down ≠ all down)
  email.ts        # email adapter: provider = smtp | resend | console(dev)
  sms.ts          # sms adapter: Twilio (account-owner number, verified)
  whatsapp.ts     # whatsapp adapter: Twilio WhatsApp or Meta Cloud API (templates)
```
- Each adapter exposes `isConfigured()` and `send(to, message)`. If
  `!isConfigured()`, the channel is **disabled with a setup note** — never throws.
- `notify()` is called from the digest cron and from the scan pipeline when a new
  **high-intent** lead is created (respect the org's threshold + quiet hours +
  per-channel on/off + dedupe so the user isn't spammed).
- Add feature-detectors to `src/lib/env.ts`: `isSmtpConfigured()`,
  `isResendConfigured()` (exists), `isTwilioSmsConfigured()`,
  `isWhatsAppConfigured()`. Default email provider: `smtp` if configured, else
  `resend` if configured, else `console` (dev) / in-app preview.

## Env vars to add (placeholders in `.env.example`, read via `src/lib/env.ts`)
```
# Email — SMTP (nodemailer). Preferred when set; falls back to Resend, then console.
EMAIL_PROVIDER=          # smtp | resend | console (default: auto-detect)
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false        # true for 465
SMTP_USER=
SMTP_PASS=
SMTP_FROM=The Leads Nest <alerts@yourdomain.com>

# SMS — Twilio (alerts to the account owner's verified phone)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_SMS_FROM=         # +1XXXXXXXXXX

# WhatsApp — Twilio WhatsApp OR Meta Cloud API (use one)
TWILIO_WHATSAPP_FROM=    # whatsapp:+14155238886  (Twilio sandbox/number)
WHATSAPP_TOKEN=          # Meta Cloud API permanent token (alternative)
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_TEMPLATE_NAMESPACE=
```
WhatsApp business-initiated messages require **pre-approved templates** — model
the alert as a template ("You have N new high-intent leads in {{project}}"), not
free text. Document this limitation rather than faking it.

## Settings UI (`/app/settings`)
- Per-channel enable + the owner's address/number, with a **verification step**
  (send a test alert; confirm code for SMS/WhatsApp) before a channel goes live.
- Controls: high-intent threshold, daily-digest on/off + time, quiet hours.
- Persist on the organization (extend `CreateOrganizationInput` /
  `updateOrganization` + a migration + RLS). Keep MemoryStore + SupabaseStore at
  parity so demo mode shows the settings.

## Tests (no real keys)
Unit-test `notify()` routing/dedupe/quiet-hours, each adapter's `isConfigured()`
gating and message formatting (against mocked transports), and that **no adapter
can be invoked with a non-owner recipient**. Then run `release-gate` +
`platform-safety-audit`.
