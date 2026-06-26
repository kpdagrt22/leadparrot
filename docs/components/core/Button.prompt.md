Mono-label action button — sharp geometry, 1px border, uppercase. Use for every primary/secondary action across Crest surfaces.

```jsx
<Button variant="primary" size="md">Find leads</Button>
<Button variant="secondary" iconLeft={<Icon name="arrow-up-right" />}>Open post</Button>
<Button variant="ghost" size="sm">Skip</Button>
<Button variant="danger" size="sm">Not a lead</Button>
```

Variants: `primary` (Verdigris fill), `secondary` (ink outline → fills ink on hover), `ghost` (quiet), `danger` (brick outline). Sizes `sm | md | lg`. Pass `full` to stretch, `as="a"` for links, `iconLeft`/`iconRight` for Lucide icons. Labels are auto-uppercased — write them in sentence case.
