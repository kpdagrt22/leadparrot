"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireContext, getSessionUser } from "@/lib/auth";
import { getStore } from "@/lib/db";
import { parseList } from "@/lib/utils";
import { runSourceScan, scoreManualPost, generateReplyForLead } from "@/lib/scan";
import { checkUsage } from "@/lib/usage/limits";
import {
  AuthorizationError,
  assertLeadBelongsToOrg,
  assertReplyDraftBelongsToOrg,
} from "@/lib/auth/organizations";
import { notify, testPayload, type NotifyChannel } from "@/lib/notify";
import { generateApiToken } from "@/lib/extension/token";
import type { BusinessType, LeadStatus, ReplyTone, SourceType } from "@/lib/types";

export interface ActionResult {
  ok: boolean;
  message?: string;
  redirectTo?: string;
}

// ---------------------------------------------------------------------------
// Onboarding — create the organization (and optionally a first project).
// ---------------------------------------------------------------------------
export async function completeOnboardingAction(formData: FormData): Promise<void> {
  const store = await getStore();
  const su = await getSessionUser();
  if (!su) redirect("/login");

  await store.upsertProfile({
    id: su.id,
    full_name: str(formData.get("full_name")) ?? su.full_name,
    email: su.email,
  });

  const org = await store.createOrganization({
    owner_id: su.id,
    name: str(formData.get("business_name")) ?? "My business",
    website: str(formData.get("website")) ?? null,
    business_type: (str(formData.get("business_type")) as BusinessType) ?? "other",
    description: str(formData.get("description")) ?? null,
    target_geography: str(formData.get("target_geography")) ?? null,
    reply_tone: (str(formData.get("reply_tone")) as ReplyTone) ?? "helpful",
    notification_email: str(formData.get("notification_email")) ?? su.email,
    daily_digest_enabled: formData.get("daily_digest") === "on",
  });

  // Optionally seed the first project from onboarding fields.
  const productDescription = str(formData.get("product_description"));
  if (productDescription) {
    await store.createProject(org.id, {
      name: str(formData.get("project_name")) ?? "My first project",
      product_description: productDescription,
      ideal_customer_profile: str(formData.get("ideal_customer_profile")) ?? null,
      competitors: parseList(str(formData.get("competitors"))),
      keywords: parseList(str(formData.get("keywords"))),
      negative_keywords: parseList(str(formData.get("negative_keywords"))),
      target_geography: str(formData.get("target_geography")) ?? null,
    });
  }

  revalidatePath("/app");
  redirect("/app");
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------
export async function createProjectAction(formData: FormData): Promise<void> {
  const ctx = await requireContext();
  const store = await getStore();

  const usage = await store.getUsageSnapshot(ctx.organization.id);
  const check = checkUsage(ctx.subscription.plan, "projects", usage);
  if (!check.allowed) {
    redirect(`/app/projects/new?error=${encodeURIComponent(check.reason ?? "Project limit reached")}`);
  }

  const project = await store.createProject(ctx.organization.id, {
    name: str(formData.get("name")) ?? "Untitled project",
    product_description: str(formData.get("product_description")) ?? "",
    ideal_customer_profile: str(formData.get("ideal_customer_profile")) ?? null,
    competitors: parseList(str(formData.get("competitors"))),
    keywords: parseList(str(formData.get("keywords"))),
    negative_keywords: parseList(str(formData.get("negative_keywords"))),
    target_geography: str(formData.get("target_geography")) ?? null,
  });

  // Always create a manual source so the project is immediately usable.
  await store.createSource(ctx.organization.id, {
    project_id: project.id,
    source_type: "manual",
    name: "Manual posts",
  });

  revalidatePath("/app/projects");
  redirect(`/app/projects/${project.id}`);
}

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------
export async function addSourceAction(formData: FormData): Promise<void> {
  const ctx = await requireContext();
  const store = await getStore();
  const projectId = str(formData.get("project_id"));
  if (!projectId) redirect("/app/projects");

  const sourceType = (str(formData.get("source_type")) as SourceType) ?? "manual";
  const config: Record<string, unknown> = {};
  if (sourceType === "reddit") {
    config.subreddits = str(formData.get("subreddits")) ?? "";
    config.sort = str(formData.get("sort")) ?? "new";
    config.time_window = str(formData.get("time_window")) ?? "week";
    config.keywords = str(formData.get("source_keywords")) ?? "";
  } else if (sourceType === "hackernews") {
    config.query = str(formData.get("query")) ?? "";
  }

  await store.createSource(ctx.organization.id, {
    project_id: projectId,
    source_type: sourceType,
    name: str(formData.get("name")) ?? null,
    url: str(formData.get("url")) ?? null,
    identifier: str(formData.get("identifier")) ?? str(formData.get("subreddits")) ?? null,
    config,
  });

  revalidatePath(`/app/projects/${projectId}/sources`);
  redirect(`/app/projects/${projectId}/sources`);
}

export async function runScanAction(sourceId: string): Promise<ActionResult> {
  const ctx = await requireContext();
  const store = await getStore();
  const source = await store.getSource(ctx.organization.id, sourceId);
  if (!source) return { ok: false, message: "Source not found" };
  const project = await store.getProject(ctx.organization.id, source.project_id);
  if (!project) return { ok: false, message: "Project not found" };

  const result = await runSourceScan(store, ctx.organization.id, ctx.subscription.plan, source, project);

  revalidatePath(`/app/projects/${project.id}/sources`);
  revalidatePath("/app/leads");
  revalidatePath("/app");

  if (result.error) return { ok: false, message: result.error };
  const parts = [`Scanned ${result.fetched} posts`, `${result.leadsCreated} new leads`];
  if (result.limitReached) parts.push("monthly scan limit reached");
  if (result.usedMock) parts.push("(demo data)");
  return { ok: true, message: parts.join(" · ") };
}

/**
 * Progressive-enhancement variant of addManualPostAction for `useActionState`:
 * works before hydration (native POST to the server action), redirects to the
 * new lead on success, and returns a result for inline feedback otherwise.
 */
export async function scoreManualPostFormAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const ctx = await requireContext();
  const store = await getStore();
  const projectId = str(formData.get("project_id"));
  if (!projectId) return { ok: false, message: "Missing project" };
  const project = await store.getProject(ctx.organization.id, projectId);
  if (!project) return { ok: false, message: "Project not found" };

  const sources = await store.listSources(ctx.organization.id, projectId);
  const manual = sources.find((s) => s.source_type === "manual");

  const { lead, limitReached, error } = await scoreManualPost(
    store,
    ctx.organization.id,
    ctx.subscription.plan,
    project,
    manual?.id ?? null,
    {
      title: str(formData.get("title")),
      body: str(formData.get("body")),
      url: str(formData.get("url")),
    },
  );

  revalidatePath("/app/leads");
  revalidatePath("/app");
  if (limitReached) return { ok: false, message: "Monthly scan limit reached. Upgrade to scan more posts." };
  if (error) return { ok: false, message: error };
  if (lead) redirect(`/app/leads/${lead.id}`);
  return { ok: true, message: "Post scored." };
}

export async function addManualPostAction(formData: FormData): Promise<ActionResult> {
  const ctx = await requireContext();
  const store = await getStore();
  const projectId = str(formData.get("project_id"));
  if (!projectId) return { ok: false, message: "Missing project" };
  const project = await store.getProject(ctx.organization.id, projectId);
  if (!project) return { ok: false, message: "Project not found" };

  const sources = await store.listSources(ctx.organization.id, projectId);
  const manual = sources.find((s) => s.source_type === "manual");

  const { lead, limitReached, error } = await scoreManualPost(
    store,
    ctx.organization.id,
    ctx.subscription.plan,
    project,
    manual?.id ?? null,
    {
      title: str(formData.get("title")),
      body: str(formData.get("body")),
      url: str(formData.get("url")),
    },
  );

  revalidatePath("/app/leads");
  revalidatePath("/app");
  if (limitReached) return { ok: false, message: "Monthly scan limit reached. Upgrade to scan more posts." };
  if (error) return { ok: false, message: error };
  return { ok: true, message: "Post scored.", redirectTo: lead ? `/app/leads/${lead.id}` : undefined };
}

// ---------------------------------------------------------------------------
// Leads + replies
// ---------------------------------------------------------------------------
export async function generateReplyAction(leadId: string): Promise<ActionResult> {
  const ctx = await requireContext();
  const store = await getStore();
  try {
    await assertLeadBelongsToOrg(leadId, ctx.organization.id);
  } catch (e) {
    if (e instanceof AuthorizationError) return { ok: false, message: "Not authorized for this lead." };
    throw e;
  }
  const { limitReached, error } = await generateReplyForLead(
    store,
    ctx.organization.id,
    ctx.subscription.plan,
    leadId,
    ctx.organization.reply_tone,
  );
  revalidatePath(`/app/leads/${leadId}`);
  if (limitReached) return { ok: false, message: "Monthly reply-draft limit reached. Upgrade for more." };
  if (error) return { ok: false, message: error };
  return { ok: true, message: "Reply draft generated." };
}

export async function copyReplyAction(replyId: string): Promise<ActionResult> {
  const ctx = await requireContext();
  const store = await getStore();
  try {
    await assertReplyDraftBelongsToOrg(replyId, ctx.organization.id);
  } catch (e) {
    if (e instanceof AuthorizationError) return { ok: false, message: "Not authorized for this reply." };
    throw e;
  }
  await store.markReplyCopied(ctx.organization.id, replyId);
  revalidatePath("/app");
  return { ok: true, message: "Marked as copied." };
}

export async function saveLeadAction(leadId: string, notes?: string): Promise<ActionResult> {
  const ctx = await requireContext();
  const store = await getStore();
  try {
    await assertLeadBelongsToOrg(leadId, ctx.organization.id);
  } catch (e) {
    if (e instanceof AuthorizationError) return { ok: false, message: "Not authorized for this lead." };
    throw e;
  }
  await store.saveLead(ctx.organization.id, leadId, notes);
  revalidatePath(`/app/leads/${leadId}`);
  revalidatePath("/app/leads");
  return { ok: true, message: "Lead saved." };
}

export async function updateLeadStatusAction(leadId: string, status: string): Promise<ActionResult> {
  const ctx = await requireContext();
  const store = await getStore();
  try {
    await assertLeadBelongsToOrg(leadId, ctx.organization.id);
  } catch (e) {
    if (e instanceof AuthorizationError) return { ok: false, message: "Not authorized for this lead." };
    throw e;
  }
  await store.updateLeadStatus(ctx.organization.id, leadId, status as LeadStatus);
  revalidatePath(`/app/leads/${leadId}`);
  revalidatePath("/app/leads");
  return { ok: true, message: "Status updated." };
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------
export async function updateSettingsAction(formData: FormData): Promise<void> {
  const ctx = await requireContext();
  const store = await getStore();
  const org = ctx.organization;

  const newEmail = str(formData.get("notification_email")) ?? null;
  const newPhone = str(formData.get("notify_phone")) ?? null;
  const emailChanged = (newEmail ?? "") !== (org.notification_email ?? "");
  const phoneChanged = (newPhone ?? "") !== (org.notify_phone ?? "");

  await store.updateOrganization(org.id, {
    name: str(formData.get("name")) ?? org.name,
    website: str(formData.get("website")) ?? null,
    reply_tone: (str(formData.get("reply_tone")) as ReplyTone) ?? org.reply_tone,
    notification_email: newEmail,
    target_geography: str(formData.get("target_geography")) ?? null,
    daily_digest_enabled: formData.get("daily_digest") === "on",
    // Alert channels (owner-only). Changing the address/number resets its
    // verified flag so the owner re-confirms before it can go live.
    notify_email_enabled: formData.get("notify_email_enabled") === "on",
    notify_sms_enabled: formData.get("notify_sms_enabled") === "on",
    notify_whatsapp_enabled: formData.get("notify_whatsapp_enabled") === "on",
    notify_phone: newPhone,
    ...(emailChanged ? { notify_email_verified: false } : {}),
    ...(phoneChanged ? { notify_phone_verified: false } : {}),
    high_intent_threshold: clampInt(formData.get("high_intent_threshold"), org.high_intent_threshold, 0, 100),
    digest_hour: clampInt(formData.get("digest_hour"), org.digest_hour, 0, 23),
    quiet_hours_start: optHour(formData.get("quiet_hours_start")),
    quiet_hours_end: optHour(formData.get("quiet_hours_end")),
  });
  revalidatePath("/app/settings");
}

/**
 * Send a test alert to the owner's own address/number for one channel. On a real
 * send this also marks the channel verified. Owner-only by construction —
 * notify() resolves the recipient from org settings, never from lead data.
 */
export async function sendTestAlertAction(channel: NotifyChannel): Promise<ActionResult> {
  const ctx = await requireContext();
  const store = await getStore();
  const org = ctx.organization;
  const to = channel === "email" ? org.notification_email : org.notify_phone;
  if (!to) {
    return { ok: false, message: channel === "email" ? "Add your notification email and save first." : "Add your phone number and save first." };
  }
  const results = await notify(store, org.id, "test", testPayload(org.name), { channels: [channel] });
  const r = results[0];
  if (r?.status === "sent") {
    await store.updateOrganization(org.id, channel === "email" ? { notify_email_verified: true } : { notify_phone_verified: true });
    revalidatePath("/app/settings");
    return { ok: true, message: "Test sent — channel verified." };
  }
  if (r?.status === "preview") {
    return { ok: false, message: "This channel isn't configured on the server yet (preview only). Add its keys to send for real." };
  }
  return { ok: false, message: "Couldn't send a test on this channel. Check that it's configured and your address/number is correct." };
}

function clampInt(v: FormDataEntryValue | null, fallback: number, min: number, max: number): number {
  const n = typeof v === "string" ? parseInt(v, 10) : NaN;
  return Number.isNaN(n) ? fallback : Math.max(min, Math.min(max, n));
}

function optHour(v: FormDataEntryValue | null): number | null {
  if (typeof v !== "string" || v.trim() === "") return null;
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? null : Math.max(0, Math.min(23, n));
}

// ---------------------------------------------------------------------------
// Browser-extension API tokens (per-user, revocable, hashed)
// ---------------------------------------------------------------------------
export async function createExtensionTokenAction(): Promise<{ ok: boolean; token?: string; message?: string }> {
  const ctx = await requireContext();
  const store = await getStore();
  const { token, hash, prefix } = generateApiToken();
  await store.createApiToken(ctx.organization.id, {
    user_id: ctx.user.id,
    name: "Browser extension",
    token_hash: hash,
    token_prefix: prefix,
  });
  revalidatePath("/app/settings");
  // The plaintext is returned ONCE here and never stored.
  return { ok: true, token };
}

export async function revokeExtensionTokenAction(tokenId: string): Promise<ActionResult> {
  const ctx = await requireContext();
  const store = await getStore();
  await store.revokeApiToken(ctx.organization.id, tokenId);
  revalidatePath("/app/settings");
  return { ok: true, message: "Token revoked." };
}

function str(v: FormDataEntryValue | null): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length ? t : undefined;
}
