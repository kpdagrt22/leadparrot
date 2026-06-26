import * as React from "react";

/** Squared identity mark with mono initials (or image). */
export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Name/handle used to derive initials. */
  label?: string;
  /** Optional image source. */
  src?: string;
  /** Pixel size. @default 36 */
  size?: number;
  /** @default "square" */
  shape?: "square" | "pill";
  /** @default "ink" */
  tone?: "ink" | "accent" | "soft";
}
export function Avatar(props: AvatarProps): React.ReactElement;
