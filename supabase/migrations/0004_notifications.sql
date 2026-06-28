-- ============================================================================
-- The Leads Nest — 0004: account-owner notification settings + delivery log
-- Forward-only and idempotent. Alerts go ONLY to the account owner's own
-- verified email/phone (from these org settings) — never to a lead.
-- ============================================================================

alter table public.organizations
  add column if not exists notify_email_enabled    boolean not null default false,
  add column if not exists notify_sms_enabled       boolean not null default false,
  add column if not exists notify_whatsapp_enabled  boolean not null default false,
  add column if not exists notify_phone             text,
  add column if not exists notify_email_verified    boolean not null default false,
  add column if not exists notify_phone_verified    boolean not null default false,
  add column if not exists high_intent_threshold    integer not null default 70,
  add column if not exists quiet_hours_start        integer,
  add column if not exists quiet_hours_end          integer,
  add column if not exists digest_hour              integer not null default 13;

alter table public.organizations drop constraint if exists chk_org_threshold_range;
alter table public.organizations
  add constraint chk_org_threshold_range check (high_intent_threshold between 0 and 100);

alter table public.organizations drop constraint if exists chk_org_hours_range;
alter table public.organizations
  add constraint chk_org_hours_range check (
    (quiet_hours_start is null or quiet_hours_start between 0 and 23) and
    (quiet_hours_end   is null or quiet_hours_end   between 0 and 23) and
    (digest_hour between 0 and 23)
  );

-- ---------------------------------------------------------------------------
-- Delivery log: one row per channel send/skip. Used for dedupe + an audit
-- trail. `target` is the OWNER's own address (their settings), never lead data.
-- ---------------------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  channel text not null check (channel in ('email','sms','whatsapp')),
  event   text not null,
  status  text not null check (status in ('sent','skipped','error','preview')),
  target  text,
  detail  text,
  created_at timestamptz not null default now()
);
create index if not exists idx_notifications_org_event_time
  on public.notifications(organization_id, event, created_at);

alter table public.notifications enable row level security;
drop policy if exists notifications_member_all on public.notifications;
create policy notifications_member_all on public.notifications
  for all using (public.is_org_member(organization_id))
  with check (public.is_org_member(organization_id));
