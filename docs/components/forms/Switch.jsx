import React from "react";

/**
 * Switch — pill toggle (one of the few pill shapes in Crest).
 * Squared knob slides; track fills accent when on.
 */
export function Switch({ checked = false, onChange, label, disabled = false, id, style, ...rest }) {
  const switchId = id || (label ? `t-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
  const toggle = () => { if (!disabled && onChange) onChange(!checked); };
  return (
    <label htmlFor={switchId} style={{ display: "inline-flex", alignItems: "center", gap: "12px", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, ...style }}>
      <button
        id={switchId}
        role="switch"
        aria-checked={checked}
        type="button"
        onClick={toggle}
        disabled={disabled}
        className="crest-switch"
        style={{
          position: "relative",
          width: "40px",
          height: "22px",
          flex: "0 0 40px",
          padding: 0,
          border: `1px solid ${checked ? "var(--accent)" : "var(--line-2)"}`,
          borderRadius: "var(--radius-pill)",
          background: checked ? "var(--accent)" : "var(--paper-sunk)",
          cursor: disabled ? "not-allowed" : "pointer",
        }}
        {...rest}
      >
        <span
          style={{
            position: "absolute",
            top: "2px",
            left: "2px",
            width: "16px",
            height: "16px",
            borderRadius: "var(--radius-pill)",
            background: checked ? "var(--paper)" : "var(--surface-raised)",
            border: "1px solid " + (checked ? "var(--accent)" : "var(--line-2)"),
            transform: checked ? "translateX(18px)" : "translateX(0)",
          }}
        />
      </button>
      {label && <span style={{ fontSize: "14px", color: "var(--ink-2)" }}>{label}</span>}
    </label>
  );
}
