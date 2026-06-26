import * as React from "react";

/**
 * LeadParrot intent score as a serif number + mono tier label.
 *
 * @startingPoint section="Data" subtitle="Editorial lead-score unit, 3 tiers" viewport="700x160"
 */
export interface ScoreBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 0–100 overall score. Tiers: high ≥70, medium 40–69, low <40. */
  score?: number;
  /** Show the tier label. @default true */
  showTier?: boolean;
  /** @default "md" */
  size?: "sm" | "md" | "lg";
}
export function ScoreBadge(props: ScoreBadgeProps): React.ReactElement;
