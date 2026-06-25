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
 * OpenAI provider (placeholder-ready).
 *
 * Uses the Chat Completions JSON-mode API via fetch so we do not pull in the
 * SDK. If no API key is configured it transparently falls back to the mock
 * provider, keeping the app runnable. Swap models via OPENAI_MODEL.
 */
export class OpenAIProvider implements AIProvider {
  readonly name = "openai" as const;
  readonly model = env.openaiModel;

  private async chatJson(system: string, user: string): Promise<unknown> {
    if (!env.openaiApiKey) {
      throw new Error("OPENAI_API_KEY is not configured");
    }
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`OpenAI API error ${res.status}: ${detail.slice(0, 300)}`);
    }
    const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const content = data.choices?.[0]?.message?.content ?? "{}";
    return JSON.parse(content);
  }

  async scoreLead(input: LeadScoringInput): Promise<LeadScoringOutput> {
    if (!env.openaiApiKey) return mockProvider.scoreLead(input);
    const raw = await this.chatJson(SCORING_SYSTEM_PROMPT, buildScoringUserPrompt(input));
    const parsed = parseLeadScoring(raw);
    // Always recompute overall from our canonical weighted model.
    parsed.overall_score = computeOverallScore(parsed);
    return parsed;
  }

  async draftReply(input: ReplyDraftInput): Promise<ReplyDraftOutput> {
    if (!env.openaiApiKey) return mockProvider.draftReply(input);
    const raw = await this.chatJson(REPLY_SYSTEM_PROMPT, buildReplyUserPrompt(input));
    return parseReplyDraft(raw);
  }
}

export const openaiProvider = new OpenAIProvider();
