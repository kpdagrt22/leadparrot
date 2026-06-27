---
name: crest-design
description: Build or restyle UI for The Leads Nest using The Crest design system (Cloud-Dancer paper, single Verdigris green accent, Newsreader serif + IBM Plex Sans/Mono, 0px-or-pill corners, 1px borders not shadows). Use for any page, component, dashboard, landing, or visual asset work, and to keep new UI on-brand.
user-invocable: true
---

# The Crest design system

The full system already lives in **`docs/`** — this skill is the entry point.
**Read `docs/readme.md` first** (the complete design guide), then pull what you
need. Do not invent new visual language.

## Where things are
- `docs/styles.css` + `docs/tokens/` — global CSS: color/type/spacing/effects
  tokens, fonts, base reset, interaction states. Link `styles.css` only.
- `docs/foundations/*.html` — color/type/spacing/brand specimen cards.
- `docs/components/` — React primitives (Button, Badge, Card, Bento, Stat, Field,
  Select, Switch, ScoreBadge, ScoreBars, Meter, Notice, Tabs, …); each has
  `.jsx`, `.d.ts`, `.prompt.md`, and a `*.card.html` demo.
- `docs/ui_kits/` — full screens: `app/` (dashboard, lead inbox, lead detail) and
  `marketing/` (landing).
- `docs/handoff/` — production Next.js/Tailwind: `tailwind.config.ts`,
  `globals.css`, reference components. **Copy from here for real app code.**
- In-app, reuse `src/components/` (incl. `src/components/crest/*`).

## Non-negotiables (match the dashboard screenshot)
- Warm **Cloud-Dancer paper** ground + **one** accent, **Verdigris green**. No
  new colors. At most one dark "well" panel per view (the AVG-SCORE tile).
- **Newsreader** for display (big scores, lead titles) · **IBM Plex Sans** body ·
  **IBM Plex Mono** for labels/buttons/metadata — UPPERCASE, letter-tracked
  (e.g. `TOTAL LEADS`, `REDDIT · R/AGENCY · COMPETITOR-SWITCHING · 1D AGO`).
- Sharp **0px** corners or full **pills** — nothing between. **1px borders, not
  shadows.** Subtle paper grain.
- Helpful, plain, safety-first voice. **No emoji. No hype.**

## How to work
- **Visual mock / throwaway:** inline `docs/styles.css`, reuse `ui_kits/` and the
  `*.card.html` patterns, build static HTML.
- **Production code:** start from `docs/handoff/` and build natively in the
  Tailwind stack. Verify with `npm run lint` + `npm run build`.
