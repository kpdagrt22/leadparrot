-- ============================================================================
-- LeadParrot — Row Level Security
-- Users can only access organizations where they are a member. Every app table
-- is organization-scoped. The service role bypasses RLS for ingestion jobs.
-- ============================================================================

-- Membership check as SECURITY DEFINER to avoid recursive RLS on the members
-- table (the function reads with the definer's privileges, not the caller's).
create or replace function public.is_org_member(org uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.organization_members m
    where m.organization_id = org and m.user_id = auth.uid()
  );
$$;

-- Enable RLS everywhere.
alter table public.profiles            enable row level security;
alter table public.organizations       enable row level security;
alter table public.organization_members enable row level security;
alter table public.projects            enable row level security;
alter table public.sources             enable row level security;
alter table public.source_runs         enable row level security;
alter table public.raw_posts           enable row level security;
alter table public.lead_candidates     enable row level security;
alter table public.reply_drafts        enable row level security;
alter table public.saved_leads         enable row level security;
alter table public.ai_scoring_logs     enable row level security;
alter table public.digest_emails       enable row level security;
alter table public.usage_events        enable row level security;
alter table public.subscriptions       enable row level security;

-- ---------------------------------------------------------------------------
-- profiles: a user can read/update only their own profile.
-- ---------------------------------------------------------------------------
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select using (id = auth.uid());
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());
drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles
  for insert with check (id = auth.uid());

-- ---------------------------------------------------------------------------
-- organizations: members can read; owner can update; any authed user can
-- create an org they own.
-- ---------------------------------------------------------------------------
drop policy if exists orgs_select_member on public.organizations;
create policy orgs_select_member on public.organizations
  for select using (public.is_org_member(id));
drop policy if exists orgs_insert_owner on public.organizations;
create policy orgs_insert_owner on public.organizations
  for insert with check (owner_id = auth.uid());
drop policy if exists orgs_update_owner on public.organizations;
create policy orgs_update_owner on public.organizations
  for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());
drop policy if exists orgs_delete_owner on public.organizations;
create policy orgs_delete_owner on public.organizations
  for delete using (owner_id = auth.uid());

-- ---------------------------------------------------------------------------
-- organization_members: members can read their org's membership; a user can
-- add themselves (handled by trigger for owners).
-- ---------------------------------------------------------------------------
drop policy if exists members_select on public.organization_members;
create policy members_select on public.organization_members
  for select using (user_id = auth.uid() or public.is_org_member(organization_id));
drop policy if exists members_insert_self on public.organization_members;
create policy members_insert_self on public.organization_members
  -- A user may only add THEMSELVES, and only to an organization they OWN.
  -- The normal owner-membership row is created by the SECURITY DEFINER trigger
  -- handle_new_org() (which bypasses RLS). This policy is a tight backstop:
  -- without the ownership check, any authenticated user could self-insert into
  -- an arbitrary organization (even as 'admin') and pass is_org_member(),
  -- escalating into another tenant's data. v1 has no invite flow, so requiring
  -- ownership here is correct and closes that hole.
  for insert with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.organizations o
      where o.id = organization_id and o.owner_id = auth.uid()
    )
  );
drop policy if exists members_delete on public.organization_members;
create policy members_delete on public.organization_members
  for delete using (
    user_id = auth.uid()
    or exists (select 1 from public.organizations o where o.id = organization_id and o.owner_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- Generic org-scoped tables: full CRUD for members of the owning org.
-- One uniform policy per table keeps the model auditable.
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'projects','sources','source_runs','raw_posts','lead_candidates',
    'reply_drafts','saved_leads','ai_scoring_logs','digest_emails',
    'usage_events','subscriptions'
  ]
  loop
    execute format('drop policy if exists %1$s_member_all on public.%1$s;', t);
    execute format(
      'create policy %1$s_member_all on public.%1$s for all
         using (public.is_org_member(organization_id))
         with check (public.is_org_member(organization_id));',
      t
    );
  end loop;
end $$;

-- ============================================================================
-- Notes
--  * The service role key (used by background ingestion + admin reporting)
--    bypasses RLS entirely — keep it server-side only.
--  * is_org_member() is SECURITY DEFINER to prevent recursive policy
--    evaluation on organization_members.
--  * Cross-organization access is impossible: every policy is gated on
--    membership of the row's organization_id.
-- ============================================================================
