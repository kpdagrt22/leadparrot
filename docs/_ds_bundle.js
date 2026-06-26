/* @ds-bundle: {"format":3,"namespace":"CrestDesignSystemLeadParrot_bb3a07","components":[{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"Meter","sourcePath":"components/data/Meter.jsx"},{"name":"ScoreBadge","sourcePath":"components/data/ScoreBadge.jsx"},{"name":"ScoreBars","sourcePath":"components/data/ScoreBars.jsx"},{"name":"Notice","sourcePath":"components/feedback/Notice.jsx"},{"name":"Tabs","sourcePath":"components/feedback/Tabs.jsx"},{"name":"Field","sourcePath":"components/forms/Field.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Bento","sourcePath":"components/layout/Bento.jsx"},{"name":"BentoItem","sourcePath":"components/layout/Bento.jsx"},{"name":"Card","sourcePath":"components/layout/Card.jsx"},{"name":"Stat","sourcePath":"components/layout/Stat.jsx"},{"name":"ActionButton","sourcePath":"handoff/action-button.tsx"},{"name":"LeadDetailCard","sourcePath":"handoff/lead-detail-card.tsx"},{"name":"TypographySpecimen","sourcePath":"handoff/typography.tsx"}],"sourceHashes":{"components/core/Avatar.jsx":"22d57337ac95","components/core/Badge.jsx":"26fa46eb67a5","components/core/Button.jsx":"4e04c4db8d8f","components/core/Eyebrow.jsx":"f9a7a8144933","components/core/Icon.jsx":"5d8f24d2c342","components/core/Tag.jsx":"03f83619a9c4","components/data/Meter.jsx":"809942918f08","components/data/ScoreBadge.jsx":"4fcf38a28fea","components/data/ScoreBars.jsx":"befb066c3989","components/feedback/Notice.jsx":"6afcf84f341f","components/feedback/Tabs.jsx":"70e538854247","components/forms/Field.jsx":"cd45d5f49f0a","components/forms/Select.jsx":"357e384d738d","components/forms/Switch.jsx":"134ed6ff5657","components/layout/Bento.jsx":"f40aa18b2e87","components/layout/Card.jsx":"e84656d3a542","components/layout/Stat.jsx":"dccb118f7556","handoff/action-button.tsx":"88a7647e139b","handoff/lead-detail-card.tsx":"e23df9ec08e7","handoff/tailwind.config.ts":"71b7edf99586","handoff/typography.tsx":"ffa45c8f1d8d","ui_kits/app/AppShell.jsx":"bf0a179d7c95","ui_kits/app/Dashboard.jsx":"c2d0cdb1ad6d","ui_kits/app/LeadDetail.jsx":"4bae9b834b34","ui_kits/app/LeadInbox.jsx":"1d12a53a42e3","ui_kits/app/data.js":"404e05e77414","ui_kits/marketing/Landing.jsx":"a492860c9ba8"},"inlinedExternals":[],"unexposedExports":[{"name":"config","sourcePath":"handoff/tailwind.config.ts"}]} */

(() => {

const __ds_ns = (window.CrestDesignSystemLeadParrot_bb3a07 = window.CrestDesignSystemLeadParrot_bb3a07 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Avatar — squared identity mark with mono initials. Sharp by default
 * (set shape="pill" for round). Used for orgs, authors (u/handle).
 */
function Avatar({
  label = "",
  src,
  size = 36,
  shape = "square",
  tone = "ink",
  style,
  ...rest
}) {
  const initials = label.replace(/^u\//, "").split(/[\s_/-]+/).filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const tones = {
    ink: {
      bg: "var(--ink)",
      fg: "var(--paper)"
    },
    accent: {
      bg: "var(--accent)",
      fg: "var(--on-accent)"
    },
    soft: {
      bg: "var(--paper-sunk)",
      fg: "var(--ink-2)"
    }
  };
  const t = tones[tone] || tones.ink;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      flex: `0 0 ${size}px`,
      borderRadius: shape === "pill" ? "var(--radius-pill)" : "var(--radius-xs)",
      background: src ? "transparent" : t.bg,
      color: t.fg,
      fontFamily: "var(--font-mono)",
      fontSize: `${Math.round(size * 0.34)}px`,
      fontWeight: 500,
      letterSpacing: "0.02em",
      overflow: "hidden",
      border: tone === "soft" ? "1px solid var(--line-2)" : "none",
      ...style
    }
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: label,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }) : initials || "—");
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Badge — compact pill status marker. Mono micro-label.
 * Tones map to the Crest earthy semantic palette.
 */
function Badge({
  children,
  tone = "neutral",
  solid = false,
  style,
  ...rest
}) {
  const tones = {
    neutral: {
      fg: "var(--ink-2)",
      bg: "var(--paper-sunk)",
      bd: "var(--line-2)"
    },
    accent: {
      fg: "var(--accent)",
      bg: "var(--accent-tint)",
      bd: "var(--accent-line)"
    },
    high: {
      fg: "var(--high)",
      bg: "var(--high-tint)",
      bd: "var(--accent-line)"
    },
    medium: {
      fg: "var(--medium)",
      bg: "var(--medium-tint)",
      bd: "#E0CFA8"
    },
    low: {
      fg: "var(--low)",
      bg: "var(--low-tint)",
      bd: "#E2C5BC"
    },
    danger: {
      fg: "var(--danger)",
      bg: "var(--danger-tint)",
      bd: "#E2C0B8"
    },
    info: {
      fg: "var(--info)",
      bg: "var(--info-tint)",
      bd: "#BFD2D6"
    }
  };
  const t = tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "5px",
      fontFamily: "var(--font-mono)",
      fontSize: "10.5px",
      fontWeight: 500,
      letterSpacing: "var(--tracking-mono)",
      textTransform: "uppercase",
      lineHeight: 1,
      padding: "4px 9px 3px",
      borderRadius: "var(--radius-pill)",
      color: solid ? "var(--on-accent)" : t.fg,
      background: solid ? t.fg : t.bg,
      border: `1px solid ${solid ? t.fg : t.bd}`,
      whiteSpace: "nowrap",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button — The Crest primary control.
 * Mono, uppercase, letter-spaced label · sharp 0px corners · 1px border.
 * Variants: primary | secondary | ghost | danger. Sizes: sm | md | lg.
 */
function Button({
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
    sm: {
      padding: "7px 12px",
      fontSize: "11px",
      gap: "6px"
    },
    md: {
      padding: "10px 18px",
      fontSize: "12px",
      gap: "8px"
    },
    lg: {
      padding: "14px 26px",
      fontSize: "13px",
      gap: "10px"
    }
  };
  const variants = {
    primary: {
      background: "var(--accent)",
      color: "var(--on-accent)",
      border: "1px solid var(--accent)"
    },
    secondary: {
      background: "transparent",
      color: "var(--ink)",
      border: "1px solid var(--ink)"
    },
    ghost: {
      background: "transparent",
      color: "var(--ink-2)",
      border: "1px solid transparent"
    },
    danger: {
      background: "transparent",
      color: "var(--danger)",
      border: "1px solid var(--danger)"
    }
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
    ...variants[variant]
  };
  const Comp = as;
  return /*#__PURE__*/React.createElement(Comp, _extends({
    className: `crest-btn crest-btn--${variant}`,
    style: base,
    disabled: as === "button" ? disabled : undefined
  }, rest), iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex"
    }
  }, iconLeft), children, iconRight && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex"
    }
  }, iconRight));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Eyebrow — mono uppercase section kicker. The Crest's editorial
 * label that sits above serif headlines. Optional leading rule tick.
 */
function Eyebrow({
  children,
  tick = true,
  tone = "muted",
  style,
  ...rest
}) {
  const color = tone === "accent" ? "var(--accent)" : "var(--ink-3)";
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
      fontFamily: "var(--font-mono)",
      fontSize: "12px",
      fontWeight: 500,
      letterSpacing: "var(--tracking-caps)",
      textTransform: "uppercase",
      color,
      ...style
    }
  }, rest), tick && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      width: "18px",
      height: "1px",
      background: "currentColor",
      opacity: 0.6
    }
  }), children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Icon — thin wrapper over Lucide (the Crest icon standard).
 * Renders a Lucide glyph by name at a consistent 1.5px stroke.
 * Requires the Lucide UMD script present on the page (window.lucide).
 */
function Icon({
  name,
  size = 16,
  stroke = 1.75,
  color = "currentColor",
  style,
  ...rest
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (el && typeof window !== "undefined" && window.lucide) {
      el.innerHTML = "";
      el.setAttribute("data-lucide", name);
      try {
        window.lucide.createIcons({
          attrs: {
            width: size,
            height: size,
            "stroke-width": stroke
          },
          nameAttr: "data-lucide"
        });
      } catch (e) {
        /* lucide not ready — no-op */
      }
    }
  }, [name, size, stroke]);
  return /*#__PURE__*/React.createElement("i", _extends({
    ref: ref,
    "data-lucide": name,
    "aria-hidden": "true",
    style: {
      display: "inline-flex",
      width: size,
      height: size,
      color,
      flex: "0 0 auto",
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Tag — squared keyword/pain-point chip. Sharp corners, hairline border.
 * Used for keywords, pain points, buying signals, filters.
 */
function Tag({
  children,
  tone = "neutral",
  onRemove,
  style,
  ...rest
}) {
  const tones = {
    neutral: {
      fg: "var(--ink-2)",
      bd: "var(--line-2)",
      bg: "var(--surface)"
    },
    accent: {
      fg: "var(--accent)",
      bd: "var(--accent-line)",
      bg: "var(--accent-tint)"
    },
    muted: {
      fg: "var(--ink-3)",
      bd: "var(--line)",
      bg: "transparent"
    }
  };
  const t = tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      letterSpacing: "0.02em",
      lineHeight: 1,
      padding: "5px 8px",
      borderRadius: "var(--radius-xs)",
      color: t.fg,
      background: t.bg,
      border: `1px solid ${t.bd}`,
      whiteSpace: "nowrap",
      ...style
    }
  }, rest), children, onRemove && /*#__PURE__*/React.createElement("button", {
    onClick: onRemove,
    "aria-label": "Remove",
    style: {
      border: "none",
      background: "none",
      padding: 0,
      margin: 0,
      cursor: "pointer",
      color: "var(--ink-4)",
      lineHeight: 1,
      fontFamily: "var(--font-mono)",
      fontSize: "12px"
    }
  }, "\xD7"));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/data/Meter.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Meter — thin squared progress/usage bar. Flat track, accent fill,
 * mono numerals. Used for usage limits and single-value gauges.
 */
function Meter({
  label,
  value = 0,
  max = 100,
  unit,
  tone = "accent",
  showValue = true,
  style,
  ...rest
}) {
  const pct = Math.max(0, Math.min(100, value / max * 100));
  const fills = {
    accent: "var(--accent)",
    soft: "var(--accent-soft)",
    medium: "var(--medium)",
    low: "var(--low)",
    ink: "var(--ink)"
  };
  const near = pct >= 90;
  const fill = near ? "var(--low)" : fills[tone] || fills.accent;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      ...style
    }
  }, rest), (label || showValue) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: "12px"
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "13px",
      color: "var(--ink-2)"
    }
  }, label), showValue && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "12px",
      color: "var(--ink)",
      letterSpacing: "0.02em",
      fontVariantNumeric: "tabular-nums"
    }
  }, value.toLocaleString(), unit ? "" : "", " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ink-4)"
    }
  }, "/ ", max.toLocaleString(), unit || ""))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: "6px",
      width: "100%",
      background: "var(--paper-sunk)",
      border: "1px solid var(--line)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: `${pct}%`,
      background: fill,
      transition: "width var(--dur-slow) var(--ease-out)"
    }
  })));
}
Object.assign(__ds_scope, { Meter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Meter.jsx", error: String((e && e.message) || e) }); }

// components/data/ScoreBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ScoreBadge — the LeadParrot intent score as an editorial unit:
 * a large serif number + a mono tier label. Tiers: high ≥70,
 * medium 40–69, low <40.
 */
function ScoreBadge({
  score = 0,
  showTier = true,
  size = "md",
  style,
  ...rest
}) {
  const tier = score >= 70 ? "high" : score >= 40 ? "medium" : "low";
  const meta = {
    high: {
      label: "High intent",
      color: "var(--high)"
    },
    medium: {
      label: "Medium",
      color: "var(--medium)"
    },
    low: {
      label: "Low",
      color: "var(--low)"
    }
  }[tier];
  const sizes = {
    sm: "22px",
    md: "32px",
    lg: "48px"
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 400,
      fontSize: sizes[size],
      lineHeight: 1,
      letterSpacing: "-0.02em",
      color: meta.color,
      fontVariantNumeric: "lining-nums tabular-nums"
    }
  }, score), showTier && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      flexDirection: "column",
      gap: "2px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: "20px",
      height: "1px",
      background: meta.color,
      opacity: 0.5
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "10px",
      fontWeight: 500,
      letterSpacing: "var(--tracking-caps)",
      textTransform: "uppercase",
      color: meta.color
    }
  }, meta.label)));
}
Object.assign(__ds_scope, { ScoreBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ScoreBadge.jsx", error: String((e && e.message) || e) }); }

// components/data/ScoreBars.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ScoreBars — the LeadParrot weighted-score breakdown.
 * relevance·0.35 + intent·0.30 + urgency·0.20 + fit·0.15.
 * Mono labels + weights, hairline tracks, accent fills.
 */
function ScoreBars({
  relevance = 0,
  intent = 0,
  urgency = 0,
  fit = 0,
  style,
  ...rest
}) {
  const rows = [{
    label: "Relevance",
    value: relevance,
    weight: "35%"
  }, {
    label: "Intent",
    value: intent,
    weight: "30%"
  }, {
    label: "Urgency",
    value: urgency,
    weight: "20%"
  }, {
    label: "Fit",
    value: fit,
    weight: "15%"
  }];
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "14px",
      ...style
    }
  }, rest), rows.map(r => /*#__PURE__*/React.createElement("div", {
    key: r.label,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "6px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: "var(--ink-2)"
    }
  }, r.label, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ink-4)",
      marginLeft: "8px"
    }
  }, "\xB7", r.weight)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "12px",
      fontWeight: 500,
      color: "var(--ink)",
      fontVariantNumeric: "tabular-nums"
    }
  }, r.value)), /*#__PURE__*/React.createElement("div", {
    style: {
      height: "4px",
      width: "100%",
      background: "var(--paper-sunk)",
      borderRadius: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: `${Math.max(0, Math.min(100, r.value))}%`,
      background: "var(--accent-soft)"
    }
  })))));
}
Object.assign(__ds_scope, { ScoreBars });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ScoreBars.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Notice.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Notice — flat callout for safety, disclosure and status messages.
 * Left ink rule + tinted ground (no rounded "alert" look). The
 * Crest voice for LeadParrot's platform-safety + disclosure notes.
 */
function Notice({
  children,
  title,
  tone = "info",
  icon,
  style,
  ...rest
}) {
  const tones = {
    info: {
      bar: "var(--info)",
      bg: "var(--info-tint)",
      fg: "var(--ink-2)"
    },
    accent: {
      bar: "var(--accent)",
      bg: "var(--accent-tint)",
      fg: "var(--ink-2)"
    },
    caution: {
      bar: "var(--medium)",
      bg: "var(--medium-tint)",
      fg: "var(--ink-2)"
    },
    danger: {
      bar: "var(--danger)",
      bg: "var(--danger-tint)",
      fg: "var(--ink-2)"
    },
    neutral: {
      bar: "var(--line-strong)",
      bg: "var(--paper-sunk)",
      fg: "var(--ink-2)"
    }
  };
  const t = tones[tone] || tones.info;
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "note",
    style: {
      display: "flex",
      gap: "12px",
      padding: "14px 16px",
      background: t.bg,
      borderLeft: `2px solid ${t.bar}`,
      border: "1px solid var(--line)",
      borderLeftWidth: "2px",
      borderLeftColor: t.bar,
      ...style
    }
  }, rest), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      color: t.bar,
      marginTop: "1px",
      flex: "0 0 auto"
    }
  }, icon), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "3px",
      minWidth: 0
    }
  }, title && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      fontWeight: 600,
      letterSpacing: "var(--tracking-caps)",
      textTransform: "uppercase",
      color: t.bar
    }
  }, title), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "13px",
      lineHeight: 1.5,
      color: t.fg
    }
  }, children)));
}
Object.assign(__ds_scope, { Notice });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Notice.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Tabs — underline tab strip. Mono labels, active tab carries an ink
 * underline + count. Controlled via value/onChange.
 */
function Tabs({
  tabs = [],
  value,
  onChange,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "tablist",
    style: {
      display: "flex",
      gap: "0",
      borderBottom: "1px solid var(--line-2)",
      ...style
    }
  }, rest), tabs.map(tab => {
    const key = tab.id ?? tab.label;
    const active = value === key;
    return /*#__PURE__*/React.createElement("button", {
      key: key,
      role: "tab",
      "aria-selected": active,
      onClick: () => onChange && onChange(key),
      className: "crest-tab",
      style: {
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
        color: active ? "var(--ink)" : "var(--ink-3)"
      }
    }, tab.label, tab.count != null && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: "11px",
        color: active ? "var(--accent)" : "var(--ink-4)",
        fontVariantNumeric: "tabular-nums"
      }
    }, tab.count));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/forms/Field.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Field — labelled text input. Mono uppercase label, sharp 2px input,
 * 1px border that goes accent on focus. Optional hint + error.
 */
function Field({
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
    resize: textarea ? "vertical" : undefined
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "7px",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      fontWeight: 500,
      letterSpacing: "var(--tracking-caps)",
      textTransform: "uppercase",
      color: "var(--ink-3)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center"
    }
  }, prefix && !textarea && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: "11px",
      color: "var(--ink-4)",
      fontFamily: "var(--font-mono)",
      fontSize: "13px",
      pointerEvents: "none"
    }
  }, prefix), textarea ? /*#__PURE__*/React.createElement("textarea", _extends({
    id: inputId,
    className: "crest-input",
    rows: rows,
    style: inputStyle
  }, rest)) : /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    className: "crest-input",
    style: inputStyle
  }, rest))), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "12px",
      color: error ? "var(--danger)" : "var(--ink-3)"
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Field.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Select — squared native select styled to the Crest. Mono label,
 * hairline border, custom chevron.
 */
function Select({
  label,
  hint,
  children,
  id,
  style,
  ...rest
}) {
  const selectId = id || (label ? `s-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "7px",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: selectId,
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      fontWeight: 500,
      letterSpacing: "var(--tracking-caps)",
      textTransform: "uppercase",
      color: "var(--ink-3)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: selectId,
    className: "crest-input",
    style: {
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
      cursor: "pointer"
    }
  }, rest), children), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      position: "absolute",
      right: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      pointerEvents: "none",
      color: "var(--ink-3)",
      fontSize: "11px",
      fontFamily: "var(--font-mono)"
    }
  }, "\u25BE")), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "12px",
      color: "var(--ink-3)"
    }
  }, hint));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Switch — pill toggle (one of the few pill shapes in Crest).
 * Squared knob slides; track fills accent when on.
 */
function Switch({
  checked = false,
  onChange,
  label,
  disabled = false,
  id,
  style,
  ...rest
}) {
  const switchId = id || (label ? `t-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
  const toggle = () => {
    if (!disabled && onChange) onChange(!checked);
  };
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: switchId,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "12px",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", _extends({
    id: switchId,
    role: "switch",
    "aria-checked": checked,
    type: "button",
    onClick: toggle,
    disabled: disabled,
    className: "crest-switch",
    style: {
      position: "relative",
      width: "40px",
      height: "22px",
      flex: "0 0 40px",
      padding: 0,
      border: `1px solid ${checked ? "var(--accent)" : "var(--line-2)"}`,
      borderRadius: "var(--radius-pill)",
      background: checked ? "var(--accent)" : "var(--paper-sunk)",
      cursor: disabled ? "not-allowed" : "pointer"
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: "2px",
      left: "2px",
      width: "16px",
      height: "16px",
      borderRadius: "var(--radius-pill)",
      background: checked ? "var(--paper)" : "var(--surface-raised)",
      border: "1px solid " + (checked ? "var(--accent)" : "var(--line-2)"),
      transform: checked ? "translateX(18px)" : "translateX(0)"
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "14px",
      color: "var(--ink-2)"
    }
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/layout/Bento.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Bento — modular grid with shared hairline seams (1px gap over an
 * ink-tinted backing). Cells read as one engineered surface. The
 * Crest layout primitive for dashboards and feature sections.
 */
function Bento({
  children,
  cols = 4,
  seam = "hairline",
  style,
  ...rest
}) {
  const gap = seam === "hairline" ? "1px" : "var(--space-4)";
  const bg = seam === "hairline" ? "var(--line-2)" : "transparent";
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "grid",
      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      gap,
      background: bg,
      border: seam === "hairline" ? "1px solid var(--line-2)" : "none",
      ...style
    }
  }, rest), children);
}

/**
 * BentoItem — a single cell. Spans columns/rows via colSpan/rowSpan.
 */
function BentoItem({
  children,
  colSpan = 1,
  rowSpan = 1,
  pad = "lg",
  tone = "surface",
  style,
  ...rest
}) {
  const pads = {
    none: 0,
    sm: "16px",
    md: "20px",
    lg: "28px"
  };
  const tones = {
    surface: {
      background: "var(--surface-card)",
      color: "var(--ink)"
    },
    sunk: {
      background: "var(--paper-sunk)",
      color: "var(--ink)"
    },
    ink: {
      background: "var(--ink)",
      color: "var(--paper)"
    },
    accent: {
      background: "var(--accent)",
      color: "var(--on-accent)"
    }
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      gridColumn: `span ${colSpan} / span ${colSpan}`,
      gridRow: `span ${rowSpan} / span ${rowSpan}`,
      padding: pads[pad],
      minWidth: 0,
      ...tones[tone],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Bento, BentoItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Bento.jsx", error: String((e && e.message) || e) }); }

// components/layout/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Card — the Crest container. Sharp 0px corners, 1px border, flat.
 * No drop shadows; structure comes from the border. Set interactive
 * for hover-to-ink-edge behavior (clickable cards / list items).
 */
function Card({
  children,
  variant = "default",
  interactive = false,
  pad = "lg",
  as = "div",
  style,
  className = "",
  ...rest
}) {
  const surfaces = {
    default: {
      background: "var(--surface-card)",
      border: "1px solid var(--line-2)"
    },
    raised: {
      background: "var(--surface-raised)",
      border: "1px solid var(--line-2)"
    },
    sunk: {
      background: "var(--paper-sunk)",
      border: "1px solid var(--line)"
    },
    ink: {
      background: "var(--ink)",
      border: "1px solid var(--ink)"
    },
    outline: {
      background: "transparent",
      border: "1px solid var(--line-2)"
    }
  };
  const pads = {
    none: 0,
    sm: "16px",
    md: "20px",
    lg: "28px",
    xl: "40px"
  };
  const Comp = as;
  return /*#__PURE__*/React.createElement(Comp, _extends({
    className: `crest-card ${interactive ? "crest-card--interactive" : ""} ${className}`.trim(),
    style: {
      borderRadius: "var(--radius-none)",
      padding: pads[pad],
      color: variant === "ink" ? "var(--paper)" : "var(--ink)",
      ...surfaces[variant],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Card.jsx", error: String((e && e.message) || e) }); }

// components/layout/Stat.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Stat — editorial metric. Mono uppercase label over a large serif
 * number. The dashboard's primary data voice.
 */
function Stat({
  label,
  value,
  hint,
  trend,
  align = "left",
  size = "md",
  style,
  ...rest
}) {
  const sizes = {
    sm: "28px",
    md: "40px",
    lg: "56px"
  };
  const trendColor = trend && trend.dir === "up" ? "var(--high)" : trend && trend.dir === "down" ? "var(--low)" : "var(--ink-3)";
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      textAlign: align,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      fontWeight: 500,
      letterSpacing: "var(--tracking-caps)",
      textTransform: "uppercase",
      color: "var(--ink-3)"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 400,
      fontSize: sizes[size],
      lineHeight: 1,
      letterSpacing: "-0.02em",
      color: "var(--ink)",
      fontVariantNumeric: "lining-nums tabular-nums"
    }
  }, value), (hint || trend) && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "12px",
      color: "var(--ink-3)"
    }
  }, trend && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: 500,
      color: trendColor,
      letterSpacing: "0.02em"
    }
  }, trend.dir === "up" ? "▲" : trend.dir === "down" ? "▼" : "■", " ", trend.value), hint && /*#__PURE__*/React.createElement("span", null, hint)));
}
Object.assign(__ds_scope, { Stat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Stat.jsx", error: String((e && e.message) || e) }); }

// handoff/action-button.tsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// THE CREST DESIGN SYSTEM — Action Button (React + Tailwind)
// Showcases the typography (mono, uppercase, tracked) and the
// 1px-border aesthetic. Sharp 0px corners, zero drop shadow.
// Place at: src/components/crest/action-button.tsx

// In the LeadParrot repo, replace this with: import { cn } from "@/lib/utils";
// (inlined here so the file is self-contained outside the repo)
function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}
const VARIANTS = {
  primary: "bg-accent text-accent-fg border-accent hover:bg-accent-press hover:border-accent-press",
  secondary: "bg-transparent text-ink border-ink hover:bg-ink hover:text-paper",
  ghost: "bg-transparent text-ink-2 border-transparent hover:bg-paper-sunk hover:text-ink",
  danger: "bg-transparent text-danger border-danger hover:bg-danger hover:text-paper"
};
const SIZES = {
  sm: "px-3 py-[7px] text-[11px] gap-1.5",
  md: "px-[18px] py-2.5 text-xs gap-2",
  lg: "px-[26px] py-3.5 text-[13px] gap-2.5"
};
function ActionButton({
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  full = false,
  className,
  children,
  ...props
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cn(
    // Type IS the interface: mono, uppercase, letter-spaced.
    "inline-flex items-center justify-center rounded-none border", "font-mono font-medium uppercase tracking-[0.08em] leading-none", "transition-colors duration-150 ease-standard", "active:shadow-press disabled:opacity-45 disabled:pointer-events-none", "focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_var(--paper),0_0_0_3.5px_var(--accent)]", VARIANTS[variant], SIZES[size], full && "w-full", className)
  }, props), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { ActionButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "handoff/action-button.tsx", error: String((e && e.message) || e) }); }

// handoff/lead-detail-card.tsx
try { (() => {
// THE CREST DESIGN SYSTEM — Lead Detail Card (React + Tailwind)
// Demonstrates the bento-grid structure and data hierarchy:
// editorial serif score, mono metadata, hairline-seam metric grid,
// and a 1px-border container with no drop shadow.
// Place at: src/components/crest/lead-detail-card.tsx

// In the LeadParrot repo, replace this with: import { cn } from "@/lib/utils";
// (inlined here so the file is self-contained outside the repo)
function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}
function tier(score) {
  if (score >= 70) return {
    label: "High intent",
    className: "text-high"
  };
  if (score >= 40) return {
    label: "Medium",
    className: "text-medium"
  };
  return {
    label: "Low",
    className: "text-low"
  };
}
const WEIGHTS = [{
  key: "relevance",
  label: "Relevance",
  weight: "35%"
}, {
  key: "intent",
  label: "Intent",
  weight: "30%"
}, {
  key: "urgency",
  label: "Urgency",
  weight: "20%"
}, {
  key: "fit",
  label: "Fit",
  weight: "15%"
}];
function LeadDetailCard({
  title,
  source,
  subreddit,
  author,
  postedAt,
  score,
  scores,
  reason
}) {
  const t = tier(score);
  return /*#__PURE__*/React.createElement("article", {
    className: "rounded-none border border-line-2 bg-surface"
  }, /*#__PURE__*/React.createElement("header", {
    className: "flex items-start justify-between gap-6 border-b border-line p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "crest-badge border-accent bg-accent text-accent-fg"
  }, source), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[10.5px] uppercase tracking-[0.06em] text-ink-4"
  }, subreddit, " \xB7 ", author, " \xB7 ", postedAt)), /*#__PURE__*/React.createElement("h3", {
    className: "font-display text-2xl leading-tight tracking-tightest text-ink"
  }, title)), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-end"
  }, /*#__PURE__*/React.createElement("span", {
    className: cn("font-display text-5xl leading-none tracking-tightest tabular-nums", t.className)
  }, score), /*#__PURE__*/React.createElement("span", {
    className: cn("mt-1 font-mono text-[10px] uppercase tracking-caps", t.className)
  }, t.label))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-4 gap-px border-b border-line bg-line"
  }, WEIGHTS.map(w => /*#__PURE__*/React.createElement("div", {
    key: w.key,
    className: "bg-surface p-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3"
  }, w.label, " ", /*#__PURE__*/React.createElement("span", {
    className: "text-ink-4"
  }, "\xB7 ", w.weight)), /*#__PURE__*/React.createElement("div", {
    className: "mt-2 font-display text-3xl leading-none tabular-nums text-ink"
  }, scores[w.key]), /*#__PURE__*/React.createElement("div", {
    className: "mt-3 h-1 w-full bg-paper-sunk"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full bg-accent-soft",
    style: {
      width: `${Math.max(0, Math.min(100, scores[w.key]))}%`
    }
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-start justify-between gap-6 p-6"
  }, /*#__PURE__*/React.createElement("p", {
    className: "max-w-prose text-sm leading-relaxed text-ink-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mr-2 font-mono text-[10px] uppercase tracking-[0.1em] text-accent"
  }, "Why"), reason), /*#__PURE__*/React.createElement("div", {
    className: "flex shrink-0 gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: "crest-btn crest-btn--secondary"
  }, "Save"), /*#__PURE__*/React.createElement("button", {
    className: "crest-btn crest-btn--primary"
  }, "Generate reply"))));
}
Object.assign(__ds_scope, { LeadDetailCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "handoff/lead-detail-card.tsx", error: String((e && e.message) || e) }); }

// handoff/tailwind.config.ts
try { (() => {
/**
 * THE CREST DESIGN SYSTEM — tailwind.config.ts extension for LeadParrot
 * Drop-in replacement for the existing Next.js / Tailwind config.
 *
 * Strategy: tokens are declared once as CSS variables in globals.css
 * (see ./globals.css) and referenced here so Tailwind utilities and
 * raw CSS stay in sync. Sharp 0px corners or full pills only.
 */

const config = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}", "./src/lib/**/*.{ts,tsx}"],
  theme: {
    // Replace the default radius scale entirely — Crest allows only
    // sharp corners or complete pills. No 4/6/8px "soft" radii.
    borderRadius: {
      none: "0px",
      xs: "2px",
      // inputs / chips only
      pill: "9999px",
      // badges, avatars, toggles
      full: "9999px"
    },
    extend: {
      colors: {
        paper: {
          DEFAULT: "var(--paper)",
          // #F4F1E9 Cloud Dancer
          sunk: "var(--paper-sunk)" // #ECE8DD
        },
        surface: {
          DEFAULT: "var(--surface)",
          // #FBFAF5
          raised: "var(--surface-2)" // #FFFFFF
        },
        ink: {
          DEFAULT: "var(--ink)",
          // #1C1B17 warm near-black
          2: "var(--ink-2)",
          // #4A463C
          3: "var(--ink-3)",
          // #6F6A5C
          4: "var(--ink-4)" // #9A9483
        },
        line: {
          DEFAULT: "var(--line)",
          // #DEDACE hairline
          2: "var(--line-2)",
          // #CDC8B8 structural
          strong: "var(--line-strong)" // = ink (emphasis)
        },
        // One owned accent — Verdigris.
        accent: {
          DEFAULT: "var(--accent)",
          // #2E5E45
          press: "var(--accent-press)",
          // #244B37
          soft: "var(--accent-soft)",
          // #5A7C66 sage
          tint: "var(--accent-tint)",
          // #E6EBE3
          line: "var(--accent-line)",
          // #BFCDBF
          fg: "var(--on-accent)" // text on accent
        },
        // Earthy semantics — scoring tiers + status.
        high: "var(--high)",
        // green   ≥70
        medium: "var(--medium)",
        // ochre   40–69
        low: "var(--low)",
        // clay    <40
        danger: "var(--danger)",
        // brick
        info: "var(--info)" // slate
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        // Newsreader
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        // IBM Plex Sans
        mono: ["var(--font-mono)", "ui-monospace", "monospace"] // IBM Plex Mono
      },
      fontSize: {
        // Editorial scale (px → rem). Display sizes pair with font-display.
        "3xs": ["0.6875rem", {
          lineHeight: "1"
        }],
        "2xs": ["0.75rem", {
          lineHeight: "1"
        }],
        eyebrow: ["0.75rem", {
          lineHeight: "1",
          letterSpacing: "0.14em"
        }],
        hero: ["4.5rem", {
          lineHeight: "1.02",
          letterSpacing: "-0.025em"
        }],
        display: ["2.625rem", {
          lineHeight: "1.08",
          letterSpacing: "-0.02em"
        }]
      },
      letterSpacing: {
        mono: "0.08em",
        caps: "0.14em",
        tightest: "-0.025em"
      },
      // Borders carry structure — keep only a single restrained overlay
      // lift for true popovers/dialogs. No ambient card shadows.
      boxShadow: {
        none: "none",
        press: "inset 0 1px 2px 0 rgb(28 27 23 / 0.12)",
        overlay: "0 1px 0 0 var(--line-2), 0 24px 48px -24px rgb(28 27 23 / 0.28)"
      },
      backgroundImage: {
        grain: "var(--grain)"
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.2, 0, 0.1, 1)",
        out: "cubic-bezier(0.16, 1, 0.3, 1)"
      }
    }
  },
  plugins: []
};
Object.assign(__ds_scope, { config });
})(); } catch (e) { __ds_ns.__errors.push({ path: "handoff/tailwind.config.ts", error: String((e && e.message) || e) }); }

// handoff/typography.tsx
try { (() => {
// THE CREST DESIGN SYSTEM — Typography scale specimen (React + Tailwind)
// Hero serif headline vs. utility mono/sans. Demonstrates text as the
// primary interface architecture.
// Place at: src/components/crest/typography.tsx

function TypographySpecimen() {
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-10 bg-paper p-12"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "crest-eyebrow before:h-px before:w-[18px] before:bg-current before:opacity-60"
  }, "The Crest"), /*#__PURE__*/React.createElement("h1", {
    className: "mt-4 max-w-3xl font-display text-hero font-light text-ink"
  }, "Find customers already asking for what you sell."), /*#__PURE__*/React.createElement("p", {
    className: "mt-6 max-w-xl font-sans text-lg leading-normal text-ink-2"
  }, "A striking neo-serif carries the editorial voice; a clean grotesque keeps long-form reading effortless.")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-6 border-t border-line pt-8"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-2xs uppercase tracking-caps text-ink-3"
  }, "Relevance \xB7 35%"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-sm tabular-nums text-ink"
  }, "SCORE ", /*#__PURE__*/React.createElement("span", {
    className: "font-medium text-accent"
  }, "81")), /*#__PURE__*/React.createElement("button", {
    className: "crest-btn crest-btn--primary"
  }, "Generate reply")), /*#__PURE__*/React.createElement("dl", {
    className: "divide-y divide-line border-t border-line"
  }, [{
    spec: "5xl · display · 300",
    cls: "font-display text-5xl font-light tracking-tightest",
    ex: "Crest"
  }, {
    spec: "display · serif",
    cls: "font-display text-display",
    ex: "High-intent leads"
  }, {
    spec: "lg · sans",
    cls: "font-sans text-lg text-ink-2",
    ex: "Body copy that stays calm and legible."
  }, {
    spec: "2xs · mono",
    cls: "font-mono text-2xs uppercase tracking-caps text-ink-3",
    ex: "Utility label"
  }].map(row => /*#__PURE__*/React.createElement("div", {
    key: row.spec,
    className: "flex items-baseline gap-6 py-4"
  }, /*#__PURE__*/React.createElement("dt", {
    className: "w-44 shrink-0 font-mono text-3xs uppercase tracking-[0.08em] text-ink-4"
  }, row.spec), /*#__PURE__*/React.createElement("dd", {
    className: row.cls
  }, row.ex)))));
}
Object.assign(__ds_scope, { TypographySpecimen });
})(); } catch (e) { __ds_ns.__errors.push({ path: "handoff/typography.tsx", error: String((e && e.message) || e) }); }

// ui_kits/app/AppShell.jsx
try { (() => {
// AppShell — sidebar + topbar chrome for the LeadParrot app kit.
const DS = window.CrestDesignSystemLeadParrot_bb3a07;
function NavItem({
  icon,
  label,
  active,
  badge,
  onClick
}) {
  const {
    Icon
  } = DS;
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    className: "crest-row",
    style: {
      display: "flex",
      alignItems: "center",
      gap: "11px",
      width: "100%",
      padding: "9px 12px",
      border: "none",
      cursor: "pointer",
      textAlign: "left",
      background: active ? "var(--paper-sunk)" : "transparent",
      borderLeft: `2px solid ${active ? "var(--accent)" : "transparent"}`,
      color: active ? "var(--ink)" : "var(--ink-2)",
      fontFamily: "var(--font-mono)",
      fontSize: "12px",
      letterSpacing: "0.04em",
      textTransform: "uppercase"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 15,
    color: active ? "var(--accent)" : "var(--ink-3)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, label), badge != null && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "11px",
      color: active ? "var(--accent)" : "var(--ink-4)",
      fontVariantNumeric: "tabular-nums"
    }
  }, badge));
}
function AppShell({
  view,
  setView,
  children
}) {
  const {
    Avatar,
    Button,
    Icon,
    Badge
  } = DS;
  const D = window.CREST_DATA;
  const nav = [{
    id: "dashboard",
    icon: "layout-dashboard",
    label: "Dashboard"
  }, {
    id: "inbox",
    icon: "inbox",
    label: "Lead inbox",
    badge: D.stats.highIntent
  }, {
    id: "projects",
    icon: "folder-kanban",
    label: "Projects"
  }, {
    id: "sources",
    icon: "radio",
    label: "Sources"
  }, {
    id: "digest",
    icon: "mail",
    label: "Daily digest"
  }, {
    id: "billing",
    icon: "credit-card",
    label: "Billing"
  }, {
    id: "settings",
    icon: "settings",
    label: "Settings"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "248px 1fr",
      minHeight: "100%",
      background: "var(--paper)"
    }
  }, /*#__PURE__*/React.createElement("aside", {
    style: {
      borderRight: "1px solid var(--line-2)",
      display: "flex",
      flexDirection: "column",
      background: "var(--surface)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 16px",
      borderBottom: "1px solid var(--line)",
      display: "flex",
      alignItems: "center",
      gap: "11px"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/crest-mark.svg",
    alt: "",
    style: {
      width: 30,
      height: 30
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "20px",
      color: "var(--ink)"
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      fontWeight: 500
    }
  }, "Lead"), "Parrot")), /*#__PURE__*/React.createElement("button", {
    className: "crest-row",
    style: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "12px 16px",
      border: "none",
      borderBottom: "1px solid var(--line)",
      background: "transparent",
      cursor: "pointer",
      textAlign: "left"
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    label: D.org.name,
    tone: "accent",
    size: 32
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontSize: "13px",
      fontWeight: 500,
      color: "var(--ink)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, D.org.name), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: "var(--font-mono)",
      fontSize: "10px",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "var(--ink-4)"
    }
  }, D.org.plan, " plan")), /*#__PURE__*/React.createElement(Icon, {
    name: "chevrons-up-down",
    size: 14,
    color: "var(--ink-4)"
  })), /*#__PURE__*/React.createElement("nav", {
    style: {
      padding: "10px 0",
      display: "flex",
      flexDirection: "column",
      gap: "1px",
      flex: 1
    }
  }, nav.map(n => /*#__PURE__*/React.createElement(NavItem, {
    key: n.id,
    icon: n.icon,
    label: n.label,
    badge: n.badge,
    active: view === n.id,
    onClick: () => setView(n.id)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px",
      borderTop: "1px solid var(--line)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "10px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "999px",
      background: "var(--accent)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "10px",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "var(--ink-3)"
    }
  }, "3 sources live")), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    full: true
  }, "Run a scan"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      height: 60,
      borderBottom: "1px solid var(--line-2)",
      display: "flex",
      alignItems: "center",
      gap: "16px",
      padding: "0 28px",
      background: "var(--surface)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      flex: 1,
      maxWidth: 420,
      border: "1px solid var(--line-2)",
      padding: "8px 12px",
      background: "var(--paper)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 15,
    color: "var(--ink-4)"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search leads, posts, keywords\u2026",
    style: {
      border: "none",
      background: "transparent",
      outline: "none",
      fontFamily: "var(--font-sans)",
      fontSize: "13px",
      color: "var(--ink)",
      width: "100%"
    }
  }), /*#__PURE__*/React.createElement("kbd", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "10px",
      color: "var(--ink-4)",
      border: "1px solid var(--line-2)",
      padding: "2px 5px"
    }
  }, "/")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "bell",
      size: 14
    })
  }, "Digest"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 14
    })
  }, "New project")), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      overflow: "auto",
      padding: "28px"
    }
  }, children)));
}
Object.assign(window, {
  AppShell
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/AppShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Dashboard.jsx
try { (() => {
// Dashboard — bento overview: metrics, usage, recent high-intent leads.
const _DS_DASH = window.CrestDesignSystemLeadParrot_bb3a07;
function Dashboard({
  onOpenLead
}) {
  const {
    Bento,
    BentoItem,
    Stat,
    Card,
    Meter,
    Eyebrow,
    Notice,
    Button,
    Badge,
    ScoreBadge,
    Icon,
    Tag
  } = _DS_DASH;
  const D = window.CREST_DATA;
  const recent = D.leads.filter(l => l.tier === "high");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "24px",
      maxWidth: 1120
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: "16px",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "1 1 320px",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Workspace \xB7 ", D.org.name), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 300,
      fontSize: "40px",
      letterSpacing: "-0.02em",
      color: "var(--ink)",
      margin: "12px 0 0",
      maxWidth: 520
    }
  }, "Good morning. 41 leads worth a look.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "8px",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm"
  }, "View inbox"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "scan-line",
      size: 14
    })
  }, "Run a scan"))), /*#__PURE__*/React.createElement(Notice, {
    tone: "caution",
    title: "Platform safety"
  }, "LeadParrot drafts replies \u2014 it never posts for you. You stay responsible for following each platform's rules before responding."), /*#__PURE__*/React.createElement(Bento, {
    cols: 4
  }, /*#__PURE__*/React.createElement(BentoItem, null, /*#__PURE__*/React.createElement(Stat, {
    label: "Total leads",
    value: D.stats.totalLeads,
    trend: {
      dir: "up",
      value: "12 this wk"
    }
  })), /*#__PURE__*/React.createElement(BentoItem, null, /*#__PURE__*/React.createElement(Stat, {
    label: "High-intent",
    value: D.stats.highIntent,
    hint: "score \u2265 70"
  })), /*#__PURE__*/React.createElement(BentoItem, {
    tone: "ink"
  }, /*#__PURE__*/React.createElement(Stat, {
    label: "Avg score",
    value: D.stats.avgScore
  })), /*#__PURE__*/React.createElement(BentoItem, {
    tone: "accent"
  }, /*#__PURE__*/React.createElement(Stat, {
    label: "Replies copied",
    value: D.stats.repliesCopied
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.6fr 1fr",
      gap: "20px",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "12px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    tone: "accent"
  }, "Recent high-intent leads"), /*#__PURE__*/React.createElement("a", {
    className: "crest-link",
    href: "#",
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--ink-3)"
    }
  }, "View all \u2192")), recent.map(l => /*#__PURE__*/React.createElement(Card, {
    key: l.id,
    variant: "default",
    interactive: true,
    pad: "md",
    as: "div",
    style: {
      cursor: "pointer"
    },
    onClick: () => onOpenLead(l.id)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "18px",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement(ScoreBadge, {
    score: l.score,
    size: "md"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "8px",
      alignItems: "center",
      marginBottom: "7px"
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "accent",
    solid: true
  }, l.source), /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral"
  }, l.stage.replace(/-/g, " ")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "10.5px",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--ink-4)"
    }
  }, l.sub, " \xB7 ", l.posted)), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 400,
      fontSize: "19px",
      lineHeight: 1.2,
      color: "var(--ink)",
      margin: 0
    }
  }, l.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "13px",
      lineHeight: 1.5,
      color: "var(--ink-3)",
      margin: "7px 0 0"
    }
  }, l.reason)))))), /*#__PURE__*/React.createElement(Card, {
    pad: "lg"
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "This month's usage"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "12px",
      color: "var(--ink-3)",
      margin: "8px 0 18px"
    }
  }, "Resets monthly. Upgrade for higher limits."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "18px"
    }
  }, /*#__PURE__*/React.createElement(Meter, {
    label: "Posts scanned",
    value: D.usage.posts.used,
    max: D.usage.posts.limit
  }), /*#__PURE__*/React.createElement(Meter, {
    label: "Reply drafts",
    value: D.usage.replies.used,
    max: D.usage.replies.limit
  }), /*#__PURE__*/React.createElement(Meter, {
    label: "Projects",
    value: D.usage.projects.used,
    max: D.usage.projects.limit
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "22px",
      paddingTop: "18px",
      borderTop: "1px solid var(--line)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: "10px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "var(--ink-3)"
    }
  }, "Watched keywords")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "6px"
    }
  }, D.project.keywords.map(k => /*#__PURE__*/React.createElement(Tag, {
    key: k
  }, k)))))));
}
Object.assign(window, {
  Dashboard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Dashboard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/LeadDetail.jsx
try { (() => {
// LeadDetail — full analysis: original post, reply draft, score panel.
const _DS_DETAIL = window.CrestDesignSystemLeadParrot_bb3a07;
function LeadDetail({
  leadId,
  onBack
}) {
  const {
    Card,
    Button,
    Badge,
    ScoreBadge,
    ScoreBars,
    Notice,
    Eyebrow,
    Icon,
    Tag,
    Avatar
  } = _DS_DETAIL;
  const D = window.CREST_DATA;
  const lead = D.leads.find(l => l.id === leadId) || D.leads[0];
  const [copied, setCopied] = React.useState(false);
  const [saved, setSaved] = React.useState(lead.saved);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1120,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    className: "crest-link",
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "7px",
      background: "none",
      border: "none",
      cursor: "pointer",
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: "var(--ink-3)",
      padding: 0,
      marginBottom: "18px"
    }
  }, "\u2190 Lead inbox"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "10px",
      alignItems: "center",
      marginBottom: "12px",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(ScoreBadge, {
    score: lead.score,
    size: "md"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      height: 26,
      background: "var(--line-2)"
    }
  }), /*#__PURE__*/React.createElement(Badge, {
    tone: "accent",
    solid: true
  }, lead.source), /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral"
  }, lead.stage.replace(/-/g, " ")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--ink-4)"
    }
  }, lead.sub, " \xB7 posted ", lead.posted)), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 300,
      fontSize: "34px",
      lineHeight: 1.12,
      letterSpacing: "-0.02em",
      color: "var(--ink)",
      margin: "0 0 24px",
      maxWidth: 820
    }
  }, lead.title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.7fr 1fr",
      gap: "20px",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "20px"
    }
  }, /*#__PURE__*/React.createElement(Card, {
    pad: "lg"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "14px"
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    label: lead.author,
    tone: "soft",
    size: 30
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "12px",
      color: "var(--ink-2)",
      letterSpacing: "0.02em"
    }
  }, lead.author), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("a", {
    className: "crest-link",
    href: "#",
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--ink-3)"
    }
  }, "View original \u2197")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "15px",
      lineHeight: 1.6,
      color: "var(--ink)",
      margin: 0
    }
  }, lead.body)), /*#__PURE__*/React.createElement(Card, {
    pad: "lg"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "16px"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    tone: "accent"
  }, "Reply draft"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "sparkles",
      size: 13
    })
  }, lead.draft ? "Regenerate" : "Generate reply")), lead.draft ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "16px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid var(--line-2)",
      background: "var(--paper)",
      padding: "18px"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "14px",
      lineHeight: 1.6,
      color: "var(--ink)",
      margin: 0,
      whiteSpace: "pre-wrap"
    }
  }, lead.draft)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: copied ? "check" : "clipboard",
      size: 13
    }),
    onClick: () => setCopied(true)
  }, copied ? "Copied — post it yourself" : "Copy reply"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      letterSpacing: "0.04em",
      color: "var(--ink-4)"
    }
  }, "CONFIDENCE ", lead.confidence, "%")), /*#__PURE__*/React.createElement(Notice, {
    tone: "accent",
    title: "Suggested disclosure"
  }, lead.disclosure), /*#__PURE__*/React.createElement(Notice, {
    tone: "caution",
    title: "Before you post"
  }, /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      paddingLeft: "16px",
      display: "flex",
      flexDirection: "column",
      gap: "4px"
    }
  }, lead.safety.map(s => /*#__PURE__*/React.createElement("li", {
    key: s
  }, s))))) : /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "14px",
      lineHeight: 1.6,
      color: "var(--ink-3)",
      margin: 0
    }
  }, "No draft yet. Generate a helpful, transparent reply you can review and copy. LeadParrot never posts for you."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "20px"
    }
  }, /*#__PURE__*/React.createElement(Card, {
    pad: "lg"
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "AI score"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: "10px",
      margin: "14px 0 18px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 300,
      fontSize: "56px",
      lineHeight: 1,
      letterSpacing: "-0.03em",
      color: "var(--ink)"
    }
  }, lead.score), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: "var(--ink-3)"
    }
  }, "overall \xB7 ", lead.confidence, "% conf.")), /*#__PURE__*/React.createElement(ScoreBars, {
    relevance: lead.relevance,
    intent: lead.intent,
    urgency: lead.urgency,
    fit: lead.fit
  })), /*#__PURE__*/React.createElement(Card, {
    pad: "lg"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "16px"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "10.5px",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "var(--ink-3)"
    }
  }, "Why it's a lead"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "13px",
      lineHeight: 1.55,
      color: "var(--ink-2)",
      margin: "7px 0 0"
    }
  }, lead.reason)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "10.5px",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "var(--ink-3)"
    }
  }, "Suggested angle"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "13px",
      lineHeight: 1.55,
      color: "var(--ink-2)",
      margin: "7px 0 0"
    }
  }, lead.angle)), lead.signals.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "10.5px",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "var(--ink-3)"
    }
  }, "Buying signals"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "6px",
      marginTop: "9px"
    }
  }, lead.signals.map(s => /*#__PURE__*/React.createElement(Tag, {
    key: s,
    tone: "accent"
  }, s)))), lead.pains.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "10.5px",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "var(--ink-3)"
    }
  }, "Pain points"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "6px",
      marginTop: "9px"
    }
  }, lead.pains.map(s => /*#__PURE__*/React.createElement(Tag, {
    key: s
  }, s)))))), /*#__PURE__*/React.createElement(Card, {
    pad: "lg"
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Manage"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      marginTop: "14px"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: saved ? "primary" : "secondary",
    size: "sm",
    full: true,
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "bookmark",
      size: 13
    }),
    onClick: () => setSaved(!saved)
  }, saved ? "Saved" : "Save lead"), /*#__PURE__*/React.createElement(Button, {
    variant: "danger",
    size: "sm",
    full: true
  }, "Not a lead"))))));
}
Object.assign(window, {
  LeadDetail
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/LeadDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/LeadInbox.jsx
try { (() => {
// LeadInbox — filterable list of scored leads.
const _DS_INBOX = window.CrestDesignSystemLeadParrot_bb3a07;
function LeadRow({
  lead,
  onOpen
}) {
  const {
    ScoreBadge,
    Badge,
    Icon,
    Button
  } = _DS_INBOX;
  return /*#__PURE__*/React.createElement("div", {
    className: "crest-row",
    onClick: () => onOpen(lead.id),
    style: {
      display: "grid",
      gridTemplateColumns: "118px 1fr auto",
      gap: "20px",
      alignItems: "center",
      padding: "18px 20px",
      borderBottom: "1px solid var(--line)",
      cursor: "pointer",
      background: "var(--surface)"
    }
  }, /*#__PURE__*/React.createElement(ScoreBadge, {
    score: lead.score,
    size: "sm"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "8px",
      alignItems: "center",
      marginBottom: "5px"
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: lead.source === "Reddit" ? "accent" : "neutral",
    solid: lead.source === "Reddit"
  }, lead.source), /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral"
  }, lead.stage.replace(/-/g, " ")), lead.saved && /*#__PURE__*/React.createElement(Icon, {
    name: "bookmark",
    size: 13,
    color: "var(--accent)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "10.5px",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--ink-4)"
    }
  }, lead.sub, " \xB7 ", lead.author, " \xB7 ", lead.posted)), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 400,
      fontSize: "17px",
      lineHeight: 1.25,
      color: "var(--ink)",
      margin: 0,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, lead.title)), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 13
    })
  }, "Open"));
}
function LeadInbox({
  onOpenLead
}) {
  const {
    Tabs,
    Select,
    Eyebrow,
    Badge,
    Icon
  } = _DS_INBOX;
  const D = window.CREST_DATA;
  const [tab, setTab] = React.useState("high");
  const counts = {
    all: D.leads.length,
    high: D.leads.filter(l => l.tier === "high").length,
    saved: D.leads.filter(l => l.saved).length
  };
  const visible = D.leads.filter(l => tab === "all" ? true : tab === "high" ? l.tier === "high" : tab === "saved" ? l.saved : true);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      maxWidth: 1120
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "Lead inbox"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 300,
      fontSize: "36px",
      letterSpacing: "-0.02em",
      color: "var(--ink)",
      margin: "12px 0 0"
    }
  }, D.leads.length, " leads across 3 sources")), /*#__PURE__*/React.createElement(Tabs, {
    value: tab,
    onChange: setTab,
    tabs: [{
      id: "all",
      label: "All",
      count: counts.all
    }, {
      id: "high",
      label: "High intent",
      count: counts.high
    }, {
      id: "saved",
      label: "Saved",
      count: counts.saved
    }, {
      id: "replied",
      label: "Replied",
      count: 0
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "12px",
      alignItems: "center",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 150
    }
  }, /*#__PURE__*/React.createElement(Select, {
    defaultValue: "all"
  }, /*#__PURE__*/React.createElement("option", {
    value: "all"
  }, "All sources"), /*#__PURE__*/React.createElement("option", null, "Reddit"), /*#__PURE__*/React.createElement("option", null, "Hacker News"), /*#__PURE__*/React.createElement("option", null, "RSS"))), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 150
    }
  }, /*#__PURE__*/React.createElement(Select, {
    defaultValue: "recent"
  }, /*#__PURE__*/React.createElement("option", {
    value: "recent"
  }, "Newest first"), /*#__PURE__*/React.createElement("option", null, "Highest score"), /*#__PURE__*/React.createElement("option", null, "Most urgent"))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--ink-3)"
    }
  }, visible.length, " shown")), /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid var(--line-2)"
    }
  }, visible.map(l => /*#__PURE__*/React.createElement(LeadRow, {
    key: l.id,
    lead: l,
    onOpen: onOpenLead
  })), visible.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "48px",
      textAlign: "center",
      color: "var(--ink-3)",
      fontFamily: "var(--font-sans)",
      fontSize: "14px"
    }
  }, "Nothing here yet. Run a scan or paste a public post to start finding leads.")));
}
Object.assign(window, {
  LeadInbox
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/LeadInbox.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/data.js
try { (() => {
// Demo dataset for the LeadParrot app UI kit — adapted from the
// codebase seed (src/lib/db/seed.ts). Static, illustrative only.
window.CREST_DATA = {
  org: {
    name: "Acme Proposals",
    plan: "Starter",
    website: "acmeproposals.com"
  },
  project: {
    name: "Proposal tool — Reddit + HN",
    keywords: ["proposal tool", "client proposal", "Upwork proposal", "freelance proposal"],
    negatives: ["school proposal", "research proposal", "marriage proposal"],
    competitors: ["PandaDoc", "Better Proposals", "Proposify"]
  },
  stats: {
    totalLeads: 248,
    highIntent: 41,
    avgScore: 63,
    saved: 12,
    repliesCopied: 29,
    activeProjects: 2
  },
  usage: {
    posts: {
      used: 342,
      limit: 500
    },
    replies: {
      used: 88,
      limit: 100
    },
    projects: {
      used: 2,
      limit: 3
    }
  },
  leads: [{
    id: "l1",
    score: 81,
    tier: "high",
    stage: "competitor-switching",
    source: "Reddit",
    sub: "r/agency",
    author: "u/agency_ops",
    posted: "1d ago",
    title: "Frustrated with PandaDoc pricing — any cheaper alternatives?",
    body: "We've been using PandaDoc but the per-seat pricing is getting expensive as our agency grows. Anyone switched to something cheaper that still does proposals and contracts well? Need to decide this week.",
    reason: "Mentions a competitor (PandaDoc) and explicit budget pressure, with strong buying signals and a near-term decision deadline.",
    angle: "Acknowledge the PandaDoc pricing frustration, share one concrete way to cut proposal time, then briefly mention Acme Proposals with disclosure.",
    relevance: 88,
    intent: 82,
    urgency: 75,
    fit: 70,
    confidence: 62,
    pains: ["Cost / pricing concerns", "Outgrowing current tool"],
    signals: ["frustrated with", "alternative", "need to decide this week"],
    risks: ["Reddit self-promotion rules vary by subreddit — read the rules first."],
    status: "new",
    saved: false,
    draft: "Totally get the PandaDoc pricing pain as you add seats. One thing that helped us before switching anything: standardize 2–3 proposal templates so you're not rebuilding each one — that alone cut our prep time a lot. If you do switch, list the must-have features (e-sign, templates, analytics) and only pay for those. I'm building a small proposal tool in this space (Acme Proposals) — happy to share if it's useful, no pressure.",
    disclosure: "I'm building a small proposal tool in this space (Acme Proposals) — sharing because it's relevant, not to pitch.",
    safety: ["Disclose your affiliation before mentioning your product.", "Don't reuse this exact text across threads — personalize it.", "Check the community's self-promotion rules before posting."]
  }, {
    id: "l2",
    score: 69,
    tier: "medium",
    stage: "solution-aware",
    source: "Reddit",
    sub: "r/freelance",
    author: "u/design_freelance",
    posted: "1d ago",
    title: "Looking for a proposal tool for freelance clients — anything better than Word?",
    body: "I'm a freelance designer sending 5–10 client proposals a month. Writing them in Word is painful. Looking for a proposal tool that handles templates and e-signatures. Budget is flexible if it saves time.",
    reason: "Freelancer explicitly looking for a proposal tool with templates and e-signatures; flexible budget signals real intent.",
    angle: "Lead with a concrete tip on reusable proposal templates, then mention Acme Proposals lightly with disclosure.",
    relevance: 84,
    intent: 68,
    urgency: 40,
    fit: 72,
    confidence: 58,
    pains: ["Manual / time-consuming workflow", "Wants templates + e-signatures"],
    signals: ["looking for", "recommend", "budget is flexible"],
    risks: [],
    status: "new",
    saved: true,
    draft: null
  }, {
    id: "l3",
    score: 74,
    tier: "high",
    stage: "problem-aware",
    source: "Hacker News",
    sub: "Ask HN",
    author: "swyx_builds",
    posted: "2d ago",
    title: "Ask HN: how do you track which communities actually send you clients?",
    body: "Running a small dev agency. We get clients from a few subreddits and Slack groups but have no idea which ones convert. How are people attributing this without a heavy CRM?",
    reason: "Problem-aware post about attribution; adjacent to our ICP and a natural place to be genuinely helpful first.",
    angle: "Share a lightweight attribution approach; only mention the product if asked.",
    relevance: 71,
    intent: 64,
    urgency: 55,
    fit: 80,
    confidence: 51,
    pains: ["No attribution", "Avoiding heavy CRM"],
    signals: ["how do you", "track", "without a heavy CRM"],
    risks: ["HN frowns on self-promotion — lead with help, disclose if relevant."],
    status: "new",
    saved: false,
    draft: null
  }, {
    id: "l4",
    score: 33,
    tier: "low",
    stage: "research",
    source: "RSS",
    sub: "indiehackers.com",
    author: "maker_jo",
    posted: "3d ago",
    title: "Roundup: 12 tools I tried for client onboarding this year",
    body: "A long blog post listing onboarding tools. Mentions proposals briefly but mostly about contracts and scheduling.",
    reason: "Low intent — a retrospective roundup, not someone actively asking. Weak fit.",
    angle: "Probably skip. No active buying question.",
    relevance: 48,
    intent: 22,
    urgency: 15,
    fit: 40,
    confidence: 44,
    pains: [],
    signals: [],
    risks: [],
    status: "new",
    saved: false,
    draft: null
  }],
  sources: [{
    type: "Reddit",
    name: "r/freelance + r/Upwork",
    meta: "Official API · new · 1w window",
    last: "30m ago",
    on: true
  }, {
    type: "Hacker News",
    name: "HN — proposal software",
    meta: "Algolia search · public",
    last: "2h ago",
    on: true
  }, {
    type: "RSS",
    name: "Indie Hackers feed",
    meta: "Public RSS",
    last: "1d ago",
    on: true
  }, {
    type: "Manual",
    name: "Manual posts",
    meta: "Paste a public URL or text",
    last: "—",
    on: true
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/data.js", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Landing.jsx
try { (() => {
// Landing — LeadParrot marketing page in the Crest aesthetic.
const _DS_LAND = window.CrestDesignSystemLeadParrot_bb3a07;
function Nav() {
  const {
    Button,
    Icon
  } = _DS_LAND;
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 30,
      borderBottom: "1px solid var(--line-2)",
      background: "color-mix(in srgb, var(--paper) 88%, transparent)",
      backdropFilter: "blur(8px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto",
      height: 64,
      display: "flex",
      alignItems: "center",
      gap: "16px",
      padding: "0 32px"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/crest-mark.svg",
    alt: "",
    style: {
      width: 28,
      height: 28
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "20px",
      color: "var(--ink)"
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      fontWeight: 500
    }
  }, "Lead"), "Parrot"), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      gap: "26px",
      marginLeft: "36px"
    }
  }, ["How it works", "Use cases", "Pricing", "Safety"].map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    className: "crest-link",
    href: "#",
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "12px",
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: "var(--ink-2)"
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm"
  }, "Log in"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm"
  }, "Start finding leads")));
}
function Hero() {
  const {
    Button,
    Eyebrow,
    Badge,
    Icon,
    ScoreBadge
  } = _DS_LAND;
  return /*#__PURE__*/React.createElement("section", {
    className: "crest-grain",
    style: {
      position: "relative",
      borderBottom: "1px solid var(--line-2)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "84px 32px 72px",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "9px",
      border: "1px solid var(--line-2)",
      background: "var(--surface)",
      padding: "6px 12px",
      marginBottom: "30px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "999px",
      background: "var(--accent)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: "var(--ink-2)"
    }
  }, "Lead discovery + reply drafts \xB7 No auto-posting")), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 300,
      fontSize: "72px",
      lineHeight: 1.02,
      letterSpacing: "-0.025em",
      color: "var(--ink)",
      margin: 0,
      maxWidth: 880
    }
  }, "Find customers already asking for what you sell."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "19px",
      lineHeight: 1.5,
      color: "var(--ink-2)",
      margin: "26px 0 0",
      maxWidth: 600
    }
  }, "LeadParrot monitors public conversations, scores buyer intent, and drafts helpful replies \u2014 so you show up at the right moment, before your competitors see the thread."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "12px",
      marginTop: "34px"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg"
  }, "Start finding leads"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg",
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 15
    })
  }, "Try demo search")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "60px",
      border: "1px solid var(--line-2)",
      background: "var(--surface)",
      maxWidth: 720
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "12px 18px",
      borderBottom: "1px solid var(--line)"
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "accent",
    solid: true
  }, "Reddit"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "10.5px",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--ink-4)"
    }
  }, "r/agency \xB7 u/agency_ops \xB7 1d ago"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(ScoreBadge, {
    score: 81,
    size: "sm"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 400,
      fontSize: "20px",
      color: "var(--ink)",
      margin: 0
    }
  }, "Frustrated with PandaDoc pricing \u2014 any cheaper alternatives?"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "13px",
      lineHeight: 1.55,
      color: "var(--ink-3)",
      margin: "10px 0 0"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "10.5px",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "var(--accent)",
      marginRight: "8px"
    }
  }, "Why"), "Competitor mention + explicit budget pressure + a decision deadline this week.")))));
}
function Steps() {
  const {
    Eyebrow
  } = _DS_LAND;
  const steps = [{
    n: "01",
    t: "Describe your business",
    b: "Product, ideal customer, keywords, competitors, and negative keywords."
  }, {
    n: "02",
    t: "Pick topics & communities",
    b: "Reddit, Hacker News, RSS, or paste posts manually. Public sources only."
  }, {
    n: "03",
    t: "Get daily high-intent leads",
    b: "AI scores relevance, intent, urgency and fit, then ranks the best."
  }, {
    n: "04",
    t: "Copy a helpful reply draft",
    b: "Review a transparent, non-spammy draft and decide whether to respond."
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "80px 32px"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "How it works"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 300,
      fontSize: "42px",
      letterSpacing: "-0.02em",
      color: "var(--ink)",
      margin: "16px 0 40px",
      maxWidth: 620
    }
  }, "From public conversation to helpful reply, in one place."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      border: "1px solid var(--line-2)",
      background: "var(--line-2)",
      gap: "1px"
    }
  }, steps.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.n,
    style: {
      background: "var(--surface)",
      padding: "28px 24px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "12px",
      letterSpacing: "0.1em",
      color: "var(--accent)"
    }
  }, s.n), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 400,
      fontSize: "20px",
      color: "var(--ink)",
      margin: "20px 0 0"
    }
  }, s.t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "13px",
      lineHeight: 1.55,
      color: "var(--ink-3)",
      margin: "10px 0 0"
    }
  }, s.b)))));
}
function UseCases() {
  const {
    Eyebrow,
    Icon
  } = _DS_LAND;
  const cases = [{
    i: "rocket",
    t: "SaaS founders",
    b: "Catch people comparing tools or asking for alternatives to your competitors."
  }, {
    i: "users",
    t: "Agencies",
    b: "Find businesses publicly asking for the exact services you deliver."
  }, {
    i: "lightbulb",
    t: "Consultants",
    b: "Spot problem-aware posts where your expertise is the answer."
  }, {
    i: "boxes",
    t: "B2B services",
    b: "Surface buying-intent threads in niche communities you can't watch all day."
  }, {
    i: "bot",
    t: "AI tools",
    b: "Be first to helpful workflows people are trying to automate."
  }, {
    i: "compass",
    t: "Niche services",
    b: "Monitor the handful of forums where your customers actually hang out."
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      borderTop: "1px solid var(--line-2)",
      borderBottom: "1px solid var(--line-2)",
      background: "var(--paper-sunk)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "80px 32px"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    tone: "accent"
  }, "Who it's for"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 300,
      fontSize: "42px",
      letterSpacing: "-0.02em",
      color: "var(--ink)",
      margin: "16px 0 40px",
      maxWidth: 640
    }
  }, "Built for people who sell by being helpful."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "16px"
    }
  }, cases.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.t,
    style: {
      background: "var(--surface)",
      border: "1px solid var(--line-2)",
      padding: "24px"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: c.i,
    size: 20,
    color: "var(--accent)"
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 400,
      fontSize: "19px",
      color: "var(--ink)",
      margin: "16px 0 0"
    }
  }, c.t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "13px",
      lineHeight: 1.55,
      color: "var(--ink-3)",
      margin: "9px 0 0"
    }
  }, c.b))))));
}
function Pricing() {
  const {
    Eyebrow,
    Button,
    Badge,
    Icon
  } = _DS_LAND;
  const plans = [{
    name: "Free",
    price: 0,
    tag: "Validate the workflow with one project.",
    feats: ["1 project", "Manual source", "20 scanned posts / mo", "10 reply drafts / mo"],
    hi: false
  }, {
    name: "Starter",
    price: 19,
    tag: "For solo founders finding their first leads.",
    feats: ["3 projects", "Reddit, HN, RSS + manual", "500 scanned posts / mo", "Daily digest email"],
    hi: false
  }, {
    name: "Pro",
    price: 49,
    tag: "For consultants scaling outreach.",
    feats: ["10 projects", "3,000 scanned posts / mo", "1,000 reply drafts / mo", "Advanced filters"],
    hi: true
  }, {
    name: "Agency",
    price: 99,
    tag: "For agencies managing clients.",
    feats: ["25 projects", "10,000 scanned posts / mo", "Multi-client workspace", "White-label digest"],
    hi: false
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "80px 32px"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Pricing"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 300,
      fontSize: "42px",
      letterSpacing: "-0.02em",
      color: "var(--ink)",
      margin: "16px 0 40px"
    }
  }, "Simple, founder-friendly pricing."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      border: "1px solid var(--line-2)",
      background: "var(--line-2)",
      gap: "1px"
    }
  }, plans.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.name,
    style: {
      background: p.hi ? "var(--ink)" : "var(--surface)",
      padding: "28px 24px",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "16px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "12px",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: p.hi ? "var(--paper)" : "var(--ink-2)"
    }
  }, p.name), p.hi && /*#__PURE__*/React.createElement(Badge, {
    tone: "accent",
    solid: true
  }, "Popular")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: "4px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 300,
      fontSize: "48px",
      letterSpacing: "-0.02em",
      color: p.hi ? "var(--paper)" : "var(--ink)"
    }
  }, "$", p.price), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      color: p.hi ? "var(--paper-sunk)" : "var(--ink-4)"
    }
  }, "/mo")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "12.5px",
      lineHeight: 1.45,
      color: p.hi ? "var(--paper-sunk)" : "var(--ink-3)",
      margin: "10px 0 18px",
      minHeight: 34
    }
  }, p.tag), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "9px",
      flex: 1,
      marginBottom: "20px"
    }
  }, p.feats.map(f => /*#__PURE__*/React.createElement("div", {
    key: f,
    style: {
      display: "flex",
      gap: "8px",
      fontFamily: "var(--font-sans)",
      fontSize: "13px",
      color: p.hi ? "var(--paper)" : "var(--ink-2)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--accent-soft)",
      fontFamily: "var(--font-mono)"
    }
  }, "\u2713"), f))), /*#__PURE__*/React.createElement("button", {
    className: p.hi ? "crest-btn crest-btn--primary" : "crest-btn crest-btn--secondary",
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: 500,
      fontSize: "12px",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      padding: "10px 18px",
      cursor: "pointer",
      background: p.hi ? "var(--accent)" : "transparent",
      color: p.hi ? "var(--on-accent)" : "var(--paper)",
      border: `1px solid ${p.hi ? "var(--accent)" : "var(--paper)"}`
    }
  }, p.price === 0 ? "Start free" : `Choose ${p.name}`)))));
}
function SafetyBlock() {
  const {
    Eyebrow,
    Notice
  } = _DS_LAND;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      borderTop: "1px solid var(--line-2)",
      background: "var(--accent)",
      color: "var(--on-accent)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "crest-grain",
    style: {
      position: "relative",
      maxWidth: 1200,
      margin: "0 auto",
      padding: "72px 32px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "12px",
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "var(--accent-tint)"
    }
  }, "Platform-safe by design"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 300,
      fontSize: "44px",
      letterSpacing: "-0.02em",
      color: "var(--on-accent)",
      margin: "18px 0 0",
      maxWidth: 760
    }
  }, "No auto-posting. No auto-DMs. You stay in control."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "16px",
      lineHeight: 1.6,
      color: "var(--accent-tint)",
      margin: "18px 0 0",
      maxWidth: 620
    }
  }, "LeadParrot is a discovery and drafting tool \u2014 not an automation bot. We use official APIs and public feeds, respect platform rules and rate limits, and never message anyone on your behalf. Every reply is reviewed and posted by you.")));
}
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: "1px solid var(--line-2)",
      background: "var(--surface)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "32px",
      display: "flex",
      alignItems: "center",
      gap: "16px",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/crest-mark-outline.svg",
    alt: "",
    style: {
      width: 24,
      height: 24
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--ink-3)"
    }
  }, "\xA9 2026 LeadParrot"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--ink-4)"
    }
  }, "No auto-posting \xB7 No auto-DMs \xB7 Official APIs only")));
}
function Landing() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--paper)"
    }
  }, /*#__PURE__*/React.createElement(Nav, null), /*#__PURE__*/React.createElement(Hero, null), /*#__PURE__*/React.createElement(Steps, null), /*#__PURE__*/React.createElement(UseCases, null), /*#__PURE__*/React.createElement(Pricing, null), /*#__PURE__*/React.createElement(SafetyBlock, null), /*#__PURE__*/React.createElement(Footer, null));
}
Object.assign(window, {
  Landing
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Landing.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Meter = __ds_scope.Meter;

__ds_ns.ScoreBadge = __ds_scope.ScoreBadge;

__ds_ns.ScoreBars = __ds_scope.ScoreBars;

__ds_ns.Notice = __ds_scope.Notice;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Bento = __ds_scope.Bento;

__ds_ns.BentoItem = __ds_scope.BentoItem;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Stat = __ds_scope.Stat;

__ds_ns.ActionButton = __ds_scope.ActionButton;

__ds_ns.LeadDetailCard = __ds_scope.LeadDetailCard;

__ds_ns.TypographySpecimen = __ds_scope.TypographySpecimen;

})();
