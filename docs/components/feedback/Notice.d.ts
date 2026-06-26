import * as React from "react";

/** Flat callout for safety / disclosure / status messages. */
export interface NoticeProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  /** @default "info" */
  tone?: "info" | "accent" | "caution" | "danger" | "neutral";
  icon?: React.ReactNode;
  children?: React.ReactNode;
}
export function Notice(props: NoticeProps): React.ReactElement;
