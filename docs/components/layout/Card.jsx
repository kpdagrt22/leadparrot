import React from "react";

/**
 * Card — the Crest container. Sharp 0px corners, 1px border, flat.
 * No drop shadows; structure comes from the border. Set interactive
 * for hover-to-ink-edge behavior (clickable cards / list items).
 */
export function Card({
  children,
  variant = "default",
  interactive = false,
  pad = "lg",
  as = "div",
  style,
  className = "",
  ...rest
}) {
  const surfaces = {
    default: { background: "var(--surface-card)", border: "1px solid var(--line-2)" },
    raised:  { background: "var(--surface-raised)", border: "1px solid var(--line-2)" },
    sunk:    { background: "var(--paper-sunk)", border: "1px solid var(--line)" },
    ink:     { background: "var(--ink)", border: "1px solid var(--ink)" },
    outline: { background: "transparent", border: "1px solid var(--line-2)" },
  };
  const pads = { none: 0, sm: "16px", md: "20px", lg: "28px", xl: "40px" };

  const Comp = as;
  return (
    <Comp
      className={`crest-card ${interactive ? "crest-card--interactive" : ""} ${className}`.trim()}
      style={{
        borderRadius: "var(--radius-none)",
        padding: pads[pad],
        color: variant === "ink" ? "var(--paper)" : "var(--ink)",
        ...surfaces[variant],
        ...style,
      }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
