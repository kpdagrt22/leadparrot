Labelled text input / textarea. Mono uppercase label, sharp 2px input, border goes accent on focus.

```jsx
<Field label="Product keyword" placeholder="proposal tool" hint="Comma-separated." />
<Field label="Pitch" textarea rows={4} />
<Field label="Website" prefix="@" error="Required." />
```

Pass `textarea` for multiline, `prefix` for a leading glyph, `error` to switch to the danger state.
