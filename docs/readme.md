# The Crest Design System — LeadParrot

A premium, editorial-minimalist design language for **LeadParrot** — a
platform-safe, high-intent lead-discovery and AI reply-draft tool for
founder-led sales. The Crest is built for high-end US & European SaaS
buyers: classy, engineered, understated. It should feel like an elite
financial or developer tool, never a playful consumer app.

> **Design thesis** — *Tactile Brutalism × Editorial Minimalism.* Text is
> the interface. Structure comes from 1px borders, not shadow. One owned
> color (Verdigris) does all the talking. Sharp geometry, generous
> whitespace, warm printed-paper ground.

---

## 1 · Product context

LeadParrot finds public conversations where people are already asking for
products or services, scores buyer intent (relevance · intent · urgency ·
fit), and drafts a helpful, disclosed reply the user reviews and posts
themselves. It **never** auto-posts, auto-DMs, or scrapes private sources —
discovery + drafting only.

- **Who it's for** — AI SaaS founders, indie hackers, agencies, consultants,
  small teams doing founder-led sales (US / EU / Canada / Australia).
- **Surfaces** — a marketing site (landing, pricing, demo) and an
  authenticated app (dashboard, projects, sources, lead inbox, lead detail,
  daily digest, billing, settings, admin).
- **Scoring** — `overall = relevance·0.35 + intent·0.30 + urgency·0.20 +
  fit·0.15`. Tiers: **high ≥ 70**, **medium 40–69**, **low < 40**.
- **Plans** — Free $0 · Starter $19 · Pro $49 · Agency $99.

### Sources this system was built from
- **Codebase** — local folder `Lead Parrot/` (Next.js App Router · TypeScript
  · Tailwind · Supabase). Key reads: `tailwind.config.ts`, `src/app/globals.css`,
  `src/components/*` (ui, lead-card, score-badge, pricing-cards, nav),
  `src/app/page.tsx`, `src/app/app/page.tsx`, `src/app/app/leads/[id]/page.tsx`,
  `src/lib/db/seed.ts`, `src/lib/plans.ts`, `docs/PRD.md`.
- **Product bible** — `uploads/LeadParrot_Product_Owner_Context.docx`.
- **Repo (for reference, access not assumed)** — `https://github.com/kpdagrt22/leadparrot.git`.

> **Note on direction.** The shipped codebase uses a generic
> white/slate/emerald SaaS look. The Crest is an intentional **elevation** of
> that brand per the product-owner brief — not a 1:1 reskin. Product
> semantics, copy, and data are preserved; the visual language is new.

---

## 2 · Content fundamentals

How LeadParrot writes. Voice is **helpful, plain, and safety-first** — a
founder talking to another founder, not a growth-hacker.

- **Person** — Speak to the user as *you*; the product is *LeadParrot* / *we*.
  "**You** stay in control." "**We** use official APIs and public feeds."
- **Tone** — Calm, concrete, quietly confident. Benefit-led, never hype.
  Leads with the useful thing, then the caveat.
- **Casing** — Sentence case for all prose and headlines. **Mono labels,
  buttons, eyebrows, and metadata are UPPERCASE** with wide tracking — the
  only place caps appear.
- **Numbers & data** — Tabular, lining numerals. Scores, weights, counts and
  percentages are set in mono. Weights shown explicitly ("Relevance · 35%").
- **Safety language is a feature, not fine print.** Every reply-drafting
  surface restates: *drafts only, you post it, disclose your affiliation,
  check the community's rules.*
- **Emoji** — **None.** The codebase used 🦜/⚠️/✓/→; the Crest replaces all of
  them with the chevron mark, Lucide icons, and mono glyphs. Do not introduce
  emoji.
- **No exclamation marketing.** No "🚀 explode your pipeline." Banned: hype
  verbs (dominate, crush, blast), fake urgency, guaranteed-volume claims.

**Voice examples (real product copy):**
- Hero — "Find customers already asking for what you sell."
- Sub — "Review a transparent, non-spammy draft and decide whether to respond."
- Safety — "No auto-posting. No auto-DMs. You stay in control."
- Disclosure — "I'm building a small proposal tool in this space (Acme
  Proposals) — sharing because it's relevant, not to pitch."
- Empty state — "Run a scan or paste a public post to start finding leads."

---

## 3 · Visual foundations

**Color — one-color ownership.** A warm monochrome base does ~95% of the
work; a single accent, **Verdigris** (`#2E5E45`, a refined botanical green),
owns primary actions, brand, and the "high-intent" tier.
- *Base* — `--paper` #F4F1E9 (Cloud Dancer off-white), `--paper-sunk` #ECE8DD,
  `--surface` #FBFAF5, `--surface-2` #FFFFFF. Surfaces stack *lighter*, not
  cooler — the whole system stays warm.
- *Ink* — warm near-black `#1C1B17` → `#9A9483`, **never pure #000**.
- *Semantics, earthy not neon* — high = Verdigris, medium = ochre `#9A6A1E`,
  low = clay `#9C5848`, danger = brick `#8F3F34`, info = slate `#355C6B`.

**Typography — text as architecture.**
- *Display* — **Newsreader** (neo-serif), set **light (300)** at large sizes
  with tight tracking. Hero, section heads, big numbers, lead scores.
- *Body / UI* — **IBM Plex Sans** (engineered grotesque). Paragraphs, UI.
- *Mono / data* — **IBM Plex Mono**. Labels, eyebrows, buttons, metadata,
  scores — uppercase, tracked. Buttons are mono on purpose: it reads
  "engineered."

**Spacing & layout** — 4px base unit, generous editorial whitespace. Page max
1280px. **Bento grids** with 1px shared hairline seams are the signature
dashboard/feature layout — cells read as one engineered surface.

**Borders, depth & texture** — 1px solid borders carry all structure:
`--line` (hairline) → `--line-2` (structural) → ink (emphasis). **Heavy blurry
drop shadows are abandoned.** Depth = borders + a single restrained
`--shadow-overlay` reserved for true popovers/dialogs. A subtle SVG
**paper-grain** noise sits under the whole page (`--grain`) for printed-paper
tactility; full-bleed accent/dark sections layer a grain overlay (`.crest-grain`).

**Corner radii — strict.** `0px` everywhere (cards, buttons, inputs), `2px`
only for inputs/chips, and full **pill** (`999px`) reserved for badges,
avatars, and toggles. Nothing in between.

**Cards** — sharp 0px corners, 1px `--line-2` border, warm `--surface` ground,
**no shadow**. Interactive cards darken their edge to ink on hover.

**Motion** — quiet and engineered. 120–280ms, `ease-standard` /
`ease-out`. **No bounce, no glow.** Hover = background/edge shift or an
underline that wipes in (links). Press = subtle inset shadow; buttons invert
(secondary fills ink, primary darkens to `--accent-press`). Honour
`prefers-reduced-motion`.

**Imagery** — the brand is type- and data-led; it ships no photography. When
imagery is needed, keep it warm, muted, and grainy to match the paper ground.

---

## 4 · Iconography

- **System** — [**Lucide**](https://lucide.dev) is the Crest icon standard:
  consistent **1.75px stroke**, line (never filled), loaded via CDN
  (`lucide@latest` UMD) and wrapped by the `Icon` component
  (`components/core/Icon.jsx`). Use line icons sparingly and at a steady
  stroke; pair with mono labels.
  > **Substitution flag.** The LeadParrot codebase had **no icon system** — it
  > used emoji (🦜 ⚠️) and unicode (✓ → ▾). The Crest *replaces* these with
  > Lucide + the chevron mark. If you have a preferred icon library, swap the
  > `Icon` wrapper; otherwise Lucide is the standard.
- **Brand mark** — a geometric **chevron crest** (the "peak of intent"), pure
  geometry, in `assets/crest-mark.svg` (filled Verdigris) and
  `assets/crest-mark-outline.svg` (ink + accent outline). No parrot
  illustration — the emoji bird is retired in favour of the mark.
- **Mono glyphs** — small UI affordances (score arrows ▲▼, select chevron ▾,
  ×, ✓, →) are set in IBM Plex Mono rather than icons or emoji.
- **Emoji** — never, in product or marketing.

---

## 5 · Index / manifest

**Foundations (CSS, root):**
- `styles.css` — entry point; `@import` list only (link this one file).
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`,
  `effects.css`, `interactions.css`, `base.css`.
- `assets/` — `crest-mark.svg`, `crest-mark-outline.svg`.

**Foundation specimen cards** — `foundations/*.html` (Design System tab):
Colors (base, ink, accent, semantics, borders), Type (display, body, mono,
scale, pairing), Spacing (scale, radii, texture), Brand (mark, voice).

**Components** — React primitives (`window.CrestDesignSystemLeadParrot_bb3a07`):
- `core/` — Button, Badge, Tag, Eyebrow, Avatar, Icon
- `layout/` — Card, Stat, Bento (+ BentoItem)
- `forms/` — Field, Select, Switch
- `data/` — ScoreBadge, ScoreBars, Meter
- `feedback/` — Notice, Tabs
Each ships `<Name>.jsx` + `.d.ts` + `.prompt.md`, with one `*.card.html`
demo per directory.

**UI kits** — full interactive recreations:
- `ui_kits/app/` — LeadParrot app: dashboard (bento), lead inbox, lead detail.
  Open `index.html`.
- `ui_kits/marketing/` — landing page (hero, steps, use-cases, pricing,
  platform-safety). Open `index.html`.

**Production handoff** — `handoff/` (drop into the Next.js / Tailwind repo):
- `tailwind.config.ts` — Crest theme extension.
- `globals.css` — tokens + base + raw-CSS component twins.
- `action-button.tsx`, `lead-detail-card.tsx`, `typography.tsx` — the three
  foundational components from the brief.

**Other** — `SKILL.md` (Agent-Skill manifest), this `readme.md`.

---

## 6 · Using it

Consumers link one file — `styles.css` — and read components off the global
namespace `window.CrestDesignSystemLeadParrot_bb3a07` after loading
`_ds_bundle.js` (compiled automatically). Fonts load from Google Fonts via the
`@import` in `tokens/fonts.css`. See any `*.card.html` for the exact load order.

> **⚠️ Fonts are CDN-loaded.** Newsreader, IBM Plex Sans, and IBM Plex Mono are
> pulled from Google Fonts rather than self-hosted `.woff2` binaries (the build
> environment can't fetch font files). For production, self-host the three
> families and swap the `@import` in `tokens/fonts.css` for local `@font-face`
> rules. **These are the intended typefaces — flagging the delivery method, not
> a substitution.**
