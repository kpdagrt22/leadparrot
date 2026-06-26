import * as React from "react";

/** LeadParrot weighted-score breakdown (relevance/intent/urgency/fit). */
export interface ScoreBarsProps extends React.HTMLAttributes<HTMLDivElement> {
  relevance?: number;
  intent?: number;
  urgency?: number;
  fit?: number;
}
export function ScoreBars(props: ScoreBarsProps): React.ReactElement;
