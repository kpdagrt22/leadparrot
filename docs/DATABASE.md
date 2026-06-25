# Database

Postgres on Supabase. Migrations live in [`supabase/migrations`](../supabase/migrations):

- `0001_init.sql` — schema, triggers, indexes.
- `0002_rls.sql` — Row Level Security.

## Tables

| Table | Purpose | Key columns |
| --- | --- | --- |
| `profiles` | 1:1 with `auth.users` | `id` (= auth uid), `full_name`, `email` |
| `organizations` | Tenant root | `owner_id`, `name`, `business_type`, `reply_tone`, `daily_digest_enabled` |
| `organization_members` | Membership + role | `organization_id`, `user_id`, `role` (owner/admin/member) |
| `projects` | One product/service | `product_description`, `competitors[]`, `keywords[]`, `negative_keywords[]` |
| `sources` | Where to look | `source_type`, `config` (jsonb), `enabled`, `last_checked_at` |
| `source_runs` | Scan history | `status` (pending/running/success/error), `items_found`, `error_message` |
| `raw_posts` | Fetched public posts | **`(organization_id, source_type, external_id)` unique** (per-tenant de-dupe), `title`, `body`, `url`, `posted_at`, `raw_json` |
| `lead_candidates` | Scored leads | 4 sub-scores + `overall_score`, `lead_stage`, `status`, `pain_points[]`, `buying_signals[]`, `disqualifiers[]`, `risk_flags[]`, `reason`, `suggested_angle`, `confidence` |
| `reply_drafts` | AI replies | `draft_text`, `tone`, `why_this_reply`, `suggested_disclosure`, `safety_notes[]`, `status`, `copied_at` |
| `saved_leads` | Bookmarks | unique `(organization_id, lead_candidate_id)`, `notes` |
| `ai_scoring_logs` | Provider audit | `provider`, `model`, `input_json`, `output_json`, `status`, `error_message` |
| `digest_emails` | Digest sends | `subject`, `sent_to`, `lead_count`, `status`, `sent_at` |
| `usage_events` | Metering | `event_type` (`post_scanned`/`reply_drafted`), indexed by `(org, type, created_at)` |
| `subscriptions` | Billing | unique per org, `plan`, `status`, `stripe_*`, `current_period_end` |

Every app table carries `organization_id` for scoping. Most use `gen_random_uuid()` primary keys.

## Triggers

- `handle_new_user` (on `auth.users` insert) → auto-creates a `profiles` row from auth metadata.
- `handle_new_org` (on `organizations` insert) → adds the owner as an `owner` member so RLS membership checks pass immediately.
- `set_updated_at` → maintains `updated_at` on profiles/organizations/projects/sources/lead_candidates/reply_drafts/subscriptions.

## Cascades

Deleting an organization cascades to all child rows (`ON DELETE CASCADE`). Deleting a `raw_post` cascades to its `lead_candidates`, which cascade to `reply_drafts` and `saved_leads`. This supports clean tenant + content deletion (see [COMPLIANCE.md](COMPLIANCE.md)).

## Row Level Security

RLS is enabled on **all** app tables. Access is gated on **organization membership**:

```sql
create function public.is_org_member(org uuid) returns boolean
  language sql stable security definer ...
  -- exists(select 1 from organization_members where organization_id = org and user_id = auth.uid())
```

- `profiles`: a user reads/updates **only their own** row.
- `organizations`: members can `select`; the **owner** can insert/update/delete.
- `organization_members`: members can read their org's membership. INSERT is restricted to adding **yourself** to an org **you own** (the owner row is created by the `handle_new_org` SECURITY DEFINER trigger). This prevents a user from self-inserting into an arbitrary org — which, since `is_org_member` ignores role, would otherwise be a cross-tenant privilege-escalation path. v1 has no invite flow.
- **All other org-scoped tables** (`projects`, `sources`, `source_runs`, `raw_posts`, `lead_candidates`, `reply_drafts`, `saved_leads`, `ai_scoring_logs`, `digest_emails`, `usage_events`, `subscriptions`): a single uniform `FOR ALL` policy — `using (is_org_member(organization_id)) with check (is_org_member(organization_id))`.

`is_org_member` is **`SECURITY DEFINER`** to avoid recursive policy evaluation on `organization_members`.

### RLS assumptions (documented for tests)

1. A user can only read/write rows whose `organization_id` is one they are a member of. **No cross-organization leakage.**
2. The **service role** key bypasses RLS and is used only by trusted server-side ingestion/admin code (`getAdminStore()` / `createAdminSupabase()`), never exposed to the browser.
3. `auth.uid()` is the source of truth for identity; the `SupabaseStore` also filters by `organization_id` explicitly as defense-in-depth.
4. Background scans write via the service role (so ingestion isn't blocked by the acting user's session), while user-facing reads/writes go through the user-scoped client and are RLS-enforced.

## Applying migrations

```bash
supabase db push          # CLI, recommended
# or paste 0001_init.sql then 0002_rls.sql into the SQL editor, in order
```
