---
name: leadparrot-design
description: Use this skill to generate well-branded interfaces and assets for LeadParrot using The Crest Design System — for production or throwaway prototypes/mocks. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping a premium, editorial-minimalist, platform-safe lead-discovery tool.
user-invocable: true
---

# LeadParrot — The Crest Design System

Read `readme.md` first — it is the full design guide (product context, content
fundamentals, visual foundations, iconography, and a file index). Then explore
the other files as needed.

## What's here
- `styles.css` + `tokens/` — the global CSS: tokens (colors, type, spacing,
  effects), fonts, base reset, interaction states. Link `styles.css` only.
- `assets/` — the chevron crest brand mark (filled + outline SVG).
- `foundations/*.html` — foundation specimen cards (colors, type, spacing, brand).
- `components/` — React UI primitives (Button, Badge, Card, Bento, Stat, Field,
  Select, Switch, ScoreBadge, ScoreBars, Meter, Notice, Tabs, Avatar, Tag,
  Eyebrow, Icon). Each has a `.jsx`, `.d.ts`, `.prompt.md`, and a `*.card.html`.
- `ui_kits/` — full interactive screens: `app/` (dashboard, lead inbox, lead
  detail) and `marketing/` (landing page).
- `handoff/` — production Next.js / Tailwind code: `tailwind.config.ts`,
  `globals.css`, and three reference components.

## How to work
- **Visual artifacts** (slides, mocks, throwaway prototypes): copy the assets
  you need out of `assets/`, link or inline `styles.css`, and build static HTML.
  Reuse the component patterns from `ui_kits/` and the `*.card.html` demos.
- **Production code**: copy from `handoff/` and follow the rules in `readme.md`
  to design natively in the LeadParrot / Tailwind stack.

## Non-negotiables (the Crest in one breath)
- Warm Cloud-Dancer paper ground + **one** accent, Verdigris green. No new colors.
- Newsreader (serif display) · IBM Plex Sans (body) · IBM Plex Mono (labels,
  buttons, data — UPPERCASE, tracked).
- Sharp **0px** corners or full **pills**. Nothing in between.
- **1px borders, not shadows.** Subtle paper grain for tactility.
- Helpful, plain, safety-first voice. No emoji. No hype. We draft; you post.

If invoked with no other guidance, ask the user what they want to build or
design, ask a few sharp questions, then act as an expert LeadParrot designer —
outputting HTML artifacts or production code depending on the need.
