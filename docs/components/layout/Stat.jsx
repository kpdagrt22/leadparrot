import React from "react";

/**
 * Stat — editorial metric. Mono uppercase label over a large serif
 * number. The dashboard's primary data voice.
 */
export function Stat({ label, value, hint, trend, align = "left", size = "md", style, ...rest }) {
  const sizes = { sm: "28px", md: "40px", lg: "56px" };
  const trendColor =
    trend && trend.dir === "up" ? "var(--high)" :
    trend && trend.dir === "down" ? "var(--low)" : "var(--ink-3)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: align, ...style }} {...rest}>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          fontWeight: 500,
          letterSpacing: "var(--tracking-caps)",
          textTransform: "uppercase",
          color: "var(--ink-3)",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          fontSize: sizes[size],
          lineHeight: 1,
          letterSpacing: "-0.02em",
          color: "var(--ink)",
          fontVariantNumeric: "lining-nums tabular-nums",
        }}
      >
        {value}
      </span>
      {(hint || trend) && (
        <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--ink-3)" }}>
          {trend && (
            <span style={{ fontFamily: "var(--font-mono)", fontWeight: 500, color: trendColor, letterSpacing: "0.02em" }}>
              {trend.dir === "up" ? "▲" : trend.dir === "down" ? "▼" : "■"} {trend.value}
            </span>
          )}
          {hint && <span>{hint}</span>}
        </span>
      )}
    </div>
  );
}
