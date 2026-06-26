import React from "react";

/**
 * Notice — flat callout for safety, disclosure and status messages.
 * Left ink rule + tinted ground (no rounded "alert" look). The
 * Crest voice for LeadParrot's platform-safety + disclosure notes.
 */
export function Notice({ children, title, tone = "info", icon, style, ...rest }) {
  const tones = {
    info:    { bar: "var(--info)", bg: "var(--info-tint)", fg: "var(--ink-2)" },
    accent:  { bar: "var(--accent)", bg: "var(--accent-tint)", fg: "var(--ink-2)" },
    caution: { bar: "var(--medium)", bg: "var(--medium-tint)", fg: "var(--ink-2)" },
    danger:  { bar: "var(--danger)", bg: "var(--danger-tint)", fg: "var(--ink-2)" },
    neutral: { bar: "var(--line-strong)", bg: "var(--paper-sunk)", fg: "var(--ink-2)" },
  };
  const t = tones[tone] || tones.info;
  return (
    <div
      role="note"
      style={{
        display: "flex",
        gap: "12px",
        padding: "14px 16px",
        background: t.bg,
        borderLeft: `2px solid ${t.bar}`,
        border: "1px solid var(--line)",
        borderLeftWidth: "2px",
        borderLeftColor: t.bar,
        ...style,
      }}
      {...rest}
    >
      {icon && <span style={{ color: t.bar, marginTop: "1px", flex: "0 0 auto" }}>{icon}</span>}
      <div style={{ display: "flex", flexDirection: "column", gap: "3px", minWidth: 0 }}>
        {title && (
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 600, letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: t.bar }}>
            {title}
          </span>
        )}
        <span style={{ fontSize: "13px", lineHeight: 1.5, color: t.fg }}>{children}</span>
      </div>
    </div>
  );
}
