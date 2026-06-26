// LeadInbox — filterable list of scored leads.
const _DS_INBOX = window.CrestDesignSystemLeadParrot_bb3a07;

function LeadRow({ lead, onOpen }) {
  const { ScoreBadge, Badge, Icon, Button } = _DS_INBOX;
  return (
    <div
      className="crest-row"
      onClick={() => onOpen(lead.id)}
      style={{
        display: "grid", gridTemplateColumns: "118px 1fr auto", gap: "20px",
        alignItems: "center", padding: "18px 20px", borderBottom: "1px solid var(--line)",
        cursor: "pointer", background: "var(--surface)",
      }}
    >
      <ScoreBadge score={lead.score} size="sm" />
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "5px" }}>
          <Badge tone={lead.source === "Reddit" ? "accent" : "neutral"} solid={lead.source === "Reddit"}>{lead.source}</Badge>
          <Badge tone="neutral">{lead.stage.replace(/-/g, " ")}</Badge>
          {lead.saved && <Icon name="bookmark" size={13} color="var(--accent)" />}
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "10.5px", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-4)" }}>{lead.sub} · {lead.author} · {lead.posted}</span>
        </div>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "17px", lineHeight: 1.25, color: "var(--ink)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{lead.title}</h3>
      </div>
      <Button variant="ghost" size="sm" iconRight={<Icon name="arrow-right" size={13} />}>Open</Button>
    </div>
  );
}

function LeadInbox({ onOpenLead }) {
  const { Tabs, Select, Eyebrow, Badge, Icon } = _DS_INBOX;
  const D = window.CREST_DATA;
  const [tab, setTab] = React.useState("high");
  const counts = {
    all: D.leads.length,
    high: D.leads.filter((l) => l.tier === "high").length,
    saved: D.leads.filter((l) => l.saved).length,
  };
  const visible = D.leads.filter((l) =>
    tab === "all" ? true : tab === "high" ? l.tier === "high" : tab === "saved" ? l.saved : true
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: 1120 }}>
      <div>
        <Eyebrow>Lead inbox</Eyebrow>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "36px", letterSpacing: "-0.02em", color: "var(--ink)", margin: "12px 0 0" }}>
          {D.leads.length} leads across 3 sources
        </h1>
      </div>

      <Tabs value={tab} onChange={setTab} tabs={[
        { id: "all", label: "All", count: counts.all },
        { id: "high", label: "High intent", count: counts.high },
        { id: "saved", label: "Saved", count: counts.saved },
        { id: "replied", label: "Replied", count: 0 },
      ]} />

      {/* Filter bar */}
      <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ minWidth: 150 }}><Select defaultValue="all"><option value="all">All sources</option><option>Reddit</option><option>Hacker News</option><option>RSS</option></Select></div>
        <div style={{ minWidth: 150 }}><Select defaultValue="recent"><option value="recent">Newest first</option><option>Highest score</option><option>Most urgent</option></Select></div>
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-3)" }}>{visible.length} shown</span>
      </div>

      {/* List */}
      <div style={{ border: "1px solid var(--line-2)" }}>
        {visible.map((l) => <LeadRow key={l.id} lead={l} onOpen={onOpenLead} />)}
        {visible.length === 0 && (
          <div style={{ padding: "48px", textAlign: "center", color: "var(--ink-3)", fontFamily: "var(--font-sans)", fontSize: "14px" }}>
            Nothing here yet. Run a scan or paste a public post to start finding leads.
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { LeadInbox });
