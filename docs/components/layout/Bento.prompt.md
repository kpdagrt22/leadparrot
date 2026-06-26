Modular grid with shared hairline seams — the Crest dashboard primitive. Cells read as one engineered surface.

```jsx
<Bento cols={4}>
  <BentoItem><Stat label="Total" value="248" /></BentoItem>
  <BentoItem colSpan={2} tone="ink"><Stat label="Avg score" value="63" /></BentoItem>
  <BentoItem tone="accent"><Stat label="Saved" value="12" /></BentoItem>
</Bento>
```

`seam="hairline"` (1px ink seams) or `"gap"` (spaced). `BentoItem` tones: `surface · sunk · ink · accent`; span with `colSpan`/`rowSpan`.
