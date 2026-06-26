The Crest container — sharp corners, 1px border, no shadow. Structure comes from the border, not depth.

```jsx
<Card>Default warm surface</Card>
<Card variant="outline" interactive>Clickable — edge goes ink on hover</Card>
<Card variant="ink"><Eyebrow tone="accent">Emphasis</Eyebrow></Card>
```

Variants: `default · raised · sunk · ink · outline`. `pad`: `none|sm|md|lg|xl`. Set `interactive` for hover affordance on clickable cards.
