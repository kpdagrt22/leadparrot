import * as React from "react";

/** Mono uppercase section kicker that sits above serif headlines. */
export interface EyebrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Show the leading rule tick. @default true */
  tick?: boolean;
  /** @default "muted" */
  tone?: "muted" | "accent";
  children?: React.ReactNode;
}
export function Eyebrow(props: EyebrowProps): React.ReactElement;
