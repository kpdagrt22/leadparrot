# Platform Safety

LeadParrot is intentionally a **discovery and drafting** tool, not an outreach-automation system. This document states the hard rules the product follows and the responsibilities of users.

## What LeadParrot does NOT do

- **Does not auto-post.** It never posts comments, answers, or threads on your behalf.
- **Does not auto-DM.** It never sends direct messages to anyone.
- **Does not scrape private communities.** It never accesses login-protected, paywalled, or private content.
- **Does not bypass protections.** It respects `robots.txt`, API terms, rate limits, and platform restrictions.
- **Does not impersonate.** It never generates replies pretending to be an unaffiliated customer, and never fabricates testimonials or claims.

## What LeadParrot does

- **Uses official APIs where possible.** Reddit's official OAuth read-only API; Hacker News' public Algolia search API; user-provided public RSS/Atom feeds.
- **Respects rate limits.** Conservative result caps per scan, cached app tokens, gentle revalidation windows.
- **Drafts transparent replies.** Every generated reply leads with genuine help and **discloses affiliation** before mentioning your product.
- **Keeps you in control.** You review every draft and decide whether (and where) to respond. Copy never posts anything.
- **Collects minimal data.** Only public post title, link, excerpt, and AI analysis are stored — never extra personal data about authors.

## Rules for generated replies

- Replies must be **helpful first**, with 1–2 genuinely useful suggestions before any product mention.
- Replies **must disclose affiliation** ("I'm building / I'm affiliated with…").
- **Do not use generated replies for spam.** Do not blast the same reply across many threads — personalize each one.
- **Avoid copying the same reply repeatedly.** Reuse is the fastest way to get flagged and to harm your reputation.
- No aggressive CTAs, no false claims, no pressure.

## User responsibilities

- **You are responsible for following each platform's rules before responding.** Subreddit self-promotion rules, forum guidelines, and community norms vary — read them first.
- For **EU/UK/Canada/Australia** users: avoid unsolicited outreach without a proper lawful basis/consent. Public, on-topic, disclosed replies in a forum thread are different from cold outreach — know the difference (see [COMPLIANCE.md](COMPLIANCE.md)).
- Honor opt-outs and community moderators' decisions.

## In-product enforcement & reminders

- Persistent disclaimer across the app: *"LeadParrot helps you discover public conversations and draft replies. You are responsible for following each platform's rules before responding."*
- Lead detail copy notice: *"LeadParrot does not post for you. Review the platform's rules before responding."*
- Reply drafts ship with **safety notes** and a **suggested disclosure** line.
- AI scoring surfaces **risk flags** (e.g. "Reddit self-promotion rules vary by subreddit").
- Source integrations that aren't configured fall back to **demo data + setup instructions** rather than scraping.

## Summary

LeadParrot is a discovery and drafting tool, **not** an outreach-automation system. Used as intended — to find public conversations and craft genuinely helpful, disclosed replies you post yourself — it keeps you safe, useful, and welcome in the communities you participate in.
