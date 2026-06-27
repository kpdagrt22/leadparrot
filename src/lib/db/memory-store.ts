import { randomUUID } from "node:crypto";
import type {
  Profile,
  Organization,
  Project,
  Source,
  SourceRun,
  RawPost,
  LeadCandidate,
  ReplyDraft,
  SavedLead,
  Subscription,
  LeadStatus,
  UsageEvent,
} from "@/lib/types";
import { scoreTier, isHighIntent } from "@/lib/scoring/score";
import type { UsageSnapshot } from "@/lib/usage/limits";
import { buildSeed, DEMO_ORG_ID } from "@/lib/db/seed";
import type {
  DataStore,
  CreateOrganizationInput,
  CreateProjectInput,
  CreateSourceInput,
  UpsertRawPostInput,
  CreateLeadInput,
  CreateReplyDraftInput,
  LeadFilters,
  DashboardStats,
  AdminStats,
  AiLogInput,
  RecordNotificationInput,
} from "@/lib/db/store";

interface State {
  profiles: Profile[];
  organizations: Organization[];
  projects: Project[];
  sources: Source[];
  sourceRuns: SourceRun[];
  rawPosts: RawPost[];
  leads: LeadCandidate[];
  replyDrafts: ReplyDraft[];
  savedLeads: SavedLead[];
  subscriptions: Subscription[];
  usageEvents: UsageEvent[];
  aiLogs: Array<{ status: string; source_type?: string; created_at: string; organization_id: string }>;
  notifications: Array<{
    organization_id: string;
    channel: string;
    event: string;
    status: string;
    target: string | null;
    detail: string | null;
    created_at: string;
  }>;
}

// Module-level singleton so all requests in a dev/demo session share data.
const g = globalThis as unknown as { __leadparrotMemory?: State };

function freshState(): State {
  const seed = buildSeed();
  return {
    profiles: seed.profiles,
    organizations: seed.organizations,
    projects: seed.projects,
    sources: seed.sources,
    sourceRuns: [],
    rawPosts: seed.rawPosts,
    leads: seed.leads,
    replyDrafts: seed.replyDrafts,
    savedLeads: [],
    subscriptions: seed.subscriptions,
    usageEvents: [],
    aiLogs: [],
    notifications: [],
  };
}

function state(): State {
  if (!g.__leadparrotMemory) g.__leadparrotMemory = freshState();
  return g.__leadparrotMemory;
}

/** Test helper: wipe and reseed. */
export function __resetMemoryStore(): void {
  g.__leadparrotMemory = freshState();
}

const nowIso = () => new Date().toISOString();

export class MemoryStore implements DataStore {
  readonly mode = "memory" as const;

  async getProfile(userId: string): Promise<Profile | null> {
    return state().profiles.find((p) => p.id === userId) ?? null;
  }

  async upsertProfile(input: { id: string; full_name?: string | null; email?: string | null }): Promise<Profile> {
    const s = state();
    let p = s.profiles.find((x) => x.id === input.id);
    if (p) {
      p.full_name = input.full_name ?? p.full_name;
      p.email = input.email ?? p.email;
      p.updated_at = nowIso();
      return p;
    }
    p = {
      id: input.id,
      full_name: input.full_name ?? null,
      email: input.email ?? null,
      created_at: nowIso(),
      updated_at: nowIso(),
    };
    s.profiles.push(p);
    return p;
  }

  async getOrganizationForUser(userId: string): Promise<Organization | null> {
    return state().organizations.find((o) => o.owner_id === userId) ?? null;
  }

  async getOrganizationById(orgId: string): Promise<Organization | null> {
    return state().organizations.find((o) => o.id === orgId) ?? null;
  }

  async createOrganization(input: CreateOrganizationInput): Promise<Organization> {
    const s = state();
    const org: Organization = {
      id: randomUUID(),
      owner_id: input.owner_id,
      name: input.name,
      website: input.website ?? null,
      business_type: input.business_type ?? null,
      description: input.description ?? null,
      target_geography: input.target_geography ?? null,
      reply_tone: input.reply_tone ?? "helpful",
      notification_email: input.notification_email ?? null,
      daily_digest_enabled: input.daily_digest_enabled ?? true,
      notify_email_enabled: input.notify_email_enabled ?? false,
      notify_sms_enabled: input.notify_sms_enabled ?? false,
      notify_whatsapp_enabled: input.notify_whatsapp_enabled ?? false,
      notify_phone: input.notify_phone ?? null,
      notify_email_verified: input.notify_email_verified ?? false,
      notify_phone_verified: input.notify_phone_verified ?? false,
      high_intent_threshold: input.high_intent_threshold ?? 70,
      quiet_hours_start: input.quiet_hours_start ?? null,
      quiet_hours_end: input.quiet_hours_end ?? null,
      digest_hour: input.digest_hour ?? 13,
      created_at: nowIso(),
      updated_at: nowIso(),
    };
    s.organizations.push(org);
    s.subscriptions.push({
      id: randomUUID(),
      organization_id: org.id,
      stripe_customer_id: null,
      stripe_subscription_id: null,
      plan: "free",
      status: "active",
      current_period_end: null,
      created_at: nowIso(),
      updated_at: nowIso(),
    });
    return org;
  }

  async updateOrganization(orgId: string, patch: Partial<CreateOrganizationInput>): Promise<Organization> {
    const org = state().organizations.find((o) => o.id === orgId);
    if (!org) throw new Error("Organization not found");
    Object.assign(org, patch, { updated_at: nowIso() });
    return org;
  }

  async recordNotification(orgId: string, input: RecordNotificationInput): Promise<void> {
    state().notifications.push({
      organization_id: orgId,
      channel: input.channel,
      event: input.event,
      status: input.status,
      target: input.target ?? null,
      detail: input.detail ?? null,
      created_at: nowIso(),
    });
  }

  async getLastNotificationAt(orgId: string, event: string): Promise<string | null> {
    const rows = state()
      .notifications.filter((n) => n.organization_id === orgId && n.event === event && n.status === "sent")
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
    return rows[0]?.created_at ?? null;
  }

  async getSubscription(orgId: string): Promise<Subscription> {
    const sub = state().subscriptions.find((s) => s.organization_id === orgId);
    if (sub) return sub;
    const created: Subscription = {
      id: randomUUID(),
      organization_id: orgId,
      stripe_customer_id: null,
      stripe_subscription_id: null,
      plan: "free",
      status: "active",
      current_period_end: null,
      created_at: nowIso(),
      updated_at: nowIso(),
    };
    state().subscriptions.push(created);
    return created;
  }

  async listProjects(orgId: string): Promise<Project[]> {
    return state()
      .projects.filter((p) => p.organization_id === orgId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  async getProject(orgId: string, projectId: string): Promise<Project | null> {
    return state().projects.find((p) => p.organization_id === orgId && p.id === projectId) ?? null;
  }

  async createProject(orgId: string, input: CreateProjectInput): Promise<Project> {
    const project: Project = {
      id: randomUUID(),
      organization_id: orgId,
      name: input.name,
      product_description: input.product_description,
      ideal_customer_profile: input.ideal_customer_profile ?? null,
      competitors: input.competitors ?? [],
      keywords: input.keywords ?? [],
      negative_keywords: input.negative_keywords ?? [],
      target_geography: input.target_geography ?? null,
      active: true,
      created_at: nowIso(),
      updated_at: nowIso(),
    };
    state().projects.push(project);
    return project;
  }

  async updateProject(
    orgId: string,
    projectId: string,
    patch: Partial<CreateProjectInput> & { active?: boolean },
  ): Promise<Project> {
    const project = state().projects.find((p) => p.organization_id === orgId && p.id === projectId);
    if (!project) throw new Error("Project not found");
    Object.assign(project, patch, { updated_at: nowIso() });
    return project;
  }

  async listSources(orgId: string, projectId: string): Promise<Source[]> {
    return state().sources.filter((s) => s.organization_id === orgId && s.project_id === projectId);
  }

  async getSource(orgId: string, sourceId: string): Promise<Source | null> {
    return state().sources.find((s) => s.organization_id === orgId && s.id === sourceId) ?? null;
  }

  async createSource(orgId: string, input: CreateSourceInput): Promise<Source> {
    const source: Source = {
      id: randomUUID(),
      organization_id: orgId,
      project_id: input.project_id,
      source_type: input.source_type,
      name: input.name ?? null,
      url: input.url ?? null,
      identifier: input.identifier ?? null,
      config: input.config ?? {},
      enabled: input.enabled ?? true,
      last_checked_at: null,
      created_at: nowIso(),
      updated_at: nowIso(),
    };
    state().sources.push(source);
    return source;
  }

  async updateSource(
    orgId: string,
    sourceId: string,
    patch: Partial<CreateSourceInput> & { last_checked_at?: string | null },
  ): Promise<Source> {
    const source = state().sources.find((s) => s.organization_id === orgId && s.id === sourceId);
    if (!source) throw new Error("Source not found");
    Object.assign(source, patch, { updated_at: nowIso() });
    return source;
  }

  async createSourceRun(orgId: string, projectId: string, sourceId: string): Promise<SourceRun> {
    const run: SourceRun = {
      id: randomUUID(),
      organization_id: orgId,
      project_id: projectId,
      source_id: sourceId,
      status: "pending",
      started_at: null,
      finished_at: null,
      items_found: 0,
      error_message: null,
      created_at: nowIso(),
    };
    state().sourceRuns.push(run);
    return run;
  }

  async updateSourceRun(orgId: string, runId: string, patch: Partial<SourceRun>): Promise<SourceRun> {
    const run = state().sourceRuns.find((r) => r.organization_id === orgId && r.id === runId);
    if (!run) throw new Error("Source run not found");
    Object.assign(run, patch);
    return run;
  }

  async listSourceRuns(orgId: string, opts?: { projectId?: string; limit?: number }): Promise<SourceRun[]> {
    let runs = state().sourceRuns.filter((r) => r.organization_id === orgId);
    if (opts?.projectId) runs = runs.filter((r) => r.project_id === opts.projectId);
    runs = runs.sort((a, b) => b.created_at.localeCompare(a.created_at));
    return opts?.limit ? runs.slice(0, opts.limit) : runs;
  }

  async upsertRawPost(orgId: string, input: UpsertRawPostInput): Promise<{ post: RawPost; created: boolean }> {
    const s = state();
    const existing = s.rawPosts.find(
      (p) => p.organization_id === orgId && p.source_type === input.source_type && p.external_id === input.external_id,
    );
    if (existing) return { post: existing, created: false };
    const post: RawPost = {
      id: randomUUID(),
      organization_id: orgId,
      project_id: input.project_id,
      source_id: input.source_id,
      source_type: input.source_type,
      external_id: input.external_id,
      title: input.title ?? null,
      body: input.body ?? null,
      author_display: input.author_display ?? null,
      url: input.url ?? null,
      permalink: input.permalink ?? null,
      posted_at: input.posted_at ?? null,
      raw_json: input.raw_json ?? null,
      created_at: nowIso(),
    };
    s.rawPosts.push(post);
    return { post, created: true };
  }

  async getRawPost(orgId: string, rawPostId: string): Promise<RawPost | null> {
    return state().rawPosts.find((p) => p.organization_id === orgId && p.id === rawPostId) ?? null;
  }

  async createLead(orgId: string, input: CreateLeadInput): Promise<LeadCandidate> {
    const lead: LeadCandidate = {
      id: randomUUID(),
      organization_id: orgId,
      project_id: input.project_id,
      raw_post_id: input.raw_post_id,
      title: input.title ?? null,
      body_excerpt: input.body_excerpt ?? null,
      url: input.url ?? null,
      source_type: input.source_type,
      posted_at: input.posted_at ?? null,
      intent_score: input.intent_score,
      relevance_score: input.relevance_score,
      urgency_score: input.urgency_score,
      fit_score: input.fit_score,
      overall_score: input.overall_score,
      lead_stage: input.lead_stage,
      status: "new",
      reason: input.reason ?? null,
      pain_points: input.pain_points ?? [],
      buying_signals: input.buying_signals ?? [],
      disqualifiers: input.disqualifiers ?? [],
      suggested_angle: input.suggested_angle ?? null,
      risk_flags: input.risk_flags ?? [],
      confidence: input.confidence,
      created_at: nowIso(),
      updated_at: nowIso(),
    };
    state().leads.push(lead);
    return lead;
  }

  async listLeads(orgId: string, filters: LeadFilters = {}): Promise<LeadCandidate[]> {
    let leads = state().leads.filter((l) => l.organization_id === orgId);
    if (filters.project_id) leads = leads.filter((l) => l.project_id === filters.project_id);
    if (filters.source_type) leads = leads.filter((l) => l.source_type === filters.source_type);
    if (filters.lead_stage) leads = leads.filter((l) => l.lead_stage === filters.lead_stage);
    if (filters.status) leads = leads.filter((l) => l.status === filters.status);
    if (filters.tier) leads = leads.filter((l) => scoreTier(l.overall_score) === filters.tier);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      leads = leads.filter(
        (l) => (l.title ?? "").toLowerCase().includes(q) || (l.body_excerpt ?? "").toLowerCase().includes(q),
      );
    }
    leads =
      filters.sort === "newest"
        ? leads.sort((a, b) => (b.posted_at ?? b.created_at).localeCompare(a.posted_at ?? a.created_at))
        : leads.sort((a, b) => b.overall_score - a.overall_score);
    return filters.limit ? leads.slice(0, filters.limit) : leads;
  }

  async getLead(orgId: string, leadId: string): Promise<LeadCandidate | null> {
    return state().leads.find((l) => l.organization_id === orgId && l.id === leadId) ?? null;
  }

  async updateLeadStatus(orgId: string, leadId: string, status: LeadStatus): Promise<LeadCandidate> {
    const lead = state().leads.find((l) => l.organization_id === orgId && l.id === leadId);
    if (!lead) throw new Error("Lead not found");
    lead.status = status;
    lead.updated_at = nowIso();
    return lead;
  }

  async createReplyDraft(orgId: string, input: CreateReplyDraftInput): Promise<ReplyDraft> {
    const s = state();
    // One draft per lead — replace existing.
    const existingIdx = s.replyDrafts.findIndex(
      (d) => d.organization_id === orgId && d.lead_candidate_id === input.lead_candidate_id,
    );
    const draft: ReplyDraft = {
      id: randomUUID(),
      organization_id: orgId,
      project_id: input.project_id,
      lead_candidate_id: input.lead_candidate_id,
      draft_text: input.draft_text,
      tone: input.tone ?? null,
      why_this_reply: input.why_this_reply ?? null,
      suggested_disclosure: input.suggested_disclosure ?? null,
      safety_notes: input.safety_notes ?? [],
      confidence: input.confidence,
      status: "draft",
      copied_at: null,
      created_at: nowIso(),
      updated_at: nowIso(),
    };
    if (existingIdx >= 0) s.replyDrafts[existingIdx] = draft;
    else s.replyDrafts.push(draft);
    return draft;
  }

  async getReplyDraftForLead(orgId: string, leadId: string): Promise<ReplyDraft | null> {
    return (
      state().replyDrafts.find((d) => d.organization_id === orgId && d.lead_candidate_id === leadId) ?? null
    );
  }

  async getReplyDraftById(orgId: string, replyId: string): Promise<ReplyDraft | null> {
    return state().replyDrafts.find((d) => d.organization_id === orgId && d.id === replyId) ?? null;
  }

  async markReplyCopied(orgId: string, replyId: string): Promise<ReplyDraft> {
    const draft = state().replyDrafts.find((d) => d.organization_id === orgId && d.id === replyId);
    if (!draft) throw new Error("Reply draft not found");
    draft.status = "copied";
    draft.copied_at = nowIso();
    draft.updated_at = nowIso();
    return draft;
  }

  async saveLead(orgId: string, leadId: string, notes?: string | null): Promise<SavedLead> {
    const s = state();
    const lead = s.leads.find((l) => l.organization_id === orgId && l.id === leadId);
    if (!lead) throw new Error("Lead not found");
    const existing = s.savedLeads.find((sl) => sl.organization_id === orgId && sl.lead_candidate_id === leadId);
    if (existing) {
      if (notes !== undefined) existing.notes = notes;
      return existing;
    }
    const saved: SavedLead = {
      id: randomUUID(),
      organization_id: orgId,
      project_id: lead.project_id,
      lead_candidate_id: leadId,
      notes: notes ?? null,
      status: "saved",
      created_at: nowIso(),
    };
    s.savedLeads.push(saved);
    if (lead.status === "new") lead.status = "saved";
    return saved;
  }

  async isLeadSaved(orgId: string, leadId: string): Promise<boolean> {
    return state().savedLeads.some((sl) => sl.organization_id === orgId && sl.lead_candidate_id === leadId);
  }

  async listSavedLeads(orgId: string): Promise<SavedLead[]> {
    return state().savedLeads.filter((sl) => sl.organization_id === orgId);
  }

  async getSavedLeadById(orgId: string, savedLeadId: string): Promise<SavedLead | null> {
    return state().savedLeads.find((sl) => sl.organization_id === orgId && sl.id === savedLeadId) ?? null;
  }

  async recordUsageEvent(
    orgId: string,
    eventType: string,
    metadata: Record<string, unknown> = {},
    projectId: string | null = null,
  ): Promise<void> {
    state().usageEvents.push({
      id: randomUUID(),
      organization_id: orgId,
      project_id: projectId,
      event_type: eventType,
      metadata,
      created_at: nowIso(),
    });
  }

  async getUsageSnapshot(orgId: string): Promise<UsageSnapshot> {
    const s = state();
    const monthStart = startOfMonthIso();
    const events = s.usageEvents.filter((e) => e.organization_id === orgId && e.created_at >= monthStart);
    return {
      posts_scanned_this_month: events.filter((e) => e.event_type === "post_scanned").length,
      reply_drafts_this_month: events.filter((e) => e.event_type === "reply_drafted").length,
      projects_count: s.projects.filter((p) => p.organization_id === orgId).length,
    };
  }

  async recordAiLog(orgId: string, input: AiLogInput): Promise<void> {
    state().aiLogs.push({
      status: input.status,
      source_type: (input.input_json?.source_type as string) ?? undefined,
      created_at: nowIso(),
      organization_id: orgId,
    });
  }

  async getDashboardStats(orgId: string): Promise<DashboardStats> {
    const s = state();
    const leads = s.leads.filter((l) => l.organization_id === orgId);
    const high = leads.filter((l) => isHighIntent(l.overall_score));
    const avg = leads.length ? Math.round(leads.reduce((sum, l) => sum + l.overall_score, 0) / leads.length) : 0;
    const runs = await this.listSourceRuns(orgId, { limit: 1 });
    return {
      totalLeads: leads.length,
      highIntentLeads: high.length,
      averageScore: avg,
      savedLeads: s.savedLeads.filter((sl) => sl.organization_id === orgId).length,
      repliesCopied: s.replyDrafts.filter((d) => d.organization_id === orgId && d.status === "copied").length,
      activeProjects: s.projects.filter((p) => p.organization_id === orgId && p.active).length,
      lastRun: runs[0] ?? null,
      recentHighIntent: high
        .sort((a, b) => (b.posted_at ?? b.created_at).localeCompare(a.posted_at ?? a.created_at))
        .slice(0, 5),
    };
  }

  async getAdminStats(): Promise<AdminStats> {
    const s = state();
    const sourceCounts = new Map<string, number>();
    for (const src of s.sources) {
      sourceCounts.set(src.source_type, (sourceCounts.get(src.source_type) ?? 0) + 1);
    }
    return {
      totalOrganizations: s.organizations.length,
      totalProjects: s.projects.length,
      totalSourceRuns: s.sourceRuns.length,
      aiErrors: s.aiLogs.filter((l) => l.status === "error").length,
      topSources: [...sourceCounts.entries()]
        .map(([source_type, count]) => ({ source_type, count }))
        .sort((a, b) => b.count - a.count),
      recentSignups: s.organizations
        .slice()
        .sort((a, b) => b.created_at.localeCompare(a.created_at))
        .slice(0, 10)
        .map((o) => ({ id: o.id, name: o.name, created_at: o.created_at })),
      usageByOrg: s.organizations.map((o) => ({
        organization: o.name,
        posts: s.usageEvents.filter((e) => e.organization_id === o.id && e.event_type === "post_scanned").length,
        replies: s.usageEvents.filter((e) => e.organization_id === o.id && e.event_type === "reply_drafted").length,
      })),
    };
  }

  async getTopLeads(orgId: string, limit: number): Promise<LeadCandidate[]> {
    return this.listLeads(orgId, { sort: "score", limit, tier: undefined });
  }
}

function startOfMonthIso(): string {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)).toISOString();
}

export const DEMO_ORG = DEMO_ORG_ID;
