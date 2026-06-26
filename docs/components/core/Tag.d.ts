import * as React from "react";

/** Squared keyword / pain-point chip with optional remove affordance. */
export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default "neutral" */
  tone?: "neutral" | "accent" | "muted";
  /** Show an × remove button calling this handler. */
  onRemove?: () => void;
  children?: React.ReactNode;
}
export function Tag(props: TagProps): React.ReactElement;
