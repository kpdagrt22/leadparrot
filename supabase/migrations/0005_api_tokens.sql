-- ============================================================================
-- The Leads Nest — 0005: per-user revocable API tokens (browser extension)
-- The extension authenticates with a hashed bearer token (we store only the
-- SHA-256 hash). Org-scoped + RLS for management; the capture route resolves a
-- token via the service-role client (bypasses RLS) then operates org-scoped.
-- ============================================================================

create table if not exists public.api_tokens (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  name text not null default 'Browser extension',
  token_hash text not null unique,
  token_prefix text not null,
  last_used_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists idx_api_tokens_org  on public.api_tokens(organization_id);
create index if not exists idx_api_tokens_hash on public.api_tokens(token_hash);

alter table public.api_tokens enable row level security;
drop policy if exists api_tokens_member_all on public.api_tokens;
create policy api_tokens_member_all on public.api_tokens
  for all using (public.is_org_member(organization_id))
  with check (public.is_org_member(organization_id));
