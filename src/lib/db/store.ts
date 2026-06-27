import type {
  Organization,
  Project,
  Source,
  SourceRun,
  RawPost,
  LeadCandidate,
  ReplyDraft,
  SavedLead,
  Subscription,
  Profile,
  SourceType,
  LeadStage,
  LeadStatus,
  ReplyTone,
  BusinessType,
  ScoreTier,
  ApiToken,
} from "@/lib/types";
import type { UsageSnapshot } from "@/lib/usage/limits";

export interface CreateOrganizationInput {
  owner_id: string;
  name: string;
  website?: string | null;
  business_type?: BusinessType | null;
  description?: string | null;
  target_geography?: string | null;
  reply_tone?: ReplyTone;
  notification_email?: string | null;
  daily_digest_enabled?: boolean;
  notify_email_enabled?: boolean;
  notify_sms_enabled?: boolean;
  notify_whatsapp_enabled?: boolean;
  notify_phone?: string | null;
  notify_email_verified?: boolean;
  notify_phone_verified?: boolean;
  high_intent_threshold?: number;
  quiet_hours_start?: number | null;
  quiet_hours_end?: number | null;
  digest_hour?: number;
}

export interface RecordNotificationInput {
  channel: "email" | "sms" | "whatsapp";
  event: string;
  status: "sent" | "skipped" | "error" | "preview";
  target?: string | null;
  detail?: string | null;
}

export interface CreateApiTokenInput {
  user_id?: string | null;
  name?: string;
  token_hash: string;
  token_prefix: string;
}

export interface CreateProjectInput {
  name: string;
  product_description: string;
  ideal_customer_profile?: string | null;
  competitors?: string[];
  keywords?: string[];
  negative_keywords?: string[];
  target_geography?: string | null;
}

export interface CreateSourceInput {
  project_id: string;
  source_type: SourceType;
  name?: string | null;
  url?: string | null;
  identifier?: string | null;
  config?: Record<string, unknown>;
  enabled?: boolean;
}

export interface UpsertRawPostInput {
  project_id: string;
  source_id: string | null;
  source_type: SourceType;
  external_id: string;
  title?: string | null;
  body?: string | null;
  author_display?: string | null;
  url?: string | null;
  permalink?: string | null;
  posted_at?: string | null;
  raw_json?: Record<string, unknown> | null;
}

export interface CreateLeadInput {
  project_id: string;
  raw_post_id: string;
  title?: string | null;
  body_excerpt?: string | null;
  url?: string | null;
  source_type: SourceType;
  posted_at?: string | null;
  intent_score: number;
  relevance_score: number;
  urgency_score: number;
  fit_score: number;
  overall_score: number;
  lead_stage: LeadStage;
  reason?: string | null;
  pain_points?: string[];
  buying_signals?: string[];
  disqualifiers?: string[];
  suggested_angle?: string | null;
  risk_flags?: string[];
  confidence: number;
}

export interface CreateReplyDraftInput {
  project_id: string;
  lead_candidate_id: string;
  draft_text: string;
  tone?: ReplyTone | null;
  why_this_reply?: string | null;
  suggested_disclosure?: string | null;
  safety_notes?: string[];
  confidence: number;
}

export interface LeadFilters {
  project_id?: string;
  source_type?: SourceType;
  tier?: ScoreTier;
  lead_stage?: LeadStage;
  status?: LeadStatus;
  search?: string;
  sort?: "newest" | "score";
  limit?: number;
}

export interface DashboardStats {
  totalLeads: number;
  highIntentLeads: number;
  averageScore: number;
  savedLeads: number;
  repliesCopied: number;
  activeProjects: number;
  lastRun: SourceRun | null;
  recentHighIntent: LeadCandidate[];
}

export interface AdminStats {
  totalOrganizations: number;
  totalProjects: number;
  totalSourceRuns: number;
  aiErrors: number;
  topSources: Array<{ source_type: string; count: number }>;
  recentSignups: Array<{ id: string; name: string; created_at: string }>;
  usageByOrg: Array<{ organization: string; posts: number; replies: number }>;
}

export interface AiLogInput {
  project_id: string;
  raw_post_id: string | null;
  provider: string;
  model: string;
  input_json: Record<string, unknown>;
  output_json: Record<string, unknown>;
  status: string;
  error_message?: string | null;
}

/**
 * The data access surface used by every page and route handler. Two
 * implementations exist: an in-memory store (demo mode) and a Supabase-backed
 * store (production). Both are organization-scoped; the Supabase store relies on
 * RLS as a second line of defense.
 */
export interface DataStore {
  readonly mode: "memory" | "supabase";

  // profiles / org
  getProfile(userId: string): Promise<Profile | null>;
  upsertProfile(input: { id: string; full_name?: string | null; email?: string | null }): Promise<Profile>;
  getOrganizationForUser(userId: string): Promise<Organization | null>;
  getOrganizationById(orgId: string): Promise<Organization | null>;
  createOrganization(input: CreateOrganizationInput): Promise<Organization>;
  updateOrganization(orgId: string, patch: Partial<CreateOrganizationInput>): Promise<Organization>;
  getSubscription(orgId: string): Promise<Subscription>;

  // notifications (account-owner alerts: delivery log + dedupe)
  recordNotification(orgId: string, input: RecordNotificationInput): Promise<void>;
  getLastNotificationAt(orgId: string, event: string): Promise<string | null>;

  // extension API tokens (per-user, revocable, hashed)
  createApiToken(orgId: string, input: CreateApiTokenInput): Promise<ApiToken>;
  listApiTokens(orgId: string): Promise<ApiToken[]>;
  revokeApiToken(orgId: string, tokenId: string): Promise<void>;
  /** Unscoped lookup by hash (used by the extension route via admin client);
   *  returns the owning org for a non-revoked token and touches last_used_at. */
  getApiTokenByHash(hash: string): Promise<{ id: string; organization_id: string } | null>;

  // projects
  listProjects(orgId: string): Promise<Project[]>;
  getProject(orgId: string, projectId: string): Promise<Project | null>;
  createProject(orgId: string, input: CreateProjectInput): Promise<Project>;
  updateProject(orgId: string, projectId: string, patch: Partial<CreateProjectInput> & { active?: boolean }): Promise<Project>;

  // sources
  listSources(orgId: string, projectId: string): Promise<Source[]>;
  getSource(orgId: string, sourceId: string): Promise<Source | null>;
  createSource(orgId: string, input: CreateSourceInput): Promise<Source>;
  updateSource(orgId: string, sourceId: string, patch: Partial<CreateSourceInput> & { last_checked_at?: string | null }): Promise<Source>;

  // source runs
  createSourceRun(orgId: string, projectId: string, sourceId: string): Promise<SourceRun>;
  updateSourceRun(orgId: string, runId: string, patch: Partial<SourceRun>): Promise<SourceRun>;
  listSourceRuns(orgId: string, opts?: { projectId?: string; limit?: number }): Promise<SourceRun[]>;

  // raw posts
  upsertRawPost(orgId: string, input: UpsertRawPostInput): Promise<{ post: RawPost; created: boolean }>;
  getRawPost(orgId: string, rawPostId: string): Promise<RawPost | null>;

  // leads
  createLead(orgId: string, input: CreateLeadInput): Promise<LeadCandidate>;
  listLeads(orgId: string, filters?: LeadFilters): Promise<LeadCandidate[]>;
  getLead(orgId: string, leadId: string): Promise<LeadCandidate | null>;
  updateLeadStatus(orgId: string, leadId: string, status: LeadStatus): Promise<LeadCandidate>;

  // reply drafts
  createReplyDraft(orgId: string, input: CreateReplyDraftInput): Promise<ReplyDraft>;
  getReplyDraftForLead(orgId: string, leadId: string): Promise<ReplyDraft | null>;
  getReplyDraftById(orgId: string, replyId: string): Promise<ReplyDraft | null>;
  markReplyCopied(orgId: string, replyId: string): Promise<ReplyDraft>;

  // saved leads
  saveLead(orgId: string, leadId: string, notes?: string | null): Promise<SavedLead>;
  isLeadSaved(orgId: string, leadId: string): Promise<boolean>;
  listSavedLeads(orgId: string): Promise<SavedLead[]>;
  getSavedLeadById(orgId: string, savedLeadId: string): Promise<SavedLead | null>;

  // usage + logs
  recordUsageEvent(orgId: string, eventType: string, metadata?: Record<string, unknown>, projectId?: string | null): Promise<void>;
  getUsageSnapshot(orgId: string): Promise<UsageSnapshot>;
  recordAiLog(orgId: string, input: AiLogInput): Promise<void>;

  // dashboard + admin + digest
  getDashboardStats(orgId: string): Promise<DashboardStats>;
  getAdminStats(): Promise<AdminStats>;
  getTopLeads(orgId: string, limit: number): Promise<LeadCandidate[]>;
}
