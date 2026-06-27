---
name: platform-safety-audit
description: Run before merging or shipping any change that touches sources, scanning, reply drafting, notifications, or scraping/fetching. Verifies The Leads Nest stays platform-safe — no auto-posting, no auto-DM, no private scraping, no ToS evasion — and that every reply carries an affiliation disclosure. Use when the user asks to "safety check", "compliance check", or review a source/reply/notification change.
user-invocable: true
---

# Platform-safety audit

The Leads Nest's differentiator is that it is **safe by design**. This audit is a
hard gate on any change to fetching, scoring, drafting, or notifications.

## 1. Sources & fetching — must ALL be true
- [ ] Data comes only from **official APIs or manual paste** (Reddit official
      OAuth read-only, Hacker News public API, public RSS, manual). Web-search is
      reserved for official APIs (Tavily/Exa/SerpAPI) — **no scraping fallback**.
- [ ] No browser automation, no login/paywall bypass, no Google/SERP scraping.
- [ ] Reddit/HN/RSS are **read-only**. There is **no commenting/posting/DM** code
      path anywhere (grep for `post`, `comment`, `submit`, `dm`, `message` in
      `src/lib/sources/` and route handlers and confirm none write to a platform).
- [ ] Unconfigured sources **degrade to demo data + a setup note**, never throw.

## 2. Reply drafting — must ALL be true
- [ ] Output is **copy-only**. No endpoint posts/sends a reply to any platform.
- [ ] Every draft has a **non-empty affiliation disclosure** (`enforceReplySafety`)
      and safety notes; the UI shows the "you post this yourself" disclaimer.
- [ ] No fake identity, no urgent/pushy CTA, no repeated copy-paste spam template.

## 3. Notifications/alerts — must ALL be true
- [ ] Every alert (email/SMS/WhatsApp) targets the **account owner** about THEIR
      leads. **No message is ever sent to a prospect/lead or any third party.**
- [ ] Recipient address/number comes from the org's own verified settings, never
      from scraped or lead-derived contact info.

## 4. Secrets & failure modes
- [ ] No secrets in logs/errors/pages/docs. No service-role key client-side.
- [ ] Optional integrations **fail safe** (disabled + note), never fail open.

## How to run
1. `git diff` the change; grep the touched area for the patterns above.
2. Walk each touched source/route/notification path end-to-end.
3. If anything is ambiguous, delegate to the `security-compliance` agent.
4. **Verdict:** PASS, or list each violation with file:line and the required fix.
   A single unresolved violation blocks the merge.
