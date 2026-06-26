// Landing — LeadParrot marketing page in the Crest aesthetic.
const _DS_LAND = window.CrestDesignSystemLeadParrot_bb3a07;

function Nav() {
  const { Button, Icon } = _DS_LAND;
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 30, borderBottom: "1px solid var(--line-2)", background: "color-mix(in srgb, var(--paper) 88%, transparent)", backdropFilter: "blur(8px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", height: 64, display: "flex", alignItems: "center", gap: "16px", padding: "0 32px" }}>
        <img src="../../assets/crest-mark.svg" alt="" style={{ width: 28, height: 28 }} />
        <span style={{ fontFamily: "var(--font-display)", fontSize: "20px", color: "var(--ink)" }}><b style={{ fontWeight: 500 }}>Lead</b>Parrot</span>
        <nav style={{ display: "flex", gap: "26px", marginLeft: "36px" }}>
          {["How it works", "Use cases", "Pricing", "Safety"].map((l) => (
            <a key={l} className="crest-link" href="#" style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--ink-2)" }}>{l}</a>
          ))}
        </nav>
        <div style={{ flex: 1 }} />
        <Button variant="ghost" size="sm">Log in</Button>
        <Button variant="primary" size="sm">Start finding leads</Button>
      </div>
    </header>
  );
}

function Hero() {
  const { Button, Eyebrow, Badge, Icon, ScoreBadge } = _DS_LAND;
  return (
    <section className="crest-grain" style={{ position: "relative", borderBottom: "1px solid var(--line-2)", overflow: "hidden" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "84px 32px 72px", position: "relative" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "9px", border: "1px solid var(--line-2)", background: "var(--surface)", padding: "6px 12px", marginBottom: "30px" }}>
          <span style={{ width: 6, height: 6, borderRadius: "999px", background: "var(--accent)" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-2)" }}>Lead discovery + reply drafts · No auto-posting</span>
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "72px", lineHeight: 1.02, letterSpacing: "-0.025em", color: "var(--ink)", margin: 0, maxWidth: 880 }}>
          Find customers already asking for what you sell.
        </h1>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "19px", lineHeight: 1.5, color: "var(--ink-2)", margin: "26px 0 0", maxWidth: 600 }}>
          LeadParrot monitors public conversations, scores buyer intent, and drafts helpful replies — so you show up at the right moment, before your competitors see the thread.
        </p>
        <div style={{ display: "flex", gap: "12px", marginTop: "34px" }}>
          <Button variant="primary" size="lg">Start finding leads</Button>
          <Button variant="secondary" size="lg" iconRight={<Icon name="arrow-right" size={15} />}>Try demo search</Button>
        </div>

        {/* Floating lead specimen */}
        <div style={{ marginTop: "60px", border: "1px solid var(--line-2)", background: "var(--surface)", maxWidth: 720 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 18px", borderBottom: "1px solid var(--line)" }}>
            <Badge tone="accent" solid>Reddit</Badge>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "10.5px", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-4)" }}>r/agency · u/agency_ops · 1d ago</span>
            <span style={{ flex: 1 }} />
            <ScoreBadge score={81} size="sm" />
          </div>
          <div style={{ padding: "18px" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "20px", color: "var(--ink)", margin: 0 }}>Frustrated with PandaDoc pricing — any cheaper alternatives?</h3>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", lineHeight: 1.55, color: "var(--ink-3)", margin: "10px 0 0" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "10.5px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", marginRight: "8px" }}>Why</span>
              Competitor mention + explicit budget pressure + a decision deadline this week.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Steps() {
  const { Eyebrow } = _DS_LAND;
  const steps = [
    { n: "01", t: "Describe your business", b: "Product, ideal customer, keywords, competitors, and negative keywords." },
    { n: "02", t: "Pick topics & communities", b: "Reddit, Hacker News, RSS, or paste posts manually. Public sources only." },
    { n: "03", t: "Get daily high-intent leads", b: "AI scores relevance, intent, urgency and fit, then ranks the best." },
    { n: "04", t: "Copy a helpful reply draft", b: "Review a transparent, non-spammy draft and decide whether to respond." },
  ];
  return (
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 32px" }}>
      <Eyebrow>How it works</Eyebrow>
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "42px", letterSpacing: "-0.02em", color: "var(--ink)", margin: "16px 0 40px", maxWidth: 620 }}>
        From public conversation to helpful reply, in one place.
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", border: "1px solid var(--line-2)", background: "var(--line-2)", gap: "1px" }}>
        {steps.map((s) => (
          <div key={s.n} style={{ background: "var(--surface)", padding: "28px 24px" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: "0.1em", color: "var(--accent)" }}>{s.n}</span>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "20px", color: "var(--ink)", margin: "20px 0 0" }}>{s.t}</h3>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", lineHeight: 1.55, color: "var(--ink-3)", margin: "10px 0 0" }}>{s.b}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function UseCases() {
  const { Eyebrow, Icon } = _DS_LAND;
  const cases = [
    { i: "rocket", t: "SaaS founders", b: "Catch people comparing tools or asking for alternatives to your competitors." },
    { i: "users", t: "Agencies", b: "Find businesses publicly asking for the exact services you deliver." },
    { i: "lightbulb", t: "Consultants", b: "Spot problem-aware posts where your expertise is the answer." },
    { i: "boxes", t: "B2B services", b: "Surface buying-intent threads in niche communities you can't watch all day." },
    { i: "bot", t: "AI tools", b: "Be first to helpful workflows people are trying to automate." },
    { i: "compass", t: "Niche services", b: "Monitor the handful of forums where your customers actually hang out." },
  ];
  return (
    <section style={{ borderTop: "1px solid var(--line-2)", borderBottom: "1px solid var(--line-2)", background: "var(--paper-sunk)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 32px" }}>
        <Eyebrow tone="accent">Who it's for</Eyebrow>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "42px", letterSpacing: "-0.02em", color: "var(--ink)", margin: "16px 0 40px", maxWidth: 640 }}>
          Built for people who sell by being helpful.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {cases.map((c) => (
            <div key={c.t} style={{ background: "var(--surface)", border: "1px solid var(--line-2)", padding: "24px" }}>
              <Icon name={c.i} size={20} color="var(--accent)" />
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "19px", color: "var(--ink)", margin: "16px 0 0" }}>{c.t}</h3>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", lineHeight: 1.55, color: "var(--ink-3)", margin: "9px 0 0" }}>{c.b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const { Eyebrow, Button, Badge, Icon } = _DS_LAND;
  const plans = [
    { name: "Free", price: 0, tag: "Validate the workflow with one project.", feats: ["1 project", "Manual source", "20 scanned posts / mo", "10 reply drafts / mo"], hi: false },
    { name: "Starter", price: 19, tag: "For solo founders finding their first leads.", feats: ["3 projects", "Reddit, HN, RSS + manual", "500 scanned posts / mo", "Daily digest email"], hi: false },
    { name: "Pro", price: 49, tag: "For consultants scaling outreach.", feats: ["10 projects", "3,000 scanned posts / mo", "1,000 reply drafts / mo", "Advanced filters"], hi: true },
    { name: "Agency", price: 99, tag: "For agencies managing clients.", feats: ["25 projects", "10,000 scanned posts / mo", "Multi-client workspace", "White-label digest"], hi: false },
  ];
  return (
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 32px" }}>
      <Eyebrow>Pricing</Eyebrow>
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "42px", letterSpacing: "-0.02em", color: "var(--ink)", margin: "16px 0 40px" }}>
        Simple, founder-friendly pricing.
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", border: "1px solid var(--line-2)", background: "var(--line-2)", gap: "1px" }}>
        {plans.map((p) => (
          <div key={p.name} style={{ background: p.hi ? "var(--ink)" : "var(--surface)", padding: "28px 24px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", color: p.hi ? "var(--paper)" : "var(--ink-2)" }}>{p.name}</span>
              {p.hi && <Badge tone="accent" solid>Popular</Badge>}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "48px", letterSpacing: "-0.02em", color: p.hi ? "var(--paper)" : "var(--ink)" }}>${p.price}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: p.hi ? "var(--paper-sunk)" : "var(--ink-4)" }}>/mo</span>
            </div>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "12.5px", lineHeight: 1.45, color: p.hi ? "var(--paper-sunk)" : "var(--ink-3)", margin: "10px 0 18px", minHeight: 34 }}>{p.tag}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "9px", flex: 1, marginBottom: "20px" }}>
              {p.feats.map((f) => (
                <div key={f} style={{ display: "flex", gap: "8px", fontFamily: "var(--font-sans)", fontSize: "13px", color: p.hi ? "var(--paper)" : "var(--ink-2)" }}>
                  <span style={{ color: "var(--accent-soft)", fontFamily: "var(--font-mono)" }}>✓</span>{f}
                </div>
              ))}
            </div>
            <button className={p.hi ? "crest-btn crest-btn--primary" : "crest-btn crest-btn--secondary"} style={{ fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", padding: "10px 18px", cursor: "pointer", background: p.hi ? "var(--accent)" : "transparent", color: p.hi ? "var(--on-accent)" : "var(--paper)", border: `1px solid ${p.hi ? "var(--accent)" : "var(--paper)"}` }}>
              {p.price === 0 ? "Start free" : `Choose ${p.name}`}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function SafetyBlock() {
  const { Eyebrow, Notice } = _DS_LAND;
  return (
    <section style={{ borderTop: "1px solid var(--line-2)", background: "var(--accent)", color: "var(--on-accent)" }}>
      <div className="crest-grain" style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "72px 32px" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent-tint)" }}>Platform-safe by design</span>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "44px", letterSpacing: "-0.02em", color: "var(--on-accent)", margin: "18px 0 0", maxWidth: 760 }}>
          No auto-posting. No auto-DMs. You stay in control.
        </h2>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "16px", lineHeight: 1.6, color: "var(--accent-tint)", margin: "18px 0 0", maxWidth: 620 }}>
          LeadParrot is a discovery and drafting tool — not an automation bot. We use official APIs and public feeds, respect platform rules and rate limits, and never message anyone on your behalf. Every reply is reviewed and posted by you.
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--line-2)", background: "var(--surface)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
        <img src="../../assets/crest-mark-outline.svg" alt="" style={{ width: 24, height: 24 }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-3)" }}>© 2026 LeadParrot</span>
        <span style={{ flex: 1 }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-4)" }}>No auto-posting · No auto-DMs · Official APIs only</span>
      </div>
    </footer>
  );
}

function Landing() {
  return (
    <div style={{ background: "var(--paper)" }}>
      <Nav /><Hero /><Steps /><UseCases /><Pricing /><SafetyBlock /><Footer />
    </div>
  );
}

Object.assign(window, { Landing });
