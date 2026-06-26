import * as React from "react";

/**
 * Modular grid with shared hairline seams. The Crest dashboard primitive.
 *
 * @startingPoint section="Layout" subtitle="Hairline-seam bento grid + cells" viewport="700x300"
 */
export interface BentoProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Column count. @default 4 */
  cols?: number;
  /** Seam style. @default "hairline" */
  seam?: "hairline" | "gap";
  children?: React.ReactNode;
}
export function Bento(props: BentoProps): React.ReactElement;

export interface BentoItemProps extends React.HTMLAttributes<HTMLDivElement> {
  colSpan?: number;
  rowSpan?: number;
  /** @default "lg" */
  pad?: "none" | "sm" | "md" | "lg";
  /** @default "surface" */
  tone?: "surface" | "sunk" | "ink" | "accent";
  children?: React.ReactNode;
}
export function BentoItem(props: BentoItemProps): React.ReactElement;
