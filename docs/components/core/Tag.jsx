import React from "react";

/**
 * Tag — squared keyword/pain-point chip. Sharp corners, hairline border.
 * Used for keywords, pain points, buying signals, filters.
 */
export function Tag({ children, tone = "neutral", onRemove, style, ...rest }) {
  const tones = {
    neutral: { fg: "var(--ink-2)", bd: "var(--line-2)", bg: "var(--surface)" },
    accent:  { fg: "var(--accent)", bd: "var(--accent-line)", bg: "var(--accent-tint)" },
    muted:   { fg: "var(--ink-3)", bd: "var(--line)", bg: "transparent" },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        fontFamily: "var(--font-mono)",
        fontSize: "11px",
        letterSpacing: "0.02em",
        lineHeight: 1,
        padding: "5px 8px",
        borderRadius: "var(--radius-xs)",
        color: t.fg,
        background: t.bg,
        border: `1px solid ${t.bd}`,
        whiteSpace: "nowrap",
        ...style,
      }}
      {...rest}
    >
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          aria-label="Remove"
          style={{
            border: "none", background: "none", padding: 0, margin: 0,
            cursor: "pointer", color: "var(--ink-4)", lineHeight: 1,
            fontFamily: "var(--font-mono)", fontSize: "12px",
          }}
        >×</button>
      )}
    </span>
  );
}
