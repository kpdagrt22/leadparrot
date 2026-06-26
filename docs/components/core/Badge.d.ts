import * as React from "react";

/** Compact pill status marker with a mono micro-label. */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Earthy semantic tone. @default "neutral" */
  tone?: "neutral" | "accent" | "high" | "medium" | "low" | "danger" | "info";
  /** Filled (solid) vs tinted. @default false */
  solid?: boolean;
  children?: React.ReactNode;
}
export function Badge(props: BadgeProps): React.ReactElement;
