-- ============================================================================
-- The Leads Nest — 0006: org-scoped user feedback + support tickets
-- Forward-only & idempotent. Internal support only: tickets + a message thread
-- feed the `support-feedback` governance agent. No lead contact, no outbound
-- channel, minimal PII (page_context = route/url/user_agent only).
-- ============================================================================

create table if not exists public.feedback_tickets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null, -- survives user removal
  type text not null check (type in ('bug','feature','question','feedback')),
  subject text not null,
  body text not null,
  page_context jsonb not null default '{}'::jsonb,                  -- {route,url,user_agent}
  severity text not null default 'normal' check (severity in ('low','normal','high','critical')),
  status text not null default 'open' check (status in ('open','in_progress','resolved','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_feedback_tickets_org
  on public.feedback_tickets(organization_id, status, created_at desc);
create index if not exists idx_feedback_tickets_creator
  on public.feedback_tickets(created_by);

create table if not exists public.ticket_messages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade, -- denormalized for RLS parity
  ticket_id uuid not null references public.feedback_tickets(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  author_role text not null default 'user' check (author_role in ('user','admin')), -- display only
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_ticket_messages_ticket on public.ticket_messages(ticket_id, created_at);
create index if not exists idx_ticket_messages_org    on public.ticket_messages(organization_id);

drop trigger if exists set_feedback_tickets_updated_at on public.feedback_tickets;
create trigger set_feedback_tickets_updated_at
  before update on public.feedback_tickets
  for each row execute function public.set_updated_at();

alter table public.feedback_tickets enable row level security;
alter table public.ticket_messages  enable row level security;

-- is the caller org owner OR an owner/admin member? (mirrors is_org_member in 0002)
create or replace function public.is_org_admin(org uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.organizations o
                 where o.id = org and o.owner_id = auth.uid())
      or exists (select 1 from public.organization_members m
                 where m.organization_id = org and m.user_id = auth.uid()
                   and m.role in ('owner','admin'));
$$;

-- feedback_tickets: members read all org tickets; insert only as self in own org;
-- only owner/admin update (status triage), can't move cross-tenant.
drop policy if exists feedback_tickets_select_member on public.feedback_tickets;
create policy feedback_tickets_select_member on public.feedback_tickets
  for select using (public.is_org_member(organization_id));
drop policy if exists feedback_tickets_insert_member on public.feedback_tickets;
create policy feedback_tickets_insert_member on public.feedback_tickets
  for insert with check (public.is_org_member(organization_id) and created_by = auth.uid());
drop policy if exists feedback_tickets_update_admin on public.feedback_tickets;
create policy feedback_tickets_update_admin on public.feedback_tickets
  for update using (public.is_org_admin(organization_id))
  with check (public.is_org_admin(organization_id));

-- ticket_messages: members read org threads; post only as self in own org on a
-- ticket that belongs to that org. Immutable: no UPDATE/DELETE policy.
drop policy if exists ticket_messages_select_member on public.ticket_messages;
create policy ticket_messages_select_member on public.ticket_messages
  for select using (public.is_org_member(organization_id));
drop policy if exists ticket_messages_insert_member on public.ticket_messages;
create policy ticket_messages_insert_member on public.ticket_messages
  for insert with check (
    public.is_org_member(organization_id) and author_id = auth.uid()
    and exists (select 1 from public.feedback_tickets t
                where t.id = ticket_id and t.organization_id = organization_id));

-- Notes:
--  * Platform super-admin (isAdminEmail allow-list) triages cross-org via the
--    SERVICE-ROLE client (bypasses RLS), same path as getAdminStats().
--  * created_by/author_id are set server-side from the session; auth.uid() checks
--    above are the DB backstop. page_context is route/url/user_agent only.
