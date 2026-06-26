import React from "react";

/**
 * Tabs — underline tab strip. Mono labels, active tab carries an ink
 * underline + count. Controlled via value/onChange.
 */
export function Tabs({ tabs = [], value, onChange, style, ...rest }) {
  return (
    <div
      role="tablist"
      style={{ display: "flex", gap: "0", borderBottom: "1px solid var(--line-2)", ...style }}
      {...rest}
    >
      {tabs.map((tab) => {
        const key = tab.id ?? tab.label;
        const active = value === key;
        return (
          <button
            key={key}
            role="tab"
            aria-selected={active}
            onClick={() => onChange && onChange(key)}
            className="crest-tab"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "none",
              border: "none",
              borderBottom: `2px solid ${active ? "var(--ink)" : "transparent"}`,
              marginBottom: "-1px",
              padding: "12px 18px",
              cursor: "pointer",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              fontWeight: 500,
              letterSpacing: "var(--tracking-mono)",
              textTransform: "uppercase",
              color: active ? "var(--ink)" : "var(--ink-3)",
            }}
          >
            {tab.label}
            {tab.count != null && (
              <span style={{ fontSize: "11px", color: active ? "var(--accent)" : "var(--ink-4)", fontVariantNumeric: "tabular-nums" }}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
