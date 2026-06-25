-- ============================================================================
-- LeadParrot — 0003: data-integrity CHECK constraints + supporting indexes
-- Forward-only and idempotent (drops constraints/indexes by name first so it
-- can be re-applied safely). The base DB started empty, so no existing rows
-- violate these ranges.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Score / confidence range constraints.
-- Defense-in-depth: the AI output schema validates 0-100 / 0-1 and the app
-- clamps before insert, but the database is the final guarantee that a bad
-- write can never persist an out-of-range score.
-- ---------------------------------------------------------------------------
alter table public.lead_candidates drop constraint if exists chk_lead_scores_range;
alter table public.lead_candidates
  add constraint chk_lead_scores_range check (
    intent_score    between 0 and 100 and
    relevance_score between 0 and 100 and
    urgency_score   between 0 and 100 and
    fit_score       between 0 and 100 and
    overall_score   between 0 and 100
  );

alter table public.lead_candidates drop constraint if exists chk_lead_confidence_range;
alter table public.lead_candidates
  add constraint chk_lead_confidence_range check (confidence between 0 and 1);

alter table public.reply_drafts drop constraint if exists chk_reply_confidence_range;
alter table public.reply_drafts
  add constraint chk_reply_confidence_range check (confidence between 0 and 1);

-- ---------------------------------------------------------------------------
-- Supporting indexes for hot lookups that previously fell back to table scans.
--   idx_runs_source        — source_runs filtered/joined by source_id
--   idx_saved_lead         — saved_leads looked up by lead_candidate_id
--   idx_ai_logs_status     — getAdminStats() counts ai_scoring_logs by status
--   idx_leads_org_status   — lead inbox "new"/"saved" filters
--   idx_digests_org_created— cron digest once-per-day idempotency probe
-- ---------------------------------------------------------------------------
create index if not exists idx_runs_source         on public.source_runs(source_id);
create index if not exists idx_saved_lead          on public.saved_leads(lead_candidate_id);
create index if not exists idx_ai_logs_status      on public.ai_scoring_logs(status);
create index if not exists idx_leads_org_status    on public.lead_candidates(organization_id, status);
create index if not exists idx_digests_org_created on public.digest_emails(organization_id, created_at);
