import React from "react";

/**
 * Button — The Crest primary control.
 * Mono, uppercase, letter-spaced label · sharp 0px corners · 1px border.
 * Variants: primary | secondary | ghost | danger. Sizes: sm | md | lg.
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  full = false,
  disabled = false,
  as = "button",
  ...rest
}) {
  const sizes = {
    sm: { padding: "7px 12px", fontSize: "11px", gap: "6px" },
    md: { padding: "10px 18px", fontSize: "12px", gap: "8px" },
    lg: { padding: "14px 26px", fontSize: "13px", gap: "10px" },
  };

  const variants = {
    primary: {
      background: "var(--accent)",
      color: "var(--on-accent)",
      border: "1px solid var(--accent)",
    },
    secondary: {
      background: "transparent",
      color: "var(--ink)",
      border: "1px solid var(--ink)",
    },
    ghost: {
      background: "transparent",
      color: "var(--ink-2)",
      border: "1px solid transparent",
    },
    danger: {
      background: "transparent",
      color: "var(--danger)",
      border: "1px solid var(--danger)",
    },
  };

  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: full ? "100%" : "auto",
    fontFamily: "var(--font-mono)",
    fontWeight: 500,
    letterSpacing: "var(--tracking-mono)",
    textTransform: "uppercase",
    lineHeight: 1,
    borderRadius: "var(--radius-none)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    transition: "background var(--dur-fast) var(--ease-standard), color var(--dur-fast) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard)",
    textDecoration: "none",
    whiteSpace: "nowrap",
    ...sizes[size],
    ...variants[variant],
  };

  const Comp = as;
  return (
    <Comp
      className={`crest-btn crest-btn--${variant}`}
      style={base}
      disabled={as === "button" ? disabled : undefined}
      {...rest}
    >
      {iconLeft && <span style={{ display: "inline-flex" }}>{iconLeft}</span>}
      {children}
      {iconRight && <span style={{ display: "inline-flex" }}>{iconRight}</span>}
    </Comp>
  );
}
