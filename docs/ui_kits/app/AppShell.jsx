// AppShell — sidebar + topbar chrome for the LeadParrot app kit.
const DS = window.CrestDesignSystemLeadParrot_bb3a07;

function NavItem({ icon, label, active, badge, onClick }) {
  const { Icon } = DS;
  return (
    <button
      onClick={onClick}
      className="crest-row"
      style={{
        display: "flex", alignItems: "center", gap: "11px", width: "100%",
        padding: "9px 12px", border: "none", cursor: "pointer", textAlign: "left",
        background: active ? "var(--paper-sunk)" : "transparent",
        borderLeft: `2px solid ${active ? "var(--accent)" : "transparent"}`,
        color: active ? "var(--ink)" : "var(--ink-2)",
        fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      <Icon name={icon} size={15} color={active ? "var(--accent)" : "var(--ink-3)"} />
      <span style={{ flex: 1 }}>{label}</span>
      {badge != null && (
        <span style={{ fontSize: "11px", color: active ? "var(--accent)" : "var(--ink-4)", fontVariantNumeric: "tabular-nums" }}>{badge}</span>
      )}
    </button>
  );
}

function AppShell({ view, setView, children }) {
  const { Avatar, Button, Icon, Badge } = DS;
  const D = window.CREST_DATA;
  const nav = [
    { id: "dashboard", icon: "layout-dashboard", label: "Dashboard" },
    { id: "inbox", icon: "inbox", label: "Lead inbox", badge: D.stats.highIntent },
    { id: "projects", icon: "folder-kanban", label: "Projects" },
    { id: "sources", icon: "radio", label: "Sources" },
    { id: "digest", icon: "mail", label: "Daily digest" },
    { id: "billing", icon: "credit-card", label: "Billing" },
    { id: "settings", icon: "settings", label: "Settings" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "248px 1fr", minHeight: "100%", background: "var(--paper)" }}>
      {/* Sidebar */}
      <aside style={{ borderRight: "1px solid var(--line-2)", display: "flex", flexDirection: "column", background: "var(--surface)" }}>
        <div style={{ padding: "20px 16px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: "11px" }}>
          <img src="../../assets/crest-mark.svg" alt="" style={{ width: 30, height: 30 }} />
          <span style={{ fontFamily: "var(--font-display)", fontSize: "20px", color: "var(--ink)" }}>
            <b style={{ fontWeight: 500 }}>Lead</b>Parrot
          </span>
        </div>

        {/* Org switcher */}
        <button className="crest-row" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", border: "none", borderBottom: "1px solid var(--line)", background: "transparent", cursor: "pointer", textAlign: "left" }}>
          <Avatar label={D.org.name} tone="accent" size={32} />
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{D.org.name}</span>
            <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-4)" }}>{D.org.plan} plan</span>
          </span>
          <Icon name="chevrons-up-down" size={14} color="var(--ink-4)" />
        </button>

        <nav style={{ padding: "10px 0", display: "flex", flexDirection: "column", gap: "1px", flex: 1 }}>
          {nav.map((n) => (
            <NavItem key={n.id} icon={n.icon} label={n.label} badge={n.badge} active={view === n.id} onClick={() => setView(n.id)} />
          ))}
        </nav>

        <div style={{ padding: "16px", borderTop: "1px solid var(--line)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
            <span style={{ width: 6, height: 6, borderRadius: "999px", background: "var(--accent)" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-3)" }}>3 sources live</span>
          </div>
          <Button variant="secondary" size="sm" full>Run a scan</Button>
        </div>
      </aside>

      {/* Main column */}
      <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header style={{ height: 60, borderBottom: "1px solid var(--line-2)", display: "flex", alignItems: "center", gap: "16px", padding: "0 28px", background: "var(--surface)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, maxWidth: 420, border: "1px solid var(--line-2)", padding: "8px 12px", background: "var(--paper)" }}>
            <Icon name="search" size={15} color="var(--ink-4)" />
            <input placeholder="Search leads, posts, keywords…" style={{ border: "none", background: "transparent", outline: "none", fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--ink)", width: "100%" }} />
            <kbd style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--ink-4)", border: "1px solid var(--line-2)", padding: "2px 5px" }}>/</kbd>
          </div>
          <div style={{ flex: 1 }} />
          <Button variant="ghost" size="sm" iconLeft={<Icon name="bell" size={14} />}>Digest</Button>
          <Button variant="primary" size="sm" iconLeft={<Icon name="plus" size={14} />}>New project</Button>
        </header>
        <main style={{ flex: 1, overflow: "auto", padding: "28px" }}>{children}</main>
      </div>
    </div>
  );
}

Object.assign(window, { AppShell });
