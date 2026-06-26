import React from "react";

/**
 * Badge — compact pill status marker. Mono micro-label.
 * Tones map to the Crest earthy semantic palette.
 */
export function Badge({ children, tone = "neutral", solid = false, style, ...rest }) {
  const tones = {
    neutral: { fg: "var(--ink-2)", bg: "var(--paper-sunk)", bd: "var(--line-2)" },
    accent:  { fg: "var(--accent)", bg: "var(--accent-tint)", bd: "var(--accent-line)" },
    high:    { fg: "var(--high)", bg: "var(--high-tint)", bd: "var(--accent-line)" },
    medium:  { fg: "var(--medium)", bg: "var(--medium-tint)", bd: "#E0CFA8" },
    low:     { fg: "var(--low)", bg: "var(--low-tint)", bd: "#E2C5BC" },
    danger:  { fg: "var(--danger)", bg: "var(--danger-tint)", bd: "#E2C0B8" },
    info:    { fg: "var(--info)", bg: "var(--info-tint)", bd: "#BFD2D6" },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        fontFamily: "var(--font-mono)",
        fontSize: "10.5px",
        fontWeight: 500,
        letterSpacing: "var(--tracking-mono)",
        textTransform: "uppercase",
        lineHeight: 1,
        padding: "4px 9px 3px",
        borderRadius: "var(--radius-pill)",
        color: solid ? "var(--on-accent)" : t.fg,
        background: solid ? t.fg : t.bg,
        border: `1px solid ${solid ? t.fg : t.bd}`,
        whiteSpace: "nowrap",
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
