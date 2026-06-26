import type { Config } from "tailwindcss";

/**
 * THE CREST DESIGN SYSTEM — LeadParrot Tailwind theme.
 *
 * Tokens live once as CSS variables in src/app/globals.css and are referenced
 * here so utilities and raw CSS never drift. Strict geometry: sharp 0px corners
 * or full pills — every legacy `rounded-*` collapses to 0, only `full`/`pill`
 * survive. Legacy `ink-*` / `brand-*` scales are kept as aliases mapped onto the
 * warm Crest palette so existing markup re-skins without per-element edits.
 */
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    // Crest allows only sharp corners or full pills — collapse the soft scale.
    borderRadius: {
      none: "0px",
      DEFAULT: "0px",
      sm: "0px",
      md: "0px",
      lg: "0px",
      xl: "0px",
      "2xl": "0px",
      "3xl": "0px",
      xs: "2px", // inputs / chips only
      pill: "9999px",
      full: "9999px",
    },
    extend: {
      colors: {
        paper: { DEFAULT: "var(--paper)", sunk: "var(--paper-sunk)" },
        surface: { DEFAULT: "var(--surface)", raised: "var(--surface-2)" },
        ink: {
          DEFAULT: "var(--ink)",
          2: "var(--ink-2)",
          3: "var(--ink-3)",
          4: "var(--ink-4)",
          // Legacy slate scale → warm paper→ink so old `text-ink-900` stays on-brand.
          50: "#F2EFE7",
          100: "#ECE8DD",
          200: "var(--line)",
          300: "var(--line-2)",
          400: "var(--ink-4)",
          500: "var(--ink-3)",
          600: "#5A554A",
          700: "var(--ink-2)",
          800: "#2A2922",
          900: "var(--ink)",
        },
        line: { DEFAULT: "var(--line)", 2: "var(--line-2)", strong: "var(--line-strong)" },
        // One owned accent — Verdigris.
        accent: {
          DEFAULT: "var(--accent)",
          press: "var(--accent-press)",
          soft: "var(--accent-soft)",
          tint: "var(--accent-tint)",
          line: "var(--accent-line)",
          fg: "var(--on-accent)",
        },
        // Legacy emerald `brand` scale → Verdigris family.
        brand: {
          50: "var(--accent-tint)",
          100: "#D8E2D6",
          200: "var(--accent-line)",
          300: "#A6BBA8",
          400: "var(--accent-soft)",
          500: "var(--accent)",
          600: "var(--accent)",
          700: "var(--accent-press)",
          800: "#1E3D2D",
          900: "#162E22",
        },
        // Earthy semantics — scoring tiers + status.
        high: "var(--high)",
        medium: "var(--medium)",
        low: "var(--low)",
        danger: "var(--danger)",
        info: "var(--info)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "3xs": ["0.6875rem", { lineHeight: "1" }],
        "2xs": ["0.75rem", { lineHeight: "1" }],
        eyebrow: ["0.75rem", { lineHeight: "1", letterSpacing: "0.14em" }],
        hero: ["4.5rem", { lineHeight: "1.02", letterSpacing: "-0.025em" }],
        display: ["2.625rem", { lineHeight: "1.08", letterSpacing: "-0.02em" }],
      },
      letterSpacing: {
        mono: "0.08em",
        caps: "0.14em",
        tightest: "-0.025em",
      },
      boxShadow: {
        none: "none",
        card: "none", // legacy alias — Crest carries depth on borders, not shadow
        press: "inset 0 1px 2px 0 rgb(28 27 23 / 0.12)",
        overlay: "0 1px 0 0 var(--line-2), 0 24px 48px -24px rgb(28 27 23 / 0.28)",
      },
      backgroundImage: {
        grain: "var(--grain)",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.2, 0, 0.1, 1)",
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
