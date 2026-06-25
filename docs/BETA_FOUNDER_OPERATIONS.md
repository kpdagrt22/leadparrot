# LeadParrot — Founder Beta Operations Kit

This is the hands-on playbook for validating LeadParrot with your **first 10 founders or agencies**. It tells you who to talk to, where to find them, exactly what to say, how to run the demo, what to charge, and the numbers that tell you to keep going or stop.

LeadParrot is a **platform-safe** lead-discovery and AI reply-draft tool. It surfaces *public* conversations where someone is asking for what you sell, scores them, and drafts a reply you copy and post **yourself**. It does **not** auto-post, auto-DM, scrape private or paywalled sources, or run browser automation. That safety promise is the product. Every word of outreach in this kit must honor it — you are selling a research-and-draft assistant, never a spam machine.

> Quick context for the demo: LeadParrot runs end-to-end with **zero secrets**. With no Supabase keys it boots in **demo mode** with seeded in-memory data, and the AI layer defaults to `AI_PROVIDER=mock` (deterministic scoring and replies, no API calls). So you can run a full live demo on a laptop with nothing configured. See `README.md` and `.env.example` for the full list of optional integrations.

---

## 1. Recommended first niche: AI SaaS founders and small agencies

Pick **one** niche for the first 10 conversations. Do not spread across local services, e-commerce, and B2B all at once — you will not be able to tell signal from noise. The recommended starting niche is **AI SaaS founders and small marketing/dev agencies**.

Why this niche first:

- **They already live in public communities.** Indie Hackers, Hacker News, founder Slacks, and X/Twitter are where they spend time. The exact conversations LeadParrot is built to find are the conversations they themselves read every day, so the value is obvious without a long explanation.
- **They understand what a lead is worth.** A SaaS founder closing a $49/mo plan or an agency landing a $2k retainer already does the math on customer acquisition cost. You do not have to teach them why a high-intent lead matters.
- **They give feedback fast and bluntly.** This crowd is comfortable replying to a cold email, hopping on a 15-minute call, and telling you exactly what is wrong. That tightens your loop from weeks to days.
- **They are comfortable with new tools.** No hand-holding through "what is a dashboard." They will click around, paste a post, and stress-test the scoring on their own.
- **They are willing to pay $19–49/month** for something that saves them time finding customers — it is a rounding error against their other SaaS spend, and they expense it without a procurement process.

Once you have a repeatable win here, you can expand to adjacent niches (B2B consultants, dev-tool companies, then broader). Niche first, generalize later.

---

## 2. Where to prospect (sources)

These are places to **find founders/agencies to talk to**, and also the public communities LeadParrot itself can surface conversations from. Use them manually.

- **Indie Hackers** — founders posting about growth, launches, and "how do I get my first users."
- **Hacker News** — "Show HN" threads, "Ask HN: how do you find customers," and Who-is-hiring / Who-wants-to-be-hired threads.
- **Reddit** — allowed startup/SaaS communities (e.g. r/SaaS, r/startups, r/Entrepreneur, r/microsaas). Read the community rules; participate where self-promo is permitted, never where it is banned.
- **X / Twitter** — manual search for build-in-public founders and "looking for a tool that…" posts.
- **LinkedIn** — manual search for agency owners and founders by title and industry.
- **Founder Slack / Discord communities** — only where the community rules **allow** it. Be a member, not a drive-by.
- **Product Hunt** — makers who just launched are actively thinking about distribution.
- **AI tool and agency directories** — listings of small agencies and AI SaaS products you can browse for fit.

> **Hard rule for all of the above: DO NOT automate outreach.** No bots, no mass-DM tools, no scraping for email lists. Find people manually, read what they actually wrote, and contact them like a human. This is both an ethics rule and a survival rule — automated spam gets you banned from every one of these communities and poisons the brand you are trying to build. LeadParrot's own ingestion uses **official APIs only** (the schema's `source_type` values are `reddit`, `hackernews`, `rss`, `manual`, and a reserved `web_search_placeholder`); web-search keys like Tavily/Exa/SerpAPI are placeholders reserved for official search APIs, never scraping.

---

## 3. Good vs bad beta prospects

You are not trying to talk to everyone. You want 10 people who can give you a real signal.

### Good beta prospect
- Founder or agency owner who **actively looks for customers** today (cold outreach, communities, content).
- Sells something with a **clear ideal customer** they can describe in one sentence.
- Already spends time in public communities and gets that leads come from conversations.
- Has a **real budget** and pays for tools without a committee.
- Will give you **15 minutes** and an honest opinion.
- Has a live product URL you can actually run a sample report against.

### Bad beta prospect
- Wants a **fully automated spam cannon** ("can it just DM 500 people a day?"). Wrong product, and a values mismatch — politely decline.
- **Pre-product / pre-idea**, with no ICP and nothing to sell yet.
- **No budget** and no intention of ever paying.
- Expects you to do their entire sales process for free, forever.
- In a niche with **no public conversation footprint** (nothing to surface).
- Will only "give feedback" if you build five custom features first.

Aim your 30 first-week contacts at the **good** column. One enthusiastic good-fit user is worth twenty tire-kickers.

---

## 4. The offer (manual, service-assisted)

For the beta, you do the work by hand and charge a small price. This is **concierge validation** — you are testing whether the *output* is valuable before you automate everything.

> **The offer (say it just like this):**
> "I'll send you **20 high-intent public conversations per week** — real posts where people are asking for a tool like yours — each with a suggested reply you can copy and post yourself. You stay 100% in control; nothing is ever posted or messaged automatically. **Beta price: $19–49/month**, and your first sample report is free."

Notes on running it:
- You assemble the report **using LeadParrot itself** (run scoring, generate the reply draft, copy it). The tool does the heavy lifting; you do the curation.
- "Public conversations" only. No private groups, no paywalled content, no scraped DMs.
- Every reply draft is a **suggestion to copy manually** — make that explicit every single time.

---

## 5. Outreach templates

All of these are **manual, one-to-one**. Personalize every send. No mail-merge blasts, no DM automation, no buying lists.

### 5a. Cold email

> **Subject:** Found a few people asking for tools like yours
>
> Hi {First name},
>
> I came across {product/agency} and noticed you're {building / running} {one specific true detail}.
>
> I run a small tool that finds **public conversations** where people are openly asking for exactly what you offer — think Reddit threads, Hacker News posts, indie founder communities — and scores them for buying intent.
>
> I'd like to send you a **free 5-lead sample report**: 5 real public posts from people who look like your ideal customers this week, each with a short suggested reply you could post yourself. No automation, nothing gets posted on your behalf — you stay fully in control.
>
> Want me to put one together? Just reply with your product URL and a one-line description of your ideal customer, and I'll send it over in a day or two.
>
> Cheers,
> {Your name}

### 5b. LinkedIn DM

> Hi {First name} — saw you {run/founded} {company}. I built a small tool that surfaces **public** posts where people are asking for tools like yours and drafts a reply you can post yourself (nothing automated, nothing posted for you).
>
> Happy to send a **free 5-lead sample** for {company} — just share your product URL and who your ideal customer is. No pitch, genuinely curious if the leads are useful to you.

### 5c. Community post (only where self-promo is allowed)

> **Title:** Built a tool that finds public posts where people ask for products like yours — want a free sample?
>
> Hey all — I'm validating a small tool that scans **public** communities for conversations where someone is actively looking for a product like yours, scores them for buying intent, and drafts a reply you can copy and post **yourself**. It never auto-posts, auto-DMs, or scrapes anything private — you stay in full control.
>
> I'll hand-make a **free 5-lead sample report** for the first few founders/agencies who comment. Drop your product URL + your ideal customer in a reply (or DM me) and I'll send one over. Feedback is all I'm after.

> **Spam reminder for every template above:** manual only. No auto-posting, no auto-DM, no list-buying, no scraping. If a community bans self-promotion, do not post there — find those people somewhere they welcome it. Getting flagged as a spammer once can end your beta.

---

## 6. The 11-step live demo script

Run this on a call or screen-share. It works in **demo mode with zero setup** (seeded data, `AI_PROVIDER=mock`). Aim for ~10 minutes.

1. **Create a project.** Show how fast it is — one project per product line. (Schema: `projects` holds the product description, ICP, keywords, and competitors.)
2. **Enter the product + ICP.** Paste their real product description and ideal-customer profile into the project (`product_description`, `ideal_customer_profile`).
3. **Add keywords.** Add a few positive keywords and one or two negative keywords (`keywords`, `negative_keywords`) so they see how targeting works.
4. **Paste a sample public post.** Use a real public post that fits their niche (a `manual` source). This grounds the demo in something they recognize.
5. **Run AI scoring.** Trigger scoring and show the four sub-scores plus the overall — intent, relevance, urgency, fit, and overall (`lead_candidates.intent_score / relevance_score / urgency_score / fit_score / overall_score`).
6. **Show the reason + buying signals.** Read out the `reason`, the detected `pain_points` and `buying_signals`, and the `lead_stage` (e.g. `problem-aware`, `buying-intent`, `competitor-switching`). This is the "why is this a lead" moment — usually where they lean in.
7. **Generate a reply draft.** Produce the suggested reply (`reply_drafts.draft_text`) in the chosen tone.
8. **Show the disclosure + safety notes.** Point at `suggested_disclosure` and `safety_notes` — the built-in nudge to disclose you're the maker and reply helpfully, not spammily. This is the safety story made visible.
9. **Copy the reply manually.** Hit copy. Emphasize: **the tool stops here.** It puts the draft on your clipboard; *you* decide whether and where to post it. Nothing is ever posted automatically (`reply_drafts.status` moves to `copied`).
10. **Show the inbox + digest preview.** Show the scored leads inbox sorted by overall score and the daily email digest preview (in demo / no-Resend mode this is an in-dashboard preview, not a real send).
11. **Explain pricing.** Walk through the plans (next section) and make the beta offer: free 5-lead sample, then $19–49/mo.

---

## 7. Pricing test

Test these price points during the beta. The goal is to learn **what people will actually pay**, not to maximize revenue on day one.

| Plan | Price | Who it's for |
|------|-------|--------------|
| **Starter** | **$19/mo** | Solo founder, one product, light volume |
| **Pro** | **$49/mo** | Active founder/small agency, more projects + leads |
| **Agency** | **$99/mo** | Agency running lead-gen for multiple clients |
| **Manual beta report** | **$49 one-off** | Done-for-you weekly report you assemble by hand |

These map to the plan tiers already in the schema (`subscriptions.plan` ∈ `free / starter / pro / agency`). Billing is optional in the codebase — if Stripe keys aren't set, the billing UI simply shows "Billing not configured," so during early beta you can collect payment manually (invoice, Stripe payment link) and still validate willingness to pay.

The single most important pricing question: **will anyone pay $19?** If not, the rest is academic (see kill metrics).

---

## 8. Success metrics

Track these honestly. Contacted = real personalized outreach, not a blast.

### First 7 days
- **30** founders/agencies contacted
- **10** sample reports offered
- **5** sample reports actually delivered
- **3** people say **at least one lead was useful**
- **1** person **pays** (any plan or the $49 report)

### First 30 days
- **100** contacted
- **30** reports offered
- **15** reports delivered
- **8** people say a lead was useful
- **3** people paying

If you are hitting these, you have early product-market signal. Keep going and start automating the manual parts.

---

## 9. Kill metrics (stop or pivot if…)

Be ruthless here. These are the signals that the current shape of the product isn't working:

- **Fewer than 2 useful leads out of 10** delivered in a report — the core output isn't good enough.
- **Nobody will pay even $19** after seeing real value — no willingness to pay.
- **Source quality is poor** — the public conversations you can legitimately surface are too thin or too noisy in the niche.
- **Users only want spam automation** — the demand is for auto-DM / auto-post, which LeadParrot will never do. Wrong market, not a fixable feature gap.
- **The manual work is too heavy** — assembling a report by hand takes so long it can never be priced profitably or automated.
- **Platform / source risk is too high** — the communities or APIs you depend on make even compliant, manual use untenable.

Hitting a kill metric doesn't always mean shut down — it may mean change the niche, change the sources, or change the offer. But don't keep grinding against a clear "no."

---

## 10. Feedback questions (ask every beta user)

Keep it short — these are the ten that matter. Capture answers in a simple sheet.

1. What's your **product URL**?
2. Who is your **ideal customer** (in one sentence)?
3. What are your **current lead channels** today (how do you find customers now)?
4. On a scale of **1–10, how useful** was this report?
5. Did **any lead match your ICP**? Which one, and why?
6. Would you actually **reply** to any of these posts?
7. Would you **pay** for this? (yes/no)
8. What **price** feels comfortable — $19, $49, $99, or other?
9. Is there a **source we're missing** where your customers hang out?
10. What's your **main objection** or the one thing that would stop you from using it?

---

## Appendix: running LeadParrot for a demo

Zero secrets required. Useful npm scripts (`package.json`):

- `npm run dev` — start the app locally (boots in **demo mode** with seeded data when Supabase keys are absent).
- `npm run build` — production build.
- `npm test` — run the unit tests (Vitest).
- `npm run typecheck` — TypeScript check (`tsc --noEmit`).
- `npm run lint` — ESLint.
- `npm run verify:env` — sanity-check your environment / feature flags before a demo.

Defaults that make the demo painless: no Supabase → **demo mode** (in-memory seeded data, demo user treated as admin); `AI_PROVIDER=mock` → deterministic scoring and reply drafts with no API calls or cost. Optional integrations (real Supabase, OpenAI/Anthropic, Reddit API, Resend email, Stripe billing) can be switched on later via `.env.local` as you graduate from concierge beta to self-serve. Database schema and tenant isolation live in `supabase/migrations/0001_init.sql` (schema) and `supabase/migrations/0002_rls.sql` (row-level security — every table is organization-scoped).
