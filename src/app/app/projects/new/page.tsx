import Link from "next/link";
import { requireContext } from "@/lib/auth";
import { createProjectAction } from "@/lib/actions";
import { SafetyNotice } from "@/components/ui";

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireContext();
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/app/projects" className="text-sm text-ink-500 hover:text-ink-900">← Projects</Link>
        <h1 className="mt-1 text-2xl font-bold text-ink-900">New project</h1>
        <p className="text-sm text-ink-500">Describe what you sell so the AI can score conversations accurately.</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      <form action={createProjectAction} className="card space-y-5 p-6">
        <Field name="name" label="Project name" placeholder="Proposal tool — Reddit + HN" required />
        <Field
          name="product_description"
          label="Product / service description"
          textarea
          required
          placeholder="AI proposal generator for freelancers. Generates client-ready proposals with templates and e-signatures."
          hint="Be specific — this is the strongest signal the AI uses to judge relevance."
        />
        <Field
          name="ideal_customer_profile"
          label="Ideal customer profile"
          textarea
          placeholder="Freelancers and small agencies sending 5+ client proposals per month."
        />
        <Field
          name="competitors"
          label="Competitors"
          placeholder="PandaDoc, Better Proposals, Proposify"
          hint="Comma or newline separated. Posts mentioning these get a competitor-switching boost."
        />
        <Field
          name="keywords"
          label="Keywords"
          textarea
          placeholder="proposal tool, client proposal, Upwork proposal, freelance proposal, proposal software"
          hint="Comma or newline separated. Posts must match at least one keyword to be scored."
        />
        <Field
          name="negative_keywords"
          label="Negative keywords"
          placeholder="school proposal, research proposal, marriage proposal"
          hint="Posts matching any of these are filtered out before scoring."
        />
        <Field name="target_geography" label="Target geography" placeholder="US, Canada, UK" />

        <SafetyNotice>
          The Leads Nest only monitors public/allowed sources and never posts on your behalf. You decide whether to reply.
        </SafetyNotice>

        <div className="flex items-center gap-3">
          <button type="submit" className="btn-primary">Create project</button>
          <Link href="/app/projects" className="btn-ghost">Cancel</Link>
        </div>
      </form>
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
}: {
  name: string;
  label: string;
  placeholder?: string;
  hint?: string;
  textarea?: boolean;
  required?: boolean;
}) {
  return (
    <div>
      <label className="label" htmlFor={name}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {textarea ? (
        <textarea id={name} name={name} className="input min-h-[90px]" placeholder={placeholder} required={required} />
      ) : (
        <input id={name} name={name} className="input" placeholder={placeholder} required={required} />
      )}
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}
