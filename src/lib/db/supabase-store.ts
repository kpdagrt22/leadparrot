import type { SupabaseClient } from "@supabase/supabase-js";
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
} from "@/lib/types";
import { scoreTier, isHighIntent, HIGH_INTENT_THRESHOLD } from "@/lib/scoring/score";
import type { UsageSnapshot } from "@/lib/usage/limits";
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
} from "@/lib/db/store";

/**
 * Supabase-backed DataStore. Org scoping is enforced both by explicit filters
 * here AND by RLS policies (see supabase/migrations). When constructed with a
 * user-scoped client, every query runs under the caller's permissions.
 */
export class SupabaseStore implements DataStore {
  readonly mode = "supabase" as const;
  constructor(private readonly sb: SupabaseClient) {}

  private orThrow<T>(data: T | null, error: { message: string } | null, ctx: string): T {
    if (error) throw new Error(`${ctx}: ${error.message}`);
    if (data == null) throw new Error(`${ctx}: no data returned`);
    return data;
  }

  async getProfile(userId: string): Promise<Profile | null> {
    const { data } = await this.sb.from("profiles").select("*").eq("id", userId).maybeSingle();
    return (data as Profile) ?? null;
  }

  async upsertProfile(input: { id: string; full_name?: string | null; email?: string | null }): Promise<Profile> {
    const { data, error } = await this.sb
      .from("profiles")
      .upsert({ id: input.id, full_name: input.full_name ?? null, email: input.email ?? null }, { onConflict: "id" })
      .select("*")
      .single();
    return this.orThrow(data as Profile, error, "upsertProfile");
  }

  async getOrganizationForUser(userId: string): Promise<Organization | null> {
    const { data } = await this.sb
      .from("organization_members")
      .select("organization:organizations(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    const org = (data as { organization?: Organization } | null)?.organization;
    return org ?? null;
  }

  async createOrganization(input: CreateOrganizationInput): Promise<Organization> {
    const { data, error } = await this.sb
      .from("organizations")
      .insert({
        owner_id: input.owner_id,
        name: input.name,
        website: input.website ?? null,
        business_type: input.business_type ?? null,
        description: input.description ?? null,
        target_geography: input.target_geography ?? null,
        reply_tone: input.reply_tone ?? "helpful",
        notification_email: input.notification_email ?? null,
        daily_digest_enabled: input.daily_digest_enabled ?? true,
      })
      .select("*")
      .single();
    const org = this.orThrow(data as Organization, error, "createOrganization");

    // The owner's `organization_members` row is created by the handle_new_org()
    // trigger (SECURITY DEFINER) — inserting it again here would violate the
    // unique(organization_id, user_id) constraint. We only seed the subscription.
    await this.sb.from("subscriptions").insert({ organization_id: org.id, plan: "free", status: "active" });
    return org;
  }

  async updateOrganization(orgId: string, patch: Partial<CreateOrganizationInput>): Promise<Organization> {
    const { data, error } = await this.sb
      .from("organizations")
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq("id", orgId)
      .select("*")
      .single();
    return this.orThrow(data as Organization, error, "updateOrganization");
  }

  async getSubscription(orgId: string): Promise<Subscription> {
    const { data } = await this.sb
      .from("subscriptions")
      .select("*")
      .eq("organization_id", orgId)
      .maybeSingle();
    if (data) return data as Subscription;
    const { data: created, error } = await this.sb
      .from("subscriptions")
      .insert({ organization_id: orgId, plan: "free", status: "active" })
      .select("*")
      .single();
    return this.orThrow(created as Subscription, error, "getSubscription");
  }

  async listProjects(orgId: string): Promise<Project[]> {
    const { data } = await this.sb
      .from("projects")
      .select("*")
      .eq("organization_id", orgId)
      .order("created_at", { ascending: false });
    return (data as Project[]) ?? [];
  }

  async getProject(orgId: string, projectId: string): Promise<Project | null> {
    const { data } = await this.sb
      .from("projects")
      .select("*")
      .eq("organization_id", orgId)
      .eq("id", projectId)
      .maybeSingle();
    return (data as Project) ?? null;
  }

  async createProject(orgId: string, input: CreateProjectInput): Promise<Project> {
    const { data, error } = await this.sb
      .from("projects")
      .insert({
        organization_id: orgId,
        name: input.name,
        product_description: input.product_description,
        ideal_customer_profile: input.ideal_customer_profile ?? null,
        competitors: input.competitors ?? [],
        keywords: input.keywords ?? [],
        negative_keywords: input.negative_keywords ?? [],
        target_geography: input.target_geography ?? null,
      })
      .select("*")
      .single();
    return this.orThrow(data as Project, error, "createProject");
  }

  async updateProject(
    orgId: string,
    projectId: string,
    patch: Partial<CreateProjectInput> & { active?: boolean },
  ): Promise<Project> {
    const { data, error } = await this.sb
      .from("projects")
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq("organization_id", orgId)
      .eq("id", projectId)
      .select("*")
      .single();
    return this.orThrow(data as Project, error, "updateProject");
  }

  async listSources(orgId: string, projectId: string): Promise<Source[]> {
    const { data } = await this.sb
      .from("sources")
      .select("*")
      .eq("organization_id", orgId)
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });
    return (data as Source[]) ?? [];
  }

  async getSource(orgId: string, sourceId: string): Promise<Source | null> {
    const { data } = await this.sb
      .from("sources")
      .select("*")
      .eq("organization_id", orgId)
      .eq("id", sourceId)
      .maybeSingle();
    return (data as Source) ?? null;
  }

  async createSource(orgId: string, input: CreateSourceInput): Promise<Source> {
    const { data, error } = await this.sb
      .from("sources")
      .insert({
        organization_id: orgId,
        project_id: input.project_id,
        source_type: input.source_type,
        name: input.name ?? null,
        url: input.url ?? null,
        identifier: input.identifier ?? null,
        config: input.config ?? {},
        enabled: input.enabled ?? true,
      })
      .select("*")
      .single();
    return this.orThrow(data as Source, error, "createSource");
  }

  async updateSource(
    orgId: string,
    sourceId: string,
    patch: Partial<CreateSourceInput> & { last_checked_at?: string | null },
  ): Promise<Source> {
    const { data, error } = await this.sb
      .from("sources")
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq("organization_id", orgId)
      .eq("id", sourceId)
      .select("*")
      .single();
    return this.orThrow(data as Source, error, "updateSource");
  }

  async createSourceRun(orgId: string, projectId: string, sourceId: string): Promise<SourceRun> {
    const { data, error } = await this.sb
      .from("source_runs")
      .insert({ organization_id: orgId, project_id: projectId, source_id: sourceId, status: "pending" })
      .select("*")
      .single();
    return this.orThrow(data as SourceRun, error, "createSourceRun");
  }

  async updateSourceRun(orgId: string, runId: string, patch: Partial<SourceRun>): Promise<SourceRun> {
    const { data, error } = await this.sb
      .from("source_runs")
      .update(patch)
      .eq("organization_id", orgId)
      .eq("id", runId)
      .select("*")
      .single();
    return this.orThrow(data as SourceRun, error, "updateSourceRun");
  }

  async listSourceRuns(orgId: string, opts?: { projectId?: string; limit?: number }): Promise<SourceRun[]> {
    let q = this.sb.from("source_runs").select("*").eq("organization_id", orgId).order("created_at", { ascending: false });
    if (opts?.projectId) q = q.eq("project_id", opts.projectId);
    if (opts?.limit) q = q.limit(opts.limit);
    const { data } = await q;
    return (data as SourceRun[]) ?? [];
  }

  async upsertRawPost(orgId: string, input: UpsertRawPostInput): Promise<{ post: RawPost; created: boolean }> {
    // De-dupe within this organization only (matches the per-org unique
    // constraint and the MemoryStore behavior) — never across tenants.
    const { data: existing } = await this.sb
      .from("raw_posts")
      .select("*")
      .eq("organization_id", orgId)
      .eq("source_type", input.source_type)
      .eq("external_id", input.external_id)
      .maybeSingle();
    if (existing) return { post: existing as RawPost, created: false };

    const { data, error } = await this.sb
      .from("raw_posts")
      .insert({
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
      })
      .select("*")
      .single();
    return { post: this.orThrow(data as RawPost, error, "upsertRawPost"), created: true };
  }

  async getRawPost(orgId: string, rawPostId: string): Promise<RawPost | null> {
    const { data } = await this.sb
      .from("raw_posts")
      .select("*")
      .eq("organization_id", orgId)
      .eq("id", rawPostId)
      .maybeSingle();
    return (data as RawPost) ?? null;
  }

  async createLead(orgId: string, input: CreateLeadInput): Promise<LeadCandidate> {
    const { data, error } = await this.sb
      .from("lead_candidates")
      .insert({
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
        reason: input.reason ?? null,
        pain_points: input.pain_points ?? [],
        buying_signals: input.buying_signals ?? [],
        disqualifiers: input.disqualifiers ?? [],
        suggested_angle: input.suggested_angle ?? null,
        risk_flags: input.risk_flags ?? [],
        confidence: input.confidence,
        status: "new",
      })
      .select("*")
      .single();
    return this.orThrow(data as LeadCandidate, error, "createLead");
  }

  async listLeads(orgId: string, filters: LeadFilters = {}): Promise<LeadCandidate[]> {
    let q = this.sb.from("lead_candidates").select("*").eq("organization_id", orgId);
    if (filters.project_id) q = q.eq("project_id", filters.project_id);
    if (filters.source_type) q = q.eq("source_type", filters.source_type);
    if (filters.lead_stage) q = q.eq("lead_stage", filters.lead_stage);
    if (filters.status) q = q.eq("status", filters.status);
    if (filters.tier === "high") q = q.gte("overall_score", HIGH_INTENT_THRESHOLD);
    if (filters.tier === "medium") q = q.gte("overall_score", 40).lt("overall_score", HIGH_INTENT_THRESHOLD);
    if (filters.tier === "low") q = q.lt("overall_score", 40);
    if (filters.search) q = q.or(`title.ilike.%${filters.search}%,body_excerpt.ilike.%${filters.search}%`);
    q = filters.sort === "newest" ? q.order("posted_at", { ascending: false, nullsFirst: false }) : q.order("overall_score", { ascending: false });
    if (filters.limit) q = q.limit(filters.limit);
    const { data } = await q;
    return (data as LeadCandidate[]) ?? [];
  }

  async getLead(orgId: string, leadId: string): Promise<LeadCandidate | null> {
    const { data } = await this.sb
      .from("lead_candidates")
      .select("*")
      .eq("organization_id", orgId)
      .eq("id", leadId)
      .maybeSingle();
    return (data as LeadCandidate) ?? null;
  }

  async updateLeadStatus(orgId: string, leadId: string, status: LeadStatus): Promise<LeadCandidate> {
    const { data, error } = await this.sb
      .from("lead_candidates")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("organization_id", orgId)
      .eq("id", leadId)
      .select("*")
      .single();
    return this.orThrow(data as LeadCandidate, error, "updateLeadStatus");
  }

  async createReplyDraft(orgId: string, input: CreateReplyDraftInput): Promise<ReplyDraft> {
    await this.sb
      .from("reply_drafts")
      .delete()
      .eq("organization_id", orgId)
      .eq("lead_candidate_id", input.lead_candidate_id);
    const { data, error } = await this.sb
      .from("reply_drafts")
      .insert({
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
      })
      .select("*")
      .single();
    return this.orThrow(data as ReplyDraft, error, "createReplyDraft");
  }

  async getReplyDraftForLead(orgId: string, leadId: string): Promise<ReplyDraft | null> {
    const { data } = await this.sb
      .from("reply_drafts")
      .select("*")
      .eq("organization_id", orgId)
      .eq("lead_candidate_id", leadId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return (data as ReplyDraft) ?? null;
  }

  async getReplyDraftById(orgId: string, replyId: string): Promise<ReplyDraft | null> {
    const { data } = await this.sb
      .from("reply_drafts")
      .select("*")
      .eq("organization_id", orgId)
      .eq("id", replyId)
      .maybeSingle();
    return (data as ReplyDraft) ?? null;
  }

  async markReplyCopied(orgId: string, replyId: string): Promise<ReplyDraft> {
    const { data, error } = await this.sb
      .from("reply_drafts")
      .update({ status: "copied", copied_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("organization_id", orgId)
      .eq("id", replyId)
      .select("*")
      .single();
    return this.orThrow(data as ReplyDraft, error, "markReplyCopied");
  }

  async saveLead(orgId: string, leadId: string, notes?: string | null): Promise<SavedLead> {
    const lead = await this.getLead(orgId, leadId);
    if (!lead) throw new Error("Lead not found");
    // Only write `notes` when explicitly provided so a re-save doesn't wipe an
    // existing note (parity with MemoryStore).
    const payload: Record<string, unknown> = {
      organization_id: orgId,
      project_id: lead.project_id,
      lead_candidate_id: leadId,
      status: "saved",
    };
    if (notes !== undefined) payload.notes = notes;
    const { data, error } = await this.sb
      .from("saved_leads")
      .upsert(payload, { onConflict: "organization_id,lead_candidate_id" })
      .select("*")
      .single();
    const saved = this.orThrow(data as SavedLead, error, "saveLead");
    // Parity with MemoryStore: saving a brand-new lead promotes it out of the
    // "new" triage bucket. The status="new" guard keeps this idempotent and
    // ensures a lead that is already contacted/won/lost is never demoted. The
    // update stays org-scoped as defense-in-depth on top of RLS.
    if (lead.status === "new") {
      await this.sb
        .from("lead_candidates")
        .update({ status: "saved", updated_at: new Date().toISOString() })
        .eq("organization_id", orgId)
        .eq("id", leadId)
        .eq("status", "new");
    }
    return saved;
  }

  async isLeadSaved(orgId: string, leadId: string): Promise<boolean> {
    const { count } = await this.sb
      .from("saved_leads")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", orgId)
      .eq("lead_candidate_id", leadId);
    return (count ?? 0) > 0;
  }

  async listSavedLeads(orgId: string): Promise<SavedLead[]> {
    const { data } = await this.sb.from("saved_leads").select("*").eq("organization_id", orgId);
    return (data as SavedLead[]) ?? [];
  }

  async getSavedLeadById(orgId: string, savedLeadId: string): Promise<SavedLead | null> {
    const { data } = await this.sb
      .from("saved_leads")
      .select("*")
      .eq("organization_id", orgId)
      .eq("id", savedLeadId)
      .maybeSingle();
    return (data as SavedLead) ?? null;
  }

  async recordUsageEvent(
    orgId: string,
    eventType: string,
    metadata: Record<string, unknown> = {},
    projectId: string | null = null,
  ): Promise<void> {
    await this.sb.from("usage_events").insert({
      organization_id: orgId,
      project_id: projectId,
      event_type: eventType,
      metadata,
    });
  }

  async getUsageSnapshot(orgId: string): Promise<UsageSnapshot> {
    const monthStart = startOfMonthIso();
    const [posts, replies, projects] = await Promise.all([
      this.sb
        .from("usage_events")
        .select("id", { count: "exact", head: true })
        .eq("organization_id", orgId)
        .eq("event_type", "post_scanned")
        .gte("created_at", monthStart),
      this.sb
        .from("usage_events")
        .select("id", { count: "exact", head: true })
        .eq("organization_id", orgId)
        .eq("event_type", "reply_drafted")
        .gte("created_at", monthStart),
      this.sb.from("projects").select("id", { count: "exact", head: true }).eq("organization_id", orgId),
    ]);
    return {
      posts_scanned_this_month: posts.count ?? 0,
      reply_drafts_this_month: replies.count ?? 0,
      projects_count: projects.count ?? 0,
    };
  }

  async recordAiLog(orgId: string, input: AiLogInput): Promise<void> {
    await this.sb.from("ai_scoring_logs").insert({
      organization_id: orgId,
      project_id: input.project_id,
      raw_post_id: input.raw_post_id,
      provider: input.provider,
      model: input.model,
      input_json: input.input_json,
      output_json: input.output_json,
      status: input.status,
      error_message: input.error_message ?? null,
    });
  }

  async getDashboardStats(orgId: string): Promise<DashboardStats> {
    const leads = await this.listLeads(orgId, { sort: "score" });
    const high = leads.filter((l) => isHighIntent(l.overall_score));
    const avg = leads.length ? Math.round(leads.reduce((s, l) => s + l.overall_score, 0) / leads.length) : 0;
    const [savedRes, repliesRes, projectsRes, runs] = await Promise.all([
      this.sb.from("saved_leads").select("id", { count: "exact", head: true }).eq("organization_id", orgId),
      this.sb
        .from("reply_drafts")
        .select("id", { count: "exact", head: true })
        .eq("organization_id", orgId)
        .eq("status", "copied"),
      this.sb
        .from("projects")
        .select("id", { count: "exact", head: true })
        .eq("organization_id", orgId)
        .eq("active", true),
      this.listSourceRuns(orgId, { limit: 1 }),
    ]);
    return {
      totalLeads: leads.length,
      highIntentLeads: high.length,
      averageScore: avg,
      savedLeads: savedRes.count ?? 0,
      repliesCopied: repliesRes.count ?? 0,
      activeProjects: projectsRes.count ?? 0,
      lastRun: runs[0] ?? null,
      recentHighIntent: high.slice(0, 5),
    };
  }

  async getAdminStats(): Promise<AdminStats> {
    const [orgs, projects, runs, aiErrors, sources, usage] = await Promise.all([
      this.sb.from("organizations").select("id,name,created_at").order("created_at", { ascending: false }),
      this.sb.from("projects").select("id", { count: "exact", head: true }),
      this.sb.from("source_runs").select("id", { count: "exact", head: true }),
      this.sb.from("ai_scoring_logs").select("id", { count: "exact", head: true }).eq("status", "error"),
      this.sb.from("sources").select("source_type"),
      this.sb.from("usage_events").select("organization_id,event_type"),
    ]);

    const sourceCounts = new Map<string, number>();
    for (const s of (sources.data as Array<{ source_type: string }>) ?? []) {
      sourceCounts.set(s.source_type, (sourceCounts.get(s.source_type) ?? 0) + 1);
    }
    const orgRows = (orgs.data as Array<{ id: string; name: string; created_at: string }>) ?? [];
    const usageRows = (usage.data as Array<{ organization_id: string; event_type: string }>) ?? [];

    return {
      totalOrganizations: orgRows.length,
      totalProjects: projects.count ?? 0,
      totalSourceRuns: runs.count ?? 0,
      aiErrors: aiErrors.count ?? 0,
      topSources: [...sourceCounts.entries()]
        .map(([source_type, count]) => ({ source_type, count }))
        .sort((a, b) => b.count - a.count),
      recentSignups: orgRows.slice(0, 10),
      usageByOrg: orgRows.map((o) => ({
        organization: o.name,
        posts: usageRows.filter((u) => u.organization_id === o.id && u.event_type === "post_scanned").length,
        replies: usageRows.filter((u) => u.organization_id === o.id && u.event_type === "reply_drafted").length,
      })),
    };
  }

  async getTopLeads(orgId: string, limit: number): Promise<LeadCandidate[]> {
    return this.listLeads(orgId, { sort: "score", limit });
  }
}

function startOfMonthIso(): string {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)).toISOString();
}

// re-export so callers can compute tiers consistently
export { scoreTier };
