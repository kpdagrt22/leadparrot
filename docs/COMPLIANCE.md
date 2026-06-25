# Compliance

This document describes LeadParrot's posture on data protection and lawful, respectful use. It is **not legal advice** — consult a qualified professional for your jurisdiction and use case.

## Data minimization

LeadParrot stores only what's needed to surface and act on a lead:

- Public post **title, link, excerpt**, and **author display handle** (as shown publicly).
- AI **analysis** (scores, reason, pain points, suggested angle, risk flags).
- Your **organization/project configuration** and **usage counters**.

It does **not** build profiles of post authors, enrich personal data, or store private contact information. Raw post payloads are kept only as needed for display and de-duplication.

## Lawful basis & unsolicited outreach (EU/UK/Canada/Australia)

LeadParrot is a **discovery + drafting** tool. It surfaces **public** conversations and helps you write a **public, on-topic, disclosed reply** that you post yourself.

- Replying publicly to a public post you were invited (by its nature) to engage with is different from **cold unsolicited outreach**.
- Do **not** use LeadParrot's outputs to send unsolicited DMs or emails. v1 deliberately ships **no** outbound email/DM automation.
- For users subject to **GDPR/UK GDPR**, **CASL** (Canada), or the **Spam Act** (Australia): ensure you have a lawful basis/consent before any direct, unsolicited contact. Public forum participation with disclosure is the intended use.

## Platform terms

- Use official APIs and respect their terms, scopes, and rate limits (Reddit API, HN/Algolia, RSS).
- Never bypass `robots.txt`, authentication, or paywalls.
- Follow each community's self-promotion and conduct rules before posting.

## Subject rights & deletion

When using Supabase:

- Organization data is **RLS-scoped**; users access only their own org.
- Deleting an organization cascades to its projects, sources, posts, leads, drafts, logs, and usage events (see `ON DELETE CASCADE` in [`docs/DATABASE.md`](DATABASE.md)).
- To honor a removal request for a stored public post, delete the corresponding `raw_posts` / `lead_candidates` rows (cascades to drafts).

## Secrets & security

- The **service-role key** bypasses RLS and is used **server-side only** (ingestion/admin). Never expose it to the browser.
- Stripe webhook signatures are verified (HMAC-SHA256) before any state change.
- AI provider keys and source credentials are read server-side from env and never sent to the client.

## AI content integrity

- Generated replies must be truthful and disclose affiliation. The system prompt forbids fake identities, fabricated testimonials, and false claims (see [`docs/AI_SCORING_WORKFLOW.md`](AI_SCORING_WORKFLOW.md)).
- Users are responsible for reviewing and editing drafts before posting.

## Summary checklist

- [x] Minimal personal data stored
- [x] No unsolicited email/DM automation in v1
- [x] Official APIs, rate limits, robots.txt respected
- [x] RLS isolation + cascading deletes
- [x] Service role server-side only; webhook signatures verified
- [x] Disclosure-first, truthful AI replies
