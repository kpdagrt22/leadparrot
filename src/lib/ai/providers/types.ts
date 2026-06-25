import type { LeadScoringInput, LeadScoringOutput } from "@/lib/ai/schemas/lead-scoring";
import type { ReplyDraftInput, ReplyDraftOutput } from "@/lib/ai/schemas/reply-draft";

/** Every AI provider implements this small surface. */
export interface AIProvider {
  readonly name: "mock" | "openai" | "anthropic";
  readonly model: string;
  scoreLead(input: LeadScoringInput): Promise<LeadScoringOutput>;
  draftReply(input: ReplyDraftInput): Promise<ReplyDraftOutput>;
}

export type { LeadScoringInput, LeadScoringOutput, ReplyDraftInput, ReplyDraftOutput };
