---
name: sample-report
description: Produce a founder-facing sample lead report for The Leads Nest validation campaign — a short report of scored public posts with title, link, why-it's-a-lead, and a safe reply draft. Use when generating the 10 free sample reports or a single demo report for outreach.
user-invocable: true
---

# Sample lead report (validation)

Goal: prove lead quality to a target founder/agency so they'll pay $19–$49/mo.
Bar: across 10 reports, **≥5 contain a genuinely useful lead**.

## What goes in one report
For the target's product + ICP, surface 3–5 **real public posts** (Reddit
official API / Hacker News / RSS / manual paste — never scraping) and for each:
- **Score + tier** (high/medium/low) and the one-line reason.
- **Title + link** to the public thread.
- **Buying signals** and any **disqualifiers**.
- A **reply draft** that includes the affiliation disclosure and reads helpful,
  not promotional — plus the reminder that the founder posts it themselves.

## How to generate (demo mode, no keys)
1. Create a project with the target's product/ICP/keywords (use the app in demo
   mode or the in-memory seed as a template).
2. Run scoring over the candidate posts; keep only medium/high that aren't
   disqualified. Be honest — a short, high-quality report beats a padded one.
3. Render the report on-brand (The Crest voice: plain, helpful, no hype, no
   emoji). Save under `docs/` or hand to the user to send.

## Guardrails
- No guaranteed-leads language. No spammy templates. Disclose affiliation in
  every draft. Note that the user is responsible for each platform's rules.
- Track per report: delivered? ≥1 useful lead confirmed? willing to pay? Feed
  results to the `gtm-validation` agent against the success/kill metrics.
