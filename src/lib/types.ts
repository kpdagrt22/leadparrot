/**
 * Domain types shared across the app. These mirror the Supabase schema in
 * supabase/migrations and the AI output schemas in src/lib/ai/schemas.
 */

export type BusinessType =
  | "saas"
  | "agency"
  | "consultant"
  | "local_service"
  | "ecommerce"
  | "other";

export type ReplyTone =
  | "helpful"
  | "expert"
  | "casual"
  | "founder-like"
  | "professional";

export type SourceType =
  | "reddit"
  | "hackernews"
  | "rss"
  | "manual"
  | "web_search_placeholder";

export type SourceRunStatus =
  | "pending"
  | "running"
  | "success"
  | "error";

export type LeadStage =
  | "research"
  | "problem-aware"
  | "solution-aware"
  | "buying-intent"
  | "competitor-switching"
  | "not-a-lead";

export type LeadStatus =
  | "new"
  | "saved"
  | "contacted"
  | "not_relevant"
  | "won"
  | "lost";

export type ReplyDraftStatus = "draft" | "copied" | "discarded";

export type PlanId = "free" | "starter" | "pro" | "agency";

export type ScoreTier = "high" | "medium" | "low";

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  owner_id: string;
  name: string;
  website: string | null;
  business_type: BusinessType | null;
  description: string | null;
  target_geography: string | null;
  reply_tone: ReplyTone;
  notification_email: string | null;
  daily_digest_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: "owner" | "admin" | "member";
  created_at: string;
}

export interface Project {
  id: string;
  organization_id: string;
  name: string;
  product_description: string;
  ideal_customer_profile: string | null;
  competitors: string[];
  keywords: string[];
  negative_keywords: string[];
  target_geography: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Source {
  id: string;
  organization_id: string;
  project_id: string;
  source_type: SourceType;
  name: string | null;
  url: string | null;
  identifier: string | null;
  config: Record<string, unknown>;
  enabled: boolean;
  last_checked_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SourceRun {
  id: string;
  organization_id: string;
  project_id: string;
  source_id: string;
  status: SourceRunStatus;
  started_at: string | null;
  finished_at: string | null;
  items_found: number;
  error_message: string | null;
  created_at: string;
}

export interface RawPost {
  id: string;
  organization_id: string;
  project_id: string;
  source_id: string | null;
  source_type: SourceType;
  external_id: string;
  title: string | null;
  body: string | null;
  author_display: string | null;
  url: string | null;
  permalink: string | null;
  posted_at: string | null;
  raw_json: Record<string, unknown> | null;
  created_at: string;
}

export interface LeadCandidate {
  id: string;
  organization_id: string;
  project_id: string;
  raw_post_id: string;
  title: string | null;
  body_excerpt: string | null;
  url: string | null;
  source_type: SourceType;
  posted_at: string | null;
  intent_score: number;
  relevance_score: number;
  urgency_score: number;
  fit_score: number;
  overall_score: number;
  lead_stage: LeadStage;
  status: LeadStatus;
  reason: string | null;
  pain_points: string[];
  buying_signals: string[];
  disqualifiers: string[];
  suggested_angle: string | null;
  risk_flags: string[];
  confidence: number;
  created_at: string;
  updated_at: string;
}

export interface ReplyDraft {
  id: string;
  organization_id: string;
  project_id: string;
  lead_candidate_id: string;
  draft_text: string;
  tone: ReplyTone | null;
  why_this_reply: string | null;
  suggested_disclosure: string | null;
  safety_notes: string[];
  confidence: number;
  status: ReplyDraftStatus;
  copied_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SavedLead {
  id: string;
  organization_id: string;
  project_id: string;
  lead_candidate_id: string;
  notes: string | null;
  status: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  organization_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: PlanId;
  status: string;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface UsageEvent {
  id: string;
  organization_id: string;
  project_id: string | null;
  event_type: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

/** Joined view used by the lead inbox / detail pages. */
export interface LeadWithRelations extends LeadCandidate {
  project_name?: string;
  reply_draft?: ReplyDraft | null;
  saved?: boolean;
}
