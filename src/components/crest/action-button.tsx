// THE CREST DESIGN SYSTEM — Action Button (React + Tailwind)
// Mono uppercase tracked label, 1px border, sharp 0px corners, no shadow.
import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-accent text-accent-fg border-accent hover:bg-accent-press hover:border-accent-press",
  secondary: "bg-transparent text-ink border-ink hover:bg-ink hover:text-paper",
  ghost: "bg-transparent text-ink-2 border-transparent hover:bg-paper-sunk hover:text-ink",
  danger: "bg-transparent text-danger border-danger hover:bg-danger hover:text-paper",
};

const SIZES: Record<Size, string> = {
  sm: "px-3 py-[7px] text-[11px] gap-1.5",
  md: "px-[18px] py-2.5 text-xs gap-2",
  lg: "px-[26px] py-3.5 text-[13px] gap-2.5",
};

export interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  full?: boolean;
}

export function ActionButton({
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  full = false,
  className,
  children,
  ...props
}: ActionButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-none border",
        "font-mono font-medium uppercase tracking-[0.08em] leading-none",
        "transition-colors duration-150 ease-standard",
        "active:shadow-press disabled:opacity-45 disabled:pointer-events-none",
        "focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_var(--paper),0_0_0_3.5px_var(--accent)]",
        VARIANTS[variant],
        SIZES[size],
        full && "w-full",
        className,
      )}
      {...props}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}
