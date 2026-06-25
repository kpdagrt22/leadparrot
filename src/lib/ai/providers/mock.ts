import { parseLeadScoring, type LeadScoringInput, type LeadScoringOutput } from "@/lib/ai/schemas/lead-scoring";
import { parseReplyDraft, type ReplyDraftInput, type ReplyDraftOutput } from "@/lib/ai/schemas/reply-draft";
import { matchedKeywords, hasNegativeKeyword } from "@/lib/scoring/keywords";
import { computeOverallScore } from "@/lib/scoring/score";
import type { AIProvider } from "@/lib/ai/providers/types";

/**
 * Deterministic mock AI provider.
 *
 * It produces realistic, *stable* scoring and reply drafts with no network
 * calls so the entire product is demoable offline and unit-testable. The same
 * input always yields the same output (no Math.random / Date.now).
 */

const BUYING_PHRASES = [
  "looking for",
  "recommend",
  "recommendation",
  "alternative to",
  "any tool",
  "anyone use",
  "best tool",
  "best software",
  "need help",
  "need a",
  "suggestions",
  "which one",
  "vs ",
  "switch from",
  "frustrated with",
  "hate using",
  "too expensive",
  "looking to buy",
  "willing to pay",
  "budget for",
];

const URGENCY_PHRASES = [
  "asap",
  "urgent",
  "today",
  "this week",
  "right now",
  "deadline",
  "launching",
  "by friday",
  "quickly",
  "immediately",
];

const RESEARCH_PHRASES = ["how do i", "what is", "curious", "learning", "tutorial", "guide"];

function tokenScore(text: string, phrases: string[], perHit: number, cap: number): number {
  const lower = text.toLowerCase();
  let score = 0;
  for (const p of phrases) {
    if (lower.includes(p)) score += perHit;
  }
  return Math.min(cap, score);
}

/** Stable pseudo-jitter derived from text so scores feel non-uniform but fixed. */
function stableJitter(text: string, range: number): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) {
    h = (h * 31 + text.charCodeAt(i)) % 100000;
  }
  return (h % (range * 2 + 1)) - range;
}

export class MockAIProvider implements AIProvider {
  readonly name = "mock" as const;
  readonly model = "mock-deterministic-v1";

  async scoreLead(input: LeadScoringInput): Promise<LeadScoringOutput> {
    const { project, post } = input;
    const text = `${post.title ?? ""}\n${post.body ?? ""}`.trim();
    const keywords = project.keywords ?? [];
    const negatives = project.negative_keywords ?? [];
    const competitors = project.competitors ?? [];

    const matched = matchedKeywords(text, keywords);
    const blocked = hasNegativeKeyword(text, negatives);
    const competitorHits = matchedKeywords(text, competitors);

    // Relevance: keyword coverage + competitor mentions.
    const keywordCoverage = keywords.length > 0 ? matched.length / keywords.length : 0.4;
    let relevance = Math.round(keywordCoverage * 70) + (competitorHits.length > 0 ? 20 : 0);
    relevance += tokenScore(text, ["help", "tool", "software", "service"], 4, 12);
    relevance += stableJitter(text + "r", 6);

    // Intent: explicit buying language.
    let intent = tokenScore(text, BUYING_PHRASES, 16, 88);
    if (competitorHits.length > 0) intent += 10;
    intent += stableJitter(text + "i", 6);

    // Urgency.
    let urgency = tokenScore(text, URGENCY_PHRASES, 22, 90);
    urgency += stableJitter(text + "u", 5);
    if (urgency === 0) urgency = 20 + stableJitter(text + "u2", 8);

    // Fit: geography / ICP heuristics (light touch in the mock).
    let fit = 50 + (matched.length > 0 ? 18 : 0) + stableJitter(text + "f", 10);

    // Research-y phrasing dampens intent.
    if (tokenScore(text, RESEARCH_PHRASES, 1, 3) > 1 && intent < 40) {
      intent = Math.max(10, intent - 10);
    }

    // Negative keyword => disqualified.
    if (blocked) {
      relevance = Math.min(relevance, 15);
      intent = Math.min(intent, 10);
    }

    const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
    const relevance_score = clamp(relevance);
    const intent_score = clamp(intent);
    const urgency_score = clamp(urgency);
    const fit_score = clamp(fit);

    const overall = computeOverallScore({
      relevance_score,
      intent_score,
      urgency_score,
      fit_score,
    });

    const lead_stage = (() => {
      if (blocked || overall < 25) return "not-a-lead" as const;
      if (competitorHits.length > 0) return "competitor-switching" as const;
      if (intent_score >= 65) return "buying-intent" as const;
      if (intent_score >= 45) return "solution-aware" as const;
      if (relevance_score >= 45) return "problem-aware" as const;
      return "research" as const;
    })();

    const pain_points = derivePainPoints(text, matched);
    const buying_signals = BUYING_PHRASES.filter((p) => text.toLowerCase().includes(p)).slice(0, 5);
    const disqualifiers = blocked
      ? [`Mentions excluded topic (${matchedKeywords(text, negatives).join(", ")})`]
      : [];
    const risk_flags: string[] = [];
    if (post.source_type === "reddit") risk_flags.push("Reddit self-promotion rules vary by subreddit — read the rules first.");
    if (intent_score < 30) risk_flags.push("Low explicit buying intent — reply only if genuinely helpful.");

    const is_relevant = !blocked && relevance_score >= 40;
    const should_generate_reply = is_relevant && overall >= 55;

    const reason = blocked
      ? `This post matches a negative keyword and is unlikely to be a fit.`
      : matched.length > 0
        ? `Post mentions ${matched.slice(0, 3).join(", ")}${competitorHits.length ? ` and a competitor (${competitorHits[0]})` : ""}, with ${intent_score >= 60 ? "strong" : intent_score >= 40 ? "some" : "limited"} buying signals.`
        : `Topically related to ${project.name} but no exact keyword match; treat as soft signal.`;

    const suggested_angle = blocked
      ? "Skip — not a fit."
      : competitorHits.length > 0
        ? `Acknowledge their frustration with ${competitorHits[0]}, offer a genuinely useful tip, then briefly mention ${project.name} with disclosure.`
        : `Lead with a concrete, helpful answer to their question, then mention ${project.name} only if directly relevant.`;

    return parseLeadScoring({
      is_relevant,
      intent_score,
      relevance_score,
      urgency_score,
      fit_score,
      overall_score: overall,
      lead_stage,
      reason,
      pain_points,
      buying_signals,
      disqualifiers,
      suggested_angle,
      risk_flags,
      should_generate_reply,
      confidence: 0.55,
    });
  }

  async draftReply(input: ReplyDraftInput): Promise<ReplyDraftOutput> {
    const { project, post, lead, tone } = input;
    const topic = (post.title ?? "your question").trim();
    const angle = lead.suggested_angle?.trim();
    const pain = lead.pain_points?.[0];

    const opener = (() => {
      switch (tone) {
        case "casual":
          return `Hey — saw your post about ${shorten(topic)}.`;
        case "expert":
          return `Good question. Here's how I'd approach ${shorten(topic)}:`;
        case "founder-like":
          return `I've run into this exact thing. On ${shorten(topic)} —`;
        case "professional":
          return `Happy to share a few thoughts on ${shorten(topic)}.`;
        default:
          return `One way to approach ${shorten(topic)}:`;
      }
    })();

    const helpfulTip = pain
      ? `first, ${actionFromPain(pain)} for a week so you can see what's actually driving the problem.`
      : `start by writing down the specific outcome you want — it makes comparing options much faster.`;

    const secondTip = `From there, a couple of free options can get you 80% of the way before you pay for anything.`;

    const disclosure = `I'm building a small tool in this space (${project.name})`;
    const softMention = `If it's useful later, ${disclosure.toLowerCase()} — happy to share, no pressure.`;

    const reply_text = [
      opener,
      helpfulTip.charAt(0).toUpperCase() + helpfulTip.slice(1),
      secondTip,
      softMention,
    ].join(" ");

    return parseReplyDraft({
      reply_text,
      why_this_reply:
        angle ||
        "Leads with genuine help, gives two actionable suggestions, and mentions the product only lightly with a clear disclosure.",
      safety_notes: [
        "Disclose your affiliation before mentioning your product.",
        "Do not reuse this exact text across multiple threads — personalize it.",
        "Check the community's self-promotion rules before posting.",
      ],
      suggested_disclosure: `${disclosure} — sharing because it's relevant, not to pitch.`,
      confidence: 0.5,
    });
  }
}

function shorten(s: string): string {
  const t = s.replace(/\s+/g, " ").trim();
  return t.length > 60 ? `${t.slice(0, 57)}…` : t;
}

function derivePainPoints(text: string, matched: string[]): string[] {
  const lower = text.toLowerCase();
  const pains: string[] = [];
  if (lower.includes("expensive") || lower.includes("pricing") || lower.includes("cost")) {
    pains.push("Cost / pricing concerns");
  }
  if (lower.includes("time") || lower.includes("manual") || lower.includes("tedious")) {
    pains.push("Manual/time-consuming workflow");
  }
  if (lower.includes("hate") || lower.includes("frustrat") || lower.includes("annoying")) {
    pains.push("Frustration with current solution");
  }
  if (pains.length === 0 && matched.length > 0) {
    pains.push(`Looking for help with ${matched[0]}`);
  }
  return pains.slice(0, 4);
}

function actionFromPain(pain: string): string {
  const lower = pain.toLowerCase();
  if (lower.includes("cost") || lower.includes("pricing")) return "list out exactly which features you'll actually use";
  if (lower.includes("manual") || lower.includes("time")) return "track the task manually";
  return "note down what's not working today";
}

export const mockProvider = new MockAIProvider();
