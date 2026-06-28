/* ============================================================
   THE LEADS NEST — App logic (self-contained, vanilla)
   Post-login workspace: Dashboard · Lead inbox · Lead detail ·
   Projects · Sources · Daily digest · Settings.
   ============================================================ */
(function () {
  "use strict";

  var DATA = {
    org: { name: "Acme Proposals", plan: "Starter", initials: "AP" },
    stats: { total: 248, high: 41, avg: 63, copied: 29 },
    usage: { posts: [342, 500], replies: [88, 100], projects: [2, 3] },
    keywords: ["proposal tool", "client proposal", "Upwork proposal", "freelance proposal"],
    leads: [
      { id: "l1", score: 81, tier: "high", source: "Reddit", badge: "", sub: "r/agency", author: "u/agency_ops", posted: "1d ago", stage: "competitor-switching", saved: false,
        title: "Frustrated with PandaDoc pricing — any cheaper alternatives?",
        body: "We've been using PandaDoc but the per-seat pricing is getting expensive as our agency grows. Anyone switched to something cheaper that still does proposals and contracts well? Need to decide this week.",
        relevance: 88, intent: 82, urgency: 75, fit: 70, confidence: 62,
        reason: "Mentions a competitor (PandaDoc) and explicit budget pressure, with strong buying signals and a near-term decision deadline.",
        angle: "Acknowledge the PandaDoc pricing frustration, share one concrete way to cut proposal time, then briefly mention Acme Proposals with disclosure.",
        signals: ["frustrated with", "alternative", "decide this week"], pains: ["Cost / pricing", "Outgrowing current tool"],
        draft: "Totally get the PandaDoc pricing pain as you add seats. One thing that helped us before switching anything: standardise 2–3 proposal templates so you're not rebuilding each one — that alone cut our prep time a lot. If you do switch, list the must-have features (e-sign, templates, analytics) and only pay for those. I'm building a small proposal tool in this space (Acme Proposals) — happy to share if it's useful, no pressure.",
        disclosure: "I'm building a small proposal tool in this space (Acme Proposals) — sharing because it's relevant, not to pitch." },
      { id: "l2", score: 69, tier: "med", source: "Reddit", badge: "", sub: "r/freelance", author: "u/design_freelance", posted: "1d ago", stage: "solution-aware", saved: true,
        title: "Looking for a proposal tool — anything better than Word?",
        body: "I'm a freelance designer sending 5–10 client proposals a month. Writing them in Word is painful. Looking for a proposal tool that handles templates and e-signatures. Budget is flexible if it saves time.",
        relevance: 84, intent: 68, urgency: 40, fit: 72, confidence: 58,
        reason: "Freelancer explicitly looking for a proposal tool with templates and e-signatures; flexible budget signals real intent.",
        angle: "Lead with a concrete tip on reusable proposal templates, then mention Acme Proposals lightly with disclosure.",
        signals: ["looking for", "recommend", "budget is flexible"], pains: ["Manual workflow", "Wants templates + e-sign"],
        draft: null },
      { id: "l3", score: 74, tier: "high", source: "Hacker News", badge: "info", sub: "Ask HN", author: "swyx_builds", posted: "2d ago", stage: "problem-aware", saved: false,
        title: "Ask HN: how do you track which communities actually send you clients?",
        body: "Running a small dev agency. We get clients from a few subreddits and Slack groups but have no idea which ones convert. How are people attributing this without a heavy CRM?",
        relevance: 71, intent: 64, urgency: 55, fit: 80, confidence: 51,
        reason: "Problem-aware post about attribution; adjacent to our ICP and a natural place to be genuinely helpful first.",
        angle: "Share a lightweight attribution approach; only mention the product if asked.",
        signals: ["how do you", "track", "without a heavy CRM"], pains: ["No attribution", "Avoiding heavy CRM"],
        draft: null },
      { id: "l4", score: 33, tier: "low", source: "RSS", badge: "gray", sub: "indiehackers.com", author: "maker_jo", posted: "3d ago", stage: "research", saved: false,
        title: "Roundup: 12 tools I tried for client onboarding this year",
        body: "A long blog post listing onboarding tools. Mentions proposals briefly but mostly about contracts and scheduling.",
        relevance: 48, intent: 22, urgency: 15, fit: 40, confidence: 44,
        reason: "Low intent — a retrospective roundup, not someone actively asking. Weak fit.",
        angle: "Probably skip. No active buying question.",
        signals: [], pains: [], draft: null }
    ],
    sources: [
      { type: "Reddit", meta: "Official API · last sync 30m ago", name: "r/freelance, r/agency, r/Upwork", on: true },
      { type: "Hacker News", meta: "Algolia search · 2h ago", name: "\u201cproposal software\u201d", on: true },
      { type: "RSS", meta: "Public feed · 1d ago", name: "indiehackers.com/feed", on: true },
      { type: "Manual", meta: "Paste a public URL or text", name: "Manual posts", on: false }
    ],
    projects: [
      { name: "Proposal tool — Reddit + HN", status: "Active", sources: 4, leads: 248, keys: ["proposal tool", "client proposal", "Upwork proposal"] },
      { name: "Contract e-sign — niche forums", status: "Active", sources: 2, leads: 96, keys: ["e-signature", "contract tool"] },
      { name: "Onboarding flows — draft", status: "Paused", sources: 0, leads: 0, keys: [] }
    ]
  };

  var state = { view: "dashboard", leadId: null, inboxTab: "high" };
  var saved = {};

  var NAV = [
    { id: "dashboard", icon: "layout-dashboard", label: "Dashboard" },
    { id: "inbox", icon: "inbox", label: "Lead inbox", count: DATA.stats.high },
    { id: "projects", icon: "folder-kanban", label: "Projects" },
    { id: "sources", icon: "radio", label: "Sources" },
    { id: "digest", icon: "mail", label: "Daily digest" },
    { id: "billing", icon: "crown", label: "Plans" },
    { id: "settings", icon: "settings", label: "Settings" }
  ];

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function lead(id) { return DATA.leads.filter(function (l) { return l.id === id; })[0]; }
  function isSaved(l) { return l.id in saved ? saved[l.id] : l.saved; }

  /* ---------- shell ---------- */
  function shell(content) {
    var navHtml = NAV.map(function (n) {
      var on = (state.view === n.id) || (state.view === "lead" && n.id === "inbox");
      return '<a data-nav="' + n.id + '" class="' + (on ? "on" : "") + '">' +
        '<span class="ai"><i data-lucide="' + n.icon + '"></i></span>' + n.label +
        (n.count != null ? '<span class="ct">' + n.count + '</span>' : '') + '</a>';
    }).join("");

    return '' +
    '<div class="app">' +
      '<aside class="aside">' +
        '<div class="abrand"><img src="assets/crest-mark.svg" alt=""/><span class="wm">The Leads <b>Nest</b></span></div>' +
        '<div class="aorg"><span class="tav acc" style="width:32px;height:32px;flex:0 0 32px;border-radius:2px">' + DATA.org.initials + '</span>' +
          '<span class="pmeta"><span class="pn2">' + DATA.org.name + '</span><span class="pr">' + DATA.org.plan + ' plan</span></span><span class="chev">⇅</span></div>' +
        '<nav class="anav">' + navHtml + '</nav>' +
        '<div class="afoot">' + upsellCard() +
          '<div class="live" style="margin-top:14px"><span class="dot"></span>3 sources live</div>' +
          '<button class="btn ghost sm" style="width:100%" data-scan>Run a scan</button></div>' +
      '</aside>' +
      '<div class="amain">' +
        '<header class="atop">' +
          '<div class="asearch"><i data-lucide="search" style="width:15px;color:var(--ink-4)"></i>' +
            '<input placeholder="Search leads, posts, keywords…"/><kbd>/</kbd></div>' +
          '<span style="flex:1"></span>' +
          '<a class="btn ghost sm" data-nav="digest"><i data-lucide="bell" style="width:14px"></i>&nbsp;Digest</a>' +
          '<a class="btn sm" data-nav="projects"><i data-lucide="plus" style="width:14px"></i>&nbsp;New project</a>' +
        '</header>' +
        '<main class="acontent">' + content + '</main>' +
      '</div>' +
    '</div>' +
    '<div id="toast"></div>';
  }

  /* ---------- views ---------- */
  function vDashboard() {
    var s = DATA.stats;
    var recent = DATA.leads.filter(function (l) { return l.tier === "high"; });
    return '' +
    '<div class="aview-h"><div class="htxt"><span class="eyebrow">Workspace · ' + DATA.org.name + '</span>' +
      '<h1>Good morning. ' + s.high + ' leads worth a look.</h1></div>' +
      '<div class="actions"><a class="btn ghost sm" data-nav="inbox">View inbox</a>' +
      '<button class="btn sm" data-scan><i data-lucide="scan-line" style="width:14px"></i>&nbsp;Run a scan</button></div></div>' +
    '<div class="anotice caution" style="margin-bottom:24px"><i data-lucide="shield-check" style="width:16px;color:var(--medium);flex:0 0 auto"></i>' +
      '<div><div class="nt">Platform safety</div><p>The Leads Nest drafts replies — it never posts for you. You stay responsible for each platform\'s rules.</p></div></div>' +
    limitBanner() +
    '<div class="abento" style="margin-bottom:24px">' +
      '<div class="cellp astat"><div class="sl">Total leads</div><div class="sv" data-count="' + s.total + '">' + s.total + '</div><div class="sh">▲ 12 this week</div></div>' +
      '<div class="cellp astat"><div class="sl">High-intent</div><div class="sv" data-count="' + s.high + '">' + s.high + '</div><div class="sh">score ≥ 70</div></div>' +
      '<div class="cellp astat ink"><div class="sl">Avg score</div><div class="sv" data-count="' + s.avg + '">' + s.avg + '</div></div>' +
      '<div class="cellp astat acc"><div class="sl">Replies copied</div><div class="sv" data-count="' + s.copied + '">' + s.copied + '</div></div>' +
    '</div>' +
    '<div class="agrid-2">' +
      '<div><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">' +
        '<span class="eyebrow accent">Recent high-intent</span></div>' +
        '<div class="alist">' + recent.map(rowLead).join("") + '</div></div>' +
      '<div class="acard pad-lg"><span class="eyebrow">This month\'s usage</span>' +
        '<div style="margin-top:18px">' + meter("Posts scanned", DATA.usage.posts) + meter("Reply drafts", DATA.usage.replies) + meter("Projects", DATA.usage.projects) + '</div>' +
        '<div class="usage-up"><div><b>88% of reply drafts used</b><span>Upgrade to Pro — 10× the quota</span></div><button class="btn sm" data-upgrade>Upgrade</button></div>' +
        '<div style="margin-top:22px;padding-top:18px;border-top:1px solid var(--line)"><span class="eyebrow">Watched keywords</span>' +
          '<div class="ktags" style="margin-top:12px">' + DATA.keywords.map(function (k) { return '<span class="ktag">' + esc(k) + '</span>'; }).join("") + '</div></div>' +
      '</div>' +
    '</div>';
  }

  function meter(label, pair) {
    var pct = Math.min(100, pair[0] / pair[1] * 100);
    var warn = pct >= 90 ? " warn" : "";
    return '<div class="ameter"><div class="mh"><span class="ml">' + label + '</span>' +
      '<span class="mv">' + pair[0].toLocaleString() + ' <span class="dim">/ ' + pair[1].toLocaleString() + '</span></span></div>' +
      '<div class="mt"><div class="mf' + warn + '" style="width:0" data-fill="' + pct + '"></div></div></div>';
  }

  var PLANS = [
    { name: "Free", price: 0, tag: "Validate the workflow.", feats: ["1 project", "Manual source", "20 posts / mo", "10 drafts / mo"] },
    { name: "Starter", price: 19, tag: "Find your first leads.", feats: ["3 projects", "Reddit · HN · RSS", "500 posts / mo", "Daily digest"], current: true },
    { name: "Pro", price: 49, tag: "Scale outreach with no ceiling.", feats: ["10 projects", "3,000 posts / mo", "1,000 drafts / mo", "Advanced filters", "Priority scoring"], popular: true },
    { name: "Agency", price: 99, tag: "Manage multiple clients.", feats: ["25 projects", "10,000 posts / mo", "Multi-client workspace", "White-label digest"] }
  ];
  function upsellCard() {
    var u = DATA.usage.replies, pct = Math.round(u[0] / u[1] * 100);
    return '<div class="upsell"><div class="up-h"><span class="pro-badge">' + DATA.org.plan + '</span><span class="up-pct">' + pct + '% used</span></div>' +
      '<div class="up-bar"><div data-fill="' + pct + '" style="width:0"></div></div>' +
      '<div class="up-t">You’re near your monthly draft limit.</div>' +
      '<button class="btn sm" data-upgrade style="width:100%"><i data-lucide="crown" style="width:13px"></i>&nbsp;Upgrade to Pro</button></div>';
  }
  function limitBanner() {
    var u = DATA.usage.replies, pct = Math.round(u[0] / u[1] * 100);
    if (pct < 80) return "";
    return '<div class="limit-banner"><div class="lb-ic"><i data-lucide="zap"></i></div>' +
      '<div class="lb-tx"><b>You’ve used ' + pct + '% of your reply drafts this month.</b>' +
      '<span>Upgrade to Pro for 1,000 drafts/mo, 3,000 scanned posts and advanced filters — before you run out.</span></div>' +
      '<button class="btn sm" data-upgrade>Upgrade to Pro</button></div>';
  }
  function vBilling() {
    return '<div class="aview-h"><div class="htxt"><span class="eyebrow accent">Plans &amp; billing</span><h1>Upgrade your nest.</h1></div></div>' +
      '<div class="anotice accent" style="margin-bottom:22px"><i data-lucide="crown" style="width:16px;color:var(--accent);flex:0 0 auto"></i><div><div class="nt">Current plan · Starter · $19/mo</div><p>You’re using 88% of reply drafts and 68% of scanned posts this month. Pro removes the ceiling and unlocks advanced filters.</p></div></div>' +
      '<div class="plan-grid">' + PLANS.map(function (p) {
        return '<div class="plan-c' + (p.popular ? ' pop' : '') + (p.current ? ' cur' : '') + '">' +
          '<div class="pc-h">' + p.name + (p.popular ? ' <span class="pro-badge">Popular</span>' : '') + (p.current ? ' <span class="pro-badge cur">Current</span>' : '') + '</div>' +
          '<div class="pc-p"><b>$' + p.price + '</b><span>/mo</span></div>' +
          '<div class="pc-t">' + p.tag + '</div>' +
          '<ul>' + p.feats.map(function (f) { return '<li>' + f + '</li>'; }).join("") + '</ul>' +
          '<button class="btn ' + (p.current ? 'ghost ' : '') + 'sm" ' + (p.current ? 'disabled' : 'data-upgrade') + ' style="width:100%">' + (p.current ? 'Current plan' : p.price > 19 ? 'Choose ' + p.name : 'Switch to ' + p.name) + '</button>' +
        '</div>';
      }).join("") + '</div>' +
      '<p style="font-family:var(--font-mono);font-size:10px;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink-4);margin-top:18px;text-align:center">Cancel anytime · No auto-posting on any plan · Official APIs only</p>';
  }

  function rowLead(l) {
    var tcls = l.tier === "med" ? " med" : l.tier === "low" ? " low" : "";
    var tlabel = l.tier === "high" ? "High" : l.tier === "med" ? "Medium" : "Low";
    return '<div class="alead" data-open-lead="' + l.id + '">' +
      '<div class="ascore' + tcls + '"><b>' + l.score + '</b><span class="tier">' + tlabel + '</span></div>' +
      '<div class="amid"><div class="ameta"><span class="abadge ' + (l.badge || "") + '">' + l.source + '</span>' +
        '<span>' + esc(l.sub) + ' · ' + l.posted + '</span></div>' +
        '<div class="atitle">' + esc(l.title) + '</div></div>' +
      '<a class="btn ghost sm">Open</a></div>';
  }

  function vInbox() {
    var counts = { all: DATA.leads.length, high: DATA.leads.filter(function (l) { return l.tier === "high"; }).length,
      saved: DATA.leads.filter(isSaved).length, replied: 0 };
    var t = state.inboxTab;
    var list = DATA.leads.filter(function (l) {
      return t === "all" ? true : t === "high" ? l.tier === "high" : t === "saved" ? isSaved(l) : false;
    });
    function tab(id, label, c) { return '<button data-inbox-tab="' + id + '" class="' + (t === id ? "on" : "") + '">' + label + ' <span class="c">' + c + '</span></button>'; }
    return '' +
    '<div class="aview-h"><div class="htxt"><span class="eyebrow">Lead inbox</span>' +
      '<h1>' + DATA.leads.length + ' leads across 3 sources</h1></div></div>' +
    '<div class="atabs">' + tab("all", "All", counts.all) + tab("high", "High intent", counts.high) + tab("saved", "Saved", counts.saved) + tab("replied", "Replied", counts.replied) + '</div>' +
    '<div class="afilter"><div class="aselect"><select><option>All sources</option><option>Reddit</option><option>Hacker News</option><option>RSS</option></select></div>' +
      '<div class="aselect"><select><option>Newest first</option><option>Highest score</option><option>Most urgent</option></select></div>' +
      '<span style="flex:1"></span><span class="eyebrow">' + list.length + ' shown</span></div>' +
    '<div class="alist">' + (list.length ? list.map(rowLead).join("") :
      '<div style="padding:48px;text-align:center;color:var(--ink-3);font-family:var(--font-sans);font-size:14px">Nothing here yet. Run a scan or paste a public post to start finding leads.</div>') + '</div>';
  }

  function vLead() {
    var l = lead(state.leadId) || DATA.leads[0];
    var sv = isSaved(l);
    var draft = l.draft;
    return '' +
    '<button class="aback" data-back>← Lead inbox</button>' +
    '<div style="display:flex;gap:10px;align-items:center;margin-bottom:12px;flex-wrap:wrap">' +
      '<span style="font-family:var(--font-display);font-size:34px;color:' + tierColor(l.tier) + ';line-height:1">' + l.score + '</span>' +
      '<span style="width:1px;height:26px;background:var(--line-2)"></span>' +
      '<span class="abadge ' + (l.badge || "") + '">' + l.source + '</span>' +
      '<span class="abadge gray">' + l.stage.replace(/-/g, " ") + '</span>' +
      '<span class="eyebrow">' + esc(l.sub) + ' · posted ' + l.posted + '</span></div>' +
    '<h1 style="font-family:var(--font-display);font-weight:300;font-size:32px;letter-spacing:-0.02em;line-height:1.12;margin:0 0 24px;max-width:820px">' + esc(l.title) + '</h1>' +
    '<div class="agrid-detail">' +
      '<div style="display:flex;flex-direction:column;gap:20px">' +
        '<div class="acard pad-lg"><div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">' +
          '<span class="tav soft" style="width:30px;height:30px;flex:0 0 30px;border-radius:2px;font-size:11px">' + initials(l.author) + '</span>' +
          '<span style="font-family:var(--font-mono);font-size:12px;color:var(--ink-2)">' + esc(l.author) + '</span>' +
          '<span style="flex:1"></span><a class="eyebrow" style="color:var(--accent)">View original ↗</a></div>' +
          '<p style="font-family:var(--font-sans);font-size:15px;line-height:1.6;color:var(--ink);margin:0">' + esc(l.body) + '</p></div>' +
        '<div class="acard pad-lg"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">' +
          '<span class="eyebrow accent">Reply draft</span>' +
          '<button class="btn ghost sm" data-gen><i data-lucide="sparkles" style="width:13px"></i>&nbsp;' + (draft ? "Regenerate" : "Generate reply") + '</button></div>' +
          (draft ?
            '<div style="display:flex;flex-direction:column;gap:16px">' +
              '<div class="draftbox">' + esc(draft) + '</div>' +
              '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">' +
                '<button class="btn sm" data-copy><i data-lucide="clipboard" style="width:13px"></i>&nbsp;Copy reply</button>' +
                '<span class="eyebrow">Confidence ' + l.confidence + '%</span></div>' +
              '<div class="anotice accent"><i data-lucide="pen-line" style="width:16px;color:var(--accent);flex:0 0 auto"></i><div><div class="nt">Suggested disclosure</div><p>' + esc(l.disclosure) + '</p></div></div>' +
              '<div class="anotice caution"><i data-lucide="shield-check" style="width:16px;color:var(--medium);flex:0 0 auto"></i><div><div class="nt">Before you post</div><ul><li>Disclose your affiliation before mentioning your product.</li><li>Personalise — don\'t reuse this across threads.</li><li>Check the community\'s self-promotion rules.</li></ul></div></div>' +
            '</div>'
            : '<p style="font-family:var(--font-sans);font-size:14px;line-height:1.6;color:var(--ink-3);margin:0">No draft yet. Generate a helpful, transparent reply you can review and copy. The Leads Nest never posts for you.</p>') +
        '</div>' +
      '</div>' +
      '<div style="display:flex;flex-direction:column;gap:20px">' +
        '<div class="acard pad-lg"><span class="eyebrow">AI score</span>' +
          '<div style="display:flex;align-items:baseline;gap:10px;margin:14px 0 18px">' +
            '<span style="font-family:var(--font-display);font-weight:300;font-size:56px;line-height:1;letter-spacing:-0.03em;color:var(--ink)">' + l.score + '</span>' +
            '<span class="eyebrow">overall · ' + l.confidence + '% conf.</span></div>' +
          sbar("Relevance", "35%", l.relevance) + sbar("Intent", "30%", l.intent) + sbar("Urgency", "20%", l.urgency) + sbar("Fit", "15%", l.fit) + '</div>' +
        '<div class="acard pad-lg"><div style="display:flex;flex-direction:column;gap:16px">' +
          block("Why it's a lead", l.reason) + block("Suggested angle", l.angle) +
          (l.signals.length ? tagblock("Buying signals", l.signals, "tint") : "") +
          (l.pains.length ? tagblock("Pain points", l.pains, "gray") : "") + '</div></div>' +
        '<div class="acard pad-lg"><span class="eyebrow">Manage</span><div style="display:flex;flex-direction:column;gap:10px;margin-top:14px">' +
          '<button class="btn ' + (sv ? "" : "ghost") + ' sm" data-save style="width:100%"><i data-lucide="bookmark" style="width:13px"></i>&nbsp;' + (sv ? "Saved" : "Save lead") + '</button>' +
          '<button class="btn ghost sm" data-back style="width:100%;border-color:var(--danger);color:var(--danger)">Not a lead</button></div></div>' +
      '</div>' +
    '</div>';
  }

  function tierColor(t) { return t === "high" ? "var(--accent)" : t === "med" ? "var(--medium)" : "var(--low)"; }
  function sbar(label, w, v) {
    return '<div class="sbar"><div class="sbh"><span class="sbl">' + label + '<em>· ' + w + '</em></span><span class="sbv">' + v + '</span></div>' +
      '<div class="sbt"><div class="sbf" style="width:0" data-fill="' + v + '"></div></div></div>';
  }
  function block(h, body) {
    return '<div><span style="font-family:var(--font-mono);font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--ink-3)">' + h + '</span>' +
      '<p style="font-family:var(--font-sans);font-size:13px;line-height:1.55;color:var(--ink-2);margin:7px 0 0">' + esc(body) + '</p></div>';
  }
  function tagblock(h, arr, cls) {
    return '<div><span style="font-family:var(--font-mono);font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--ink-3)">' + h + '</span>' +
      '<div class="ktags" style="margin-top:9px">' + arr.map(function (x) { return '<span class="ktag">' + esc(x) + '</span>'; }).join("") + '</div></div>';
  }
  function initials(s) { return s.replace(/^u\//, "").slice(0, 2).toUpperCase(); }

  function vProjects() {
    return '<div class="aview-h"><div class="htxt"><span class="eyebrow">Projects</span><h1>2 of 3 active</h1></div>' +
      '<div class="actions"><button class="btn sm"><i data-lucide="plus" style="width:14px"></i>&nbsp;New project</button></div></div>' +
      DATA.projects.map(function (p) {
        var paused = p.status === "Paused";
        return '<div class="acardrow"' + (paused ? ' style="opacity:.6"' : "") + '><div class="grow">' +
          '<div class="rsub"><span class="abadge ' + (paused ? "gray" : "tint") + '">' + p.status + '</span> ' + p.sources + ' sources · ' + p.leads + ' leads</div>' +
          '<div class="rtitle">' + esc(p.name) + '</div>' +
          (p.keys.length ? '<div class="ktags" style="margin-top:10px">' + p.keys.map(function (k) { return '<span class="ktag">' + esc(k) + '</span>'; }).join("") + '</div>' : "") +
          '</div><a class="btn ghost sm">Open</a></div>';
      }).join("");
  }

  function vSources() {
    return '<div class="aview-h"><div class="htxt"><span class="eyebrow">Sources</span><h1>3 live · official APIs only</h1></div>' +
      '<div class="actions"><button class="btn sm"><i data-lucide="plus" style="width:14px"></i>&nbsp;Add source</button></div></div>' +
      '<div class="anotice accent" style="margin-bottom:18px"><i data-lucide="shield-check" style="width:16px;color:var(--accent);flex:0 0 auto"></i><div><div class="nt">Public sources only</div><p>Reddit\'s read-only API, public Hacker News search and public RSS. No scraping, no logged-in pages.</p></div></div>' +
      DATA.sources.map(function (s, i) {
        return '<div class="acardrow"><div class="grow"><div class="rsub"><span class="abadge ' + (s.on ? "tint" : "gray") + '">' + s.type + '</span> ' + esc(s.meta) + '</div>' +
          '<div class="rtitle" style="font-size:16px">' + esc(s.name) + '</div></div>' +
          '<span class="tsw' + (s.on ? "" : " off") + '" data-toggle-src="' + i + '"></span></div>';
      }).join("");
  }

  function vDigest() {
    var top = DATA.leads.filter(function (l) { return l.tier === "high"; });
    return '<div class="aview-h"><div class="htxt"><span class="eyebrow">Daily digest</span><h1>Your 7:00 AM summary</h1></div>' +
      '<div class="actions"><a class="btn ghost sm" data-nav="settings">Digest settings</a></div></div>' +
      '<div class="acard" style="max-width:720px;padding:0">' +
        '<div style="padding:20px 24px;border-bottom:1px solid var(--line)"><div style="font-family:var(--font-display);font-size:22px;color:var(--ink)">' + top.length + ' high-intent leads this morning</div>' +
          '<div class="eyebrow" style="margin-top:8px">The Leads Nest · digest@theleadsnest.com</div></div>' +
        '<div style="padding:8px 24px 20px">' + top.concat(DATA.leads.filter(function (l) { return l.tier === "med"; })).map(function (l) {
          return '<div class="alead" data-open-lead="' + l.id + '" style="grid-template-columns:60px 1fr auto;padding:16px 0;border-bottom:1px solid var(--line)">' +
            '<div class="ascore' + (l.tier === "med" ? " med" : "") + '"><b style="font-size:24px">' + l.score + '</b></div>' +
            '<div class="amid"><div class="ameta"><span class="abadge ' + (l.badge || "") + '">' + l.source + '</span> ' + esc(l.sub) + '</div><div class="atitle" style="font-size:16px">' + esc(l.title) + '</div></div>' +
            '<a class="btn ghost sm">Open</a></div>';
        }).join("") + '</div>' +
      '</div>';
  }

  function vSettings() {
    return '<div class="aview-h"><div class="htxt"><span class="eyebrow">Settings</span><h1>Workspace</h1></div></div>' +
      '<div class="acard pad-lg" style="max-width:760px"><div class="aset-grid">' +
        '<div class="afield"><label>Workspace name</label><input value="Acme Proposals"/></div>' +
        '<div class="afield"><label>Website</label><input value="acmeproposals.com"/></div>' +
        '<div class="afield full"><label>Plan</label><div class="box">Starter — $19 / mo · 500 scanned posts · 100 reply drafts</div></div>' +
      '</div>' +
      '<div style="margin-top:8px">' +
        '<div class="arow"><div class="rl2">Daily digest email<em>7:00 AM · your timezone</em></div><span class="tsw" data-toggle-set="digest"></span></div>' +
        '<div class="arow"><div class="rl2">Weekly summary<em>Mondays · top movers</em></div><span class="tsw off" data-toggle-set="weekly"></span></div>' +
        '<div class="arow"><div class="rl2">Auto-post replies<em>Disabled by design — you always review and post</em></div><span class="tsw off" style="opacity:.5;pointer-events:none"></span></div>' +
      '</div>' +
      '<div style="margin-top:20px;display:flex;gap:8px"><button class="btn sm" data-save-set>Save changes</button><button class="btn ghost sm">Cancel</button></div></div>';
  }

  /* ---------- render ---------- */
  var root = document.getElementById("app");
  function render() {
    var content;
    switch (state.view) {
      case "inbox": content = vInbox(); break;
      case "lead": content = vLead(); break;
      case "projects": content = vProjects(); break;
      case "sources": content = vSources(); break;
      case "digest": content = vDigest(); break;
      case "settings": content = vSettings(); break;
      case "billing": content = vBilling(); break;
      default: content = vDashboard();
    }
    root.innerHTML = shell(content);
    if (window.lucide) window.lucide.createIcons({ attrs: { "stroke-width": 1.75, width: 16, height: 16 } });
    var _rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.querySelectorAll("[data-fill]").forEach(function (f, k) { if (_rm) { f.style.width = f.getAttribute("data-fill") + "%"; return; } setTimeout(function () { f.style.width = f.getAttribute("data-fill") + "%"; }, 150 + k * 60); });
    root.querySelectorAll("[data-count]").forEach(function (n) { countUp(n, _rm); });
    var _it = root.querySelectorAll(".alead, .acardrow"); for (var _k = 0; _k < _it.length; _k++) _it[_k].style.animationDelay = Math.min(_k * 0.04, 0.28) + "s";
    window.scrollTo(0, 0);
  }
  function countUp(n, rm) {
    var target = parseFloat(n.getAttribute("data-count")); if (isNaN(target)) return;
    if (rm) { n.textContent = Math.round(target).toLocaleString(); return; }
    var dur = 720, t0 = null;
    function step(ts) { if (!t0) t0 = ts; var p = Math.min((ts - t0) / dur, 1); var e = 1 - Math.pow(1 - p, 3); n.textContent = Math.round(target * e).toLocaleString(); if (p < 1) requestAnimationFrame(step); else n.textContent = Math.round(target).toLocaleString(); }
    requestAnimationFrame(step);
  }

  function toast(msg) {
    var t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg; t.classList.add("show");
    clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }

  /* ---------- events ---------- */
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-nav],[data-open-lead],[data-back],[data-inbox-tab],[data-gen],[data-copy],[data-save],[data-scan],[data-toggle-src],[data-toggle-set],[data-save-set],[data-upgrade]");
    if (!el) return;
    if (el.hasAttribute("data-nav")) { state.view = el.getAttribute("data-nav"); render(); }
    else if (el.hasAttribute("data-open-lead")) { state.leadId = el.getAttribute("data-open-lead"); state.view = "lead"; render(); }
    else if (el.hasAttribute("data-back")) { state.view = "inbox"; render(); }
    else if (el.hasAttribute("data-inbox-tab")) { state.inboxTab = el.getAttribute("data-inbox-tab"); render(); }
    else if (el.hasAttribute("data-gen")) {
      var l = lead(state.leadId);
      if (l && !l.draft) { l.draft = draftFor(l); toast("Draft generated — review before posting"); }
      render();
    }
    else if (el.hasAttribute("data-copy")) { toast("Copied — now post it yourself"); }
    else if (el.hasAttribute("data-save")) { var l2 = lead(state.leadId); saved[l2.id] = !isSaved(l2); toast(saved[l2.id] ? "Lead saved" : "Removed from saved"); render(); }
    else if (el.hasAttribute("data-scan")) { toast("Scan started — checking 3 public sources…"); }
    else if (el.hasAttribute("data-toggle-src")) { var i = +el.getAttribute("data-toggle-src"); DATA.sources[i].on = !DATA.sources[i].on; el.classList.toggle("off"); toast(DATA.sources[i].on ? "Source enabled" : "Source paused"); }
    else if (el.hasAttribute("data-toggle-set")) { el.classList.toggle("off"); }
    else if (el.hasAttribute("data-save-set")) { toast("Settings saved"); }
    else if (el.hasAttribute("data-upgrade")) { if (state.view === "billing") { toast("Redirecting to secure checkout…"); } else { state.view = "billing"; render(); } }
  });

  function draftFor(l) {
    return "Hey — saw your post about " + l.stage.replace(/-/g, " ") + ". A quick tip that helped us: standardise a couple of reusable templates so each one isn't from scratch. Happy to share what worked. (I build a small tool in this space — only mentioning since it's relevant, no pressure.)";
  }

  render();
})();
