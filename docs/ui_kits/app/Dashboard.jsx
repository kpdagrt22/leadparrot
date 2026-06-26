// Dashboard — bento overview: metrics, usage, recent high-intent leads.
const _DS_DASH = window.CrestDesignSystemLeadParrot_bb3a07;

function Dashboard({ onOpenLead }) {
  const { Bento, BentoItem, Stat, Card, Meter, Eyebrow, Notice, Button, Badge, ScoreBadge, Icon, Tag } = _DS_DASH;
  const D = window.CREST_DATA;
  const recent = D.leads.filter((l) => l.tier === "high");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: 1120 }}>
      {/* Heading */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 320px", minWidth: 0 }}>
          <Eyebrow>Workspace · {D.org.name}</Eyebrow>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "40px", letterSpacing: "-0.02em", color: "var(--ink)", margin: "12px 0 0", maxWidth: 520 }}>
            Good morning. 41 leads worth a look.
          </h1>
        </div>
        <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
          <Button variant="secondary" size="sm">View inbox</Button>
          <Button variant="primary" size="sm" iconLeft={<Icon name="scan-line" size={14} />}>Run a scan</Button>
        </div>
      </div>

      <Notice tone="caution" title="Platform safety">
        LeadParrot drafts replies — it never posts for you. You stay responsible for following each platform's rules before responding.
      </Notice>

      {/* Bento metrics */}
      <Bento cols={4}>
        <BentoItem><Stat label="Total leads" value={D.stats.totalLeads} trend={{ dir: "up", value: "12 this wk" }} /></BentoItem>
        <BentoItem><Stat label="High-intent" value={D.stats.highIntent} hint="score ≥ 70" /></BentoItem>
        <BentoItem tone="ink"><Stat label="Avg score" value={D.stats.avgScore} /></BentoItem>
        <BentoItem tone="accent"><Stat label="Replies copied" value={D.stats.repliesCopied} /></BentoItem>
      </Bento>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "20px", alignItems: "start" }}>
        {/* Recent high-intent */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Eyebrow tone="accent">Recent high-intent leads</Eyebrow>
            <a className="crest-link" href="#" style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-3)" }}>View all →</a>
          </div>
          {recent.map((l) => (
            <Card key={l.id} variant="default" interactive pad="md" as="div" style={{ cursor: "pointer" }} onClick={() => onOpenLead(l.id)}>
              <div style={{ display: "flex", gap: "18px", alignItems: "flex-start" }}>
                <ScoreBadge score={l.score} size="md" />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "7px" }}>
                    <Badge tone="accent" solid>{l.source}</Badge>
                    <Badge tone="neutral">{l.stage.replace(/-/g, " ")}</Badge>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "10.5px", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-4)" }}>{l.sub} · {l.posted}</span>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "19px", lineHeight: 1.2, color: "var(--ink)", margin: 0 }}>{l.title}</h3>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", lineHeight: 1.5, color: "var(--ink-3)", margin: "7px 0 0" }}>{l.reason}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Usage */}
        <Card pad="lg">
          <Eyebrow>This month's usage</Eyebrow>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--ink-3)", margin: "8px 0 18px" }}>Resets monthly. Upgrade for higher limits.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <Meter label="Posts scanned" value={D.usage.posts.used} max={D.usage.posts.limit} />
            <Meter label="Reply drafts" value={D.usage.replies.used} max={D.usage.replies.limit} />
            <Meter label="Projects" value={D.usage.projects.used} max={D.usage.projects.limit} />
          </div>
          <div style={{ marginTop: "22px", paddingTop: "18px", borderTop: "1px solid var(--line)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-3)" }}>Watched keywords</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {D.project.keywords.map((k) => <Tag key={k}>{k}</Tag>)}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

Object.assign(window, { Dashboard });
