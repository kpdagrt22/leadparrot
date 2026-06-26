import React from "react";

/**
 * ScoreBars — the LeadParrot weighted-score breakdown.
 * relevance·0.35 + intent·0.30 + urgency·0.20 + fit·0.15.
 * Mono labels + weights, hairline tracks, accent fills.
 */
export function ScoreBars({ relevance = 0, intent = 0, urgency = 0, fit = 0, style, ...rest }) {
  const rows = [
    { label: "Relevance", value: relevance, weight: "35%" },
    { label: "Intent", value: intent, weight: "30%" },
    { label: "Urgency", value: urgency, weight: "20%" },
    { label: "Fit", value: fit, weight: "15%" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px", ...style }} {...rest}>
      {rows.map((r) => (
        <div key={r.label} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--ink-2)" }}>
              {r.label}
              <span style={{ color: "var(--ink-4)", marginLeft: "8px" }}>·{r.weight}</span>
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: 500, color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>
              {r.value}
            </span>
          </div>
          <div style={{ height: "4px", width: "100%", background: "var(--paper-sunk)", borderRadius: 0 }}>
            <div style={{ height: "100%", width: `${Math.max(0, Math.min(100, r.value))}%`, background: "var(--accent-soft)" }} />
          </div>
        </div>
      ))}
    </div>
  );
}
