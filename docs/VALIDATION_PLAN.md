# Validation Plan

LeadParrot is built **validation-first**. The goal of v1 is to learn whether founders/agencies will pay for curated, high-intent lead reports — *before* investing in advanced integrations.

## Principle

> Don't build a generic social-listening platform. Validate one narrow niche, deliver real value manually if needed, and only build the integrations people actually ask for.

## Recommended first niche

**AI SaaS founders looking for customers from Reddit and startup communities.**

Narrow, reachable, and full of people who already understand the value of being early to a relevant thread.

## Manual MVP (do this before scaling integrations)

You can run the core loop manually using LeadParrot's scoring + reply drafting:

1. Ask a founder for their **product website** and **ideal customer profile (ICP)**.
2. Manually search Reddit / Hacker News / Google for ~20 relevant public conversations.
3. Score them (use the **Demo Search** page or a project + manual posts) to rank intent.
4. Send a **daily report** containing, per lead:
   - title
   - link
   - why it's relevant
   - a suggested reply
   - a confidence score
5. **Ask for payment after 2 useful reports.**

This validates the value proposition with almost no engineering.

## Validation steps before advanced integrations

1. Manually create **10 lead reports for 10 founders/agencies**.
2. Ask each which leads were useful.
3. Track whether they would pay **$19–$49/month**.
4. Build only the source integrations people actually request.
5. Validate **one niche first** before broadening.

## Success criteria

- 10 users try the free report.
- ≥ 5 say at least one lead was useful.
- ≥ 3 agree to pay **$19–$49/month**.

**Kill / pivot rule:** if **fewer than 2 of 10** find value, pivot niche or kill the idea.

## How the product supports this plan

- **Demo Search** (`/demo`) lets a prospect see scoring on their own example with zero setup.
- **Manual sources** let you score any pasted public post immediately — perfect for hand-built reports.
- **Daily digest preview** (`/app/digest`) renders the exact "top 5 opportunities" email even without Resend configured.
- **Deterministic mock AI** means you can demo consistent output without API costs.
- **Usage limits + plans** are already wired, so converting a validated user to paid is a config change, not a build.

## What to measure

| Metric | Target |
| --- | --- |
| Reports delivered | 10 |
| "At least one useful lead" | ≥ 5 / 10 |
| Willing to pay $19–$49/mo | ≥ 3 / 10 |
| Time to build a report | trending down |
| Most-requested source | informs next integration |

## After validation

Only then invest in: scheduled background scans, the web-search integration (SerpAPI/Tavily/Exa/Bing), more communities, team/agency multi-client features, and white-label digests.
