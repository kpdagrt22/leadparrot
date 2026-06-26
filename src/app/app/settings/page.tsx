import { requireContext } from "@/lib/auth";
import { updateSettingsAction } from "@/lib/actions";
import { SectionTitle } from "@/components/ui";
import { isResendConfigured } from "@/lib/env";

const TONES = ["helpful", "expert", "casual", "founder-like", "professional"];

export default async function SettingsPage() {
  const ctx = await requireContext();
  const org = ctx.organization;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Settings</h1>
        <p className="text-sm text-ink-500">Organization preferences and reply tone.</p>
      </div>

      <form action={updateSettingsAction} className="card space-y-5 p-6">
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
        <div>
          <label className="label" htmlFor="notification_email">Notification email</label>
          <input id="notification_email" name="notification_email" type="email" className="input" defaultValue={org.notification_email ?? ""} />
          {!isResendConfigured() && (
            <p className="hint">Email sending isn&apos;t configured — digests show as in-app previews.</p>
          )}
        </div>
        <label className="flex items-center gap-2 text-sm text-ink-700">
          <input type="checkbox" name="daily_digest" defaultChecked={org.daily_digest_enabled} className="h-4 w-4 rounded border-ink-300" />
          Enable daily digest
        </label>

        <button type="submit" className="btn-primary">Save settings</button>
      </form>

      <div className="card p-6">
        <SectionTitle>Data &amp; privacy</SectionTitle>
        <p className="text-sm text-ink-600">
          The Leads Nest stores only the minimum needed: public post title, link, excerpt, and AI analysis. We do not
          collect or store extra personal data about post authors. See the platform-safety and compliance docs in the
          repository for details.
        </p>
      </div>
    </div>
  );
}
