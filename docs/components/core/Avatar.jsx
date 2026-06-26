import React from "react";

/**
 * Avatar — squared identity mark with mono initials. Sharp by default
 * (set shape="pill" for round). Used for orgs, authors (u/handle).
 */
export function Avatar({ label = "", src, size = 36, shape = "square", tone = "ink", style, ...rest }) {
  const initials = label
    .replace(/^u\//, "")
    .split(/[\s_/-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const tones = {
    ink:    { bg: "var(--ink)", fg: "var(--paper)" },
    accent: { bg: "var(--accent)", fg: "var(--on-accent)" },
    soft:   { bg: "var(--paper-sunk)", fg: "var(--ink-2)" },
  };
  const t = tones[tone] || tones.ink;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        flex: `0 0 ${size}px`,
        borderRadius: shape === "pill" ? "var(--radius-pill)" : "var(--radius-xs)",
        background: src ? "transparent" : t.bg,
        color: t.fg,
        fontFamily: "var(--font-mono)",
        fontSize: `${Math.round(size * 0.34)}px`,
        fontWeight: 500,
        letterSpacing: "0.02em",
        overflow: "hidden",
        border: tone === "soft" ? "1px solid var(--line-2)" : "none",
        ...style,
      }}
      {...rest}
    >
      {src ? (
        <img src={src} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        initials || "—"
      )}
    </span>
  );
}
