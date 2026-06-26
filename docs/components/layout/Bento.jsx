import React from "react";

/**
 * Bento — modular grid with shared hairline seams (1px gap over an
 * ink-tinted backing). Cells read as one engineered surface. The
 * Crest layout primitive for dashboards and feature sections.
 */
export function Bento({ children, cols = 4, seam = "hairline", style, ...rest }) {
  const gap = seam === "hairline" ? "1px" : "var(--space-4)";
  const bg = seam === "hairline" ? "var(--line-2)" : "transparent";
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gap,
        background: bg,
        border: seam === "hairline" ? "1px solid var(--line-2)" : "none",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

/**
 * BentoItem — a single cell. Spans columns/rows via colSpan/rowSpan.
 */
export function BentoItem({ children, colSpan = 1, rowSpan = 1, pad = "lg", tone = "surface", style, ...rest }) {
  const pads = { none: 0, sm: "16px", md: "20px", lg: "28px" };
  const tones = {
    surface: { background: "var(--surface-card)", color: "var(--ink)" },
    sunk:    { background: "var(--paper-sunk)", color: "var(--ink)" },
    ink:     { background: "var(--ink)", color: "var(--paper)" },
    accent:  { background: "var(--accent)", color: "var(--on-accent)" },
  };
  return (
    <div
      style={{
        gridColumn: `span ${colSpan} / span ${colSpan}`,
        gridRow: `span ${rowSpan} / span ${rowSpan}`,
        padding: pads[pad],
        minWidth: 0,
        ...tones[tone],
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
