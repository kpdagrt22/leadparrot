import { z } from "zod";

const confidence = z.coerce.number().min(0).max(1);

/**
 * Schema for AI reply-draft output. The reply must be helpful, transparent and
 * non-pushy; the model is also asked to surface its own safety notes and a
 * disclosure line the user can include.
 */
export const replyDraftSchema = z.object({
  reply_text: z.string().min(1).max(4000),
  why_this_reply: z.string().max(1200).default(""),
  safety_notes: z.array(z.string().min(1)).max(12).default([]),
  suggested_disclosure: z.string().max(600).default(""),
  confidence,
});

export type ReplyDraftInput = {
  tone: string;
  project: {
    name: string;
    product_description: string;
    website?: string | null;
  };
  post: {
    title?: string | null;
    body?: string | null;
    source_type: string;
  };
  lead: {
    reason?: string | null;
    pain_points?: string[];
    suggested_angle?: string | null;
  };
};

export type ReplyDraftOutput = z.infer<typeof replyDraftSchema>;

export function parseReplyDraft(raw: unknown): ReplyDraftOutput {
  return replyDraftSchema.parse(raw);
}

export function safeParseReplyDraft(raw: unknown) {
  return replyDraftSchema.safeParse(raw);
}
