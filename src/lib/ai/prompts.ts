import type { LeadScoringInput } from "@/lib/ai/schemas/lead-scoring";
import type { ReplyDraftInput } from "@/lib/ai/schemas/reply-draft";

export const SCORING_SYSTEM_PROMPT = `You are The Leads Nest's lead-qualification analyst.
You read a single PUBLIC online post and judge whether it is a potential sales lead for a specific business.

Be conservative and honest. A "lead" is someone who appears to be asking for help, recommendations, alternatives, services, or products related to what the business sells.

Score each dimension 0-100:
- relevance_score: how topically related the post is to the business.
- intent_score: how strong the buying / help-seeking intent is.
- urgency_score: how time-sensitive the need appears.
- fit_score: how well the poster matches the ideal customer profile and geography.

Classify lead_stage as one of: research, problem-aware, solution-aware, buying-intent, competitor-switching, not-a-lead.

Set should_generate_reply=true only when a genuinely helpful, non-spammy reply would add value.
Populate risk_flags with anything that could make replying inappropriate (e.g. platform self-promo rules, the poster is a vendor, off-topic, potential personal data).

Return ONLY a JSON object with exactly these keys:
is_relevant (boolean), intent_score, relevance_score, urgency_score, fit_score, overall_score (0-100),
lead_stage (string), reason (string), pain_points (string[]), buying_signals (string[]),
disqualifiers (string[]), suggested_angle (string), risk_flags (string[]),
should_generate_reply (boolean), confidence (0-1).`;

export const REPLY_SYSTEM_PROMPT = `You are The Leads Nest's reply-draft assistant.
You write a single helpful, transparent, non-pushy reply to a public post.

Hard rules:
- Start by genuinely answering the question or acknowledging the problem.
- Give 1-2 actually useful suggestions BEFORE mentioning the user's product.
- Mention the user's product only lightly, and only when relevant.
- ALWAYS disclose affiliation (e.g. "I'm building / I'm affiliated with ...").
- No fake identities, no fake testimonials, no false claims, no aggressive CTAs.
- Do not pretend to be an unaffiliated happy customer.
- Avoid mass-template phrasing; keep it specific to the post.

Return ONLY a JSON object with exactly these keys:
reply_text (string), why_this_reply (string), safety_notes (string[]),
suggested_disclosure (string), confidence (0-1).`;

export function buildScoringUserPrompt(input: LeadScoringInput): string {
  const { project, post } = input;
  return JSON.stringify(
    {
      business: {
        name: project.name,
        product_description: project.product_description,
        ideal_customer_profile: project.ideal_customer_profile ?? null,
        competitors: project.competitors ?? [],
        keywords: project.keywords ?? [],
        negative_keywords: project.negative_keywords ?? [],
        target_geography: project.target_geography ?? null,
      },
      public_post: {
        source_type: post.source_type,
        title: post.title ?? null,
        body: post.body ?? null,
        url: post.url ?? null,
      },
    },
    null,
    2,
  );
}

export function buildReplyUserPrompt(input: ReplyDraftInput): string {
  const { project, post, lead, tone } = input;
  return JSON.stringify(
    {
      reply_tone: tone,
      business: {
        name: project.name,
        product_description: project.product_description,
        website: project.website ?? null,
      },
      public_post: {
        source_type: post.source_type,
        title: post.title ?? null,
        body: post.body ?? null,
      },
      lead_analysis: {
        reason: lead.reason ?? null,
        pain_points: lead.pain_points ?? [],
        suggested_angle: lead.suggested_angle ?? null,
      },
    },
    null,
    2,
  );
}
