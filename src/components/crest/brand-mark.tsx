import { cn } from "@/lib/utils";

/**
 * The Crest brand mark — a geometric chevron crest ("peak of intent"), pure
 * geometry filled in Verdigris. Replaces the retired parrot/emoji. Uses the
 * design-system CSS variables so it always tracks the palette.
 */
export function BrandMark({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden
      className={className}
    >
      <rect x="0.75" y="0.75" width="46.5" height="46.5" fill="var(--accent)" />
      <path
        d="M14 28.5L24 16.5L34 28.5"
        stroke="var(--on-accent)"
        strokeWidth="2.25"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path
        d="M19 33.5L24 27.5L29 33.5"
        stroke="var(--on-accent)"
        strokeWidth="2.25"
        strokeLinecap="square"
        strokeLinejoin="miter"
        opacity="0.55"
      />
    </svg>
  );
}

/** Mark + wordmark lockup. The product name is "The Leads Nest". */
export function Wordmark({
  size = 22,
  className,
  textClassName,
}: {
  size?: number;
  className?: string;
  textClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <BrandMark size={size} />
      <span className={cn("font-display text-lg font-medium tracking-tightest text-ink", textClassName)}>
        The Leads Nest
      </span>
    </span>
  );
}
