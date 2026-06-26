import React from "react";

/**
 * Field — labelled text input. Mono uppercase label, sharp 2px input,
 * 1px border that goes accent on focus. Optional hint + error.
 */
export function Field({
  label,
  hint,
  error,
  prefix,
  textarea = false,
  rows = 3,
  id,
  style,
  ...rest
}) {
  const inputId = id || (label ? `f-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
  const inputStyle = {
    width: "100%",
    fontFamily: "var(--font-sans)",
    fontSize: "14px",
    color: "var(--ink)",
    background: "var(--surface-raised)",
    border: `1px solid ${error ? "var(--danger)" : "var(--line-2)"}`,
    borderRadius: "var(--radius-xs)",
    padding: textarea ? "10px 12px" : prefix ? "10px 12px 10px 28px" : "10px 12px",
    lineHeight: 1.45,
    outline: "none",
    resize: textarea ? "vertical" : undefined,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "7px", ...style }}>
      {label && (
        <label
          htmlFor={inputId}
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
        </label>
      )}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {prefix && !textarea && (
          <span style={{ position: "absolute", left: "11px", color: "var(--ink-4)", fontFamily: "var(--font-mono)", fontSize: "13px", pointerEvents: "none" }}>
            {prefix}
          </span>
        )}
        {textarea ? (
          <textarea id={inputId} className="crest-input" rows={rows} style={inputStyle} {...rest} />
        ) : (
          <input id={inputId} className="crest-input" style={inputStyle} {...rest} />
        )}
      </div>
      {(hint || error) && (
        <span style={{ fontSize: "12px", color: error ? "var(--danger)" : "var(--ink-3)" }}>
          {error || hint}
        </span>
      )}
    </div>
  );
}
