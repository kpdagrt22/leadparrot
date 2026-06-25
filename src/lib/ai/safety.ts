import type { ReplyDraftOutput } from "@/lib/ai/schemas/reply-draft";

const DISCLOSURE_REMINDER = "Disclose your affiliation before mentioning your product.";

/**
 * Server-side platform-safety backstop for reply drafts.
 *
 * The AI prompt already requires an affiliation disclosure, but a real provider
 * can ignore it (the schema only requires the FIELD to exist, not that it has
 * meaningful content). This guarantees that every persisted/shown draft carries
 * a non-empty disclosure and that the safety notes remind the user to disclose
 * before they mention their product — so LeadParrot never produces a silently
 * self-promotional reply.
 */
export function enforceReplySafety(
  output: ReplyDraftOutput,
  projectName: string,
): ReplyDraftOutput {
  const name = projectName.trim() || "the product I work on";

  const provided = output.suggested_disclosure?.trim();
  const suggested_disclosure = provided
    ? provided
    : `I'm affiliated with ${name} — sharing because it's relevant, not to pitch.`;

  const notes = [...(output.safety_notes ?? [])];
  if (!notes.some((n) => /disclos/i.test(n))) {
    notes.unshift(DISCLOSURE_REMINDER);
  }

  return { ...output, suggested_disclosure, safety_notes: notes };
}
