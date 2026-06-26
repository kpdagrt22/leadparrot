import { redirect } from "next/navigation";
import { getSessionUser, getContext } from "@/lib/auth";
import { completeOnboardingAction } from "@/lib/actions";
import { SafetyNotice } from "@/components/ui";

const BUSINESS_TYPES = [
  { value: "saas", label: "SaaS" },
  { value: "agency", label: "Agency" },
  { value: "consultant", label: "Consultant" },
  { value: "local_service", label: "Local service" },
  { value: "ecommerce", label: "Ecommerce" },
  { value: "other", label: "Other" },
];
const TONES = ["helpful", "expert", "casual", "founder-like", "professional"];

export default async function OnboardingPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const ctx = await getContext();
  if (ctx) redirect("/app");

  return (
    <div className="min-h-screen bg-paper py-10">
      <div className="mx-auto max-w-2xl px-4">
        <div className="mb-6 text-center">
          <h1 className="font-display text-3xl font-light tracking-tightest text-ink">Welcome to The Leads Nest</h1>
          <p className="mt-2 text-sm text-ink-3">Tell us about your business so we can find the right conversations.</p>
        </div>

        <form action={completeOnboardingAction} className="card space-y-6 p-6">
          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-ink-800">About you</legend>
            <Field name="full_name" label="Your name" defaultValue={user.full_name ?? ""} placeholder="Jane Founder" />
            <Field name="business_name" label="Business name" required placeholder="Acme Proposals" />
            <Field name="website" label="Website" placeholder="https://acme.com" />
            <div>
              <label className="label" htmlFor="business_type">Business type</label>
              <select id="business_type" name="business_type" className="input" defaultValue="saas">
                {BUSINESS_TYPES.map((b) => (
                  <option key={b.value} value={b.value}>{b.label}</option>
                ))}
              </select>
            </div>
            <Field name="description" label="What do you sell?" textarea placeholder="AI proposal generator for freelancers." />
            <Field name="target_geography" label="Target geography" placeholder="US, Canada, UK" />
          </fieldset>

          <fieldset className="space-y-4 border-t border-ink-100 pt-5">
            <legend className="text-sm font-semibold text-ink-800">Your first project (optional)</legend>
            <p className="text-xs text-ink-500">Fill this in to start finding leads immediately. You can add more later.</p>
            <Field name="project_name" label="Project name" placeholder="Proposal tool — Reddit + HN" />
            <Field name="product_description" label="Product / service description" textarea placeholder="AI proposal generator for freelancers with templates and e-signatures." />
            <Field name="ideal_customer_profile" label="Ideal customer profile" placeholder="Freelancers sending 5+ proposals/month" />
            <Field name="competitors" label="Competitors" placeholder="PandaDoc, Proposify" hint="Comma separated" />
            <Field name="keywords" label="Keywords" placeholder="proposal tool, client proposal, freelance proposal" hint="Comma separated" />
            <Field name="negative_keywords" label="Negative keywords" placeholder="marriage proposal, research proposal" hint="Comma separated" />
          </fieldset>

          <fieldset className="space-y-4 border-t border-ink-100 pt-5">
            <legend className="text-sm font-semibold text-ink-800">Preferences</legend>
            <div>
              <label className="label" htmlFor="reply_tone">Reply tone</label>
              <select id="reply_tone" name="reply_tone" className="input" defaultValue="helpful">
                {TONES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <Field name="notification_email" label="Notification email" defaultValue={user.email ?? ""} />
            <label className="flex items-center gap-2 text-sm text-ink-700">
              <input type="checkbox" name="daily_digest" defaultChecked className="h-4 w-4 rounded border-ink-300" />
              Send me a daily digest of top leads
            </label>
          </fieldset>

          <SafetyNotice />

          <button type="submit" className="btn-primary w-full">Create my workspace</button>
        </form>
      </div>
    </div>
  );
}

function Field({
  name,
  label,
  placeholder,
  hint,
  textarea,
  required,
  defaultValue,
}: {
  name: string;
  label: string;
  placeholder?: string;
  hint?: string;
  textarea?: boolean;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <div>
      <label className="label" htmlFor={name}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {textarea ? (
        <textarea id={name} name={name} className="input min-h-[80px]" placeholder={placeholder} defaultValue={defaultValue} required={required} />
      ) : (
        <input id={name} name={name} className="input" placeholder={placeholder} defaultValue={defaultValue} required={required} />
      )}
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}
