import * as React from "react";

/** Thin wrapper over Lucide (the Crest icon standard). Requires window.lucide. */
export interface IconProps extends React.HTMLAttributes<HTMLElement> {
  /** Lucide icon name, e.g. "search", "arrow-up-right". */
  name: string;
  /** Pixel size. @default 16 */
  size?: number;
  /** Stroke width. @default 1.75 */
  stroke?: number;
  /** @default "currentColor" */
  color?: string;
}
export function Icon(props: IconProps): React.ReactElement;
