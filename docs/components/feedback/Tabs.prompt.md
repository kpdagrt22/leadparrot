Underline tab strip with mono labels and optional counts. Controlled.

```jsx
const [tab, setTab] = useState("high");
<Tabs value={tab} onChange={setTab} tabs={[
  { id: "all", label: "All leads", count: 248 },
  { id: "high", label: "High intent", count: 41 },
]} />
```
