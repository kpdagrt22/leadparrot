import type {
  Profile,
  Organization,
  Project,
  Source,
  RawPost,
  LeadCandidate,
  ReplyDraft,
  Subscription,
} from "@/lib/types";

export const DEMO_USER_ID = "00000000-0000-4000-8000-000000000001";
export const DEMO_ORG_ID = "00000000-0000-4000-8000-000000000010";
export const DEMO_PROJECT_ID = "00000000-0000-4000-8000-000000000100";
export const DEMO_USER_EMAIL = "demo@leadparrot.app";

const T = (iso: string) => iso;

export interface SeedData {
  profiles: Profile[];
  organizations: Organization[];
  projects: Project[];
  sources: Source[];
  rawPosts: RawPost[];
  leads: LeadCandidate[];
  replyDrafts: ReplyDraft[];
  subscriptions: Subscription[];
}

/**
 * Build the demo dataset. Returns fresh objects each call so the in-memory
 * store can be reset cleanly between test runs.
 */
export function buildSeed(): SeedData {
  const now = T("2026-06-26T08:00:00.000Z");

  const profile: Profile = {
    id: DEMO_USER_ID,
    full_name: "Demo Founder",
    email: DEMO_USER_EMAIL,
    created_at: T("2026-06-01T08:00:00.000Z"),
    updated_at: now,
  };

  const organization: Organization = {
    id: DEMO_ORG_ID,
    owner_id: DEMO_USER_ID,
    name: "Acme Proposals",
    website: "https://acmeproposals.example.com",
    business_type: "saas",
    description: "AI proposal generator for freelancers.",
    target_geography: "US, Canada, UK",
    reply_tone: "founder-like",
    notification_email: DEMO_USER_EMAIL,
    daily_digest_enabled: true,
    notify_email_enabled: true,
    notify_sms_enabled: false,
    notify_whatsapp_enabled: false,
    notify_phone: null,
    notify_email_verified: true,
    notify_phone_verified: false,
    high_intent_threshold: 70,
    quiet_hours_start: null,
    quiet_hours_end: null,
    digest_hour: 13,
    created_at: T("2026-06-01T08:00:00.000Z"),
    updated_at: now,
  };

  const project: Project = {
    id: DEMO_PROJECT_ID,
    organization_id: DEMO_ORG_ID,
    name: "Proposal tool — Reddit + HN",
    product_description: "AI proposal generator for freelancers. Generates client-ready proposals with templates and e-signatures.",
    ideal_customer_profile: "Freelancers and small agencies sending 5+ client proposals per month.",
    competitors: ["PandaDoc", "Better Proposals", "Proposify"],
    keywords: ["proposal tool", "client proposal", "Upwork proposal", "freelance proposal", "proposal software"],
    negative_keywords: ["school proposal", "research proposal", "marriage proposal"],
    target_geography: "US, Canada, UK",
    active: true,
    created_at: T("2026-06-02T08:00:00.000Z"),
    updated_at: now,
  };

  const sources: Source[] = [
    {
      id: "00000000-0000-4000-8000-000000000201",
      organization_id: DEMO_ORG_ID,
      project_id: DEMO_PROJECT_ID,
      source_type: "manual",
      name: "Manual posts",
      url: null,
      identifier: null,
      config: {},
      enabled: true,
      last_checked_at: null,
      created_at: T("2026-06-02T08:05:00.000Z"),
      updated_at: now,
    },
    {
      id: "00000000-0000-4000-8000-000000000202",
      organization_id: DEMO_ORG_ID,
      project_id: DEMO_PROJECT_ID,
      source_type: "reddit",
      name: "r/freelance + r/Upwork",
      url: null,
      identifier: "freelance, Upwork",
      config: { subreddits: "freelance, Upwork", sort: "new", time_window: "week" },
      enabled: true,
      last_checked_at: T("2026-06-26T07:30:00.000Z"),
      created_at: T("2026-06-02T08:06:00.000Z"),
      updated_at: now,
    },
    {
      id: "00000000-0000-4000-8000-000000000203",
      organization_id: DEMO_ORG_ID,
      project_id: DEMO_PROJECT_ID,
      source_type: "hackernews",
      name: "HN — proposal software",
      url: null,
      identifier: null,
      config: { query: "proposal software" },
      enabled: true,
      last_checked_at: null,
      created_at: T("2026-06-02T08:07:00.000Z"),
      updated_at: now,
    },
  ];

  // Two pre-scored example leads so the dashboard/inbox aren't empty.
  const rawPosts: RawPost[] = [
    {
      id: "00000000-0000-4000-8000-000000000301",
      organization_id: DEMO_ORG_ID,
      project_id: DEMO_PROJECT_ID,
      source_id: sources[1].id,
      source_type: "reddit",
      external_id: "seed_reddit_1",
      title: "Frustrated with PandaDoc pricing — any cheaper alternatives?",
      body: "We've been using PandaDoc but the per-seat pricing is getting expensive as our agency grows. Anyone switched to something cheaper that still does proposals and contracts well? Need to decide this week.",
      author_display: "u/agency_ops",
      url: "https://www.reddit.com/r/agency/comments/seed1",
      permalink: "https://www.reddit.com/r/agency/comments/seed1",
      posted_at: T("2026-06-25T09:05:00.000Z"),
      raw_json: { subreddit: "agency", score: 14 },
      created_at: T("2026-06-26T07:30:05.000Z"),
    },
    {
      id: "00000000-0000-4000-8000-000000000302",
      organization_id: DEMO_ORG_ID,
      project_id: DEMO_PROJECT_ID,
      source_id: sources[1].id,
      source_type: "reddit",
      external_id: "seed_reddit_2",
      title: "Looking for a proposal tool for freelance clients — anything better than Word?",
      body: "I'm a freelance designer sending 5-10 client proposals a month. Writing them in Word is painful. Looking for a proposal tool that handles templates and e-signatures. Budget is flexible if it saves time.",
      author_display: "u/design_freelance",
      url: "https://www.reddit.com/r/freelance/comments/seed2",
      permalink: "https://www.reddit.com/r/freelance/comments/seed2",
      posted_at: T("2026-06-25T14:20:00.000Z"),
      raw_json: { subreddit: "freelance", score: 8 },
      created_at: T("2026-06-26T07:30:06.000Z"),
    },
  ];

  const leads: LeadCandidate[] = [
    {
      id: "00000000-0000-4000-8000-000000000401",
      organization_id: DEMO_ORG_ID,
      project_id: DEMO_PROJECT_ID,
      raw_post_id: rawPosts[0].id,
      title: rawPosts[0].title,
      body_excerpt: rawPosts[0].body,
      url: rawPosts[0].url,
      source_type: "reddit",
      posted_at: rawPosts[0].posted_at,
      intent_score: 82,
      relevance_score: 88,
      urgency_score: 75,
      fit_score: 70,
      overall_score: 81,
      lead_stage: "competitor-switching",
      status: "new",
      reason: "Post mentions PandaDoc (a competitor) and explicit budget pressure, with strong buying signals and a near-term decision deadline.",
      pain_points: ["Cost / pricing concerns", "Outgrowing current tool"],
      buying_signals: ["frustrated with", "alternative", "need to decide this week"],
      disqualifiers: [],
      suggested_angle: "Acknowledge the PandaDoc pricing frustration, share one concrete way to cut proposal time, then briefly mention Acme Proposals with disclosure.",
      risk_flags: ["Reddit self-promotion rules vary by subreddit — read the rules first."],
      confidence: 0.62,
      created_at: T("2026-06-26T07:31:00.000Z"),
      updated_at: T("2026-06-26T07:31:00.000Z"),
    },
    {
      id: "00000000-0000-4000-8000-000000000402",
      organization_id: DEMO_ORG_ID,
      project_id: DEMO_PROJECT_ID,
      raw_post_id: rawPosts[1].id,
      title: rawPosts[1].title,
      body_excerpt: rawPosts[1].body,
      url: rawPosts[1].url,
      source_type: "reddit",
      posted_at: rawPosts[1].posted_at,
      intent_score: 68,
      relevance_score: 84,
      urgency_score: 40,
      fit_score: 72,
      overall_score: 69,
      lead_stage: "solution-aware",
      status: "new",
      reason: "Freelancer explicitly looking for a proposal tool with templates and e-signatures; flexible budget signals real intent.",
      pain_points: ["Manual/time-consuming workflow", "Looking for templates + e-signatures"],
      buying_signals: ["looking for", "recommend", "budget is flexible"],
      disqualifiers: [],
      suggested_angle: "Lead with a concrete tip on reusable proposal templates, then mention Acme Proposals lightly with disclosure.",
      risk_flags: [],
      confidence: 0.58,
      created_at: T("2026-06-26T07:31:01.000Z"),
      updated_at: T("2026-06-26T07:31:01.000Z"),
    },
  ];

  const replyDrafts: ReplyDraft[] = [
    {
      id: "00000000-0000-4000-8000-000000000501",
      organization_id: DEMO_ORG_ID,
      project_id: DEMO_PROJECT_ID,
      lead_candidate_id: leads[0].id,
      draft_text:
        "Totally get the PandaDoc pricing pain as you add seats. One thing that helped us before switching anything: standardize 2-3 proposal templates so you're not rebuilding each one — that alone cut our prep time a lot. If you do switch, list the must-have features (e-sign, templates, analytics) and only pay for those. I'm building a small proposal tool in this space (Acme Proposals) — happy to share if it's useful, no pressure.",
      tone: "founder-like",
      why_this_reply:
        "Acknowledges the cost frustration, gives an actionable tip before any pitch, and discloses affiliation clearly.",
      suggested_disclosure: "I'm building a small proposal tool in this space (Acme Proposals) — sharing because it's relevant, not to pitch.",
      safety_notes: [
        "Disclose your affiliation before mentioning your product.",
        "Do not reuse this exact text across multiple threads — personalize it.",
        "Check the community's self-promotion rules before posting.",
      ],
      confidence: 0.55,
      status: "draft",
      copied_at: null,
      created_at: T("2026-06-26T07:32:00.000Z"),
      updated_at: T("2026-06-26T07:32:00.000Z"),
    },
  ];

  const subscriptions: Subscription[] = [
    {
      id: "00000000-0000-4000-8000-000000000601",
      organization_id: DEMO_ORG_ID,
      stripe_customer_id: null,
      stripe_subscription_id: null,
      plan: "free",
      status: "active",
      current_period_end: null,
      created_at: T("2026-06-01T08:00:00.000Z"),
      updated_at: now,
    },
  ];

  return {
    profiles: [profile],
    organizations: [organization],
    projects: [project],
    sources,
    rawPosts,
    leads,
    replyDrafts,
    subscriptions,
  };
}
