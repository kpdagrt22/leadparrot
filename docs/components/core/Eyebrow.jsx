import React from "react";

/**
 * Eyebrow — mono uppercase section kicker. The Crest's editorial
 * label that sits above serif headlines. Optional leading rule tick.
 */
export function Eyebrow({ children, tick = true, tone = "muted", style, ...rest }) {
  const color = tone === "accent" ? "var(--accent)" : "var(--ink-3)";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        fontFamily: "var(--font-mono)",
        fontSize: "12px",
        fontWeight: 500,
        letterSpacing: "var(--tracking-caps)",
        textTransform: "uppercase",
        color,
        ...style,
      }}
      {...rest}
    >
      {tick && (
        <span
          aria-hidden
          style={{ width: "18px", height: "1px", background: "currentColor", opacity: 0.6 }}
        />
      )}
      {children}
    </span>
  );
}
