import { env } from "@/lib/env";
import { mockProvider } from "@/lib/ai/providers/mock";
import { openaiProvider } from "@/lib/ai/providers/openai";
import { anthropicProvider } from "@/lib/ai/providers/anthropic";
import type { AIProvider } from "@/lib/ai/providers/types";
import type { LeadScoringInput, LeadScoringOutput } from "@/lib/ai/schemas/lead-scoring";
import type { ReplyDraftInput, ReplyDraftOutput } from "@/lib/ai/schemas/reply-draft";

/**
 * AI service facade. Selects a provider from AI_PROVIDER, but always degrades
 * gracefully to the deterministic mock when the chosen provider lacks an API
 * key — so the product never hard-fails on a missing secret.
 */
export function getAIProvider(): AIProvider {
  switch (env.aiProvider) {
    case "openai":
      return env.openaiApiKey ? openaiProvider : mockProvider;
    case "anthropic":
      return env.anthropicApiKey ? anthropicProvider : mockProvider;
    case "mock":
    default:
      return mockProvider;
  }
}

export interface ScoreResult {
  output: LeadScoringOutput;
  provider: string;
  model: string;
  status: "ok" | "error";
  error?: string;
}

export async function scoreLead(input: LeadScoringInput): Promise<ScoreResult> {
  const provider = getAIProvider();
  try {
    const output = await provider.scoreLead(input);
    return { output, provider: provider.name, model: provider.model, status: "ok" };
  } catch (err) {
    // On provider failure, fall back to the mock so a scan never dies entirely.
    const output = await mockProvider.scoreLead(input);
    return {
      output,
      provider: "mock",
      model: mockProvider.model,
      status: "error",
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export interface ReplyResult {
  output: ReplyDraftOutput;
  provider: string;
  model: string;
  status: "ok" | "error";
  error?: string;
}

export async function draftReply(input: ReplyDraftInput): Promise<ReplyResult> {
  const provider = getAIProvider();
  try {
    const output = await provider.draftReply(input);
    return { output, provider: provider.name, model: provider.model, status: "ok" };
  } catch (err) {
    const output = await mockProvider.draftReply(input);
    return {
      output,
      provider: "mock",
      model: mockProvider.model,
      status: "error",
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export const activeAIProviderName = (): string => getAIProvider().name;
