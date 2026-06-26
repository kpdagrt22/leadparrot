import * as React from "react";

/** Editorial metric: mono label over a large serif number. */
export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  value: React.ReactNode;
  hint?: React.ReactNode;
  /** Optional trend chip. */
  trend?: { dir: "up" | "down" | "flat"; value: string };
  /** @default "left" */
  align?: "left" | "center";
  /** @default "md" */
  size?: "sm" | "md" | "lg";
}
export function Stat(props: StatProps): React.ReactElement;
