Squared keyword / pain-point chip. Use for project keywords, pain points, buying signals, active filters.

```jsx
<Tag>proposal tool</Tag>
<Tag tone="accent">budget is flexible</Tag>
<Tag onRemove={() => removeKeyword(k)}>{k}</Tag>
```

Tones: `neutral · accent · muted`. Pass `onRemove` to show an × affordance (for editable filter/keyword sets).
