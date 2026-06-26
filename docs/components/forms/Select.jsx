import React from "react";

/**
 * Select — squared native select styled to the Crest. Mono label,
 * hairline border, custom chevron.
 */
export function Select({ label, hint, children, id, style, ...rest }) {
  const selectId = id || (label ? `s-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "7px", ...style }}>
      {label && (
        <label htmlFor={selectId} style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 500, letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--ink-3)" }}>
          {label}
        </label>
      )}
      <div style={{ position: "relative" }}>
        <select
          id={selectId}
          className="crest-input"
          style={{
            width: "100%",
            appearance: "none",
            WebkitAppearance: "none",
            fontFamily: "var(--font-sans)",
            fontSize: "14px",
            color: "var(--ink)",
            background: "var(--surface-raised)",
            border: "1px solid var(--line-2)",
            borderRadius: "var(--radius-xs)",
            padding: "10px 34px 10px 12px",
            outline: "none",
            cursor: "pointer",
          }}
          {...rest}
        >
          {children}
        </select>
        <span aria-hidden style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--ink-3)", fontSize: "11px", fontFamily: "var(--font-mono)" }}>
          ▾
        </span>
      </div>
      {hint && <span style={{ fontSize: "12px", color: "var(--ink-3)" }}>{hint}</span>}
    </div>
  );
}
