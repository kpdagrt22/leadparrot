import React from "react";

/**
 * Meter — thin squared progress/usage bar. Flat track, accent fill,
 * mono numerals. Used for usage limits and single-value gauges.
 */
export function Meter({ label, value = 0, max = 100, unit, tone = "accent", showValue = true, style, ...rest }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const fills = {
    accent: "var(--accent)",
    soft: "var(--accent-soft)",
    medium: "var(--medium)",
    low: "var(--low)",
    ink: "var(--ink)",
  };
  const near = pct >= 90;
  const fill = near ? "var(--low)" : (fills[tone] || fills.accent);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", ...style }} {...rest}>
      {(label || showValue) && (
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "12px" }}>
          {label && <span style={{ fontSize: "13px", color: "var(--ink-2)" }}>{label}</span>}
          {showValue && (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--ink)", letterSpacing: "0.02em", fontVariantNumeric: "tabular-nums" }}>
              {value.toLocaleString()}{unit ? "" : ""} <span style={{ color: "var(--ink-4)" }}>/ {max.toLocaleString()}{unit || ""}</span>
            </span>
          )}
        </div>
      )}
      <div style={{ height: "6px", width: "100%", background: "var(--paper-sunk)", border: "1px solid var(--line)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: fill, transition: "width var(--dur-slow) var(--ease-out)" }} />
      </div>
    </div>
  );
}
