import * as React from "react";

/** Thin squared usage / progress bar with mono numerals. */
export interface MeterProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  value?: number;
  max?: number;
  unit?: string;
  /** @default "accent" — auto-switches to clay past 90%. */
  tone?: "accent" | "soft" | "medium" | "low" | "ink";
  /** @default true */
  showValue?: boolean;
}
export function Meter(props: MeterProps): React.ReactElement;
