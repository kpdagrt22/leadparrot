import type { DataStore } from "@/lib/db/store";
import type { Project, Source, LeadCandidate, SourceType, ReplyTone } from "@/lib/types";
import { getFetcher } from "@/lib/sources";
import type { FetchedPost } from "@/lib/sources/types";
import { transition } from "@/lib/sources/status";
import { filterPost } from "@/lib/scoring/keywords";
import { computeOverallScore, clampScore, clamp01 } from "@/lib/scoring/score";
import { scoreLead, draftReply } from "@/lib/ai/service";
import { enforceReplySafety } from "@/lib/ai/safety";
import { checkUsage } from "@/lib/usage/limits";
import { truncate } from "@/lib/utils";
import { captureError } from "@/lib/observability";

export interface ScanSummary {
  runId: string | null;
  fetched: number;
  scored: number;
  leadsCreated: number;
  skippedByFilter: number;
  skippedDuplicate: number;
  limitReached: boolean;
  usedMock: boolean;
  note?: string;
  error?: string;
}

/**
 * Run a full scan for one source: fetch → keyword pre-filter → usage check →
 * AI score → persist lead candidate. Status transitions are validated by the
 * source-run state machine so failures are recorded, never swallowed.
 */
export async function runSourceScan(
  store: DataStore,
  orgId: string,
  plan: string,
  source: Source,
  project: Project,
): Promise<ScanSummary> {
  const run = await store.createSourceRun(orgId, project.id, source.id);
  const summary: ScanSummary = {
    runId: run.id,
    fetched: 0,
    scored: 0,
    leadsCreated: 0,
    skippedByFilter: 0,
    skippedDuplicate: 0,
    limitReached: false,
    usedMock: false,
  };

  try {
    await store.updateSourceRun(orgId, run.id, {
      status: transition("pending", "running"),
      started_at: new Date().toISOString(),
    });

    const fetcher = getFetcher(source.source_type);
    const result = await fetcher.fetch({
      config: source.config,
      identifier: source.identifier,
      url: source.url,
      keywords: project.keywords,
      limit: 25,
    });
    summary.usedMock = result.usedMock;
    summary.note = result.note;
    summary.fetched = result.posts.length;

    for (const post of result.posts) {
      // Enforce monthly scan budget before doing any AI work.
      const usage = await store.getUsageSnapshot(orgId);
      const check = checkUsage(plan, "posts_scanned", usage);
      if (!check.allowed) {
        summary.limitReached = true;
        break;
      }

      const text = `${post.title ?? ""}\n${post.body ?? ""}`.trim();
      const filter = filterPost(text, project.keywords, project.negative_keywords);
      if (!filter.passes) {
        summary.skippedByFilter += 1;
        continue;
      }

      const { post: rawPost, created } = await store.upsertRawPost(orgId, {
        project_id: project.id,
        source_id: source.id,
        source_type: source.source_type,
        external_id: post.external_id,
        title: post.title,
        body: post.body,
        author_display: post.author_display,
        url: post.url,
        permalink: post.permalink,
        posted_at: post.posted_at,
        raw_json: post.raw_json,
      });
      if (!created) {
        summary.skippedDuplicate += 1;
        continue;
      }

      await scoreAndPersist(store, orgId, project, source.source_type, rawPost.id, post);
      summary.scored += 1;
      summary.leadsCreated += 1;
    }

    await store.updateSourceRun(orgId, run.id, {
      status: transition("running", "success"),
      finished_at: new Date().toISOString(),
      items_found: summary.leadsCreated,
    });
    await store.updateSource(orgId, source.id, { last_checked_at: new Date().toISOString() });
  } catch (err) {
    summary.error = err instanceof Error ? err.message : String(err);
    captureError(err, { scope: "scan", orgId, projectId: project.id, sourceId: source.id });
    await store.updateSourceRun(orgId, run.id, {
      status: "error",
      finished_at: new Date().toISOString(),
      error_message: summary.error,
    });
  }

  return summary;
}

/** Score a single manually-added post and create a lead candidate. */
export async function scoreManualPost(
  store: DataStore,
  orgId: string,
  plan: string,
  project: Project,
  sourceId: string | null,
  input: { title?: string; body?: string; url?: string; author_display?: string },
): Promise<{ lead: LeadCandidate | null; limitReached: boolean; error?: string }> {
  const usage = await store.getUsageSnapshot(orgId);
  const check = checkUsage(plan, "posts_scanned", usage);
  if (!check.allowed) return { lead: null, limitReached: true };

  const externalId = `manual_${(input.url || input.title || "post").slice(0, 80)}_${Date.now()}`;
  const { post } = await store.upsertRawPost(orgId, {
    project_id: project.id,
    source_id: sourceId,
    source_type: "manual",
    external_id: externalId,
    title: input.title ?? null,
    body: input.body ?? null,
    author_display: input.author_display ?? null,
    url: input.url ?? null,
    permalink: input.url ?? null,
    posted_at: new Date().toISOString(),
    raw_json: { manual: true },
  });

  const lead = await scoreAndPersist(store, orgId, project, "manual", post.id, {
    external_id: externalId,
    source_type: "manual",
    title: input.title,
    body: input.body,
    url: input.url,
    author_display: input.author_display,
  });
  return { lead, limitReached: false };
}

async function scoreAndPersist(
  store: DataStore,
  orgId: string,
  project: Project,
  sourceType: SourceType,
  rawPostId: string,
  post: FetchedPost,
): Promise<LeadCandidate> {
  const input = {
    project: {
      name: project.name,
      product_description: project.product_description,
      ideal_customer_profile: project.ideal_customer_profile,
      competitors: project.competitors,
      keywords: project.keywords,
      negative_keywords: project.negative_keywords,
      target_geography: project.target_geography,
    },
    post: {
      title: post.title,
      body: post.body,
      url: post.url,
      source_type: sourceType,
      author_display: post.author_display,
    },
  };

  const { output, provider, model, status, error } = await scoreLead(input);
  // Canonical overall score is always our weighted model.
  const overall = computeOverallScore(output);

  await store.recordAiLog(orgId, {
    project_id: project.id,
    raw_post_id: rawPostId,
    provider,
    model,
    input_json: { source_type: sourceType, title: post.title },
    output_json: output as unknown as Record<string, unknown>,
    status,
    error_message: error ?? null,
  });
  await store.recordUsageEvent(orgId, "post_scanned", { source_type: sourceType }, project.id);

  return store.createLead(orgId, {
    project_id: project.id,
    raw_post_id: rawPostId,
    title: post.title ?? null,
    body_excerpt: truncate(post.body ?? post.title ?? "", 280),
    url: post.url ?? null,
    source_type: sourceType,
    posted_at: post.posted_at ?? null,
    intent_score: clampScore(output.intent_score),
    relevance_score: clampScore(output.relevance_score),
    urgency_score: clampScore(output.urgency_score),
    fit_score: clampScore(output.fit_score),
    overall_score: overall,
    lead_stage: output.lead_stage,
    reason: output.reason,
    pain_points: output.pain_points,
    buying_signals: output.buying_signals,
    disqualifiers: output.disqualifiers,
    suggested_angle: output.suggested_angle,
    risk_flags: output.risk_flags,
    confidence: clamp01(output.confidence),
  });
}

/** Generate (or regenerate) a reply draft for a lead, enforcing usage limits. */
export async function generateReplyForLead(
  store: DataStore,
  orgId: string,
  plan: string,
  leadId: string,
  toneOverride?: string,
): Promise<{ draft: Awaited<ReturnType<DataStore["createReplyDraft"]>> | null; limitReached: boolean; error?: string }> {
  const lead = await store.getLead(orgId, leadId);
  if (!lead) return { draft: null, limitReached: false, error: "Lead not found" };

  const usage = await store.getUsageSnapshot(orgId);
  const check = checkUsage(plan, "reply_drafts", usage);
  if (!check.allowed) return { draft: null, limitReached: true };

  const project = await store.getProject(orgId, lead.project_id);
  if (!project) return { draft: null, limitReached: false, error: "Project not found" };

  const tone = (toneOverride || "helpful") as ReplyTone;
  const { output, provider, model, status, error } = await draftReply({
    tone,
    project: {
      name: project.name,
      product_description: project.product_description,
      website: null,
    },
    post: {
      title: lead.title,
      body: lead.body_excerpt,
      source_type: lead.source_type,
    },
    lead: {
      reason: lead.reason,
      pain_points: lead.pain_points,
      suggested_angle: lead.suggested_angle,
    },
  });

  // Platform-safety backstop: guarantee an affiliation disclosure + reminder
  // even if a real provider ignored the prompt's instruction to include one.
  const safe = enforceReplySafety(output, project.name);

  await store.recordAiLog(orgId, {
    project_id: project.id,
    raw_post_id: lead.raw_post_id,
    provider,
    model,
    input_json: { kind: "reply", lead_id: leadId },
    output_json: output as unknown as Record<string, unknown>,
    status,
    error_message: error ?? null,
  });
  await store.recordUsageEvent(orgId, "reply_drafted", { lead_id: leadId }, project.id);

  const draft = await store.createReplyDraft(orgId, {
    project_id: project.id,
    lead_candidate_id: leadId,
    draft_text: safe.reply_text,
    tone,
    why_this_reply: safe.why_this_reply,
    suggested_disclosure: safe.suggested_disclosure,
    safety_notes: safe.safety_notes,
    confidence: clamp01(safe.confidence),
  });
  return { draft, limitReached: false };
}
