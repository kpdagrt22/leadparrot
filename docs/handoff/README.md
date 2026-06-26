# Crest — Production handoff (Next.js / Tailwind)

The three files the LeadParrot product-owner brief asked for, ready to drop
into the existing Next.js / Tailwind repo.

| File | Goes to | What it is |
| --- | --- | --- |
| `tailwind.config.ts` | repo root | Crest theme extension — colors, fonts, radii (0px / pill only), borders-over-shadow, grain. |
| `globals.css` | `src/app/globals.css` | Token CSS variables + base layer + raw-CSS component twins (`.crest-btn`, `.crest-card`, `.crest-bento`, …). |
| `action-button.tsx` | `src/components/crest/` | Primary action button — mono uppercase label, 1px border, sharp corners, 4 variants × 3 sizes. |
| `lead-detail-card.tsx` | `src/components/crest/` | Lead detail card — bento-grid score breakdown + editorial serif score + mono metadata. |
| `typography.tsx` | `src/components/crest/` | Type-scale specimen — serif hero vs. mono/sans utility. |

## Notes
- The `.tsx` files import `cn` from `@/lib/utils` (already in the repo —
  `clsx` + `tailwind-merge`). No new dependencies.
- Tokens live **once** as CSS variables in `globals.css`; `tailwind.config.ts`
  references them so utilities and raw CSS never drift.
- **No animation libraries, no bloat** — only native Tailwind transitions, per
  the LeadParrot no-scope-creep rules.
- Fonts: load Newsreader / IBM Plex Sans / IBM Plex Mono via `next/font` (or the
  `@import` already in `globals.css`). Self-host for production.
- These mirror the live React kit in `../components/` — same visual language,
  expressed as Tailwind classes instead of inline-token styles.
