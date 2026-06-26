/**
 * THE CREST DESIGN SYSTEM — tailwind.config.ts extension for LeadParrot
 * Drop-in replacement for the existing Next.js / Tailwind config.
 *
 * Strategy: tokens are declared once as CSS variables in globals.css
 * (see ./globals.css) and referenced here so Tailwind utilities and
 * raw CSS stay in sync. Sharp 0px corners or full pills only.
 */
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    // Replace the default radius scale entirely — Crest allows only
    // sharp corners or complete pills. No 4/6/8px "soft" radii.
    borderRadius: {
      none: "0px",
      xs: "2px",      // inputs / chips only
      pill: "9999px", // badges, avatars, toggles
      full: "9999px",
    },
    extend: {
      colors: {
        paper: {
          DEFAULT: "var(--paper)",     // #F4F1E9 Cloud Dancer
          sunk: "var(--paper-sunk)",   // #ECE8DD
        },
        surface: {
          DEFAULT: "var(--surface)",   // #FBFAF5
          raised: "var(--surface-2)",  // #FFFFFF
        },
        ink: {
          DEFAULT: "var(--ink)",       // #1C1B17 warm near-black
          2: "var(--ink-2)",           // #4A463C
          3: "var(--ink-3)",           // #6F6A5C
          4: "var(--ink-4)",           // #9A9483
        },
        line: {
          DEFAULT: "var(--line)",      // #DEDACE hairline
          2: "var(--line-2)",          // #CDC8B8 structural
          strong: "var(--line-strong)" // = ink (emphasis)
        },
        // One owned accent — Verdigris.
        accent: {
          DEFAULT: "var(--accent)",       // #2E5E45
          press: "var(--accent-press)",   // #244B37
          soft: "var(--accent-soft)",     // #5A7C66 sage
          tint: "var(--accent-tint)",     // #E6EBE3
          line: "var(--accent-line)",     // #BFCDBF
          fg: "var(--on-accent)",         // text on accent
        },
        // Earthy semantics — scoring tiers + status.
        high: "var(--high)",     // green   ≥70
        medium: "var(--medium)", // ochre   40–69
        low: "var(--low)",       // clay    <40
        danger: "var(--danger)", // brick
        info: "var(--info)",     // slate
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"], // Newsreader
        sans: ["var(--font-sans)", "system-ui", "sans-serif"], // IBM Plex Sans
        mono: ["var(--font-mono)", "ui-monospace", "monospace"], // IBM Plex Mono
      },
      fontSize: {
        // Editorial scale (px → rem). Display sizes pair with font-display.
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
      // Borders carry structure — keep only a single restrained overlay
      // lift for true popovers/dialogs. No ambient card shadows.
      boxShadow: {
        none: "none",
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
