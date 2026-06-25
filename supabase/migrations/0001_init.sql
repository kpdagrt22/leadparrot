-- ============================================================================
-- LeadParrot — initial schema
-- Postgres / Supabase. All app tables are organization-scoped; RLS is added in
-- 0002_rls.sql. Background ingestion uses the service role (bypasses RLS).
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- updated_at helper
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create a profile row when a user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- organizations
-- ---------------------------------------------------------------------------
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  website text,
  business_type text check (business_type in ('saas','agency','consultant','local_service','ecommerce','other')),
  description text,
  target_geography text,
  reply_tone text not null default 'helpful',
  notification_email text,
  daily_digest_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_orgs_owner on public.organizations(owner_id);

-- ---------------------------------------------------------------------------
-- organization_members
-- ---------------------------------------------------------------------------
create table if not exists public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('owner','admin','member')),
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);
create index if not exists idx_members_user on public.organization_members(user_id);
create index if not exists idx_members_org on public.organization_members(organization_id);

-- Ensure the org owner is also a member (so RLS membership checks pass).
create or replace function public.handle_new_org()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.organization_members (organization_id, user_id, role)
  values (new.id, new.owner_id, 'owner')
  on conflict (organization_id, user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_org_created on public.organizations;
create trigger on_org_created
  after insert on public.organizations
  for each row execute function public.handle_new_org();

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  product_description text not null,
  ideal_customer_profile text,
  competitors text[] not null default '{}',
  keywords text[] not null default '{}',
  negative_keywords text[] not null default '{}',
  target_geography text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_projects_org on public.projects(organization_id);

-- ---------------------------------------------------------------------------
-- sources
-- ---------------------------------------------------------------------------
create table if not exists public.sources (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  source_type text not null check (source_type in ('reddit','hackernews','rss','manual','web_search_placeholder')),
  name text,
  url text,
  identifier text,
  config jsonb not null default '{}'::jsonb,
  enabled boolean not null default true,
  last_checked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_sources_project on public.sources(project_id);
create index if not exists idx_sources_org on public.sources(organization_id);

-- ---------------------------------------------------------------------------
-- source_runs
-- ---------------------------------------------------------------------------
create table if not exists public.source_runs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  source_id uuid not null references public.sources(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','running','success','error')),
  started_at timestamptz,
  finished_at timestamptz,
  items_found integer not null default 0,
  error_message text,
  created_at timestamptz not null default now()
);
create index if not exists idx_runs_org on public.source_runs(organization_id);
create index if not exists idx_runs_project on public.source_runs(project_id);

-- ---------------------------------------------------------------------------
-- raw_posts
-- ---------------------------------------------------------------------------
create table if not exists public.raw_posts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  source_id uuid references public.sources(id) on delete set null,
  source_type text not null,
  external_id text not null,
  title text,
  body text,
  author_display text,
  url text,
  permalink text,
  posted_at timestamptz,
  raw_json jsonb,
  created_at timestamptz not null default now(),
  -- De-dupe per organization, not globally: the same public post (same
  -- source_type + external_id) may legitimately be ingested by different
  -- organizations, each storing its own copy. A global unique constraint would
  -- let one tenant's row block (or leak into) another's scan.
  unique (organization_id, source_type, external_id)
);
create index if not exists idx_raw_posts_org on public.raw_posts(organization_id);
create index if not exists idx_raw_posts_project on public.raw_posts(project_id);

-- ---------------------------------------------------------------------------
-- lead_candidates
-- ---------------------------------------------------------------------------
create table if not exists public.lead_candidates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  raw_post_id uuid not null references public.raw_posts(id) on delete cascade,
  title text,
  body_excerpt text,
  url text,
  source_type text,
  posted_at timestamptz,
  intent_score integer not null default 0,
  relevance_score integer not null default 0,
  urgency_score integer not null default 0,
  fit_score integer not null default 0,
  overall_score integer not null default 0,
  lead_stage text not null default 'research'
    check (lead_stage in ('research','problem-aware','solution-aware','buying-intent','competitor-switching','not-a-lead')),
  status text not null default 'new'
    check (status in ('new','saved','contacted','not_relevant','won','lost')),
  reason text,
  pain_points text[] not null default '{}',
  buying_signals text[] not null default '{}',
  disqualifiers text[] not null default '{}',
  suggested_angle text,
  risk_flags text[] not null default '{}',
  confidence real not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_leads_org on public.lead_candidates(organization_id);
create index if not exists idx_leads_project on public.lead_candidates(project_id);
create index if not exists idx_leads_score on public.lead_candidates(overall_score desc);

-- ---------------------------------------------------------------------------
-- reply_drafts
-- ---------------------------------------------------------------------------
create table if not exists public.reply_drafts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  lead_candidate_id uuid not null references public.lead_candidates(id) on delete cascade,
  draft_text text not null,
  tone text,
  why_this_reply text,
  suggested_disclosure text,
  safety_notes text[] not null default '{}',
  confidence real not null default 0,
  status text not null default 'draft' check (status in ('draft','copied','discarded')),
  copied_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_drafts_lead on public.reply_drafts(lead_candidate_id);
create index if not exists idx_drafts_org on public.reply_drafts(organization_id);

-- ---------------------------------------------------------------------------
-- saved_leads
-- ---------------------------------------------------------------------------
create table if not exists public.saved_leads (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  lead_candidate_id uuid not null references public.lead_candidates(id) on delete cascade,
  notes text,
  status text not null default 'saved',
  created_at timestamptz not null default now(),
  unique (organization_id, lead_candidate_id)
);
create index if not exists idx_saved_org on public.saved_leads(organization_id);

-- ---------------------------------------------------------------------------
-- ai_scoring_logs
-- ---------------------------------------------------------------------------
create table if not exists public.ai_scoring_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  raw_post_id uuid references public.raw_posts(id) on delete set null,
  provider text,
  model text,
  input_json jsonb,
  output_json jsonb,
  status text,
  error_message text,
  created_at timestamptz not null default now()
);
create index if not exists idx_ai_logs_org on public.ai_scoring_logs(organization_id);

-- ---------------------------------------------------------------------------
-- digest_emails
-- ---------------------------------------------------------------------------
create table if not exists public.digest_emails (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  subject text,
  sent_to text,
  lead_count integer not null default 0,
  status text,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists idx_digests_org on public.digest_emails(organization_id);

-- ---------------------------------------------------------------------------
-- usage_events
-- ---------------------------------------------------------------------------
create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_usage_org_type_time on public.usage_events(organization_id, event_type, created_at);

-- ---------------------------------------------------------------------------
-- subscriptions
-- ---------------------------------------------------------------------------
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text not null default 'free' check (plan in ('free','starter','pro','agency')),
  status text not null default 'active',
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id)
);
create index if not exists idx_subs_org on public.subscriptions(organization_id);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'profiles','organizations','projects','sources','lead_candidates','reply_drafts','subscriptions'
  ]
  loop
    execute format('drop trigger if exists set_%1$s_updated_at on public.%1$s;', t);
    execute format(
      'create trigger set_%1$s_updated_at before update on public.%1$s for each row execute function public.set_updated_at();',
      t
    );
  end loop;
end $$;
