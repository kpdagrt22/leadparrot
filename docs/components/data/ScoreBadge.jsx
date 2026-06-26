import React from "react";

/**
 * ScoreBadge — the LeadParrot intent score as an editorial unit:
 * a large serif number + a mono tier label. Tiers: high ≥70,
 * medium 40–69, low <40.
 */
export function ScoreBadge({ score = 0, showTier = true, size = "md", style, ...rest }) {
  const tier = score >= 70 ? "high" : score >= 40 ? "medium" : "low";
  const meta = {
    high:   { label: "High intent", color: "var(--high)" },
    medium: { label: "Medium", color: "var(--medium)" },
    low:    { label: "Low", color: "var(--low)" },
  }[tier];
  const sizes = { sm: "22px", md: "32px", lg: "48px" };

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "10px", ...style }} {...rest}>
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          fontSize: sizes[size],
          lineHeight: 1,
          letterSpacing: "-0.02em",
          color: meta.color,
          fontVariantNumeric: "lining-nums tabular-nums",
        }}
      >
        {score}
      </span>
      {showTier && (
        <span style={{ display: "inline-flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ width: "20px", height: "1px", background: meta.color, opacity: 0.5 }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 500, letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: meta.color }}>
            {meta.label}
          </span>
        </span>
      )}
    </span>
  );
}
