import { env } from "@/lib/env";
import { computeOverallScore } from "@/lib/scoring/score";
import {
  parseLeadScoring,
  type LeadScoringInput,
  type LeadScoringOutput,
} from "@/lib/ai/schemas/lead-scoring";
import {
  parseReplyDraft,
  type ReplyDraftInput,
  type ReplyDraftOutput,
} from "@/lib/ai/schemas/reply-draft";
import { mockProvider } from "@/lib/ai/providers/mock";
import { SCORING_SYSTEM_PROMPT, REPLY_SYSTEM_PROMPT, buildScoringUserPrompt, buildReplyUserPrompt } from "@/lib/ai/prompts";
import type { AIProvider } from "@/lib/ai/providers/types";

/**
 * Anthropic provider (placeholder-ready).
 *
 * Uses the Messages API via fetch. We instruct the model to return a single
 * JSON object and extract it from the first text block. Falls back to the mock
 * provider when no key is configured. Swap models via ANTHROPIC_MODEL.
 */
export class AnthropicProvider implements AIProvider {
  readonly name = "anthropic" as const;
  readonly model = env.anthropicModel;

  private async messageJson(system: string, user: string): Promise<unknown> {
    if (!env.anthropicApiKey) {
      throw new Error("ANTHROPIC_API_KEY is not configured");
    }
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.anthropicApiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 1024,
        temperature: 0.4,
        system: `${system}\n\nRespond with ONLY a single valid JSON object and no surrounding prose.`,
        messages: [{ role: "user", content: user }],
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`Anthropic API error ${res.status}: ${detail.slice(0, 300)}`);
    }
    const data = (await res.json()) as { content?: Array<{ type: string; text?: string }> };
    const text = data.content?.find((b) => b.type === "text")?.text ?? "{}";
    return JSON.parse(extractJson(text));
  }

  async scoreLead(input: LeadScoringInput): Promise<LeadScoringOutput> {
    if (!env.anthropicApiKey) return mockProvider.scoreLead(input);
    const raw = await this.messageJson(SCORING_SYSTEM_PROMPT, buildScoringUserPrompt(input));
    const parsed = parseLeadScoring(raw);
    parsed.overall_score = computeOverallScore(parsed);
    return parsed;
  }

  async draftReply(input: ReplyDraftInput): Promise<ReplyDraftOutput> {
    if (!env.anthropicApiKey) return mockProvider.draftReply(input);
    const raw = await this.messageJson(REPLY_SYSTEM_PROMPT, buildReplyUserPrompt(input));
    return parseReplyDraft(raw);
  }
}

/** Pull the first {...} JSON object out of a possibly chatty response. */
function extractJson(text: string): string {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return "{}";
  return text.slice(start, end + 1);
}

export const anthropicProvider = new AnthropicProvider();
