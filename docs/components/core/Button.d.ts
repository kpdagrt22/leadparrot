import * as React from "react";

/**
 * The Crest primary control. Mono uppercase label, sharp corners, 1px border.
 *
 * @startingPoint section="Core" subtitle="Mono-label action button, 4 variants" viewport="700x180"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual emphasis. @default "primary" */
  variant?: "primary" | "secondary" | "ghost" | "danger";
  /** Control size. @default "md" */
  size?: "sm" | "md" | "lg";
  /** Icon node rendered before the label. */
  iconLeft?: React.ReactNode;
  /** Icon node rendered after the label. */
  iconRight?: React.ReactNode;
  /** Stretch to fill the container width. @default false */
  full?: boolean;
  /** Render as a different element (e.g. "a"). @default "button" */
  as?: "button" | "a";
  children?: React.ReactNode;
}

export function Button(props: ButtonProps): React.ReactElement;
