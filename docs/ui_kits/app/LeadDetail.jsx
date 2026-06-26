// LeadDetail — full analysis: original post, reply draft, score panel.
const _DS_DETAIL = window.CrestDesignSystemLeadParrot_bb3a07;

function LeadDetail({ leadId, onBack }) {
  const { Card, Button, Badge, ScoreBadge, ScoreBars, Notice, Eyebrow, Icon, Tag, Avatar } = _DS_DETAIL;
  const D = window.CREST_DATA;
  const lead = D.leads.find((l) => l.id === leadId) || D.leads[0];
  const [copied, setCopied] = React.useState(false);
  const [saved, setSaved] = React.useState(lead.saved);

  return (
    <div style={{ maxWidth: 1120, margin: "0 auto" }}>
      <button onClick={onBack} className="crest-link" style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-3)", padding: 0, marginBottom: "18px" }}>
        ← Lead inbox
      </button>

      <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "12px", flexWrap: "wrap" }}>
        <ScoreBadge score={lead.score} size="md" />
        <span style={{ width: 1, height: 26, background: "var(--line-2)" }} />
        <Badge tone="accent" solid>{lead.source}</Badge>
        <Badge tone="neutral">{lead.stage.replace(/-/g, " ")}</Badge>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-4)" }}>{lead.sub} · posted {lead.posted}</span>
      </div>
      <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "34px", lineHeight: 1.12, letterSpacing: "-0.02em", color: "var(--ink)", margin: "0 0 24px", maxWidth: 820 }}>{lead.title}</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: "20px", alignItems: "start" }}>
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <Card pad="lg">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <Avatar label={lead.author} tone="soft" size={30} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--ink-2)", letterSpacing: "0.02em" }}>{lead.author}</span>
              <span style={{ flex: 1 }} />
              <a className="crest-link" href="#" style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-3)" }}>View original ↗</a>
            </div>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", lineHeight: 1.6, color: "var(--ink)", margin: 0 }}>{lead.body}</p>
          </Card>

          {/* Reply draft */}
          <Card pad="lg">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <Eyebrow tone="accent">Reply draft</Eyebrow>
              <Button variant="secondary" size="sm" iconLeft={<Icon name="sparkles" size={13} />}>{lead.draft ? "Regenerate" : "Generate reply"}</Button>
            </div>
            {lead.draft ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ border: "1px solid var(--line-2)", background: "var(--paper)", padding: "18px" }}>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", lineHeight: 1.6, color: "var(--ink)", margin: 0, whiteSpace: "pre-wrap" }}>{lead.draft}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  <Button variant="primary" size="sm" iconLeft={<Icon name={copied ? "check" : "clipboard"} size={13} />} onClick={() => setCopied(true)}>
                    {copied ? "Copied — post it yourself" : "Copy reply"}
                  </Button>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.04em", color: "var(--ink-4)" }}>CONFIDENCE {lead.confidence}%</span>
                </div>
                <Notice tone="accent" title="Suggested disclosure">{lead.disclosure}</Notice>
                <Notice tone="caution" title="Before you post">
                  <ul style={{ margin: 0, paddingLeft: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
                    {lead.safety.map((s) => <li key={s}>{s}</li>)}
                  </ul>
                </Notice>
              </div>
            ) : (
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", lineHeight: 1.6, color: "var(--ink-3)", margin: 0 }}>
                No draft yet. Generate a helpful, transparent reply you can review and copy. LeadParrot never posts for you.
              </p>
            )}
          </Card>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <Card pad="lg">
            <Eyebrow>AI score</Eyebrow>
            <div style={{ display: "flex", alignItems: "baseline", gap: "10px", margin: "14px 0 18px" }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "56px", lineHeight: 1, letterSpacing: "-0.03em", color: "var(--ink)" }}>{lead.score}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--ink-3)" }}>overall · {lead.confidence}% conf.</span>
            </div>
            <ScoreBars relevance={lead.relevance} intent={lead.intent} urgency={lead.urgency} fit={lead.fit} />
          </Card>

          <Card pad="lg">
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10.5px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-3)" }}>Why it's a lead</span>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", lineHeight: 1.55, color: "var(--ink-2)", margin: "7px 0 0" }}>{lead.reason}</p>
              </div>
              <div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10.5px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-3)" }}>Suggested angle</span>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", lineHeight: 1.55, color: "var(--ink-2)", margin: "7px 0 0" }}>{lead.angle}</p>
              </div>
              {lead.signals.length > 0 && (
                <div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "10.5px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-3)" }}>Buying signals</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "9px" }}>
                    {lead.signals.map((s) => <Tag key={s} tone="accent">{s}</Tag>)}
                  </div>
                </div>
              )}
              {lead.pains.length > 0 && (
                <div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "10.5px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-3)" }}>Pain points</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "9px" }}>
                    {lead.pains.map((s) => <Tag key={s}>{s}</Tag>)}
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card pad="lg">
            <Eyebrow>Manage</Eyebrow>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "14px" }}>
              <Button variant={saved ? "primary" : "secondary"} size="sm" full iconLeft={<Icon name="bookmark" size={13} />} onClick={() => setSaved(!saved)}>{saved ? "Saved" : "Save lead"}</Button>
              <Button variant="danger" size="sm" full>Not a lead</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LeadDetail });
