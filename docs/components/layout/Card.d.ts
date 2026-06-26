import * as React from "react";

/**
 * The Crest container. Sharp corners, 1px border, flat (no shadow).
 *
 * @startingPoint section="Layout" subtitle="Sharp 1px-border surface, 5 variants" viewport="700x220"
 */
export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  /** @default "default" */
  variant?: "default" | "raised" | "sunk" | "ink" | "outline";
  /** Hover-to-ink-edge for clickable cards. @default false */
  interactive?: boolean;
  /** Inner padding. @default "lg" */
  pad?: "none" | "sm" | "md" | "lg" | "xl";
  /** Element to render. @default "div" */
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
}
export function Card(props: CardProps): React.ReactElement;
