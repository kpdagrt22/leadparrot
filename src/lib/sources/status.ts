import type { SourceRunStatus } from "@/lib/types";

/**
 * Source-run state machine.
 *   pending → running → success
 *                     ↘ error
 * Terminal states (success, error) cannot transition further.
 */
const TRANSITIONS: Record<SourceRunStatus, SourceRunStatus[]> = {
  pending: ["running", "error"],
  running: ["success", "error"],
  success: [],
  error: [],
};

export function canTransition(from: SourceRunStatus, to: SourceRunStatus): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

export function isTerminal(status: SourceRunStatus): boolean {
  return status === "success" || status === "error";
}

/**
 * Apply a transition, throwing on an illegal move so background jobs surface
 * bugs loudly instead of silently corrupting run history.
 */
export function transition(from: SourceRunStatus, to: SourceRunStatus): SourceRunStatus {
  if (!canTransition(from, to)) {
    throw new Error(`Illegal source run transition: ${from} → ${to}`);
  }
  return to;
}
