/* @ds-bundle: {"format":3,"namespace":"CrestDesignSystemLeadParrot_bb3a07","components":[{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"Meter","sourcePath":"components/data/Meter.jsx"},{"name":"ScoreBadge","sourcePath":"components/data/ScoreBadge.jsx"},{"name":"ScoreBars","sourcePath":"components/data/ScoreBars.jsx"},{"name":"Notice","sourcePath":"components/feedback/Notice.jsx"},{"name":"Tabs","sourcePath":"components/feedback/Tabs.jsx"},{"name":"Field","sourcePath":"components/forms/Field.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Bento","sourcePath":"components/layout/Bento.jsx"},{"name":"BentoItem","sourcePath":"components/layout/Bento.jsx"},{"name":"Card","sourcePath":"components/layout/Card.jsx"},{"name":"Stat","sourcePath":"components/layout/Stat.jsx"},{"name":"ActionButton","sourcePath":"handoff/action-button.tsx"},{"name":"LeadDetailCard","sourcePath":"handoff/lead-detail-card.tsx"},{"name":"TypographySpecimen","sourcePath":"handoff/typography.tsx"}],"sourceHashes":{"assets/app.js":"7f2108146ce3","assets/auth.js":"e4a5039ea509","assets/landing.js":"b98e78b75978","assets/mobile.js":"230595b09e74","components/core/Avatar.jsx":"22d57337ac95","components/core/Badge.jsx":"26fa46eb67a5","components/core/Button.jsx":"4e04c4db8d8f","components/core/Eyebrow.jsx":"f9a7a8144933","components/core/Icon.jsx":"5d8f24d2c342","components/core/Tag.jsx":"03f83619a9c4","components/data/Meter.jsx":"809942918f08","components/data/ScoreBadge.jsx":"4fcf38a28fea","components/data/ScoreBars.jsx":"befb066c3989","components/feedback/Notice.jsx":"6afcf84f341f","components/feedback/Tabs.jsx":"70e538854247","components/forms/Field.jsx":"cd45d5f49f0a","components/forms/Select.jsx":"357e384d738d","components/forms/Switch.jsx":"134ed6ff5657","components/layout/Bento.jsx":"f40aa18b2e87","components/layout/Card.jsx":"e84656d3a542","components/layout/Stat.jsx":"dccb118f7556","handoff/action-button.tsx":"88a7647e139b","handoff/lead-detail-card.tsx":"e23df9ec08e7","handoff/tailwind.config.ts":"71b7edf99586","handoff/typography.tsx":"ffa45c8f1d8d","ui_kits/app/AppShell.jsx":"bf0a179d7c95","ui_kits/app/Dashboard.jsx":"c2d0cdb1ad6d","ui_kits/app/LeadDetail.jsx":"4bae9b834b34","ui_kits/app/LeadInbox.jsx":"1d12a53a42e3","ui_kits/app/data.js":"404e05e77414","ui_kits/marketing/Landing.jsx":"a492860c9ba8"},"inlinedExternals":[],"unexposedExports":[{"name":"config","sourcePath":"handoff/tailwind.config.ts"}]} */

(() => {

const __ds_ns = (window.CrestDesignSystemLeadParrot_bb3a07 = window.CrestDesignSystemLeadParrot_bb3a07 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// assets/app.js
try { (() => {
/* ============================================================
   THE LEADS NEST — App logic (self-contained, vanilla)
   Post-login workspace: Dashboard · Lead inbox · Lead detail ·
   Projects · Sources · Daily digest · Settings.
   ============================================================ */
(function () {
  "use strict";

  var DATA = {
    org: {
      name: "Acme Proposals",
      plan: "Starter",
      initials: "AP"
    },
    stats: {
      total: 248,
      high: 41,
      avg: 63,
      copied: 29
    },
    usage: {
      posts: [342, 500],
      replies: [88, 100],
      projects: [2, 3]
    },
    keywords: ["proposal tool", "client proposal", "Upwork proposal", "freelance proposal"],
    leads: [{
      id: "l1",
      score: 81,
      tier: "high",
      source: "Reddit",
      badge: "",
      sub: "r/agency",
      author: "u/agency_ops",
      posted: "1d ago",
      stage: "competitor-switching",
      saved: false,
      title: "Frustrated with PandaDoc pricing — any cheaper alternatives?",
      body: "We've been using PandaDoc but the per-seat pricing is getting expensive as our agency grows. Anyone switched to something cheaper that still does proposals and contracts well? Need to decide this week.",
      relevance: 88,
      intent: 82,
      urgency: 75,
      fit: 70,
      confidence: 62,
      reason: "Mentions a competitor (PandaDoc) and explicit budget pressure, with strong buying signals and a near-term decision deadline.",
      angle: "Acknowledge the PandaDoc pricing frustration, share one concrete way to cut proposal time, then briefly mention Acme Proposals with disclosure.",
      signals: ["frustrated with", "alternative", "decide this week"],
      pains: ["Cost / pricing", "Outgrowing current tool"],
      draft: "Totally get the PandaDoc pricing pain as you add seats. One thing that helped us before switching anything: standardise 2–3 proposal templates so you're not rebuilding each one — that alone cut our prep time a lot. If you do switch, list the must-have features (e-sign, templates, analytics) and only pay for those. I'm building a small proposal tool in this space (Acme Proposals) — happy to share if it's useful, no pressure.",
      disclosure: "I'm building a small proposal tool in this space (Acme Proposals) — sharing because it's relevant, not to pitch."
    }, {
      id: "l2",
      score: 69,
      tier: "med",
      source: "Reddit",
      badge: "",
      sub: "r/freelance",
      author: "u/design_freelance",
      posted: "1d ago",
      stage: "solution-aware",
      saved: true,
      title: "Looking for a proposal tool — anything better than Word?",
      body: "I'm a freelance designer sending 5–10 client proposals a month. Writing them in Word is painful. Looking for a proposal tool that handles templates and e-signatures. Budget is flexible if it saves time.",
      relevance: 84,
      intent: 68,
      urgency: 40,
      fit: 72,
      confidence: 58,
      reason: "Freelancer explicitly looking for a proposal tool with templates and e-signatures; flexible budget signals real intent.",
      angle: "Lead with a concrete tip on reusable proposal templates, then mention Acme Proposals lightly with disclosure.",
      signals: ["looking for", "recommend", "budget is flexible"],
      pains: ["Manual workflow", "Wants templates + e-sign"],
      draft: null
    }, {
      id: "l3",
      score: 74,
      tier: "high",
      source: "Hacker News",
      badge: "info",
      sub: "Ask HN",
      author: "swyx_builds",
      posted: "2d ago",
      stage: "problem-aware",
      saved: false,
      title: "Ask HN: how do you track which communities actually send you clients?",
      body: "Running a small dev agency. We get clients from a few subreddits and Slack groups but have no idea which ones convert. How are people attributing this without a heavy CRM?",
      relevance: 71,
      intent: 64,
      urgency: 55,
      fit: 80,
      confidence: 51,
      reason: "Problem-aware post about attribution; adjacent to our ICP and a natural place to be genuinely helpful first.",
      angle: "Share a lightweight attribution approach; only mention the product if asked.",
      signals: ["how do you", "track", "without a heavy CRM"],
      pains: ["No attribution", "Avoiding heavy CRM"],
      draft: null
    }, {
      id: "l4",
      score: 33,
      tier: "low",
      source: "RSS",
      badge: "gray",
      sub: "indiehackers.com",
      author: "maker_jo",
      posted: "3d ago",
      stage: "research",
      saved: false,
      title: "Roundup: 12 tools I tried for client onboarding this year",
      body: "A long blog post listing onboarding tools. Mentions proposals briefly but mostly about contracts and scheduling.",
      relevance: 48,
      intent: 22,
      urgency: 15,
      fit: 40,
      confidence: 44,
      reason: "Low intent — a retrospective roundup, not someone actively asking. Weak fit.",
      angle: "Probably skip. No active buying question.",
      signals: [],
      pains: [],
      draft: null
    }],
    sources: [{
      type: "Reddit",
      meta: "Official API · last sync 30m ago",
      name: "r/freelance, r/agency, r/Upwork",
      on: true
    }, {
      type: "Hacker News",
      meta: "Algolia search · 2h ago",
      name: "\u201cproposal software\u201d",
      on: true
    }, {
      type: "RSS",
      meta: "Public feed · 1d ago",
      name: "indiehackers.com/feed",
      on: true
    }, {
      type: "Manual",
      meta: "Paste a public URL or text",
      name: "Manual posts",
      on: false
    }],
    projects: [{
      name: "Proposal tool — Reddit + HN",
      status: "Active",
      sources: 4,
      leads: 248,
      keys: ["proposal tool", "client proposal", "Upwork proposal"]
    }, {
      name: "Contract e-sign — niche forums",
      status: "Active",
      sources: 2,
      leads: 96,
      keys: ["e-signature", "contract tool"]
    }, {
      name: "Onboarding flows — draft",
      status: "Paused",
      sources: 0,
      leads: 0,
      keys: []
    }]
  };
  var state = {
    view: "dashboard",
    leadId: null,
    inboxTab: "high"
  };
  var saved = {};
  var NAV = [{
    id: "dashboard",
    icon: "layout-dashboard",
    label: "Dashboard"
  }, {
    id: "inbox",
    icon: "inbox",
    label: "Lead inbox",
    count: DATA.stats.high
  }, {
    id: "projects",
    icon: "folder-kanban",
    label: "Projects"
  }, {
    id: "sources",
    icon: "radio",
    label: "Sources"
  }, {
    id: "digest",
    icon: "mail",
    label: "Daily digest"
  }, {
    id: "billing",
    icon: "crown",
    label: "Plans"
  }, {
    id: "settings",
    icon: "settings",
    label: "Settings"
  }];
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function lead(id) {
    return DATA.leads.filter(function (l) {
      return l.id === id;
    })[0];
  }
  function isSaved(l) {
    return l.id in saved ? saved[l.id] : l.saved;
  }

  /* ---------- shell ---------- */
  function shell(content) {
    var navHtml = NAV.map(function (n) {
      var on = state.view === n.id || state.view === "lead" && n.id === "inbox";
      return '<a data-nav="' + n.id + '" class="' + (on ? "on" : "") + '">' + '<span class="ai"><i data-lucide="' + n.icon + '"></i></span>' + n.label + (n.count != null ? '<span class="ct">' + n.count + '</span>' : '') + '</a>';
    }).join("");
    return '' + '<div class="app">' + '<aside class="aside">' + '<div class="abrand"><img src="assets/crest-mark.svg" alt=""/><span class="wm">The Leads <b>Nest</b></span></div>' + '<div class="aorg"><span class="tav acc" style="width:32px;height:32px;flex:0 0 32px;border-radius:2px">' + DATA.org.initials + '</span>' + '<span class="pmeta"><span class="pn2">' + DATA.org.name + '</span><span class="pr">' + DATA.org.plan + ' plan</span></span><span class="chev">⇅</span></div>' + '<nav class="anav">' + navHtml + '</nav>' + '<div class="afoot">' + upsellCard() + '<div class="live" style="margin-top:14px"><span class="dot"></span>3 sources live</div>' + '<button class="btn ghost sm" style="width:100%" data-scan>Run a scan</button></div>' + '</aside>' + '<div class="amain">' + '<header class="atop">' + '<div class="asearch"><i data-lucide="search" style="width:15px;color:var(--ink-4)"></i>' + '<input placeholder="Search leads, posts, keywords…"/><kbd>/</kbd></div>' + '<span style="flex:1"></span>' + '<a class="btn ghost sm" data-nav="digest"><i data-lucide="bell" style="width:14px"></i>&nbsp;Digest</a>' + '<a class="btn sm" data-nav="projects"><i data-lucide="plus" style="width:14px"></i>&nbsp;New project</a>' + '</header>' + '<main class="acontent">' + content + '</main>' + '</div>' + '</div>' + '<div id="toast"></div>';
  }

  /* ---------- views ---------- */
  function vDashboard() {
    var s = DATA.stats;
    var recent = DATA.leads.filter(function (l) {
      return l.tier === "high";
    });
    return '' + '<div class="aview-h"><div class="htxt"><span class="eyebrow">Workspace · ' + DATA.org.name + '</span>' + '<h1>Good morning. ' + s.high + ' leads worth a look.</h1></div>' + '<div class="actions"><a class="btn ghost sm" data-nav="inbox">View inbox</a>' + '<button class="btn sm" data-scan><i data-lucide="scan-line" style="width:14px"></i>&nbsp;Run a scan</button></div></div>' + '<div class="anotice caution" style="margin-bottom:24px"><i data-lucide="shield-check" style="width:16px;color:var(--medium);flex:0 0 auto"></i>' + '<div><div class="nt">Platform safety</div><p>The Leads Nest drafts replies — it never posts for you. You stay responsible for each platform\'s rules.</p></div></div>' + limitBanner() + '<div class="abento" style="margin-bottom:24px">' + '<div class="cellp astat"><div class="sl">Total leads</div><div class="sv" data-count="' + s.total + '">' + s.total + '</div><div class="sh">▲ 12 this week</div></div>' + '<div class="cellp astat"><div class="sl">High-intent</div><div class="sv" data-count="' + s.high + '">' + s.high + '</div><div class="sh">score ≥ 70</div></div>' + '<div class="cellp astat ink"><div class="sl">Avg score</div><div class="sv" data-count="' + s.avg + '">' + s.avg + '</div></div>' + '<div class="cellp astat acc"><div class="sl">Replies copied</div><div class="sv" data-count="' + s.copied + '">' + s.copied + '</div></div>' + '</div>' + '<div class="agrid-2">' + '<div><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">' + '<span class="eyebrow accent">Recent high-intent</span></div>' + '<div class="alist">' + recent.map(rowLead).join("") + '</div></div>' + '<div class="acard pad-lg"><span class="eyebrow">This month\'s usage</span>' + '<div style="margin-top:18px">' + meter("Posts scanned", DATA.usage.posts) + meter("Reply drafts", DATA.usage.replies) + meter("Projects", DATA.usage.projects) + '</div>' + '<div class="usage-up"><div><b>88% of reply drafts used</b><span>Upgrade to Pro — 10× the quota</span></div><button class="btn sm" data-upgrade>Upgrade</button></div>' + '<div style="margin-top:22px;padding-top:18px;border-top:1px solid var(--line)"><span class="eyebrow">Watched keywords</span>' + '<div class="ktags" style="margin-top:12px">' + DATA.keywords.map(function (k) {
      return '<span class="ktag">' + esc(k) + '</span>';
    }).join("") + '</div></div>' + '</div>' + '</div>';
  }
  function meter(label, pair) {
    var pct = Math.min(100, pair[0] / pair[1] * 100);
    var warn = pct >= 90 ? " warn" : "";
    return '<div class="ameter"><div class="mh"><span class="ml">' + label + '</span>' + '<span class="mv">' + pair[0].toLocaleString() + ' <span class="dim">/ ' + pair[1].toLocaleString() + '</span></span></div>' + '<div class="mt"><div class="mf' + warn + '" style="width:0" data-fill="' + pct + '"></div></div></div>';
  }
  var PLANS = [{
    name: "Free",
    price: 0,
    tag: "Validate the workflow.",
    feats: ["1 project", "Manual source", "20 posts / mo", "10 drafts / mo"]
  }, {
    name: "Starter",
    price: 19,
    tag: "Find your first leads.",
    feats: ["3 projects", "Reddit · HN · RSS", "500 posts / mo", "Daily digest"],
    current: true
  }, {
    name: "Pro",
    price: 49,
    tag: "Scale outreach with no ceiling.",
    feats: ["10 projects", "3,000 posts / mo", "1,000 drafts / mo", "Advanced filters", "Priority scoring"],
    popular: true
  }, {
    name: "Agency",
    price: 99,
    tag: "Manage multiple clients.",
    feats: ["25 projects", "10,000 posts / mo", "Multi-client workspace", "White-label digest"]
  }];
  function upsellCard() {
    var u = DATA.usage.replies,
      pct = Math.round(u[0] / u[1] * 100);
    return '<div class="upsell"><div class="up-h"><span class="pro-badge">' + DATA.org.plan + '</span><span class="up-pct">' + pct + '% used</span></div>' + '<div class="up-bar"><div data-fill="' + pct + '" style="width:0"></div></div>' + '<div class="up-t">You’re near your monthly draft limit.</div>' + '<button class="btn sm" data-upgrade style="width:100%"><i data-lucide="crown" style="width:13px"></i>&nbsp;Upgrade to Pro</button></div>';
  }
  function limitBanner() {
    var u = DATA.usage.replies,
      pct = Math.round(u[0] / u[1] * 100);
    if (pct < 80) return "";
    return '<div class="limit-banner"><div class="lb-ic"><i data-lucide="zap"></i></div>' + '<div class="lb-tx"><b>You’ve used ' + pct + '% of your reply drafts this month.</b>' + '<span>Upgrade to Pro for 1,000 drafts/mo, 3,000 scanned posts and advanced filters — before you run out.</span></div>' + '<button class="btn sm" data-upgrade>Upgrade to Pro</button></div>';
  }
  function vBilling() {
    return '<div class="aview-h"><div class="htxt"><span class="eyebrow accent">Plans &amp; billing</span><h1>Upgrade your nest.</h1></div></div>' + '<div class="anotice accent" style="margin-bottom:22px"><i data-lucide="crown" style="width:16px;color:var(--accent);flex:0 0 auto"></i><div><div class="nt">Current plan · Starter · $19/mo</div><p>You’re using 88% of reply drafts and 68% of scanned posts this month. Pro removes the ceiling and unlocks advanced filters.</p></div></div>' + '<div class="plan-grid">' + PLANS.map(function (p) {
      return '<div class="plan-c' + (p.popular ? ' pop' : '') + (p.current ? ' cur' : '') + '">' + '<div class="pc-h">' + p.name + (p.popular ? ' <span class="pro-badge">Popular</span>' : '') + (p.current ? ' <span class="pro-badge cur">Current</span>' : '') + '</div>' + '<div class="pc-p"><b>$' + p.price + '</b><span>/mo</span></div>' + '<div class="pc-t">' + p.tag + '</div>' + '<ul>' + p.feats.map(function (f) {
        return '<li>' + f + '</li>';
      }).join("") + '</ul>' + '<button class="btn ' + (p.current ? 'ghost ' : '') + 'sm" ' + (p.current ? 'disabled' : 'data-upgrade') + ' style="width:100%">' + (p.current ? 'Current plan' : p.price > 19 ? 'Choose ' + p.name : 'Switch to ' + p.name) + '</button>' + '</div>';
    }).join("") + '</div>' + '<p style="font-family:var(--font-mono);font-size:10px;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink-4);margin-top:18px;text-align:center">Cancel anytime · No auto-posting on any plan · Official APIs only</p>';
  }
  function rowLead(l) {
    var tcls = l.tier === "med" ? " med" : l.tier === "low" ? " low" : "";
    var tlabel = l.tier === "high" ? "High" : l.tier === "med" ? "Medium" : "Low";
    return '<div class="alead" data-open-lead="' + l.id + '">' + '<div class="ascore' + tcls + '"><b>' + l.score + '</b><span class="tier">' + tlabel + '</span></div>' + '<div class="amid"><div class="ameta"><span class="abadge ' + (l.badge || "") + '">' + l.source + '</span>' + '<span>' + esc(l.sub) + ' · ' + l.posted + '</span></div>' + '<div class="atitle">' + esc(l.title) + '</div></div>' + '<a class="btn ghost sm">Open</a></div>';
  }
  function vInbox() {
    var counts = {
      all: DATA.leads.length,
      high: DATA.leads.filter(function (l) {
        return l.tier === "high";
      }).length,
      saved: DATA.leads.filter(isSaved).length,
      replied: 0
    };
    var t = state.inboxTab;
    var list = DATA.leads.filter(function (l) {
      return t === "all" ? true : t === "high" ? l.tier === "high" : t === "saved" ? isSaved(l) : false;
    });
    function tab(id, label, c) {
      return '<button data-inbox-tab="' + id + '" class="' + (t === id ? "on" : "") + '">' + label + ' <span class="c">' + c + '</span></button>';
    }
    return '' + '<div class="aview-h"><div class="htxt"><span class="eyebrow">Lead inbox</span>' + '<h1>' + DATA.leads.length + ' leads across 3 sources</h1></div></div>' + '<div class="atabs">' + tab("all", "All", counts.all) + tab("high", "High intent", counts.high) + tab("saved", "Saved", counts.saved) + tab("replied", "Replied", counts.replied) + '</div>' + '<div class="afilter"><div class="aselect"><select><option>All sources</option><option>Reddit</option><option>Hacker News</option><option>RSS</option></select></div>' + '<div class="aselect"><select><option>Newest first</option><option>Highest score</option><option>Most urgent</option></select></div>' + '<span style="flex:1"></span><span class="eyebrow">' + list.length + ' shown</span></div>' + '<div class="alist">' + (list.length ? list.map(rowLead).join("") : '<div style="padding:48px;text-align:center;color:var(--ink-3);font-family:var(--font-sans);font-size:14px">Nothing here yet. Run a scan or paste a public post to start finding leads.</div>') + '</div>';
  }
  function vLead() {
    var l = lead(state.leadId) || DATA.leads[0];
    var sv = isSaved(l);
    var draft = l.draft;
    return '' + '<button class="aback" data-back>← Lead inbox</button>' + '<div style="display:flex;gap:10px;align-items:center;margin-bottom:12px;flex-wrap:wrap">' + '<span style="font-family:var(--font-display);font-size:34px;color:' + tierColor(l.tier) + ';line-height:1">' + l.score + '</span>' + '<span style="width:1px;height:26px;background:var(--line-2)"></span>' + '<span class="abadge ' + (l.badge || "") + '">' + l.source + '</span>' + '<span class="abadge gray">' + l.stage.replace(/-/g, " ") + '</span>' + '<span class="eyebrow">' + esc(l.sub) + ' · posted ' + l.posted + '</span></div>' + '<h1 style="font-family:var(--font-display);font-weight:300;font-size:32px;letter-spacing:-0.02em;line-height:1.12;margin:0 0 24px;max-width:820px">' + esc(l.title) + '</h1>' + '<div class="agrid-detail">' + '<div style="display:flex;flex-direction:column;gap:20px">' + '<div class="acard pad-lg"><div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">' + '<span class="tav soft" style="width:30px;height:30px;flex:0 0 30px;border-radius:2px;font-size:11px">' + initials(l.author) + '</span>' + '<span style="font-family:var(--font-mono);font-size:12px;color:var(--ink-2)">' + esc(l.author) + '</span>' + '<span style="flex:1"></span><a class="eyebrow" style="color:var(--accent)">View original ↗</a></div>' + '<p style="font-family:var(--font-sans);font-size:15px;line-height:1.6;color:var(--ink);margin:0">' + esc(l.body) + '</p></div>' + '<div class="acard pad-lg"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">' + '<span class="eyebrow accent">Reply draft</span>' + '<button class="btn ghost sm" data-gen><i data-lucide="sparkles" style="width:13px"></i>&nbsp;' + (draft ? "Regenerate" : "Generate reply") + '</button></div>' + (draft ? '<div style="display:flex;flex-direction:column;gap:16px">' + '<div class="draftbox">' + esc(draft) + '</div>' + '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">' + '<button class="btn sm" data-copy><i data-lucide="clipboard" style="width:13px"></i>&nbsp;Copy reply</button>' + '<span class="eyebrow">Confidence ' + l.confidence + '%</span></div>' + '<div class="anotice accent"><i data-lucide="pen-line" style="width:16px;color:var(--accent);flex:0 0 auto"></i><div><div class="nt">Suggested disclosure</div><p>' + esc(l.disclosure) + '</p></div></div>' + '<div class="anotice caution"><i data-lucide="shield-check" style="width:16px;color:var(--medium);flex:0 0 auto"></i><div><div class="nt">Before you post</div><ul><li>Disclose your affiliation before mentioning your product.</li><li>Personalise — don\'t reuse this across threads.</li><li>Check the community\'s self-promotion rules.</li></ul></div></div>' + '</div>' : '<p style="font-family:var(--font-sans);font-size:14px;line-height:1.6;color:var(--ink-3);margin:0">No draft yet. Generate a helpful, transparent reply you can review and copy. The Leads Nest never posts for you.</p>') + '</div>' + '</div>' + '<div style="display:flex;flex-direction:column;gap:20px">' + '<div class="acard pad-lg"><span class="eyebrow">AI score</span>' + '<div style="display:flex;align-items:baseline;gap:10px;margin:14px 0 18px">' + '<span style="font-family:var(--font-display);font-weight:300;font-size:56px;line-height:1;letter-spacing:-0.03em;color:var(--ink)">' + l.score + '</span>' + '<span class="eyebrow">overall · ' + l.confidence + '% conf.</span></div>' + sbar("Relevance", "35%", l.relevance) + sbar("Intent", "30%", l.intent) + sbar("Urgency", "20%", l.urgency) + sbar("Fit", "15%", l.fit) + '</div>' + '<div class="acard pad-lg"><div style="display:flex;flex-direction:column;gap:16px">' + block("Why it's a lead", l.reason) + block("Suggested angle", l.angle) + (l.signals.length ? tagblock("Buying signals", l.signals, "tint") : "") + (l.pains.length ? tagblock("Pain points", l.pains, "gray") : "") + '</div></div>' + '<div class="acard pad-lg"><span class="eyebrow">Manage</span><div style="display:flex;flex-direction:column;gap:10px;margin-top:14px">' + '<button class="btn ' + (sv ? "" : "ghost") + ' sm" data-save style="width:100%"><i data-lucide="bookmark" style="width:13px"></i>&nbsp;' + (sv ? "Saved" : "Save lead") + '</button>' + '<button class="btn ghost sm" data-back style="width:100%;border-color:var(--danger);color:var(--danger)">Not a lead</button></div></div>' + '</div>' + '</div>';
  }
  function tierColor(t) {
    return t === "high" ? "var(--accent)" : t === "med" ? "var(--medium)" : "var(--low)";
  }
  function sbar(label, w, v) {
    return '<div class="sbar"><div class="sbh"><span class="sbl">' + label + '<em>· ' + w + '</em></span><span class="sbv">' + v + '</span></div>' + '<div class="sbt"><div class="sbf" style="width:0" data-fill="' + v + '"></div></div></div>';
  }
  function block(h, body) {
    return '<div><span style="font-family:var(--font-mono);font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--ink-3)">' + h + '</span>' + '<p style="font-family:var(--font-sans);font-size:13px;line-height:1.55;color:var(--ink-2);margin:7px 0 0">' + esc(body) + '</p></div>';
  }
  function tagblock(h, arr, cls) {
    return '<div><span style="font-family:var(--font-mono);font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--ink-3)">' + h + '</span>' + '<div class="ktags" style="margin-top:9px">' + arr.map(function (x) {
      return '<span class="ktag">' + esc(x) + '</span>';
    }).join("") + '</div></div>';
  }
  function initials(s) {
    return s.replace(/^u\//, "").slice(0, 2).toUpperCase();
  }
  function vProjects() {
    return '<div class="aview-h"><div class="htxt"><span class="eyebrow">Projects</span><h1>2 of 3 active</h1></div>' + '<div class="actions"><button class="btn sm"><i data-lucide="plus" style="width:14px"></i>&nbsp;New project</button></div></div>' + DATA.projects.map(function (p) {
      var paused = p.status === "Paused";
      return '<div class="acardrow"' + (paused ? ' style="opacity:.6"' : "") + '><div class="grow">' + '<div class="rsub"><span class="abadge ' + (paused ? "gray" : "tint") + '">' + p.status + '</span> ' + p.sources + ' sources · ' + p.leads + ' leads</div>' + '<div class="rtitle">' + esc(p.name) + '</div>' + (p.keys.length ? '<div class="ktags" style="margin-top:10px">' + p.keys.map(function (k) {
        return '<span class="ktag">' + esc(k) + '</span>';
      }).join("") + '</div>' : "") + '</div><a class="btn ghost sm">Open</a></div>';
    }).join("");
  }
  function vSources() {
    return '<div class="aview-h"><div class="htxt"><span class="eyebrow">Sources</span><h1>3 live · official APIs only</h1></div>' + '<div class="actions"><button class="btn sm"><i data-lucide="plus" style="width:14px"></i>&nbsp;Add source</button></div></div>' + '<div class="anotice accent" style="margin-bottom:18px"><i data-lucide="shield-check" style="width:16px;color:var(--accent);flex:0 0 auto"></i><div><div class="nt">Public sources only</div><p>Reddit\'s read-only API, public Hacker News search and public RSS. No scraping, no logged-in pages.</p></div></div>' + DATA.sources.map(function (s, i) {
      return '<div class="acardrow"><div class="grow"><div class="rsub"><span class="abadge ' + (s.on ? "tint" : "gray") + '">' + s.type + '</span> ' + esc(s.meta) + '</div>' + '<div class="rtitle" style="font-size:16px">' + esc(s.name) + '</div></div>' + '<span class="tsw' + (s.on ? "" : " off") + '" data-toggle-src="' + i + '"></span></div>';
    }).join("");
  }
  function vDigest() {
    var top = DATA.leads.filter(function (l) {
      return l.tier === "high";
    });
    return '<div class="aview-h"><div class="htxt"><span class="eyebrow">Daily digest</span><h1>Your 7:00 AM summary</h1></div>' + '<div class="actions"><a class="btn ghost sm" data-nav="settings">Digest settings</a></div></div>' + '<div class="acard" style="max-width:720px;padding:0">' + '<div style="padding:20px 24px;border-bottom:1px solid var(--line)"><div style="font-family:var(--font-display);font-size:22px;color:var(--ink)">' + top.length + ' high-intent leads this morning</div>' + '<div class="eyebrow" style="margin-top:8px">The Leads Nest · digest@theleadsnest.com</div></div>' + '<div style="padding:8px 24px 20px">' + top.concat(DATA.leads.filter(function (l) {
      return l.tier === "med";
    })).map(function (l) {
      return '<div class="alead" data-open-lead="' + l.id + '" style="grid-template-columns:60px 1fr auto;padding:16px 0;border-bottom:1px solid var(--line)">' + '<div class="ascore' + (l.tier === "med" ? " med" : "") + '"><b style="font-size:24px">' + l.score + '</b></div>' + '<div class="amid"><div class="ameta"><span class="abadge ' + (l.badge || "") + '">' + l.source + '</span> ' + esc(l.sub) + '</div><div class="atitle" style="font-size:16px">' + esc(l.title) + '</div></div>' + '<a class="btn ghost sm">Open</a></div>';
    }).join("") + '</div>' + '</div>';
  }
  function vSettings() {
    return '<div class="aview-h"><div class="htxt"><span class="eyebrow">Settings</span><h1>Workspace</h1></div></div>' + '<div class="acard pad-lg" style="max-width:760px"><div class="aset-grid">' + '<div class="afield"><label>Workspace name</label><input value="Acme Proposals"/></div>' + '<div class="afield"><label>Website</label><input value="acmeproposals.com"/></div>' + '<div class="afield full"><label>Plan</label><div class="box">Starter — $19 / mo · 500 scanned posts · 100 reply drafts</div></div>' + '</div>' + '<div style="margin-top:8px">' + '<div class="arow"><div class="rl2">Daily digest email<em>7:00 AM · your timezone</em></div><span class="tsw" data-toggle-set="digest"></span></div>' + '<div class="arow"><div class="rl2">Weekly summary<em>Mondays · top movers</em></div><span class="tsw off" data-toggle-set="weekly"></span></div>' + '<div class="arow"><div class="rl2">Auto-post replies<em>Disabled by design — you always review and post</em></div><span class="tsw off" style="opacity:.5;pointer-events:none"></span></div>' + '</div>' + '<div style="margin-top:20px;display:flex;gap:8px"><button class="btn sm" data-save-set>Save changes</button><button class="btn ghost sm">Cancel</button></div></div>';
  }

  /* ---------- render ---------- */
  var root = document.getElementById("app");
  function render() {
    var content;
    switch (state.view) {
      case "inbox":
        content = vInbox();
        break;
      case "lead":
        content = vLead();
        break;
      case "projects":
        content = vProjects();
        break;
      case "sources":
        content = vSources();
        break;
      case "digest":
        content = vDigest();
        break;
      case "settings":
        content = vSettings();
        break;
      case "billing":
        content = vBilling();
        break;
      default:
        content = vDashboard();
    }
    root.innerHTML = shell(content);
    if (window.lucide) window.lucide.createIcons({
      attrs: {
        "stroke-width": 1.75,
        width: 16,
        height: 16
      }
    });
    var _rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.querySelectorAll("[data-fill]").forEach(function (f, k) {
      if (_rm) {
        f.style.width = f.getAttribute("data-fill") + "%";
        return;
      }
      setTimeout(function () {
        f.style.width = f.getAttribute("data-fill") + "%";
      }, 150 + k * 60);
    });
    root.querySelectorAll("[data-count]").forEach(function (n) {
      countUp(n, _rm);
    });
    var _it = root.querySelectorAll(".alead, .acardrow");
    for (var _k = 0; _k < _it.length; _k++) _it[_k].style.animationDelay = Math.min(_k * 0.04, 0.28) + "s";
    window.scrollTo(0, 0);
  }
  function countUp(n, rm) {
    var target = parseFloat(n.getAttribute("data-count"));
    if (isNaN(target)) return;
    if (rm) {
      n.textContent = Math.round(target).toLocaleString();
      return;
    }
    var dur = 720,
      t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      n.textContent = Math.round(target * e).toLocaleString();
      if (p < 1) requestAnimationFrame(step);else n.textContent = Math.round(target).toLocaleString();
    }
    requestAnimationFrame(step);
  }
  function toast(msg) {
    var t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._h);
    t._h = setTimeout(function () {
      t.classList.remove("show");
    }, 2200);
  }

  /* ---------- events ---------- */
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-nav],[data-open-lead],[data-back],[data-inbox-tab],[data-gen],[data-copy],[data-save],[data-scan],[data-toggle-src],[data-toggle-set],[data-save-set],[data-upgrade]");
    if (!el) return;
    if (el.hasAttribute("data-nav")) {
      state.view = el.getAttribute("data-nav");
      render();
    } else if (el.hasAttribute("data-open-lead")) {
      state.leadId = el.getAttribute("data-open-lead");
      state.view = "lead";
      render();
    } else if (el.hasAttribute("data-back")) {
      state.view = "inbox";
      render();
    } else if (el.hasAttribute("data-inbox-tab")) {
      state.inboxTab = el.getAttribute("data-inbox-tab");
      render();
    } else if (el.hasAttribute("data-gen")) {
      var l = lead(state.leadId);
      if (l && !l.draft) {
        l.draft = draftFor(l);
        toast("Draft generated — review before posting");
      }
      render();
    } else if (el.hasAttribute("data-copy")) {
      toast("Copied — now post it yourself");
    } else if (el.hasAttribute("data-save")) {
      var l2 = lead(state.leadId);
      saved[l2.id] = !isSaved(l2);
      toast(saved[l2.id] ? "Lead saved" : "Removed from saved");
      render();
    } else if (el.hasAttribute("data-scan")) {
      toast("Scan started — checking 3 public sources…");
    } else if (el.hasAttribute("data-toggle-src")) {
      var i = +el.getAttribute("data-toggle-src");
      DATA.sources[i].on = !DATA.sources[i].on;
      el.classList.toggle("off");
      toast(DATA.sources[i].on ? "Source enabled" : "Source paused");
    } else if (el.hasAttribute("data-toggle-set")) {
      el.classList.toggle("off");
    } else if (el.hasAttribute("data-save-set")) {
      toast("Settings saved");
    } else if (el.hasAttribute("data-upgrade")) {
      if (state.view === "billing") {
        toast("Redirecting to secure checkout…");
      } else {
        state.view = "billing";
        render();
      }
    }
  });
  function draftFor(l) {
    return "Hey — saw your post about " + l.stage.replace(/-/g, " ") + ". A quick tip that helped us: standardise a couple of reusable templates so each one isn't from scratch. Happy to share what worked. (I build a small tool in this space — only mentioning since it's relevant, no pressure.)";
  }
  render();
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "assets/app.js", error: String((e && e.message) || e) }); }

// assets/auth.js
try { (() => {
/* ============================================================
   THE LEADS NEST — auth brand animation
   A continuous "intent radar" stream: public posts drift upward
   through a scan line; as each crosses, it lights up and reveals
   its intent score. Reduced-motion safe.
   ============================================================ */
(function () {
  "use strict";

  var stream = document.getElementById("abStream");
  if (!stream) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var POSTS = [{
    src: "Reddit",
    sub: "r/agency",
    q: "Any cheaper PandaDoc alternative?",
    score: 81
  }, {
    src: "Hacker News",
    sub: "Ask HN",
    q: "How do you track which communities convert?",
    score: 74
  }, {
    src: "Reddit",
    sub: "r/freelance",
    q: "A proposal tool better than Word?",
    score: 69
  }, {
    src: "Reddit",
    sub: "r/SaaS",
    q: "What do you use instead of a heavy CRM?",
    score: 77
  }, {
    src: "RSS",
    sub: "indiehackers",
    q: "Faster way to draft client replies?",
    score: 66
  }, {
    src: "Reddit",
    sub: "r/Upwork",
    q: "Best e-sign tool for freelance contracts?",
    score: 72
  }];
  function chipEl(p) {
    var el = document.createElement("div");
    el.className = "flchip";
    el.innerHTML = '<div class="fl-meta"><span class="fl-badge">' + p.src + '</span><span>' + p.sub + '</span></div>' + '<div class="fl-q">' + p.q + '</div>' + '<div class="fl-score">' + p.score + '</div>';
    return el;
  }
  if (reduce) {
    // static: three chips, the middle one lit
    [0, 1, 2].forEach(function (k) {
      var el = chipEl(POSTS[k]);
      el.style.top = 28 + k * 84 + "px";
      if (k === 1) el.classList.add("lit");
      stream.appendChild(el);
    });
    return;
  }
  var lane = [],
    i = 0;
  function spawn() {
    var el = chipEl(POSTS[i % POSTS.length]);
    i++;
    el.style.top = stream.clientHeight + 12 + "px";
    stream.appendChild(el);
    lane.push({
      el: el,
      y: stream.clientHeight + 12
    });
  }
  var GAP = 30;
  function tick() {
    var h = stream.clientHeight,
      mid = h / 2;
    for (var j = lane.length - 1; j >= 0; j--) {
      var o = lane[j];
      o.y -= 0.42;
      o.el.style.top = o.y + "px";
      var cy = o.y + o.el.offsetHeight / 2;
      o.el.classList.toggle("lit", Math.abs(cy - mid) < 40);
      if (o.y < -o.el.offsetHeight - 12) {
        o.el.remove();
        lane.splice(j, 1);
      }
    }
    // self-paced spawn: only when the newest chip has cleared a gap
    var last = lane[lane.length - 1];
    if (!last || last.y < h - last.el.offsetHeight - GAP) spawn();
    requestAnimationFrame(tick);
  }
  spawn();
  requestAnimationFrame(tick);
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "assets/auth.js", error: String((e && e.message) || e) }); }

// assets/landing.js
try { (() => {
/* ============================================================
   THE LEADS NEST — landing interactions
   Interactive intent-radar hero, count-ups, scan-log, reveals,
   magnetic buttons, cursor spotlight. Reduced-motion aware.
   ============================================================ */
(function () {
  "use strict";

  document.documentElement.classList.add("js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- intro animation (landing only) ---------- */
  var intro = document.getElementById("intro");
  if (intro) {
    if (reduce) {
      intro.parentNode && intro.parentNode.removeChild(intro);
    } else {
      var killIntro = function () {
        if (intro.classList.contains("done")) return;
        intro.classList.add("done");
        setTimeout(function () {
          intro.parentNode && intro.parentNode.removeChild(intro);
        }, 720);
      };
      setTimeout(killIntro, 2000);
      intro.addEventListener("click", killIntro);
    }
  }

  /* ---------- prominent custom cursor + spotlight ---------- */
  function ensureEl(id) {
    var e = document.getElementById(id);
    if (!e) {
      e = document.createElement("div");
      e.id = id;
      document.body.appendChild(e);
    }
    return e;
  }
  var finePointer = window.matchMedia("(pointer:fine)").matches;
  var noCursor = document.documentElement.hasAttribute("data-no-cursor");
  if (finePointer && !reduce && !noCursor) {
    var spot = ensureEl("spotlight");
    var dot = ensureEl("cur-dot");
    var ring = ensureEl("cur-ring");
    var mx = window.innerWidth / 2,
      my = window.innerHeight / 2,
      rx = mx,
      ry = my;
    window.addEventListener("pointermove", function (e) {
      mx = e.clientX;
      my = e.clientY;
      spot.style.setProperty("--mx", mx + "px");
      spot.style.setProperty("--my", my + "px");
      dot.style.transform = "translate(" + mx + "px," + my + "px) translate(-50%,-50%)";
    }, {
      passive: true
    });
    (function ringLoop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%)";
      requestAnimationFrame(ringLoop);
    })();
    var hotSel = "a,button,.btn,.qa button,.am-lead,.plan,.cell,.tcard,#radar,input,select,textarea,.am-nav a";
    document.addEventListener("pointerover", function (e) {
      if (e.target.closest && e.target.closest(hotSel)) ring.classList.add("hot");
    });
    document.addEventListener("pointerout", function (e) {
      if (e.target.closest && e.target.closest(hotSel)) {
        var to = e.relatedTarget;
        if (!(to && to.closest && to.closest(hotSel))) ring.classList.remove("hot");
      }
    });
    window.addEventListener("pointerdown", function () {
      ring.classList.add("click");
    });
    window.addEventListener("pointerup", function () {
      ring.classList.remove("click");
    });
    document.addEventListener("mouseleave", function () {
      dot.style.opacity = ring.style.opacity = "0";
    });
    document.addEventListener("mouseenter", function () {
      dot.style.opacity = ring.style.opacity = "1";
    });
  } else {
    var sp = document.getElementById("spotlight");
    if (sp) sp.style.display = "none";
  }

  /* ---------- sticky nav ---------- */
  var nav = document.getElementById("nav");
  if (nav) {
    var navState = function () {
      nav.classList.toggle("stuck", window.scrollY > 12);
    };
    navState();
    window.addEventListener("scroll", navState, {
      passive: true
    });
  }

  /* ---------- headline underline draw ---------- */
  var uline = document.querySelector(".hero h1 .accent path");
  if (uline) {
    try {
      var len = uline.getTotalLength();
      uline.style.strokeDasharray = len;
      uline.style.strokeDashoffset = len;
      if (reduce) {
        uline.style.strokeDashoffset = 0;
      } else {
        setTimeout(function () {
          uline.style.transition = "stroke-dashoffset 1.1s cubic-bezier(0.16,1,0.3,1)";
          uline.style.strokeDashoffset = 0;
        }, 650);
      }
    } catch (e) {}
  }

  /* ---------- marquee ---------- */
  var questions = ["anything better than Word for proposals?", "alternatives to PandaDoc that are cheaper?", "how do you track which communities send clients?", "best lightweight CRM for a 2-person agency?", "looking for a freelance proposal tool with e-sign", "what are people using instead of [competitor]?", "how to find customers without cold DMs?", "tools to draft client replies faster?"];
  var mq = document.getElementById("mq");
  if (mq) {
    var one = questions.map(function (q) {
      return '<span class="mq"><span class="mq-item">\u201C' + q + '\u201D</span><span class="mq-sep">\u25C6</span></span>';
    }).join("");
    mq.innerHTML = one + one;
  }

  /* ---------- reveal on scroll + triggers (scroll-based, robust) ---------- */
  var watch = [].slice.call(document.querySelectorAll("[data-reveal], [data-count], .formula, #scanlog"));
  document.querySelectorAll("[data-reveal]").forEach(function (el, i) {
    el.style.setProperty("--d", i % 4 * 70 + "ms");
  });
  function checkReveal() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    watch = watch.filter(function (el) {
      var top = el.getBoundingClientRect().top;
      if (top < vh * 0.9) {
        el.classList.add("in");
        if (el.hasAttribute("data-count")) countUp(el);
        if (el.classList.contains("formula")) fillBars(el);
        if (el.id === "scanlog") runScanLog();
        return false;
      }
      return true;
    });
  }
  window.addEventListener("scroll", checkReveal, {
    passive: true
  });
  window.addEventListener("resize", checkReveal);
  checkReveal();
  setTimeout(checkReveal, 300);
  setTimeout(checkReveal, 1200);
  // Fallback: ensure signature pieces populate even if the page never
  // scrolls (embedded previews, very tall viewports).
  window.addEventListener("load", function () {
    setTimeout(function () {
      runScanLog();
      document.querySelectorAll(".formula").forEach(fillBars);
      document.querySelectorAll("[data-count]").forEach(function (el) {
        if (!el.classList.contains("counted")) {
          el.classList.add("counted");
          countUp(el);
        }
      });
    }, 700);
  });

  /* ---------- count-up ---------- */
  function countUp(el) {
    if (el.__counted) return;
    el.__counted = true;
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var dur = 1300,
      t0 = null;
    if (reduce) {
      el.textContent = format(target) + suffix;
      return;
    }
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = format(target * e) + suffix;
      if (p < 1) requestAnimationFrame(step);else el.textContent = format(target) + suffix;
    }
    requestAnimationFrame(step);
  }
  function format(n) {
    if (n >= 1000) return Math.round(n).toLocaleString();
    return Math.round(n).toString();
  }

  /* ---------- scoring bars ---------- */
  function fillBars(root) {
    root.querySelectorAll(".ff").forEach(function (bar, i) {
      var w = bar.getAttribute("data-w");
      setTimeout(function () {
        bar.style.width = w + "%";
      }, reduce ? 0 : 120 + i * 130);
    });
  }

  /* ---------- typed scan log ---------- */
  var scanStarted = false;
  function runScanLog() {
    if (scanStarted) return;
    scanStarted = true;
    var box = document.getElementById("scanbody");
    if (!box) return;
    var lines = [{
      t: '$ nest scan --project "proposal-tool" --sources reddit,hn,rss',
      c: ""
    }, {
      t: "→ connecting to official APIs\u2026",
      c: "c-dim"
    }, {
      t: "✓ reddit  · r/freelance, r/agency, r/Upwork",
      c: "c-accent"
    }, {
      t: "✓ hn      · Algolia search \u201Cproposal software\u201D",
      c: "c-accent"
    }, {
      t: "✓ rss     · indiehackers.com/feed",
      c: "c-accent"
    }, {
      t: "→ pulled 342 public posts · filtering keywords\u2026",
      c: "c-dim"
    }, {
      t: "→ scoring intent  [relevance · intent · urgency · fit]",
      c: "c-dim"
    }, {
      t: "★ 81  competitor-switching  \u201CFrustrated with PandaDoc pricing\u2026\u201D",
      c: "c-hi"
    }, {
      t: "★ 74  problem-aware        \u201Chow do you track which communities\u2026\u201D",
      c: "c-hi"
    }, {
      t: "★ 69  solution-aware       \u201Clooking for a proposal tool\u2026\u201D",
      c: "c-hi"
    }, {
      t: "✓ 41 high-intent leads ready · 0 posts published. you decide.",
      c: "c-accent"
    }];
    if (reduce) {
      box.innerHTML = lines.map(function (l) {
        return '<div class="ln ' + l.c + '">' + esc(l.t) + "</div>";
      }).join("");
      return;
    }
    var li = 0;
    function typeLine() {
      if (li >= lines.length) return;
      var l = lines[li];
      var div = document.createElement("div");
      div.className = "ln " + l.c;
      box.appendChild(div);
      var ci = 0,
        txt = l.t;
      var speed = li === 0 ? 16 : 7;
      function typeChar() {
        div.innerHTML = esc(txt.slice(0, ci)) + '<span class="cursor"></span>';
        ci++;
        if (ci <= txt.length) setTimeout(typeChar, speed + Math.random() * 14);else {
          div.innerHTML = esc(txt);
          li++;
          setTimeout(typeLine, 220);
        }
      }
      typeChar();
    }
    typeLine();
  }
  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ---------- magnetic buttons ---------- */
  if (!reduce && window.matchMedia("(pointer:fine)").matches) {
    document.querySelectorAll(".btn").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) / r.width;
        var y = (e.clientY - r.top - r.height / 2) / r.height;
        b.style.transform = "translate(" + (x * 6).toFixed(1) + "px," + (y * 5).toFixed(1) + "px)";
      });
      b.addEventListener("pointerleave", function () {
        b.style.transform = "";
      });
    });
  }

  /* ---------- inject Lucide icons (data-ic → data-lucide) ---------- */
  document.querySelectorAll("[data-ic]").forEach(function (el) {
    var i = document.createElement("i");
    i.setAttribute("data-lucide", el.getAttribute("data-ic"));
    el.appendChild(i);
  });

  /* ---------- FAQ ---------- */
  document.querySelectorAll(".qa button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var open = btn.parentElement.classList.contains("open");
      document.querySelectorAll(".qa.open").forEach(function (o) {
        o.classList.remove("open");
      });
      if (!open) btn.parentElement.classList.add("open");
    });
  });

  /* ============================================================
     INTERACTIVE INTENT RADAR (hero canvas)
     A field of public-post nodes. A slow sweep scans them; nodes
     light by intent, high-intent ones connect to the nest and
     surface a question. Cursor adds parallax + proximity glow.
     ============================================================ */
  var COL = {
    paper: "#F4F1E9",
    ink: "#1C1B17",
    accent: "#2E5E45",
    soft: "#5A7C66",
    line: "#CDC8B8",
    ink3: "#6F6A5C",
    ink4: "#9A9483",
    tint: "#E6EBE3"
  };
  var cv = document.getElementById("radar");
  if (cv) initRadar(cv);

  /* ---------- scroll-driven product tour ---------- */
  (function initTour() {
    var sec = document.getElementById("product");
    if (!sec || !sec.classList.contains("tour")) return;
    var tabs = [].slice.call(sec.querySelectorAll(".tnav a"));
    var panels = [].slice.call(sec.querySelectorAll(".tpanel"));
    var n = tabs.length;
    if (!n) return;
    var current = -1,
      locked = -1,
      lockUntil = 0;
    var prog = sec.querySelector(".tprog .trail i");
    var count = sec.querySelector(".tcount");
    function setStep(i) {
      if (i === current) return;
      current = i;
      tabs.forEach(function (t, idx) {
        t.classList.toggle("on", idx === i);
      });
      panels.forEach(function (p, idx) {
        p.classList.toggle("on", idx === i);
      });
      if (prog) prog.style.width = (i + 1) / n * 100 + "%";
      if (count) count.textContent = pad(i + 1) + " / " + pad(n);
    }
    function pad(x) {
      return (x < 10 ? "0" : "") + x;
    }
    function onScroll() {
      if (Date.now() < lockUntil) return; // honor a click jump briefly
      if (sec.offsetParent === null) return;
      var r = sec.getBoundingClientRect();
      var total = sec.offsetHeight - window.innerHeight;
      if (total <= 0) return; // stacked (mobile) — driven by clicks
      var scrolled = Math.min(Math.max(-r.top, 0), total);
      var p = scrolled / total;
      setStep(Math.min(n - 1, Math.floor(p * n + 0.0001)));
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function (e) {
        e.preventDefault();
        setStep(i);
        lockUntil = Date.now() + 700;
        var total = sec.offsetHeight - window.innerHeight;
        if (total > 0) {
          var target = sec.offsetTop + (i + 0.5) / n * total;
          window.scrollTo({
            top: target,
            behavior: "smooth"
          });
        }
      });
    });
    window.addEventListener("scroll", onScroll, {
      passive: true
    });
    window.addEventListener("resize", onScroll);
    setStep(0);
    onScroll();
    setTimeout(onScroll, 200);
  })();
  function initRadar(canvas) {
    var ctx = canvas.getContext("2d");
    var W = 0,
      H = 0,
      DPR = Math.min(window.devicePixelRatio || 1, 2);
    var cx, cy, R;
    var nodes = [];
    var sweep = -Math.PI / 2;
    var mouse = {
      x: 0,
      y: 0,
      inside: false
    };
    var parallax = {
      x: 0,
      y: 0
    };
    var detectEl = document.getElementById("detect");
    var scannedEl = document.getElementById("rf-scanned");
    var highEl = document.getElementById("rf-high");
    var scanned = 0,
      highCount = 0;
    var qPool = ["any cheaper PandaDoc alternative?", "better than Word for proposals?", "which communities send clients?", "freelance proposal tool w/ e-sign?", "what do you use instead of X?", "lightweight CRM rec?"];
    var qi = 0;
    function resize() {
      var rect = canvas.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      cx = W / 2;
      cy = H / 2;
      R = Math.min(W, H) / 2 - 14;
      if (!nodes.length) seed();
    }
    function seed() {
      nodes = [];
      var N = 34;
      for (var i = 0; i < N; i++) {
        var ang = Math.random() * Math.PI * 2;
        var rr = 0.16 + Math.random() * 0.82;
        // intent distribution: mostly low, a few high
        var roll = Math.random();
        var intent = roll > 0.86 ? 70 + Math.random() * 26 : roll > 0.6 ? 40 + Math.random() * 28 : 8 + Math.random() * 30;
        nodes.push({
          ang: ang,
          rr: rr,
          intent: Math.round(intent),
          lit: 0,
          // 0..1 activation glow
          scoredAt: -1e9,
          drift: Math.random() * Math.PI * 2,
          dspeed: 0.0006 + Math.random() * 0.0009,
          rad: 1.4 + Math.random() * 1.8
        });
      }
    }
    function nodePos(n) {
      var wob = Math.sin(n.drift) * 0.012;
      var r = (n.rr + wob) * R;
      return {
        x: cx + Math.cos(n.ang) * r + parallax.x * (0.4 + n.rr * 0.6),
        y: cy + Math.sin(n.ang) * r + parallax.y * (0.4 + n.rr * 0.6)
      };
    }
    var last = performance.now();
    function frame(now) {
      var dt = Math.min(now - last, 50);
      last = now;
      ctx.clearRect(0, 0, W, H);

      // parallax easing toward mouse
      var tx = mouse.inside ? (mouse.x - cx) * 0.04 : 0;
      var ty = mouse.inside ? (mouse.y - cy) * 0.04 : 0;
      parallax.x += (tx - parallax.x) * 0.06;
      parallax.y += (ty - parallax.y) * 0.06;
      drawGrid();
      if (!reduce) sweep += dt * 0.00052;
      if (sweep > Math.PI * 1.5) sweep -= Math.PI * 2;
      if (!reduce) drawSweep();

      // nodes
      nodes.forEach(function (n) {
        n.drift += n.dspeed * dt;
        var p = nodePos(n);
        // activation when sweep angle passes node angle
        if (!reduce) {
          var na = Math.atan2(p.y - cy, p.x - cx);
          var diff = Math.abs(angDiff(na, sweep));
          if (diff < 0.06 && now - n.scoredAt > 4000) {
            n.lit = 1;
            n.scoredAt = now;
            scanned++;
            if (n.intent >= 70) {
              highCount++;
              surface(n, p);
            }
            updateFoot();
          }
        }
        n.lit *= Math.pow(0.9975, dt); // slow fade

        // proximity glow
        var prox = 0;
        if (mouse.inside) {
          var d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
          prox = Math.max(0, 1 - d / 70);
        }
        drawNode(n, p, prox);
      });

      // nest center
      drawNest();
      requestAnimationFrame(frame);
    }
    function angDiff(a, b) {
      var d = a - b;
      while (d > Math.PI) d -= Math.PI * 2;
      while (d < -Math.PI) d += Math.PI * 2;
      return d;
    }
    function drawGrid() {
      ctx.save();
      ctx.strokeStyle = COL.line;
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 1;
      [0.33, 0.66, 1].forEach(function (f) {
        ctx.beginPath();
        ctx.arc(cx + parallax.x * 0.3, cy + parallax.y * 0.3, R * f, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.globalAlpha = 0.32;
      for (var a = 0; a < Math.PI * 2; a += Math.PI / 3) {
        ctx.beginPath();
        ctx.moveTo(cx + parallax.x * 0.3, cy + parallax.y * 0.3);
        ctx.lineTo(cx + Math.cos(a) * R + parallax.x * 0.3, cy + Math.sin(a) * R + parallax.y * 0.3);
        ctx.stroke();
      }
      ctx.restore();
    }
    function drawSweep() {
      var gx = cx + parallax.x * 0.3,
        gy = cy + parallax.y * 0.3;
      var grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, R);
      grad.addColorStop(0, "rgba(46,94,69,0.16)");
      grad.addColorStop(1, "rgba(46,94,69,0)");
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.arc(gx, gy, R, sweep - 0.5, sweep);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
      // leading line
      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.lineTo(gx + Math.cos(sweep) * R, gy + Math.sin(sweep) * R);
      ctx.strokeStyle = "rgba(46,94,69,0.55)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    }
    function drawNode(n, p, prox) {
      var high = n.intent >= 70,
        med = n.intent >= 40;
      var base = high ? COL.accent : med ? COL.soft : COL.ink4;
      var r = n.rad + n.lit * 2.4 + prox * 3;

      // connecting hairline for lit high-intent
      if (high && n.lit > 0.05) {
        ctx.save();
        ctx.globalAlpha = n.lit * 0.5;
        ctx.strokeStyle = COL.accent;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx + parallax.x * 0.3, cy + parallax.y * 0.3);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        ctx.restore();
      }
      // glow ring
      if (n.lit > 0.05 || prox > 0.05) {
        ctx.save();
        ctx.globalAlpha = Math.max(n.lit, prox) * 0.6;
        ctx.strokeStyle = base;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r + 4 + n.lit * 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      // dot
      ctx.save();
      ctx.globalAlpha = 0.35 + (med ? 0.35 : 0) + n.lit * 0.4 + prox * 0.4;
      ctx.fillStyle = base;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      // score label for lit high-intent or hovered
      if (high && n.lit > 0.4 || prox > 0.5) {
        ctx.save();
        ctx.globalAlpha = Math.max(n.lit, prox);
        ctx.fillStyle = high ? COL.accent : COL.ink3;
        ctx.font = "600 10px 'IBM Plex Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText(String(n.intent), p.x, p.y - r - 6);
        ctx.restore();
      }
    }
    function drawNest() {
      var gx = cx + parallax.x * 0.3,
        gy = cy + parallax.y * 0.3;
      ctx.save();
      // chevron mark
      ctx.translate(gx, gy);
      ctx.strokeStyle = COL.accent;
      ctx.lineWidth = 2;
      ctx.lineJoin = "miter";
      ctx.beginPath();
      ctx.moveTo(-8, 4);
      ctx.lineTo(0, -6);
      ctx.lineTo(8, 4);
      ctx.stroke();
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.moveTo(-5, 9);
      ctx.lineTo(0, 2);
      ctx.lineTo(5, 9);
      ctx.stroke();
      ctx.restore();
    }
    function updateFoot() {
      if (scannedEl) scannedEl.textContent = scanned.toString();
      if (highEl) highEl.textContent = highCount.toString();
    }
    var detectTimer = null;
    function surface(n, p) {
      if (!detectEl) return;
      detectEl.style.left = p.x + "px";
      detectEl.style.top = p.y + "px";
      detectEl.querySelector(".dq").textContent = "\u201C" + qPool[qi % qPool.length] + "\u201D";
      qi++;
      detectEl.classList.add("show");
      clearTimeout(detectTimer);
      detectTimer = setTimeout(function () {
        detectEl.classList.remove("show");
      }, 2600);
    }
    canvas.addEventListener("pointermove", function (e) {
      var r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.inside = true;
    });
    canvas.addEventListener("pointerleave", function () {
      mouse.inside = false;
    });
    var ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);
    resize();
    if (reduce) {
      // static: light all high-intent nodes once
      nodes.forEach(function (n) {
        if (n.intent >= 70) {
          n.lit = 1;
          highCount++;
        }
        scanned++;
      });
      updateFoot();
      // one static frame
      ctx.clearRect(0, 0, W, H);
      drawGrid();
      nodes.forEach(function (n) {
        drawNode(n, nodePos(n), 0);
      });
      drawNest();
    } else {
      requestAnimationFrame(frame);
    }
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "assets/landing.js", error: String((e && e.message) || e) }); }

// assets/mobile.js
try { (() => {
/* ============================================================
   THE LEADS NEST — Mobile prototype logic
   Navigator (push/pop/tab) + screens + events. Vanilla.
   ============================================================ */
(function () {
  "use strict";

  /* ---------------- data ---------------- */
  var DATA = {
    org: {
      name: "Acme Proposals",
      plan: "Starter",
      initials: "AP",
      user: "Maya Okafor",
      handle: "maya@acme.co"
    },
    stats: {
      total: 248,
      high: 41,
      avg: 63,
      copied: 29
    },
    usage: {
      posts: [342, 500],
      replies: [88, 100],
      projects: [2, 3]
    },
    keywords: ["proposal tool", "client proposal", "Upwork proposal", "freelance proposal"],
    leads: [{
      id: "l1",
      score: 81,
      tier: "high",
      source: "Reddit",
      badge: "",
      sub: "r/agency",
      author: "u/agency_ops",
      posted: "1d",
      stage: "competitor-switching",
      saved: false,
      title: "Frustrated with PandaDoc pricing — any cheaper alternatives?",
      body: "We've been using PandaDoc but the per-seat pricing is getting expensive as our agency grows. Anyone switched to something cheaper that still does proposals and contracts well? Need to decide this week.",
      relevance: 88,
      intent: 82,
      urgency: 75,
      fit: 70,
      confidence: 62,
      reason: "Mentions a competitor (PandaDoc) and explicit budget pressure, with strong buying signals and a near-term decision deadline.",
      angle: "Acknowledge the pricing frustration, share one concrete way to cut proposal time, then mention Acme with disclosure.",
      signals: ["frustrated with", "alternative", "decide this week"],
      pains: ["Cost / pricing", "Outgrowing tool"],
      draft: "Totally get the PandaDoc pricing pain as you add seats. One thing that helped us before switching anything: standardise 2–3 proposal templates so you're not rebuilding each one — that alone cut our prep time a lot. I'm building a small proposal tool in this space (Acme Proposals) — happy to share if it's useful, no pressure.",
      disclosure: "I'm building a small proposal tool in this space (Acme Proposals) — sharing because it's relevant, not to pitch."
    }, {
      id: "l3",
      score: 74,
      tier: "high",
      source: "Hacker News",
      badge: "info",
      sub: "Ask HN",
      author: "swyx_builds",
      posted: "2d",
      stage: "problem-aware",
      saved: false,
      title: "Ask HN: how do you track which communities actually send you clients?",
      body: "Running a small dev agency. We get clients from a few subreddits and Slack groups but have no idea which ones convert. How are people attributing this without a heavy CRM?",
      relevance: 71,
      intent: 64,
      urgency: 55,
      fit: 80,
      confidence: 51,
      reason: "Problem-aware post about attribution; adjacent to our ICP and a natural place to be genuinely helpful first.",
      angle: "Share a lightweight attribution approach; only mention the product if asked.",
      signals: ["how do you", "track", "without a heavy CRM"],
      pains: ["No attribution", "Avoiding heavy CRM"],
      draft: null
    }, {
      id: "l2",
      score: 69,
      tier: "med",
      source: "Reddit",
      badge: "",
      sub: "r/freelance",
      author: "u/design_freelance",
      posted: "1d",
      stage: "solution-aware",
      saved: true,
      title: "Looking for a proposal tool — anything better than Word?",
      body: "I'm a freelance designer sending 5–10 client proposals a month. Writing them in Word is painful. Looking for a proposal tool that handles templates and e-signatures. Budget is flexible if it saves time.",
      relevance: 84,
      intent: 68,
      urgency: 40,
      fit: 72,
      confidence: 58,
      reason: "Freelancer explicitly looking for a proposal tool with templates and e-signatures; flexible budget signals real intent.",
      angle: "Lead with a concrete tip on reusable templates, then mention Acme lightly with disclosure.",
      signals: ["looking for", "recommend", "budget is flexible"],
      pains: ["Manual workflow", "Wants e-sign"],
      draft: null
    }, {
      id: "l4",
      score: 33,
      tier: "low",
      source: "RSS",
      badge: "gray",
      sub: "indiehackers",
      author: "maker_jo",
      posted: "3d",
      stage: "research",
      saved: false,
      title: "Roundup: 12 tools I tried for client onboarding this year",
      body: "A long blog post listing onboarding tools. Mentions proposals briefly but mostly about contracts and scheduling.",
      relevance: 48,
      intent: 22,
      urgency: 15,
      fit: 40,
      confidence: 44,
      reason: "Low intent — a retrospective roundup, not someone actively asking. Weak fit.",
      angle: "Probably skip. No active buying question.",
      signals: [],
      pains: [],
      draft: null
    }],
    sources: [{
      type: "Reddit",
      meta: "Official API · 30m ago",
      name: "r/freelance, r/agency, r/Upwork",
      on: true
    }, {
      type: "Hacker News",
      meta: "Algolia search · 2h ago",
      name: "\u201cproposal software\u201d",
      on: true
    }, {
      type: "RSS",
      meta: "Public feed · 1d ago",
      name: "indiehackers.com/feed",
      on: true
    }, {
      type: "Manual",
      meta: "Paste a public URL",
      name: "Manual posts",
      on: false
    }],
    projects: [{
      name: "Proposal tool — Reddit + HN",
      status: "Active",
      sources: 4,
      leads: 248
    }, {
      name: "Contract e-sign — niche forums",
      status: "Active",
      sources: 2,
      leads: 96
    }, {
      name: "Onboarding flows — draft",
      status: "Paused",
      sources: 0,
      leads: 0
    }]
  };
  var saved = {},
    setTog = {
      digest: true,
      weekly: false
    };
  function isSaved(l) {
    return l.id in saved ? saved[l.id] : l.saved;
  }
  function lead(id) {
    return DATA.leads.filter(function (l) {
      return l.id === id;
    })[0];
  }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function countUp(n, rm) {
    var target = parseFloat(n.getAttribute("data-count"));
    if (isNaN(target)) return;
    if (rm) {
      n.textContent = Math.round(target).toLocaleString();
      return;
    }
    var dur = 720,
      t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      n.textContent = Math.round(target * e).toLocaleString();
      if (p < 1) requestAnimationFrame(step);else n.textContent = Math.round(target).toLocaleString();
    }
    requestAnimationFrame(step);
  }

  /* ---------------- chrome helpers ---------------- */
  function icon(name, sz) {
    return '<i data-lucide="' + name + '"' + (sz ? ' style="width:' + sz + 'px;height:' + sz + 'px"' : '') + '></i>';
  }
  function badge(l) {
    return '<span class="m-badge ' + (l.badge || "") + '">' + l.source + '</span>';
  }
  function tierColor(t) {
    return t === "high" ? "var(--accent)" : t === "med" ? "var(--medium)" : "var(--low)";
  }
  function tierCls(t) {
    return t === "med" ? " med" : t === "low" ? " low" : "";
  }
  function tabbar(active) {
    var t = [["home", "home", "Home"], ["inbox", "inbox", "Inbox"], ["sources", "radio", "Sources"], ["settings", "settings", "Settings"]];
    return '<div class="tabbar">' + t.map(function (x) {
      return '<a data-tab="' + x[0] + '" class="' + (active === x[0] ? "on" : "") + '"><span class="tdot"></span>' + icon(x[1], 20) + '<span class="tl">' + x[2] + '</span></a>';
    }).join("") + '</div>';
  }
  function leadRow(l) {
    return '<div class="m-lead" data-open-lead="' + l.id + '"><div class="lscore' + tierCls(l.tier) + '">' + l.score + '</div>' + '<div style="min-width:0"><div class="lmeta">' + badge(l) + '<span>' + esc(l.sub) + ' · ' + l.posted + '</span></div>' + '<div class="ltitle">' + esc(l.title) + '</div></div></div>';
  }
  function meter(label, pair) {
    var pct = Math.min(100, pair[0] / pair[1] * 100),
      warn = pct >= 90 ? " warn" : "";
    return '<div class="m-meter"><div class="mh"><span class="ml">' + label + '</span><span class="mv">' + pair[0] + ' <span class="dim">/ ' + pair[1] + '</span></span></div>' + '<div class="mt"><div class="mf' + warn + '" style="width:0" data-fill="' + pct + '"></div></div></div>';
  }
  function sbar(label, w, v) {
    return '<div class="m-sbar"><div class="sh"><span class="sl2">' + label + '<em>· ' + w + '</em></span><span class="sv2">' + v + '</span></div><div class="st"><div class="sf" style="width:0" data-fill="' + v + '"></div></div></div>';
  }
  function ring(score) {
    var c = 2 * Math.PI * 36,
      off = c * (1 - score / 100);
    return '<div class="ring"><svg width="84" height="84" viewBox="0 0 84 84">' + '<circle class="rt-bg" cx="42" cy="42" r="36" fill="none" stroke-width="5"/>' + '<circle class="rt-fg" cx="42" cy="42" r="36" fill="none" stroke-width="5" stroke-dasharray="' + c + '" stroke-dashoffset="' + c + '" data-ring-off="' + off + '"/>' + '</svg><div class="rnum"><b data-count="' + score + '">' + score + '</b></div></div>';
  }

  /* ---------------- SCREENS ---------------- */
  var SCREENS = {};
  SCREENS.splash = function () {
    return {
      dark: true,
      status: "dark",
      noIndicator: true,
      body: '<div class="scr-inner" style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center">' + '<svg class="smk" viewBox="0 0 48 48"><path d="M12 30 L24 16 L36 30"/><path class="p2" d="M18 35 L24 28 L30 35"/></svg>' + '<div class="sw">The Leads <b>Nest</b></div><div class="scap">Calibrating intent radar</div></div>',
      rootClass: "splash",
      onMount: function () {
        setTimeout(function () {
          go("onboarding", {}, "fade");
        }, 1750);
      }
    };
  };
  SCREENS.onboarding = function () {
    function obar(label, w, v) {
      return '<div class="m-sbar"><div class="sh"><span class="sl2">' + label + '<em>· ' + w + '</em></span><span class="sv2">' + v + '</span></div><div class="st"><div class="sf" style="width:0" data-fill="' + v + '"></div></div></div>';
    }
    function ocheck(t) {
      return '<div class="ocheck">' + icon("check", 14) + '<span>' + t + '</span></div>';
    }
    var slides = [{
      eb: "01 · Discover",
      h: 'Find customers already <span class="accent">asking.</span>',
      p: "We watch public conversations on Reddit, Hacker News and RSS for people describing the problem you solve.",
      hero: '<div class="onb-radar"><span class="orr" style="width:96px;height:96px"></span><span class="orr" style="width:164px;height:164px"></span><span class="orr" style="width:232px;height:232px"></span><span class="osweep"></span>' + '<div class="ochip"><div class="lmeta"><span class="m-badge">Reddit</span><span>r/agency · 1d</span></div><div class="ltitle">Frustrated with PandaDoc pricing — any alternatives?</div><span class="oscore">81</span></div></div>'
    }, {
      eb: "02 · Score",
      h: 'Ranked by <span class="accent">real intent.</span>',
      p: "Relevance, intent, urgency and fit — one transparent score, so you act on the right threads first.",
      hero: '<div class="onb-score">' + ring(81) + '<div class="obars">' + obar("Relevance", "35%", 88) + obar("Intent", "30%", 82) + obar("Urgency", "20%", 75) + obar("Fit", "15%", 70) + '</div></div>'
    }, {
      eb: "03 · Safe",
      h: 'You post. <span class="accent">Never us.</span>',
      p: "We draft a disclosed reply you review and send yourself — no auto-posting, no auto-DMs, official APIs only.",
      hero: '<div class="onb-safe"><div class="oshield">' + icon("shield-check", 40) + '</div><div class="ochecks">' + ocheck("Official APIs only") + ocheck("No auto-posting, ever") + ocheck("Disclosure in every draft") + '</div></div>'
    }];
    return {
      status: "light",
      rootClass: "onb",
      noBody: true,
      body: '<div class="onb-top"><span class="onb-logo"><img src="assets/crest-mark.svg" alt=""/><span>The Leads <b>Nest</b></span></span><a class="onb-skip" data-go="signup">Skip</a></div>' + '<div class="onb-pager" id="onbPager">' + slides.map(function (s) {
        return '<div class="onb-slide"><div class="ohero">' + s.hero + '</div>' + '<span class="eyebrow-m accent">' + s.eb + '</span>' + '<h2 style="margin-top:12px">' + s.h + '</h2><p>' + s.p + '</p></div>';
      }).join("") + '</div>' + '<div class="onb-foot"><div class="onb-trust">Trusted by 1,200+ founder-led teams · Official APIs only</div>' + '<div class="dots" id="onbDots">' + slides.map(function (_, i) {
        return '<i class="' + (i === 0 ? "on" : "") + '"></i>';
      }).join("") + '</div>' + '<button class="m-btn" data-go="signup">Get started</button>' + '<div style="text-align:center;margin-top:14px"><a class="lnk" data-go="login" style="font-family:var(--font-mono);font-size:11px;letter-spacing:0.04em;text-transform:uppercase;color:var(--ink-3)">I already have an account</a></div></div>',
      onMount: function (el) {
        var pager = el.querySelector("#onbPager"),
          dots = el.querySelectorAll("#onbDots i");
        pager.addEventListener("scroll", function () {
          var i = Math.round(pager.scrollLeft / pager.clientWidth);
          dots.forEach(function (d, idx) {
            d.classList.toggle("on", idx === i);
          });
        }, {
          passive: true
        });
        setTimeout(function () {
          el.querySelectorAll("[data-fill]").forEach(function (b, k) {
            setTimeout(function () {
              b.style.width = b.getAttribute("data-fill") + "%";
            }, k * 130);
          });
          var os = el.querySelector(".oscore");
          if (os) os.classList.add("pop");
        }, 420);
        if (window.lucide) window.lucide.createIcons();
      }
    };
  };
  SCREENS.login = function () {
    return {
      status: "light",
      topbar: backbar("Log in"),
      body: '<div style="padding-top:6px"><h1 class="h-display" style="font-size:30px">Welcome back</h1>' + '<p style="font-family:var(--font-sans);font-size:14px;color:var(--ink-3);margin:10px 0 26px">Log in to your nest.</p>' + googleBtn("Continue with Google") + '<div class="m-divider"><span>or</span></div>' + '<div class="m-field"><label>Email</label><input type="email" value="maya@acme.co" inputmode="email"/></div>' + '<div class="m-field"><label>Password</label><input type="password" value="123456789"/></div>' + '<button class="m-btn" data-auth style="margin-top:6px">Log in</button>' + '<div style="text-align:center;margin-top:20px;font-family:var(--font-sans);font-size:13px;color:var(--ink-3)">New here? <a data-go="signup" style="color:var(--accent)">Create an account</a></div></div>'
    };
  };
  SCREENS.signup = function () {
    return {
      status: "light",
      topbar: backbar("Start free"),
      body: '<div style="padding-top:6px"><h1 class="h-display" style="font-size:28px">Create your account</h1>' + '<p style="font-family:var(--font-sans);font-size:14px;color:var(--ink-3);margin:10px 0 24px">No card required. Demo workspace from minute one.</p>' + googleBtn("Sign up with Google") + '<div class="m-divider"><span>or</span></div>' + '<div class="m-field"><label>Full name</label><input type="text" value="Maya Okafor"/></div>' + '<div class="m-field"><label>Work email</label><input type="email" value="maya@acme.co"/></div>' + '<div class="m-field"><label>Password</label><input type="password" value="123456789"/></div>' + '<div style="display:flex;gap:10px;align-items:flex-start;margin:2px 0 16px"><span class="m-sw" style="width:42px;transform:scale(.8);transform-origin:left" data-static></span>' + '<span style="font-family:var(--font-sans);font-size:12px;line-height:1.45;color:var(--ink-3)">I\'ll review and post replies myself, with disclosure.</span></div>' + '<button class="m-btn" data-auth>Create free account</button>' + '<div style="text-align:center;margin-top:20px;font-family:var(--font-sans);font-size:13px;color:var(--ink-3)">Have an account? <a data-go="login" style="color:var(--accent)">Log in</a></div></div>'
    };
  };
  SCREENS.home = function () {
    var s = DATA.stats,
      recent = DATA.leads.filter(function (l) {
        return l.tier === "high";
      });
    return {
      status: "light",
      tab: "home",
      fab: '<button class="fab" data-scan>' + icon("scan-line", 22) + '</button>',
      topbar: '<div style="display:flex;align-items:center;gap:11px;width:100%">' + '<span class="m-av acc" style="width:34px;height:34px;font-size:13px">' + DATA.org.initials + '</span>' + '<div style="flex:1;min-width:0"><div style="font-family:var(--font-display);font-size:18px;color:var(--ink);line-height:1">' + DATA.org.name + '</div>' + '<div style="font-family:var(--font-mono);font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-4);margin-top:2px">' + DATA.org.plan + ' plan</div></div>' + '<button class="iconbtn" data-go="digest">' + icon("bell", 16) + '</button></div>',
      body: '<span class="eyebrow-m">Good morning, Maya</span>' + '<h1 class="h-display" style="font-size:27px;margin-top:12px">' + s.high + ' leads worth a look.</h1>' + '<div class="m-notice caution" style="margin:18px 0"><span style="color:var(--medium);flex:0 0 auto">' + icon("shield-check", 16) + '</span><div><div class="nt">Platform safety</div><p>We draft replies — you review and post them yourself.</p></div></div>' + '<div class="stat-row" style="margin-bottom:18px">' + '<div class="stat-cell"><div class="sl">Total leads</div><div class="sv" data-count="' + s.total + '">' + s.total + '</div><div class="sh">▲ 12 this week</div></div>' + '<div class="stat-cell"><div class="sl">High-intent</div><div class="sv" data-count="' + s.high + '">' + s.high + '</div><div class="sh">score ≥ 70</div></div>' + '<div class="stat-cell ink"><div class="sl">Avg score</div><div class="sv" data-count="' + s.avg + '">' + s.avg + '</div></div>' + '<div class="stat-cell acc"><div class="sl">Replies copied</div><div class="sv" data-count="' + s.copied + '">' + s.copied + '</div></div>' + '</div>' + '<div style="display:flex;gap:8px;margin-bottom:22px">' + chip("projects", "folder-kanban", "Projects") + chip("sources", "radio", "Sources") + chip("digest", "mail", "Digest") + '</div>' + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">' + '<span class="eyebrow-m accent">Recent high-intent</span><a data-tab="inbox" style="font-family:var(--font-mono);font-size:10px;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink-3)">All →</a></div>' + recent.map(leadRow).join("") + '<div style="margin-top:20px"><span class="eyebrow-m">This month</span><div class="m-card" style="margin-top:10px">' + meter("Posts scanned", DATA.usage.posts) + meter("Reply drafts", DATA.usage.replies) + '</div></div>'
    };
  };
  SCREENS.inbox = function (p) {
    var seg = p.seg || "high";
    var counts = {
      all: DATA.leads.length,
      high: DATA.leads.filter(function (l) {
        return l.tier === "high";
      }).length,
      saved: DATA.leads.filter(isSaved).length
    };
    var list = DATA.leads.filter(function (l) {
      return seg === "all" ? true : seg === "high" ? l.tier === "high" : isSaved(l);
    });
    function sb(id, label, c) {
      return '<button data-seg="' + id + '" class="' + (seg === id ? "on" : "") + '">' + label + ' <span class="c">' + c + '</span></button>';
    }
    return {
      status: "light",
      tab: "inbox",
      topbar: '<div class="tb-title">Lead inbox</div><div class="spacer"></div><button class="iconbtn" data-scan>' + icon("scan-line", 16) + '</button>',
      body: '<div class="m-search" style="margin-bottom:14px">' + icon("search", 15) + '<input placeholder="Search leads, keywords…"/></div>' + '<div class="seg" style="margin-bottom:6px">' + sb("all", "All", counts.all) + sb("high", "High", counts.high) + sb("saved", "Saved", counts.saved) + '</div>' + '<div style="font-family:var(--font-mono);font-size:10px;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink-4);margin:14px 0 2px">' + list.length + ' shown</div>' + (list.length ? list.map(leadRow).join("") : '<div style="padding:40px 0;text-align:center;font-family:var(--font-sans);font-size:14px;color:var(--ink-3)">Nothing here yet.</div>')
    };
  };
  SCREENS.lead = function (p) {
    var l = lead(p.id) || DATA.leads[0],
      sv = isSaved(l),
      d = l.draft;
    return {
      status: "light",
      topbar: backbar(l.source + " · " + l.sub),
      body: '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">' + '<span class="m-badge ' + (l.badge || "") + '">' + l.source + '</span><span class="m-badge gray">' + l.stage.replace(/-/g, " ") + '</span>' + '<span style="font-family:var(--font-mono);font-size:9px;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink-4)">' + l.posted + ' ago</span></div>' + '<h1 class="h-display" style="font-size:24px;line-height:1.18">' + esc(l.title) + '</h1>' + '<div class="ring-wrap" style="margin:18px 0"><div>' + ring(l.score) + '</div>' + '<div><div class="eyebrow-m bare" style="color:' + tierColor(l.tier) + '">' + (l.tier === "high" ? "High intent" : l.tier === "med" ? "Medium" : "Low") + '</div>' + '<div style="font-family:var(--font-mono);font-size:10px;letter-spacing:0.04em;color:var(--ink-4);margin-top:6px">' + l.confidence + '% confidence</div></div></div>' + '<div class="m-card"><div style="display:flex;align-items:center;gap:9px;margin-bottom:12px"><span class="m-av soft" style="width:28px;height:28px;font-size:10px">' + l.author.replace(/^u\//, "").slice(0, 2).toUpperCase() + '</span>' + '<span style="font-family:var(--font-mono);font-size:11px;color:var(--ink-2)">' + esc(l.author) + '</span></div>' + '<p style="font-family:var(--font-sans);font-size:14px;line-height:1.6;color:var(--ink);margin:0">' + esc(l.body) + '</p></div>' + '<div style="margin:18px 0 8px"><span class="eyebrow-m accent">Reply draft</span></div>' + (d ? '<div class="draft">' + esc(d) + '</div>' + '<button class="m-btn" data-copy style="margin-top:12px">' + icon("clipboard", 13) + ' Copy reply</button>' + '<div class="m-notice accent" style="margin-top:12px"><span style="color:var(--accent);flex:0 0 auto">' + icon("pen-line", 15) + '</span><div><div class="nt">Suggested disclosure</div><p>' + esc(l.disclosure) + '</p></div></div>' + '<div class="m-notice caution" style="margin-top:10px"><span style="color:var(--medium);flex:0 0 auto">' + icon("shield-check", 15) + '</span><div><div class="nt">Before you post</div><ul><li>Disclose your affiliation first.</li><li>Personalise — don\'t reuse across threads.</li><li>Check the community\'s rules.</li></ul></div></div>' : '<button class="m-btn" data-gen>' + icon("sparkles", 13) + ' Generate reply</button>' + '<p style="font-family:var(--font-sans);font-size:13px;line-height:1.55;color:var(--ink-3);margin:12px 0 0">A helpful, transparent draft you review and copy. The Leads Nest never posts for you.</p>') + '<div style="margin:20px 0 8px"><span class="eyebrow-m">AI score breakdown</span></div>' + '<div class="m-card">' + sbar("Relevance", "35%", l.relevance) + sbar("Intent", "30%", l.intent) + sbar("Urgency", "20%", l.urgency) + sbar("Fit", "15%", l.fit) + '</div>' + (l.signals.length ? '<div style="margin:18px 0 8px"><span class="eyebrow-m">Why it\'s a lead</span></div>' + '<p style="font-family:var(--font-sans);font-size:13px;line-height:1.55;color:var(--ink-2)">' + esc(l.reason) + '</p>' + '<div class="m-tags" style="margin-top:12px">' + l.signals.map(function (x) {
        return '<span class="m-tag">' + esc(x) + '</span>';
      }).join("") + '</div>' : "") + '<div style="display:flex;gap:10px;margin-top:22px">' + '<button class="m-btn ' + (sv ? "" : "ghost") + '" data-save>' + icon("bookmark", 13) + ' ' + (sv ? "Saved" : "Save") + '</button>' + '<button class="m-btn danger" data-back>Not a lead</button></div>'
    };
  };
  SCREENS.sources = function () {
    return {
      status: "light",
      tab: "sources",
      topbar: '<div class="tb-title">Sources</div><div class="spacer"></div><button class="iconbtn" data-toast="Add a public source">' + icon("plus", 16) + '</button>',
      body: '<div class="m-notice accent" style="margin-bottom:16px"><span style="color:var(--accent);flex:0 0 auto">' + icon("shield-check", 15) + '</span><div><div class="nt">Public sources only</div><p>Official APIs and public feeds. No scraping, no logged-in pages.</p></div></div>' + DATA.sources.map(function (s, i) {
        return '<div class="m-row"><div class="grow"><div class="rs2"><span class="m-badge ' + (s.on ? "tint" : "gray") + '">' + s.type + '</span> ' + esc(s.meta) + '</div>' + '<div class="rt2" style="font-size:15px">' + esc(s.name) + '</div></div><span class="m-sw' + (s.on ? "" : " off") + '" data-toggle-src="' + i + '"></span></div>';
      }).join("")
    };
  };
  SCREENS.projects = function () {
    return {
      status: "light",
      topbar: backbar("Projects"),
      body: '<span class="eyebrow-m">2 of 3 active</span><div style="margin-top:14px">' + DATA.projects.map(function (p) {
        var paused = p.status === "Paused";
        return '<div class="m-row"' + (paused ? ' style="opacity:.6"' : "") + '><div class="grow"><div class="rs2"><span class="m-badge ' + (paused ? "gray" : "tint") + '">' + p.status + '</span> ' + p.sources + ' sources · ' + p.leads + ' leads</div>' + '<div class="rt2">' + esc(p.name) + '</div></div>' + icon("chevron-right", 16) + '</div>';
      }).join("") + '</div>' + '<button class="m-btn ghost" data-toast="New project" style="margin-top:18px">' + icon("plus", 14) + ' New project</button>'
    };
  };
  SCREENS.digest = function () {
    var top = DATA.leads.filter(function (l) {
      return l.tier !== "low";
    });
    return {
      status: "light",
      topbar: backbar("Daily digest"),
      body: '<span class="eyebrow-m accent">Sent 7:00 AM</span><h1 class="h-display" style="font-size:24px;margin-top:12px">' + top.length + ' high-intent leads today</h1>' + '<div style="font-family:var(--font-mono);font-size:10px;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink-4);margin:8px 0 18px">digest@theleadsnest.com</div>' + top.map(leadRow).join("") + '<button class="m-btn ghost" data-go="settings" style="margin-top:20px">Digest settings</button>'
    };
  };
  SCREENS.settings = function () {
    return {
      status: "light",
      tab: "settings",
      topbar: '<div class="tb-title">Settings</div>',
      body: '<div class="m-row" data-go="profile" style="border-top:1px solid var(--line)"><span class="m-av acc" style="width:44px;height:44px;font-size:15px">' + DATA.org.initials + '</span>' + '<div class="grow"><div class="rt2">' + DATA.org.user + '</div><div style="font-family:var(--font-mono);font-size:10px;color:var(--ink-4);margin-top:3px">' + DATA.org.handle + '</div></div>' + icon("chevron-right", 16) + '</div>' + '<div style="margin:22px 0 8px"><span class="eyebrow-m">Workspace</span></div>' + '<div class="m-field"><label>Workspace name</label><input value="Acme Proposals"/></div>' + '<div class="m-field"><label>Plan</label><input value="Starter — $19 / mo" readonly/></div>' + '<div style="margin:18px 0 4px"><span class="eyebrow-m">Notifications</span></div>' + '<div class="m-row"><div class="grow"><div class="rt2" style="font-size:14px">Daily digest email</div><div style="font-family:var(--font-mono);font-size:9px;letter-spacing:0.04em;text-transform:uppercase;color:var(--ink-4);margin-top:3px">7:00 AM · your timezone</div></div><span class="m-sw' + (setTog.digest ? "" : " off") + '" data-toggle-set="digest"></span></div>' + '<div class="m-row"><div class="grow"><div class="rt2" style="font-size:14px">Weekly summary</div><div style="font-family:var(--font-mono);font-size:9px;letter-spacing:0.04em;text-transform:uppercase;color:var(--ink-4);margin-top:3px">Mondays · top movers</div></div><span class="m-sw' + (setTog.weekly ? "" : " off") + '" data-toggle-set="weekly"></span></div>' + '<div class="m-row"><div class="grow"><div class="rt2" style="font-size:14px">Auto-post replies</div><div style="font-family:var(--font-mono);font-size:9px;letter-spacing:0.04em;text-transform:uppercase;color:var(--ink-4);margin-top:3px">Disabled by design</div></div><span class="m-sw off" style="opacity:.5"></span></div>' + '<button class="m-btn ghost" data-logout style="margin-top:22px">Log out</button>'
    };
  };
  SCREENS.profile = function () {
    return {
      status: "light",
      topbar: backbar("Profile"),
      body: '<div style="display:flex;flex-direction:column;align-items:center;text-align:center;padding:10px 0 20px">' + '<span class="m-av acc" style="width:74px;height:74px;font-size:26px;border-radius:3px">' + DATA.org.initials + '</span>' + '<div class="h-display" style="font-size:24px;margin-top:14px">' + DATA.org.user + '</div>' + '<div style="font-family:var(--font-mono);font-size:11px;color:var(--ink-4);margin-top:5px">' + DATA.org.handle + '</div></div>' + '<div class="stat-row"><div class="stat-cell"><div class="sl">Leads found</div><div class="sv" data-count="248">248</div></div><div class="stat-cell"><div class="sl">Replies sent</div><div class="sv" data-count="29">29</div></div></div>' + '<div style="margin:20px 0 8px"><span class="eyebrow-m">Watched keywords</span></div>' + '<div class="m-tags">' + DATA.keywords.map(function (k) {
        return '<span class="m-tag">' + esc(k) + '</span>';
      }).join("") + '</div>' + '<button class="m-btn ghost" data-back style="margin-top:24px">Done</button>'
    };
  };
  function backbar(title) {
    return '<button class="iconbtn" data-back>' + icon("arrow-left", 16) + '</button><div class="tb-title">' + title + '</div>';
  }
  function chip(go, ic, label) {
    return '<button class="m-card" data-go="' + go + '" style="flex:1;padding:14px 10px;display:flex;flex-direction:column;align-items:center;gap:7px"><span style="color:var(--accent)">' + icon(ic, 18) + '</span><span style="font-family:var(--font-mono);font-size:9px;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink-2)">' + label + '</span></button>';
  }
  function googleBtn(t) {
    return '<button class="m-oauth" data-auth><svg width="15" height="15" viewBox="0 0 48 48"><path fill="#4285F4" d="M45 24c0-1.6-.1-3.1-.4-4.5H24v9h11.8c-.5 2.7-2 5-4.3 6.6v5.5h7C42.6 36.8 45 31 45 24z"/><path fill="#34A853" d="M24 46c5.9 0 10.8-2 14.4-5.3l-7-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.5-3.8-12.2-9H4.5v5.7C8.1 41.1 15.5 46 24 46z"/><path fill="#FBBC05" d="M11.8 28.3c-.4-1.3-.7-2.7-.7-4.3s.3-3 .7-4.3v-5.7H4.5C2.9 17.3 2 20.5 2 24s.9 6.7 2.5 9.7l7.3-5.4z"/><path fill="#EA4335" d="M24 10.8c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.8 4.1 29.9 2 24 2 15.5 2 8.1 6.9 4.5 14.3l7.3 5.7c1.7-5.2 6.5-9.2 12.2-9.2z"/></svg>' + t + '</button>';
  }

  /* ---------------- navigator ---------------- */
  var viewport = document.getElementById("viewport");
  var statusbarEl = document.getElementById("statusbar");
  var homeInd = document.getElementById("homeInd");
  var nav = [{
    id: "splash",
    p: {}
  }];
  var curEl = null;
  function cur() {
    return nav[nav.length - 1];
  }
  function go(id, p, dir) {
    nav.push({
      id: id,
      p: p || {}
    });
    render(dir || "push");
  }
  function back() {
    if (nav.length > 1) {
      nav.pop();
      render("pop");
    }
  }
  function setTab(tab) {
    // if already in this tab root, no-op; else reset stack to tab
    nav = [{
      id: tab,
      p: {}
    }];
    render("fade");
  }
  function authIn() {
    nav = [{
      id: "home",
      p: {}
    }];
    render("fade");
  }
  function render(dir) {
    var def = SCREENS[cur().id](cur().p);
    var el = document.createElement("div");
    el.className = "scr" + (def.dark ? " dark" : "") + (def.rootClass ? " " + def.rootClass : "") + " " + (dir === "push" ? "in-right" : dir === "pop" ? "in-left" : "in-fade");
    var topbar = def.topbar ? '<div class="topbar' + (def.dark ? " dark" : "") + '">' + def.topbar + '</div>' : "";
    var inner;
    if (def.noBody) inner = def.body;else inner = '<div class="body' + (def.tab ? " has-tabbar" : "") + (def.topbar ? " has-topbar" : "") + '">' + def.body + '</div>';
    el.innerHTML = topbar + inner + (def.fab || "") + (def.tab ? tabbar(def.tab) : "");
    viewport.appendChild(el);
    statusbarEl.className = "statusbar " + (def.status || "light");
    homeInd.className = "home-ind" + (def.dark ? " on-dark" : "");
    homeInd.style.display = def.noIndicator ? "none" : "block";
    if (window.lucide) window.lucide.createIcons({
      attrs: {
        "stroke-width": 1.75,
        width: 18,
        height: 18
      }
    });
    if (def.onMount) def.onMount(el);
    // ring animation
    el.querySelectorAll("[data-ring-off]").forEach(function (c) {
      requestAnimationFrame(function () {
        setTimeout(function () {
          c.style.strokeDashoffset = c.getAttribute("data-ring-off");
        }, 120);
      });
    });
    // score bars / meters fill, count-ups, list stagger
    var _rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.querySelectorAll("[data-fill]").forEach(function (f, k) {
      if (_rm) {
        f.style.width = f.getAttribute("data-fill") + "%";
        return;
      }
      setTimeout(function () {
        f.style.width = f.getAttribute("data-fill") + "%";
      }, 140 + k * 70);
    });
    el.querySelectorAll("[data-count]").forEach(function (n) {
      countUp(n, _rm);
    });
    ["m-lead", "m-row", "acardrow"].forEach(function (cls) {
      var items = el.getElementsByClassName(cls);
      for (var k = 0; k < items.length; k++) items[k].style.animationDelay = Math.min(k * 0.045, 0.3) + "s";
    });
    var prev = curEl;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        el.classList.add("settle");
        el.classList.remove("in-right", "in-left", "in-fade");
        if (prev) {
          prev.classList.add(dir === "pop" ? "out-right" : dir === "push" ? "out-left" : "out-fade");
          var pr = prev;
          setTimeout(function () {
            if (pr.parentNode) pr.parentNode.removeChild(pr);
          }, 380);
        }
      });
    });
    curEl = el;
    var b = el.querySelector(".body");
    if (b) b.scrollTop = 0;
  }

  /* ---------------- scan sheet ---------------- */
  function openScan() {
    var mask = document.createElement("div");
    mask.className = "sheet-mask";
    mask.innerHTML = '<div class="sheet"><div class="grab"></div>' + '<div style="text-align:center"><span class="eyebrow-m accent bare" style="justify-content:center">Scanning public sources</span></div>' + '<div class="scan-radar" id="scanRadar"><svg width="150" height="150" viewBox="0 0 150 150">' + '<circle cx="75" cy="75" r="24" fill="none" stroke="var(--line)" stroke-width="1"/>' + '<circle cx="75" cy="75" r="48" fill="none" stroke="var(--line)" stroke-width="1"/>' + '<circle cx="75" cy="75" r="70" fill="none" stroke="var(--line)" stroke-width="1"/>' + '<line id="sweep" x1="75" y1="75" x2="75" y2="5" stroke="var(--accent)" stroke-width="2"/>' + '<g id="blips"></g></svg></div>' + '<div style="text-align:center;font-family:var(--font-mono);font-size:13px;color:var(--ink);font-variant-numeric:tabular-nums" id="scanCount">0 posts scanned</div>' + '<div style="text-align:center;font-family:var(--font-mono);font-size:10px;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink-4);margin-top:6px" id="scanStat">Reddit · Hacker News · RSS</div>' + '</div>';
    document.querySelector(".mask").appendChild(mask);
    requestAnimationFrame(function () {
      mask.classList.add("show");
    });
    var sweep = mask.querySelector("#sweep"),
      blips = mask.querySelector("#blips"),
      countEl = mask.querySelector("#scanCount");
    var ang = -90,
      count = 0,
      target = 342,
      t0 = performance.now(),
      raf;
    function frame(now) {
      ang += 4;
      var rad = ang * Math.PI / 180;
      sweep.setAttribute("x2", (75 + Math.cos(rad) * 70).toFixed(1));
      sweep.setAttribute("y2", (75 + Math.sin(rad) * 70).toFixed(1));
      if (Math.random() > 0.78) {
        var r = 16 + Math.random() * 54,
          a = Math.random() * Math.PI * 2;
        var c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        c.setAttribute("cx", (75 + Math.cos(a) * r).toFixed(1));
        c.setAttribute("cy", (75 + Math.sin(a) * r).toFixed(1));
        c.setAttribute("r", "2.5");
        c.setAttribute("fill", Math.random() > 0.7 ? "var(--accent)" : "var(--accent-soft)");
        blips.appendChild(c);
        setTimeout(function () {
          if (c.parentNode) c.parentNode.removeChild(c);
        }, 900);
      }
      count = Math.min(target, Math.round((now - t0) / 1900 * target));
      countEl.textContent = count.toLocaleString() + " posts scanned";
      if (now - t0 < 1950) raf = requestAnimationFrame(frame);else finish();
    }
    function finish() {
      mask.querySelector("#scanStat").textContent = "Done · 3 new high-intent leads";
      setTimeout(function () {
        mask.classList.remove("show");
        setTimeout(function () {
          if (mask.parentNode) mask.parentNode.removeChild(mask);
        }, 360);
        if (cur().id !== "inbox") setTab("inbox");
        toast("Scan complete — 3 new high-intent leads");
      }, 700);
    }
    raf = requestAnimationFrame(frame);
    mask.addEventListener("click", function (e) {
      if (e.target === mask) {
        cancelAnimationFrame(raf);
        mask.classList.remove("show");
        setTimeout(function () {
          if (mask.parentNode) mask.parentNode.removeChild(mask);
        }, 360);
      }
    });
  }

  /* ---------------- toast ---------------- */
  var toastEl = document.getElementById("toast");
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastEl._h);
    toastEl._h = setTimeout(function () {
      toastEl.classList.remove("show");
    }, 2200);
  }

  /* ---------------- events ---------------- */
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-go],[data-back],[data-tab],[data-seg],[data-open-lead],[data-gen],[data-copy],[data-save],[data-scan],[data-toggle-src],[data-toggle-set],[data-logout],[data-auth],[data-toast]");
    if (!t) return;
    if (t.hasAttribute("data-go")) go(t.getAttribute("data-go"), {}, "push");else if (t.hasAttribute("data-back")) back();else if (t.hasAttribute("data-tab")) setTab(t.getAttribute("data-tab"));else if (t.hasAttribute("data-seg")) {
      nav[nav.length - 1] = {
        id: "inbox",
        p: {
          seg: t.getAttribute("data-seg")
        }
      };
      render("fade");
    } else if (t.hasAttribute("data-open-lead")) go("lead", {
      id: t.getAttribute("data-open-lead")
    }, "push");else if (t.hasAttribute("data-gen")) {
      var l = lead(cur().p.id);
      if (l) {
        l.draft = l.draft || draftFor(l);
        toast("Draft generated — review before posting");
        render("fade");
      }
    } else if (t.hasAttribute("data-copy")) toast("Copied — now post it yourself");else if (t.hasAttribute("data-save")) {
      var l2 = lead(cur().p.id);
      saved[l2.id] = !isSaved(l2);
      toast(saved[l2.id] ? "Lead saved" : "Removed");
      render("fade");
    } else if (t.hasAttribute("data-scan")) openScan();else if (t.hasAttribute("data-toggle-src")) {
      var i = +t.getAttribute("data-toggle-src");
      DATA.sources[i].on = !DATA.sources[i].on;
      t.classList.toggle("off");
      toast(DATA.sources[i].on ? "Source enabled" : "Source paused");
    } else if (t.hasAttribute("data-toggle-set")) {
      var k = t.getAttribute("data-toggle-set");
      setTog[k] = !setTog[k];
      t.classList.toggle("off");
    } else if (t.hasAttribute("data-logout")) {
      nav = [{
        id: "login",
        p: {}
      }];
      render("fade");
      toast("Logged out");
    } else if (t.hasAttribute("data-auth")) authIn();else if (t.hasAttribute("data-toast")) toast(t.getAttribute("data-toast"));
  });
  function draftFor(l) {
    return "Hey — saw your post about " + l.stage.replace(/-/g, " ") + ". A quick tip that helped us: standardise a couple of reusable templates so each one isn't from scratch. Happy to share what worked. (I build a small tool in this space — only mentioning since it's relevant, no pressure.)";
  }

  /* ---------------- scale device ---------------- */
  function scale() {
    var phone = document.querySelector(".phone");
    var s = Math.min((window.innerHeight - 36) / 844, (window.innerWidth - 24) / 390, 1);
    phone.style.transform = "scale(" + s + ")";
  }
  window.addEventListener("resize", scale);
  scale();
  render("fade");
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "assets/mobile.js", error: String((e && e.message) || e) }); }

// components/core/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Avatar — squared identity mark with mono initials. Sharp by default
 * (set shape="pill" for round). Used for orgs, authors (u/handle).
 */
function Avatar({
  label = "",
  src,
  size = 36,
  shape = "square",
  tone = "ink",
  style,
  ...rest
}) {
  const initials = label.replace(/^u\//, "").split(/[\s_/-]+/).filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const tones = {
    ink: {
      bg: "var(--ink)",
      fg: "var(--paper)"
    },
    accent: {
      bg: "var(--accent)",
      fg: "var(--on-accent)"
    },
    soft: {
      bg: "var(--paper-sunk)",
      fg: "var(--ink-2)"
    }
  };
  const t = tones[tone] || tones.ink;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      flex: `0 0 ${size}px`,
      borderRadius: shape === "pill" ? "var(--radius-pill)" : "var(--radius-xs)",
      background: src ? "transparent" : t.bg,
      color: t.fg,
      fontFamily: "var(--font-mono)",
      fontSize: `${Math.round(size * 0.34)}px`,
      fontWeight: 500,
      letterSpacing: "0.02em",
      overflow: "hidden",
      border: tone === "soft" ? "1px solid var(--line-2)" : "none",
      ...style
    }
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: label,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }) : initials || "—");
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Badge — compact pill status marker. Mono micro-label.
 * Tones map to the Crest earthy semantic palette.
 */
function Badge({
  children,
  tone = "neutral",
  solid = false,
  style,
  ...rest
}) {
  const tones = {
    neutral: {
      fg: "var(--ink-2)",
      bg: "var(--paper-sunk)",
      bd: "var(--line-2)"
    },
    accent: {
      fg: "var(--accent)",
      bg: "var(--accent-tint)",
      bd: "var(--accent-line)"
    },
    high: {
      fg: "var(--high)",
      bg: "var(--high-tint)",
      bd: "var(--accent-line)"
    },
    medium: {
      fg: "var(--medium)",
      bg: "var(--medium-tint)",
      bd: "#E0CFA8"
    },
    low: {
      fg: "var(--low)",
      bg: "var(--low-tint)",
      bd: "#E2C5BC"
    },
    danger: {
      fg: "var(--danger)",
      bg: "var(--danger-tint)",
      bd: "#E2C0B8"
    },
    info: {
      fg: "var(--info)",
      bg: "var(--info-tint)",
      bd: "#BFD2D6"
    }
  };
  const t = tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "5px",
      fontFamily: "var(--font-mono)",
      fontSize: "10.5px",
      fontWeight: 500,
      letterSpacing: "var(--tracking-mono)",
      textTransform: "uppercase",
      lineHeight: 1,
      padding: "4px 9px 3px",
      borderRadius: "var(--radius-pill)",
      color: solid ? "var(--on-accent)" : t.fg,
      background: solid ? t.fg : t.bg,
      border: `1px solid ${solid ? t.fg : t.bd}`,
      whiteSpace: "nowrap",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button — The Crest primary control.
 * Mono, uppercase, letter-spaced label · sharp 0px corners · 1px border.
 * Variants: primary | secondary | ghost | danger. Sizes: sm | md | lg.
 */
function Button({
  children,
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  full = false,
  disabled = false,
  as = "button",
  ...rest
}) {
  const sizes = {
    sm: {
      padding: "7px 12px",
      fontSize: "11px",
      gap: "6px"
    },
    md: {
      padding: "10px 18px",
      fontSize: "12px",
      gap: "8px"
    },
    lg: {
      padding: "14px 26px",
      fontSize: "13px",
      gap: "10px"
    }
  };
  const variants = {
    primary: {
      background: "var(--accent)",
      color: "var(--on-accent)",
      border: "1px solid var(--accent)"
    },
    secondary: {
      background: "transparent",
      color: "var(--ink)",
      border: "1px solid var(--ink)"
    },
    ghost: {
      background: "transparent",
      color: "var(--ink-2)",
      border: "1px solid transparent"
    },
    danger: {
      background: "transparent",
      color: "var(--danger)",
      border: "1px solid var(--danger)"
    }
  };
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: full ? "100%" : "auto",
    fontFamily: "var(--font-mono)",
    fontWeight: 500,
    letterSpacing: "var(--tracking-mono)",
    textTransform: "uppercase",
    lineHeight: 1,
    borderRadius: "var(--radius-none)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    transition: "background var(--dur-fast) var(--ease-standard), color var(--dur-fast) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard)",
    textDecoration: "none",
    whiteSpace: "nowrap",
    ...sizes[size],
    ...variants[variant]
  };
  const Comp = as;
  return /*#__PURE__*/React.createElement(Comp, _extends({
    className: `crest-btn crest-btn--${variant}`,
    style: base,
    disabled: as === "button" ? disabled : undefined
  }, rest), iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex"
    }
  }, iconLeft), children, iconRight && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex"
    }
  }, iconRight));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Eyebrow — mono uppercase section kicker. The Crest's editorial
 * label that sits above serif headlines. Optional leading rule tick.
 */
function Eyebrow({
  children,
  tick = true,
  tone = "muted",
  style,
  ...rest
}) {
  const color = tone === "accent" ? "var(--accent)" : "var(--ink-3)";
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
      fontFamily: "var(--font-mono)",
      fontSize: "12px",
      fontWeight: 500,
      letterSpacing: "var(--tracking-caps)",
      textTransform: "uppercase",
      color,
      ...style
    }
  }, rest), tick && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      width: "18px",
      height: "1px",
      background: "currentColor",
      opacity: 0.6
    }
  }), children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Icon — thin wrapper over Lucide (the Crest icon standard).
 * Renders a Lucide glyph by name at a consistent 1.5px stroke.
 * Requires the Lucide UMD script present on the page (window.lucide).
 */
function Icon({
  name,
  size = 16,
  stroke = 1.75,
  color = "currentColor",
  style,
  ...rest
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (el && typeof window !== "undefined" && window.lucide) {
      el.innerHTML = "";
      el.setAttribute("data-lucide", name);
      try {
        window.lucide.createIcons({
          attrs: {
            width: size,
            height: size,
            "stroke-width": stroke
          },
          nameAttr: "data-lucide"
        });
      } catch (e) {
        /* lucide not ready — no-op */
      }
    }
  }, [name, size, stroke]);
  return /*#__PURE__*/React.createElement("i", _extends({
    ref: ref,
    "data-lucide": name,
    "aria-hidden": "true",
    style: {
      display: "inline-flex",
      width: size,
      height: size,
      color,
      flex: "0 0 auto",
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Tag — squared keyword/pain-point chip. Sharp corners, hairline border.
 * Used for keywords, pain points, buying signals, filters.
 */
function Tag({
  children,
  tone = "neutral",
  onRemove,
  style,
  ...rest
}) {
  const tones = {
    neutral: {
      fg: "var(--ink-2)",
      bd: "var(--line-2)",
      bg: "var(--surface)"
    },
    accent: {
      fg: "var(--accent)",
      bd: "var(--accent-line)",
      bg: "var(--accent-tint)"
    },
    muted: {
      fg: "var(--ink-3)",
      bd: "var(--line)",
      bg: "transparent"
    }
  };
  const t = tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      letterSpacing: "0.02em",
      lineHeight: 1,
      padding: "5px 8px",
      borderRadius: "var(--radius-xs)",
      color: t.fg,
      background: t.bg,
      border: `1px solid ${t.bd}`,
      whiteSpace: "nowrap",
      ...style
    }
  }, rest), children, onRemove && /*#__PURE__*/React.createElement("button", {
    onClick: onRemove,
    "aria-label": "Remove",
    style: {
      border: "none",
      background: "none",
      padding: 0,
      margin: 0,
      cursor: "pointer",
      color: "var(--ink-4)",
      lineHeight: 1,
      fontFamily: "var(--font-mono)",
      fontSize: "12px"
    }
  }, "\xD7"));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/data/Meter.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Meter — thin squared progress/usage bar. Flat track, accent fill,
 * mono numerals. Used for usage limits and single-value gauges.
 */
function Meter({
  label,
  value = 0,
  max = 100,
  unit,
  tone = "accent",
  showValue = true,
  style,
  ...rest
}) {
  const pct = Math.max(0, Math.min(100, value / max * 100));
  const fills = {
    accent: "var(--accent)",
    soft: "var(--accent-soft)",
    medium: "var(--medium)",
    low: "var(--low)",
    ink: "var(--ink)"
  };
  const near = pct >= 90;
  const fill = near ? "var(--low)" : fills[tone] || fills.accent;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      ...style
    }
  }, rest), (label || showValue) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: "12px"
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "13px",
      color: "var(--ink-2)"
    }
  }, label), showValue && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "12px",
      color: "var(--ink)",
      letterSpacing: "0.02em",
      fontVariantNumeric: "tabular-nums"
    }
  }, value.toLocaleString(), unit ? "" : "", " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ink-4)"
    }
  }, "/ ", max.toLocaleString(), unit || ""))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: "6px",
      width: "100%",
      background: "var(--paper-sunk)",
      border: "1px solid var(--line)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: `${pct}%`,
      background: fill,
      transition: "width var(--dur-slow) var(--ease-out)"
    }
  })));
}
Object.assign(__ds_scope, { Meter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Meter.jsx", error: String((e && e.message) || e) }); }

// components/data/ScoreBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ScoreBadge — the LeadParrot intent score as an editorial unit:
 * a large serif number + a mono tier label. Tiers: high ≥70,
 * medium 40–69, low <40.
 */
function ScoreBadge({
  score = 0,
  showTier = true,
  size = "md",
  style,
  ...rest
}) {
  const tier = score >= 70 ? "high" : score >= 40 ? "medium" : "low";
  const meta = {
    high: {
      label: "High intent",
      color: "var(--high)"
    },
    medium: {
      label: "Medium",
      color: "var(--medium)"
    },
    low: {
      label: "Low",
      color: "var(--low)"
    }
  }[tier];
  const sizes = {
    sm: "22px",
    md: "32px",
    lg: "48px"
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 400,
      fontSize: sizes[size],
      lineHeight: 1,
      letterSpacing: "-0.02em",
      color: meta.color,
      fontVariantNumeric: "lining-nums tabular-nums"
    }
  }, score), showTier && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      flexDirection: "column",
      gap: "2px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: "20px",
      height: "1px",
      background: meta.color,
      opacity: 0.5
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "10px",
      fontWeight: 500,
      letterSpacing: "var(--tracking-caps)",
      textTransform: "uppercase",
      color: meta.color
    }
  }, meta.label)));
}
Object.assign(__ds_scope, { ScoreBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ScoreBadge.jsx", error: String((e && e.message) || e) }); }

// components/data/ScoreBars.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ScoreBars — the LeadParrot weighted-score breakdown.
 * relevance·0.35 + intent·0.30 + urgency·0.20 + fit·0.15.
 * Mono labels + weights, hairline tracks, accent fills.
 */
function ScoreBars({
  relevance = 0,
  intent = 0,
  urgency = 0,
  fit = 0,
  style,
  ...rest
}) {
  const rows = [{
    label: "Relevance",
    value: relevance,
    weight: "35%"
  }, {
    label: "Intent",
    value: intent,
    weight: "30%"
  }, {
    label: "Urgency",
    value: urgency,
    weight: "20%"
  }, {
    label: "Fit",
    value: fit,
    weight: "15%"
  }];
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "14px",
      ...style
    }
  }, rest), rows.map(r => /*#__PURE__*/React.createElement("div", {
    key: r.label,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "6px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: "var(--ink-2)"
    }
  }, r.label, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ink-4)",
      marginLeft: "8px"
    }
  }, "\xB7", r.weight)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "12px",
      fontWeight: 500,
      color: "var(--ink)",
      fontVariantNumeric: "tabular-nums"
    }
  }, r.value)), /*#__PURE__*/React.createElement("div", {
    style: {
      height: "4px",
      width: "100%",
      background: "var(--paper-sunk)",
      borderRadius: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: `${Math.max(0, Math.min(100, r.value))}%`,
      background: "var(--accent-soft)"
    }
  })))));
}
Object.assign(__ds_scope, { ScoreBars });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ScoreBars.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Notice.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Notice — flat callout for safety, disclosure and status messages.
 * Left ink rule + tinted ground (no rounded "alert" look). The
 * Crest voice for LeadParrot's platform-safety + disclosure notes.
 */
function Notice({
  children,
  title,
  tone = "info",
  icon,
  style,
  ...rest
}) {
  const tones = {
    info: {
      bar: "var(--info)",
      bg: "var(--info-tint)",
      fg: "var(--ink-2)"
    },
    accent: {
      bar: "var(--accent)",
      bg: "var(--accent-tint)",
      fg: "var(--ink-2)"
    },
    caution: {
      bar: "var(--medium)",
      bg: "var(--medium-tint)",
      fg: "var(--ink-2)"
    },
    danger: {
      bar: "var(--danger)",
      bg: "var(--danger-tint)",
      fg: "var(--ink-2)"
    },
    neutral: {
      bar: "var(--line-strong)",
      bg: "var(--paper-sunk)",
      fg: "var(--ink-2)"
    }
  };
  const t = tones[tone] || tones.info;
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "note",
    style: {
      display: "flex",
      gap: "12px",
      padding: "14px 16px",
      background: t.bg,
      borderLeft: `2px solid ${t.bar}`,
      border: "1px solid var(--line)",
      borderLeftWidth: "2px",
      borderLeftColor: t.bar,
      ...style
    }
  }, rest), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      color: t.bar,
      marginTop: "1px",
      flex: "0 0 auto"
    }
  }, icon), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "3px",
      minWidth: 0
    }
  }, title && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      fontWeight: 600,
      letterSpacing: "var(--tracking-caps)",
      textTransform: "uppercase",
      color: t.bar
    }
  }, title), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "13px",
      lineHeight: 1.5,
      color: t.fg
    }
  }, children)));
}
Object.assign(__ds_scope, { Notice });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Notice.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Tabs — underline tab strip. Mono labels, active tab carries an ink
 * underline + count. Controlled via value/onChange.
 */
function Tabs({
  tabs = [],
  value,
  onChange,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "tablist",
    style: {
      display: "flex",
      gap: "0",
      borderBottom: "1px solid var(--line-2)",
      ...style
    }
  }, rest), tabs.map(tab => {
    const key = tab.id ?? tab.label;
    const active = value === key;
    return /*#__PURE__*/React.createElement("button", {
      key: key,
      role: "tab",
      "aria-selected": active,
      onClick: () => onChange && onChange(key),
      className: "crest-tab",
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        background: "none",
        border: "none",
        borderBottom: `2px solid ${active ? "var(--ink)" : "transparent"}`,
        marginBottom: "-1px",
        padding: "12px 18px",
        cursor: "pointer",
        fontFamily: "var(--font-mono)",
        fontSize: "12px",
        fontWeight: 500,
        letterSpacing: "var(--tracking-mono)",
        textTransform: "uppercase",
        color: active ? "var(--ink)" : "var(--ink-3)"
      }
    }, tab.label, tab.count != null && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: "11px",
        color: active ? "var(--accent)" : "var(--ink-4)",
        fontVariantNumeric: "tabular-nums"
      }
    }, tab.count));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/forms/Field.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Field — labelled text input. Mono uppercase label, sharp 2px input,
 * 1px border that goes accent on focus. Optional hint + error.
 */
function Field({
  label,
  hint,
  error,
  prefix,
  textarea = false,
  rows = 3,
  id,
  style,
  ...rest
}) {
  const inputId = id || (label ? `f-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
  const inputStyle = {
    width: "100%",
    fontFamily: "var(--font-sans)",
    fontSize: "14px",
    color: "var(--ink)",
    background: "var(--surface-raised)",
    border: `1px solid ${error ? "var(--danger)" : "var(--line-2)"}`,
    borderRadius: "var(--radius-xs)",
    padding: textarea ? "10px 12px" : prefix ? "10px 12px 10px 28px" : "10px 12px",
    lineHeight: 1.45,
    outline: "none",
    resize: textarea ? "vertical" : undefined
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "7px",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      fontWeight: 500,
      letterSpacing: "var(--tracking-caps)",
      textTransform: "uppercase",
      color: "var(--ink-3)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center"
    }
  }, prefix && !textarea && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: "11px",
      color: "var(--ink-4)",
      fontFamily: "var(--font-mono)",
      fontSize: "13px",
      pointerEvents: "none"
    }
  }, prefix), textarea ? /*#__PURE__*/React.createElement("textarea", _extends({
    id: inputId,
    className: "crest-input",
    rows: rows,
    style: inputStyle
  }, rest)) : /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    className: "crest-input",
    style: inputStyle
  }, rest))), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "12px",
      color: error ? "var(--danger)" : "var(--ink-3)"
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Field.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Select — squared native select styled to the Crest. Mono label,
 * hairline border, custom chevron.
 */
function Select({
  label,
  hint,
  children,
  id,
  style,
  ...rest
}) {
  const selectId = id || (label ? `s-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "7px",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: selectId,
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      fontWeight: 500,
      letterSpacing: "var(--tracking-caps)",
      textTransform: "uppercase",
      color: "var(--ink-3)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: selectId,
    className: "crest-input",
    style: {
      width: "100%",
      appearance: "none",
      WebkitAppearance: "none",
      fontFamily: "var(--font-sans)",
      fontSize: "14px",
      color: "var(--ink)",
      background: "var(--surface-raised)",
      border: "1px solid var(--line-2)",
      borderRadius: "var(--radius-xs)",
      padding: "10px 34px 10px 12px",
      outline: "none",
      cursor: "pointer"
    }
  }, rest), children), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      position: "absolute",
      right: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      pointerEvents: "none",
      color: "var(--ink-3)",
      fontSize: "11px",
      fontFamily: "var(--font-mono)"
    }
  }, "\u25BE")), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "12px",
      color: "var(--ink-3)"
    }
  }, hint));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Switch — pill toggle (one of the few pill shapes in Crest).
 * Squared knob slides; track fills accent when on.
 */
function Switch({
  checked = false,
  onChange,
  label,
  disabled = false,
  id,
  style,
  ...rest
}) {
  const switchId = id || (label ? `t-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
  const toggle = () => {
    if (!disabled && onChange) onChange(!checked);
  };
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: switchId,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "12px",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", _extends({
    id: switchId,
    role: "switch",
    "aria-checked": checked,
    type: "button",
    onClick: toggle,
    disabled: disabled,
    className: "crest-switch",
    style: {
      position: "relative",
      width: "40px",
      height: "22px",
      flex: "0 0 40px",
      padding: 0,
      border: `1px solid ${checked ? "var(--accent)" : "var(--line-2)"}`,
      borderRadius: "var(--radius-pill)",
      background: checked ? "var(--accent)" : "var(--paper-sunk)",
      cursor: disabled ? "not-allowed" : "pointer"
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: "2px",
      left: "2px",
      width: "16px",
      height: "16px",
      borderRadius: "var(--radius-pill)",
      background: checked ? "var(--paper)" : "var(--surface-raised)",
      border: "1px solid " + (checked ? "var(--accent)" : "var(--line-2)"),
      transform: checked ? "translateX(18px)" : "translateX(0)"
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "14px",
      color: "var(--ink-2)"
    }
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/layout/Bento.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Bento — modular grid with shared hairline seams (1px gap over an
 * ink-tinted backing). Cells read as one engineered surface. The
 * Crest layout primitive for dashboards and feature sections.
 */
function Bento({
  children,
  cols = 4,
  seam = "hairline",
  style,
  ...rest
}) {
  const gap = seam === "hairline" ? "1px" : "var(--space-4)";
  const bg = seam === "hairline" ? "var(--line-2)" : "transparent";
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "grid",
      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      gap,
      background: bg,
      border: seam === "hairline" ? "1px solid var(--line-2)" : "none",
      ...style
    }
  }, rest), children);
}

/**
 * BentoItem — a single cell. Spans columns/rows via colSpan/rowSpan.
 */
function BentoItem({
  children,
  colSpan = 1,
  rowSpan = 1,
  pad = "lg",
  tone = "surface",
  style,
  ...rest
}) {
  const pads = {
    none: 0,
    sm: "16px",
    md: "20px",
    lg: "28px"
  };
  const tones = {
    surface: {
      background: "var(--surface-card)",
      color: "var(--ink)"
    },
    sunk: {
      background: "var(--paper-sunk)",
      color: "var(--ink)"
    },
    ink: {
      background: "var(--ink)",
      color: "var(--paper)"
    },
    accent: {
      background: "var(--accent)",
      color: "var(--on-accent)"
    }
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      gridColumn: `span ${colSpan} / span ${colSpan}`,
      gridRow: `span ${rowSpan} / span ${rowSpan}`,
      padding: pads[pad],
      minWidth: 0,
      ...tones[tone],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Bento, BentoItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Bento.jsx", error: String((e && e.message) || e) }); }

// components/layout/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Card — the Crest container. Sharp 0px corners, 1px border, flat.
 * No drop shadows; structure comes from the border. Set interactive
 * for hover-to-ink-edge behavior (clickable cards / list items).
 */
function Card({
  children,
  variant = "default",
  interactive = false,
  pad = "lg",
  as = "div",
  style,
  className = "",
  ...rest
}) {
  const surfaces = {
    default: {
      background: "var(--surface-card)",
      border: "1px solid var(--line-2)"
    },
    raised: {
      background: "var(--surface-raised)",
      border: "1px solid var(--line-2)"
    },
    sunk: {
      background: "var(--paper-sunk)",
      border: "1px solid var(--line)"
    },
    ink: {
      background: "var(--ink)",
      border: "1px solid var(--ink)"
    },
    outline: {
      background: "transparent",
      border: "1px solid var(--line-2)"
    }
  };
  const pads = {
    none: 0,
    sm: "16px",
    md: "20px",
    lg: "28px",
    xl: "40px"
  };
  const Comp = as;
  return /*#__PURE__*/React.createElement(Comp, _extends({
    className: `crest-card ${interactive ? "crest-card--interactive" : ""} ${className}`.trim(),
    style: {
      borderRadius: "var(--radius-none)",
      padding: pads[pad],
      color: variant === "ink" ? "var(--paper)" : "var(--ink)",
      ...surfaces[variant],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Card.jsx", error: String((e && e.message) || e) }); }

// components/layout/Stat.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Stat — editorial metric. Mono uppercase label over a large serif
 * number. The dashboard's primary data voice.
 */
function Stat({
  label,
  value,
  hint,
  trend,
  align = "left",
  size = "md",
  style,
  ...rest
}) {
  const sizes = {
    sm: "28px",
    md: "40px",
    lg: "56px"
  };
  const trendColor = trend && trend.dir === "up" ? "var(--high)" : trend && trend.dir === "down" ? "var(--low)" : "var(--ink-3)";
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      textAlign: align,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      fontWeight: 500,
      letterSpacing: "var(--tracking-caps)",
      textTransform: "uppercase",
      color: "var(--ink-3)"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 400,
      fontSize: sizes[size],
      lineHeight: 1,
      letterSpacing: "-0.02em",
      color: "var(--ink)",
      fontVariantNumeric: "lining-nums tabular-nums"
    }
  }, value), (hint || trend) && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "12px",
      color: "var(--ink-3)"
    }
  }, trend && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: 500,
      color: trendColor,
      letterSpacing: "0.02em"
    }
  }, trend.dir === "up" ? "▲" : trend.dir === "down" ? "▼" : "■", " ", trend.value), hint && /*#__PURE__*/React.createElement("span", null, hint)));
}
Object.assign(__ds_scope, { Stat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Stat.jsx", error: String((e && e.message) || e) }); }

// handoff/action-button.tsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// THE CREST DESIGN SYSTEM — Action Button (React + Tailwind)
// Showcases the typography (mono, uppercase, tracked) and the
// 1px-border aesthetic. Sharp 0px corners, zero drop shadow.
// Place at: src/components/crest/action-button.tsx

// In the LeadParrot repo, replace this with: import { cn } from "@/lib/utils";
// (inlined here so the file is self-contained outside the repo)
function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}
const VARIANTS = {
  primary: "bg-accent text-accent-fg border-accent hover:bg-accent-press hover:border-accent-press",
  secondary: "bg-transparent text-ink border-ink hover:bg-ink hover:text-paper",
  ghost: "bg-transparent text-ink-2 border-transparent hover:bg-paper-sunk hover:text-ink",
  danger: "bg-transparent text-danger border-danger hover:bg-danger hover:text-paper"
};
const SIZES = {
  sm: "px-3 py-[7px] text-[11px] gap-1.5",
  md: "px-[18px] py-2.5 text-xs gap-2",
  lg: "px-[26px] py-3.5 text-[13px] gap-2.5"
};
function ActionButton({
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  full = false,
  className,
  children,
  ...props
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cn(
    // Type IS the interface: mono, uppercase, letter-spaced.
    "inline-flex items-center justify-center rounded-none border", "font-mono font-medium uppercase tracking-[0.08em] leading-none", "transition-colors duration-150 ease-standard", "active:shadow-press disabled:opacity-45 disabled:pointer-events-none", "focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_var(--paper),0_0_0_3.5px_var(--accent)]", VARIANTS[variant], SIZES[size], full && "w-full", className)
  }, props), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { ActionButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "handoff/action-button.tsx", error: String((e && e.message) || e) }); }

// handoff/lead-detail-card.tsx
try { (() => {
// THE CREST DESIGN SYSTEM — Lead Detail Card (React + Tailwind)
// Demonstrates the bento-grid structure and data hierarchy:
// editorial serif score, mono metadata, hairline-seam metric grid,
// and a 1px-border container with no drop shadow.
// Place at: src/components/crest/lead-detail-card.tsx

// In the LeadParrot repo, replace this with: import { cn } from "@/lib/utils";
// (inlined here so the file is self-contained outside the repo)
function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}
function tier(score) {
  if (score >= 70) return {
    label: "High intent",
    className: "text-high"
  };
  if (score >= 40) return {
    label: "Medium",
    className: "text-medium"
  };
  return {
    label: "Low",
    className: "text-low"
  };
}
const WEIGHTS = [{
  key: "relevance",
  label: "Relevance",
  weight: "35%"
}, {
  key: "intent",
  label: "Intent",
  weight: "30%"
}, {
  key: "urgency",
  label: "Urgency",
  weight: "20%"
}, {
  key: "fit",
  label: "Fit",
  weight: "15%"
}];
function LeadDetailCard({
  title,
  source,
  subreddit,
  author,
  postedAt,
  score,
  scores,
  reason
}) {
  const t = tier(score);
  return /*#__PURE__*/React.createElement("article", {
    className: "rounded-none border border-line-2 bg-surface"
  }, /*#__PURE__*/React.createElement("header", {
    className: "flex items-start justify-between gap-6 border-b border-line p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "crest-badge border-accent bg-accent text-accent-fg"
  }, source), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[10.5px] uppercase tracking-[0.06em] text-ink-4"
  }, subreddit, " \xB7 ", author, " \xB7 ", postedAt)), /*#__PURE__*/React.createElement("h3", {
    className: "font-display text-2xl leading-tight tracking-tightest text-ink"
  }, title)), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-end"
  }, /*#__PURE__*/React.createElement("span", {
    className: cn("font-display text-5xl leading-none tracking-tightest tabular-nums", t.className)
  }, score), /*#__PURE__*/React.createElement("span", {
    className: cn("mt-1 font-mono text-[10px] uppercase tracking-caps", t.className)
  }, t.label))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-4 gap-px border-b border-line bg-line"
  }, WEIGHTS.map(w => /*#__PURE__*/React.createElement("div", {
    key: w.key,
    className: "bg-surface p-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3"
  }, w.label, " ", /*#__PURE__*/React.createElement("span", {
    className: "text-ink-4"
  }, "\xB7 ", w.weight)), /*#__PURE__*/React.createElement("div", {
    className: "mt-2 font-display text-3xl leading-none tabular-nums text-ink"
  }, scores[w.key]), /*#__PURE__*/React.createElement("div", {
    className: "mt-3 h-1 w-full bg-paper-sunk"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full bg-accent-soft",
    style: {
      width: `${Math.max(0, Math.min(100, scores[w.key]))}%`
    }
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-start justify-between gap-6 p-6"
  }, /*#__PURE__*/React.createElement("p", {
    className: "max-w-prose text-sm leading-relaxed text-ink-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mr-2 font-mono text-[10px] uppercase tracking-[0.1em] text-accent"
  }, "Why"), reason), /*#__PURE__*/React.createElement("div", {
    className: "flex shrink-0 gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: "crest-btn crest-btn--secondary"
  }, "Save"), /*#__PURE__*/React.createElement("button", {
    className: "crest-btn crest-btn--primary"
  }, "Generate reply"))));
}
Object.assign(__ds_scope, { LeadDetailCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "handoff/lead-detail-card.tsx", error: String((e && e.message) || e) }); }

// handoff/tailwind.config.ts
try { (() => {
/**
 * THE CREST DESIGN SYSTEM — tailwind.config.ts extension for LeadParrot
 * Drop-in replacement for the existing Next.js / Tailwind config.
 *
 * Strategy: tokens are declared once as CSS variables in globals.css
 * (see ./globals.css) and referenced here so Tailwind utilities and
 * raw CSS stay in sync. Sharp 0px corners or full pills only.
 */

const config = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}", "./src/lib/**/*.{ts,tsx}"],
  theme: {
    // Replace the default radius scale entirely — Crest allows only
    // sharp corners or complete pills. No 4/6/8px "soft" radii.
    borderRadius: {
      none: "0px",
      xs: "2px",
      // inputs / chips only
      pill: "9999px",
      // badges, avatars, toggles
      full: "9999px"
    },
    extend: {
      colors: {
        paper: {
          DEFAULT: "var(--paper)",
          // #F4F1E9 Cloud Dancer
          sunk: "var(--paper-sunk)" // #ECE8DD
        },
        surface: {
          DEFAULT: "var(--surface)",
          // #FBFAF5
          raised: "var(--surface-2)" // #FFFFFF
        },
        ink: {
          DEFAULT: "var(--ink)",
          // #1C1B17 warm near-black
          2: "var(--ink-2)",
          // #4A463C
          3: "var(--ink-3)",
          // #6F6A5C
          4: "var(--ink-4)" // #9A9483
        },
        line: {
          DEFAULT: "var(--line)",
          // #DEDACE hairline
          2: "var(--line-2)",
          // #CDC8B8 structural
          strong: "var(--line-strong)" // = ink (emphasis)
        },
        // One owned accent — Verdigris.
        accent: {
          DEFAULT: "var(--accent)",
          // #2E5E45
          press: "var(--accent-press)",
          // #244B37
          soft: "var(--accent-soft)",
          // #5A7C66 sage
          tint: "var(--accent-tint)",
          // #E6EBE3
          line: "var(--accent-line)",
          // #BFCDBF
          fg: "var(--on-accent)" // text on accent
        },
        // Earthy semantics — scoring tiers + status.
        high: "var(--high)",
        // green   ≥70
        medium: "var(--medium)",
        // ochre   40–69
        low: "var(--low)",
        // clay    <40
        danger: "var(--danger)",
        // brick
        info: "var(--info)" // slate
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        // Newsreader
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        // IBM Plex Sans
        mono: ["var(--font-mono)", "ui-monospace", "monospace"] // IBM Plex Mono
      },
      fontSize: {
        // Editorial scale (px → rem). Display sizes pair with font-display.
        "3xs": ["0.6875rem", {
          lineHeight: "1"
        }],
        "2xs": ["0.75rem", {
          lineHeight: "1"
        }],
        eyebrow: ["0.75rem", {
          lineHeight: "1",
          letterSpacing: "0.14em"
        }],
        hero: ["4.5rem", {
          lineHeight: "1.02",
          letterSpacing: "-0.025em"
        }],
        display: ["2.625rem", {
          lineHeight: "1.08",
          letterSpacing: "-0.02em"
        }]
      },
      letterSpacing: {
        mono: "0.08em",
        caps: "0.14em",
        tightest: "-0.025em"
      },
      // Borders carry structure — keep only a single restrained overlay
      // lift for true popovers/dialogs. No ambient card shadows.
      boxShadow: {
        none: "none",
        press: "inset 0 1px 2px 0 rgb(28 27 23 / 0.12)",
        overlay: "0 1px 0 0 var(--line-2), 0 24px 48px -24px rgb(28 27 23 / 0.28)"
      },
      backgroundImage: {
        grain: "var(--grain)"
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.2, 0, 0.1, 1)",
        out: "cubic-bezier(0.16, 1, 0.3, 1)"
      }
    }
  },
  plugins: []
};
Object.assign(__ds_scope, { config });
})(); } catch (e) { __ds_ns.__errors.push({ path: "handoff/tailwind.config.ts", error: String((e && e.message) || e) }); }

// handoff/typography.tsx
try { (() => {
// THE CREST DESIGN SYSTEM — Typography scale specimen (React + Tailwind)
// Hero serif headline vs. utility mono/sans. Demonstrates text as the
// primary interface architecture.
// Place at: src/components/crest/typography.tsx

function TypographySpecimen() {
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-10 bg-paper p-12"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "crest-eyebrow before:h-px before:w-[18px] before:bg-current before:opacity-60"
  }, "The Crest"), /*#__PURE__*/React.createElement("h1", {
    className: "mt-4 max-w-3xl font-display text-hero font-light text-ink"
  }, "Find customers already asking for what you sell."), /*#__PURE__*/React.createElement("p", {
    className: "mt-6 max-w-xl font-sans text-lg leading-normal text-ink-2"
  }, "A striking neo-serif carries the editorial voice; a clean grotesque keeps long-form reading effortless.")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-6 border-t border-line pt-8"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-2xs uppercase tracking-caps text-ink-3"
  }, "Relevance \xB7 35%"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-sm tabular-nums text-ink"
  }, "SCORE ", /*#__PURE__*/React.createElement("span", {
    className: "font-medium text-accent"
  }, "81")), /*#__PURE__*/React.createElement("button", {
    className: "crest-btn crest-btn--primary"
  }, "Generate reply")), /*#__PURE__*/React.createElement("dl", {
    className: "divide-y divide-line border-t border-line"
  }, [{
    spec: "5xl · display · 300",
    cls: "font-display text-5xl font-light tracking-tightest",
    ex: "Crest"
  }, {
    spec: "display · serif",
    cls: "font-display text-display",
    ex: "High-intent leads"
  }, {
    spec: "lg · sans",
    cls: "font-sans text-lg text-ink-2",
    ex: "Body copy that stays calm and legible."
  }, {
    spec: "2xs · mono",
    cls: "font-mono text-2xs uppercase tracking-caps text-ink-3",
    ex: "Utility label"
  }].map(row => /*#__PURE__*/React.createElement("div", {
    key: row.spec,
    className: "flex items-baseline gap-6 py-4"
  }, /*#__PURE__*/React.createElement("dt", {
    className: "w-44 shrink-0 font-mono text-3xs uppercase tracking-[0.08em] text-ink-4"
  }, row.spec), /*#__PURE__*/React.createElement("dd", {
    className: row.cls
  }, row.ex)))));
}
Object.assign(__ds_scope, { TypographySpecimen });
})(); } catch (e) { __ds_ns.__errors.push({ path: "handoff/typography.tsx", error: String((e && e.message) || e) }); }

// ui_kits/app/AppShell.jsx
try { (() => {
// AppShell — sidebar + topbar chrome for the LeadParrot app kit.
const DS = window.CrestDesignSystemLeadParrot_bb3a07;
function NavItem({
  icon,
  label,
  active,
  badge,
  onClick
}) {
  const {
    Icon
  } = DS;
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    className: "crest-row",
    style: {
      display: "flex",
      alignItems: "center",
      gap: "11px",
      width: "100%",
      padding: "9px 12px",
      border: "none",
      cursor: "pointer",
      textAlign: "left",
      background: active ? "var(--paper-sunk)" : "transparent",
      borderLeft: `2px solid ${active ? "var(--accent)" : "transparent"}`,
      color: active ? "var(--ink)" : "var(--ink-2)",
      fontFamily: "var(--font-mono)",
      fontSize: "12px",
      letterSpacing: "0.04em",
      textTransform: "uppercase"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 15,
    color: active ? "var(--accent)" : "var(--ink-3)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, label), badge != null && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "11px",
      color: active ? "var(--accent)" : "var(--ink-4)",
      fontVariantNumeric: "tabular-nums"
    }
  }, badge));
}
function AppShell({
  view,
  setView,
  children
}) {
  const {
    Avatar,
    Button,
    Icon,
    Badge
  } = DS;
  const D = window.CREST_DATA;
  const nav = [{
    id: "dashboard",
    icon: "layout-dashboard",
    label: "Dashboard"
  }, {
    id: "inbox",
    icon: "inbox",
    label: "Lead inbox",
    badge: D.stats.highIntent
  }, {
    id: "projects",
    icon: "folder-kanban",
    label: "Projects"
  }, {
    id: "sources",
    icon: "radio",
    label: "Sources"
  }, {
    id: "digest",
    icon: "mail",
    label: "Daily digest"
  }, {
    id: "billing",
    icon: "credit-card",
    label: "Billing"
  }, {
    id: "settings",
    icon: "settings",
    label: "Settings"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "248px 1fr",
      minHeight: "100%",
      background: "var(--paper)"
    }
  }, /*#__PURE__*/React.createElement("aside", {
    style: {
      borderRight: "1px solid var(--line-2)",
      display: "flex",
      flexDirection: "column",
      background: "var(--surface)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 16px",
      borderBottom: "1px solid var(--line)",
      display: "flex",
      alignItems: "center",
      gap: "11px"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/crest-mark.svg",
    alt: "",
    style: {
      width: 30,
      height: 30
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "20px",
      color: "var(--ink)"
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      fontWeight: 500
    }
  }, "Lead"), "Parrot")), /*#__PURE__*/React.createElement("button", {
    className: "crest-row",
    style: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "12px 16px",
      border: "none",
      borderBottom: "1px solid var(--line)",
      background: "transparent",
      cursor: "pointer",
      textAlign: "left"
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    label: D.org.name,
    tone: "accent",
    size: 32
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontSize: "13px",
      fontWeight: 500,
      color: "var(--ink)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, D.org.name), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: "var(--font-mono)",
      fontSize: "10px",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "var(--ink-4)"
    }
  }, D.org.plan, " plan")), /*#__PURE__*/React.createElement(Icon, {
    name: "chevrons-up-down",
    size: 14,
    color: "var(--ink-4)"
  })), /*#__PURE__*/React.createElement("nav", {
    style: {
      padding: "10px 0",
      display: "flex",
      flexDirection: "column",
      gap: "1px",
      flex: 1
    }
  }, nav.map(n => /*#__PURE__*/React.createElement(NavItem, {
    key: n.id,
    icon: n.icon,
    label: n.label,
    badge: n.badge,
    active: view === n.id,
    onClick: () => setView(n.id)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px",
      borderTop: "1px solid var(--line)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "10px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "999px",
      background: "var(--accent)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "10px",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "var(--ink-3)"
    }
  }, "3 sources live")), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    full: true
  }, "Run a scan"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      height: 60,
      borderBottom: "1px solid var(--line-2)",
      display: "flex",
      alignItems: "center",
      gap: "16px",
      padding: "0 28px",
      background: "var(--surface)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      flex: 1,
      maxWidth: 420,
      border: "1px solid var(--line-2)",
      padding: "8px 12px",
      background: "var(--paper)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 15,
    color: "var(--ink-4)"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search leads, posts, keywords\u2026",
    style: {
      border: "none",
      background: "transparent",
      outline: "none",
      fontFamily: "var(--font-sans)",
      fontSize: "13px",
      color: "var(--ink)",
      width: "100%"
    }
  }), /*#__PURE__*/React.createElement("kbd", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "10px",
      color: "var(--ink-4)",
      border: "1px solid var(--line-2)",
      padding: "2px 5px"
    }
  }, "/")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "bell",
      size: 14
    })
  }, "Digest"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 14
    })
  }, "New project")), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      overflow: "auto",
      padding: "28px"
    }
  }, children)));
}
Object.assign(window, {
  AppShell
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/AppShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Dashboard.jsx
try { (() => {
// Dashboard — bento overview: metrics, usage, recent high-intent leads.
const _DS_DASH = window.CrestDesignSystemLeadParrot_bb3a07;
function Dashboard({
  onOpenLead
}) {
  const {
    Bento,
    BentoItem,
    Stat,
    Card,
    Meter,
    Eyebrow,
    Notice,
    Button,
    Badge,
    ScoreBadge,
    Icon,
    Tag
  } = _DS_DASH;
  const D = window.CREST_DATA;
  const recent = D.leads.filter(l => l.tier === "high");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "24px",
      maxWidth: 1120
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: "16px",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "1 1 320px",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Workspace \xB7 ", D.org.name), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 300,
      fontSize: "40px",
      letterSpacing: "-0.02em",
      color: "var(--ink)",
      margin: "12px 0 0",
      maxWidth: 520
    }
  }, "Good morning. 41 leads worth a look.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "8px",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm"
  }, "View inbox"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "scan-line",
      size: 14
    })
  }, "Run a scan"))), /*#__PURE__*/React.createElement(Notice, {
    tone: "caution",
    title: "Platform safety"
  }, "LeadParrot drafts replies \u2014 it never posts for you. You stay responsible for following each platform's rules before responding."), /*#__PURE__*/React.createElement(Bento, {
    cols: 4
  }, /*#__PURE__*/React.createElement(BentoItem, null, /*#__PURE__*/React.createElement(Stat, {
    label: "Total leads",
    value: D.stats.totalLeads,
    trend: {
      dir: "up",
      value: "12 this wk"
    }
  })), /*#__PURE__*/React.createElement(BentoItem, null, /*#__PURE__*/React.createElement(Stat, {
    label: "High-intent",
    value: D.stats.highIntent,
    hint: "score \u2265 70"
  })), /*#__PURE__*/React.createElement(BentoItem, {
    tone: "ink"
  }, /*#__PURE__*/React.createElement(Stat, {
    label: "Avg score",
    value: D.stats.avgScore
  })), /*#__PURE__*/React.createElement(BentoItem, {
    tone: "accent"
  }, /*#__PURE__*/React.createElement(Stat, {
    label: "Replies copied",
    value: D.stats.repliesCopied
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.6fr 1fr",
      gap: "20px",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "12px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    tone: "accent"
  }, "Recent high-intent leads"), /*#__PURE__*/React.createElement("a", {
    className: "crest-link",
    href: "#",
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--ink-3)"
    }
  }, "View all \u2192")), recent.map(l => /*#__PURE__*/React.createElement(Card, {
    key: l.id,
    variant: "default",
    interactive: true,
    pad: "md",
    as: "div",
    style: {
      cursor: "pointer"
    },
    onClick: () => onOpenLead(l.id)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "18px",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement(ScoreBadge, {
    score: l.score,
    size: "md"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "8px",
      alignItems: "center",
      marginBottom: "7px"
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "accent",
    solid: true
  }, l.source), /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral"
  }, l.stage.replace(/-/g, " ")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "10.5px",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--ink-4)"
    }
  }, l.sub, " \xB7 ", l.posted)), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 400,
      fontSize: "19px",
      lineHeight: 1.2,
      color: "var(--ink)",
      margin: 0
    }
  }, l.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "13px",
      lineHeight: 1.5,
      color: "var(--ink-3)",
      margin: "7px 0 0"
    }
  }, l.reason)))))), /*#__PURE__*/React.createElement(Card, {
    pad: "lg"
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "This month's usage"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "12px",
      color: "var(--ink-3)",
      margin: "8px 0 18px"
    }
  }, "Resets monthly. Upgrade for higher limits."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "18px"
    }
  }, /*#__PURE__*/React.createElement(Meter, {
    label: "Posts scanned",
    value: D.usage.posts.used,
    max: D.usage.posts.limit
  }), /*#__PURE__*/React.createElement(Meter, {
    label: "Reply drafts",
    value: D.usage.replies.used,
    max: D.usage.replies.limit
  }), /*#__PURE__*/React.createElement(Meter, {
    label: "Projects",
    value: D.usage.projects.used,
    max: D.usage.projects.limit
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "22px",
      paddingTop: "18px",
      borderTop: "1px solid var(--line)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: "10px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "var(--ink-3)"
    }
  }, "Watched keywords")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "6px"
    }
  }, D.project.keywords.map(k => /*#__PURE__*/React.createElement(Tag, {
    key: k
  }, k)))))));
}
Object.assign(window, {
  Dashboard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Dashboard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/LeadDetail.jsx
try { (() => {
// LeadDetail — full analysis: original post, reply draft, score panel.
const _DS_DETAIL = window.CrestDesignSystemLeadParrot_bb3a07;
function LeadDetail({
  leadId,
  onBack
}) {
  const {
    Card,
    Button,
    Badge,
    ScoreBadge,
    ScoreBars,
    Notice,
    Eyebrow,
    Icon,
    Tag,
    Avatar
  } = _DS_DETAIL;
  const D = window.CREST_DATA;
  const lead = D.leads.find(l => l.id === leadId) || D.leads[0];
  const [copied, setCopied] = React.useState(false);
  const [saved, setSaved] = React.useState(lead.saved);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1120,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    className: "crest-link",
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "7px",
      background: "none",
      border: "none",
      cursor: "pointer",
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: "var(--ink-3)",
      padding: 0,
      marginBottom: "18px"
    }
  }, "\u2190 Lead inbox"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "10px",
      alignItems: "center",
      marginBottom: "12px",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(ScoreBadge, {
    score: lead.score,
    size: "md"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      height: 26,
      background: "var(--line-2)"
    }
  }), /*#__PURE__*/React.createElement(Badge, {
    tone: "accent",
    solid: true
  }, lead.source), /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral"
  }, lead.stage.replace(/-/g, " ")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--ink-4)"
    }
  }, lead.sub, " \xB7 posted ", lead.posted)), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 300,
      fontSize: "34px",
      lineHeight: 1.12,
      letterSpacing: "-0.02em",
      color: "var(--ink)",
      margin: "0 0 24px",
      maxWidth: 820
    }
  }, lead.title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.7fr 1fr",
      gap: "20px",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "20px"
    }
  }, /*#__PURE__*/React.createElement(Card, {
    pad: "lg"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "14px"
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    label: lead.author,
    tone: "soft",
    size: 30
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "12px",
      color: "var(--ink-2)",
      letterSpacing: "0.02em"
    }
  }, lead.author), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("a", {
    className: "crest-link",
    href: "#",
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--ink-3)"
    }
  }, "View original \u2197")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "15px",
      lineHeight: 1.6,
      color: "var(--ink)",
      margin: 0
    }
  }, lead.body)), /*#__PURE__*/React.createElement(Card, {
    pad: "lg"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "16px"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    tone: "accent"
  }, "Reply draft"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "sparkles",
      size: 13
    })
  }, lead.draft ? "Regenerate" : "Generate reply")), lead.draft ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "16px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid var(--line-2)",
      background: "var(--paper)",
      padding: "18px"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "14px",
      lineHeight: 1.6,
      color: "var(--ink)",
      margin: 0,
      whiteSpace: "pre-wrap"
    }
  }, lead.draft)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: copied ? "check" : "clipboard",
      size: 13
    }),
    onClick: () => setCopied(true)
  }, copied ? "Copied — post it yourself" : "Copy reply"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      letterSpacing: "0.04em",
      color: "var(--ink-4)"
    }
  }, "CONFIDENCE ", lead.confidence, "%")), /*#__PURE__*/React.createElement(Notice, {
    tone: "accent",
    title: "Suggested disclosure"
  }, lead.disclosure), /*#__PURE__*/React.createElement(Notice, {
    tone: "caution",
    title: "Before you post"
  }, /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      paddingLeft: "16px",
      display: "flex",
      flexDirection: "column",
      gap: "4px"
    }
  }, lead.safety.map(s => /*#__PURE__*/React.createElement("li", {
    key: s
  }, s))))) : /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "14px",
      lineHeight: 1.6,
      color: "var(--ink-3)",
      margin: 0
    }
  }, "No draft yet. Generate a helpful, transparent reply you can review and copy. LeadParrot never posts for you."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "20px"
    }
  }, /*#__PURE__*/React.createElement(Card, {
    pad: "lg"
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "AI score"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: "10px",
      margin: "14px 0 18px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 300,
      fontSize: "56px",
      lineHeight: 1,
      letterSpacing: "-0.03em",
      color: "var(--ink)"
    }
  }, lead.score), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: "var(--ink-3)"
    }
  }, "overall \xB7 ", lead.confidence, "% conf.")), /*#__PURE__*/React.createElement(ScoreBars, {
    relevance: lead.relevance,
    intent: lead.intent,
    urgency: lead.urgency,
    fit: lead.fit
  })), /*#__PURE__*/React.createElement(Card, {
    pad: "lg"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "16px"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "10.5px",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "var(--ink-3)"
    }
  }, "Why it's a lead"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "13px",
      lineHeight: 1.55,
      color: "var(--ink-2)",
      margin: "7px 0 0"
    }
  }, lead.reason)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "10.5px",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "var(--ink-3)"
    }
  }, "Suggested angle"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "13px",
      lineHeight: 1.55,
      color: "var(--ink-2)",
      margin: "7px 0 0"
    }
  }, lead.angle)), lead.signals.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "10.5px",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "var(--ink-3)"
    }
  }, "Buying signals"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "6px",
      marginTop: "9px"
    }
  }, lead.signals.map(s => /*#__PURE__*/React.createElement(Tag, {
    key: s,
    tone: "accent"
  }, s)))), lead.pains.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "10.5px",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "var(--ink-3)"
    }
  }, "Pain points"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "6px",
      marginTop: "9px"
    }
  }, lead.pains.map(s => /*#__PURE__*/React.createElement(Tag, {
    key: s
  }, s)))))), /*#__PURE__*/React.createElement(Card, {
    pad: "lg"
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Manage"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      marginTop: "14px"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: saved ? "primary" : "secondary",
    size: "sm",
    full: true,
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "bookmark",
      size: 13
    }),
    onClick: () => setSaved(!saved)
  }, saved ? "Saved" : "Save lead"), /*#__PURE__*/React.createElement(Button, {
    variant: "danger",
    size: "sm",
    full: true
  }, "Not a lead"))))));
}
Object.assign(window, {
  LeadDetail
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/LeadDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/LeadInbox.jsx
try { (() => {
// LeadInbox — filterable list of scored leads.
const _DS_INBOX = window.CrestDesignSystemLeadParrot_bb3a07;
function LeadRow({
  lead,
  onOpen
}) {
  const {
    ScoreBadge,
    Badge,
    Icon,
    Button
  } = _DS_INBOX;
  return /*#__PURE__*/React.createElement("div", {
    className: "crest-row",
    onClick: () => onOpen(lead.id),
    style: {
      display: "grid",
      gridTemplateColumns: "118px 1fr auto",
      gap: "20px",
      alignItems: "center",
      padding: "18px 20px",
      borderBottom: "1px solid var(--line)",
      cursor: "pointer",
      background: "var(--surface)"
    }
  }, /*#__PURE__*/React.createElement(ScoreBadge, {
    score: lead.score,
    size: "sm"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "8px",
      alignItems: "center",
      marginBottom: "5px"
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: lead.source === "Reddit" ? "accent" : "neutral",
    solid: lead.source === "Reddit"
  }, lead.source), /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral"
  }, lead.stage.replace(/-/g, " ")), lead.saved && /*#__PURE__*/React.createElement(Icon, {
    name: "bookmark",
    size: 13,
    color: "var(--accent)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "10.5px",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--ink-4)"
    }
  }, lead.sub, " \xB7 ", lead.author, " \xB7 ", lead.posted)), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 400,
      fontSize: "17px",
      lineHeight: 1.25,
      color: "var(--ink)",
      margin: 0,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, lead.title)), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 13
    })
  }, "Open"));
}
function LeadInbox({
  onOpenLead
}) {
  const {
    Tabs,
    Select,
    Eyebrow,
    Badge,
    Icon
  } = _DS_INBOX;
  const D = window.CREST_DATA;
  const [tab, setTab] = React.useState("high");
  const counts = {
    all: D.leads.length,
    high: D.leads.filter(l => l.tier === "high").length,
    saved: D.leads.filter(l => l.saved).length
  };
  const visible = D.leads.filter(l => tab === "all" ? true : tab === "high" ? l.tier === "high" : tab === "saved" ? l.saved : true);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      maxWidth: 1120
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "Lead inbox"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 300,
      fontSize: "36px",
      letterSpacing: "-0.02em",
      color: "var(--ink)",
      margin: "12px 0 0"
    }
  }, D.leads.length, " leads across 3 sources")), /*#__PURE__*/React.createElement(Tabs, {
    value: tab,
    onChange: setTab,
    tabs: [{
      id: "all",
      label: "All",
      count: counts.all
    }, {
      id: "high",
      label: "High intent",
      count: counts.high
    }, {
      id: "saved",
      label: "Saved",
      count: counts.saved
    }, {
      id: "replied",
      label: "Replied",
      count: 0
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "12px",
      alignItems: "center",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 150
    }
  }, /*#__PURE__*/React.createElement(Select, {
    defaultValue: "all"
  }, /*#__PURE__*/React.createElement("option", {
    value: "all"
  }, "All sources"), /*#__PURE__*/React.createElement("option", null, "Reddit"), /*#__PURE__*/React.createElement("option", null, "Hacker News"), /*#__PURE__*/React.createElement("option", null, "RSS"))), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 150
    }
  }, /*#__PURE__*/React.createElement(Select, {
    defaultValue: "recent"
  }, /*#__PURE__*/React.createElement("option", {
    value: "recent"
  }, "Newest first"), /*#__PURE__*/React.createElement("option", null, "Highest score"), /*#__PURE__*/React.createElement("option", null, "Most urgent"))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--ink-3)"
    }
  }, visible.length, " shown")), /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid var(--line-2)"
    }
  }, visible.map(l => /*#__PURE__*/React.createElement(LeadRow, {
    key: l.id,
    lead: l,
    onOpen: onOpenLead
  })), visible.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "48px",
      textAlign: "center",
      color: "var(--ink-3)",
      fontFamily: "var(--font-sans)",
      fontSize: "14px"
    }
  }, "Nothing here yet. Run a scan or paste a public post to start finding leads.")));
}
Object.assign(window, {
  LeadInbox
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/LeadInbox.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/data.js
try { (() => {
// Demo dataset for the LeadParrot app UI kit — adapted from the
// codebase seed (src/lib/db/seed.ts). Static, illustrative only.
window.CREST_DATA = {
  org: {
    name: "Acme Proposals",
    plan: "Starter",
    website: "acmeproposals.com"
  },
  project: {
    name: "Proposal tool — Reddit + HN",
    keywords: ["proposal tool", "client proposal", "Upwork proposal", "freelance proposal"],
    negatives: ["school proposal", "research proposal", "marriage proposal"],
    competitors: ["PandaDoc", "Better Proposals", "Proposify"]
  },
  stats: {
    totalLeads: 248,
    highIntent: 41,
    avgScore: 63,
    saved: 12,
    repliesCopied: 29,
    activeProjects: 2
  },
  usage: {
    posts: {
      used: 342,
      limit: 500
    },
    replies: {
      used: 88,
      limit: 100
    },
    projects: {
      used: 2,
      limit: 3
    }
  },
  leads: [{
    id: "l1",
    score: 81,
    tier: "high",
    stage: "competitor-switching",
    source: "Reddit",
    sub: "r/agency",
    author: "u/agency_ops",
    posted: "1d ago",
    title: "Frustrated with PandaDoc pricing — any cheaper alternatives?",
    body: "We've been using PandaDoc but the per-seat pricing is getting expensive as our agency grows. Anyone switched to something cheaper that still does proposals and contracts well? Need to decide this week.",
    reason: "Mentions a competitor (PandaDoc) and explicit budget pressure, with strong buying signals and a near-term decision deadline.",
    angle: "Acknowledge the PandaDoc pricing frustration, share one concrete way to cut proposal time, then briefly mention Acme Proposals with disclosure.",
    relevance: 88,
    intent: 82,
    urgency: 75,
    fit: 70,
    confidence: 62,
    pains: ["Cost / pricing concerns", "Outgrowing current tool"],
    signals: ["frustrated with", "alternative", "need to decide this week"],
    risks: ["Reddit self-promotion rules vary by subreddit — read the rules first."],
    status: "new",
    saved: false,
    draft: "Totally get the PandaDoc pricing pain as you add seats. One thing that helped us before switching anything: standardize 2–3 proposal templates so you're not rebuilding each one — that alone cut our prep time a lot. If you do switch, list the must-have features (e-sign, templates, analytics) and only pay for those. I'm building a small proposal tool in this space (Acme Proposals) — happy to share if it's useful, no pressure.",
    disclosure: "I'm building a small proposal tool in this space (Acme Proposals) — sharing because it's relevant, not to pitch.",
    safety: ["Disclose your affiliation before mentioning your product.", "Don't reuse this exact text across threads — personalize it.", "Check the community's self-promotion rules before posting."]
  }, {
    id: "l2",
    score: 69,
    tier: "medium",
    stage: "solution-aware",
    source: "Reddit",
    sub: "r/freelance",
    author: "u/design_freelance",
    posted: "1d ago",
    title: "Looking for a proposal tool for freelance clients — anything better than Word?",
    body: "I'm a freelance designer sending 5–10 client proposals a month. Writing them in Word is painful. Looking for a proposal tool that handles templates and e-signatures. Budget is flexible if it saves time.",
    reason: "Freelancer explicitly looking for a proposal tool with templates and e-signatures; flexible budget signals real intent.",
    angle: "Lead with a concrete tip on reusable proposal templates, then mention Acme Proposals lightly with disclosure.",
    relevance: 84,
    intent: 68,
    urgency: 40,
    fit: 72,
    confidence: 58,
    pains: ["Manual / time-consuming workflow", "Wants templates + e-signatures"],
    signals: ["looking for", "recommend", "budget is flexible"],
    risks: [],
    status: "new",
    saved: true,
    draft: null
  }, {
    id: "l3",
    score: 74,
    tier: "high",
    stage: "problem-aware",
    source: "Hacker News",
    sub: "Ask HN",
    author: "swyx_builds",
    posted: "2d ago",
    title: "Ask HN: how do you track which communities actually send you clients?",
    body: "Running a small dev agency. We get clients from a few subreddits and Slack groups but have no idea which ones convert. How are people attributing this without a heavy CRM?",
    reason: "Problem-aware post about attribution; adjacent to our ICP and a natural place to be genuinely helpful first.",
    angle: "Share a lightweight attribution approach; only mention the product if asked.",
    relevance: 71,
    intent: 64,
    urgency: 55,
    fit: 80,
    confidence: 51,
    pains: ["No attribution", "Avoiding heavy CRM"],
    signals: ["how do you", "track", "without a heavy CRM"],
    risks: ["HN frowns on self-promotion — lead with help, disclose if relevant."],
    status: "new",
    saved: false,
    draft: null
  }, {
    id: "l4",
    score: 33,
    tier: "low",
    stage: "research",
    source: "RSS",
    sub: "indiehackers.com",
    author: "maker_jo",
    posted: "3d ago",
    title: "Roundup: 12 tools I tried for client onboarding this year",
    body: "A long blog post listing onboarding tools. Mentions proposals briefly but mostly about contracts and scheduling.",
    reason: "Low intent — a retrospective roundup, not someone actively asking. Weak fit.",
    angle: "Probably skip. No active buying question.",
    relevance: 48,
    intent: 22,
    urgency: 15,
    fit: 40,
    confidence: 44,
    pains: [],
    signals: [],
    risks: [],
    status: "new",
    saved: false,
    draft: null
  }],
  sources: [{
    type: "Reddit",
    name: "r/freelance + r/Upwork",
    meta: "Official API · new · 1w window",
    last: "30m ago",
    on: true
  }, {
    type: "Hacker News",
    name: "HN — proposal software",
    meta: "Algolia search · public",
    last: "2h ago",
    on: true
  }, {
    type: "RSS",
    name: "Indie Hackers feed",
    meta: "Public RSS",
    last: "1d ago",
    on: true
  }, {
    type: "Manual",
    name: "Manual posts",
    meta: "Paste a public URL or text",
    last: "—",
    on: true
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/data.js", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Landing.jsx
try { (() => {
// Landing — LeadParrot marketing page in the Crest aesthetic.
const _DS_LAND = window.CrestDesignSystemLeadParrot_bb3a07;
function Nav() {
  const {
    Button,
    Icon
  } = _DS_LAND;
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 30,
      borderBottom: "1px solid var(--line-2)",
      background: "color-mix(in srgb, var(--paper) 88%, transparent)",
      backdropFilter: "blur(8px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto",
      height: 64,
      display: "flex",
      alignItems: "center",
      gap: "16px",
      padding: "0 32px"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/crest-mark.svg",
    alt: "",
    style: {
      width: 28,
      height: 28
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "20px",
      color: "var(--ink)"
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      fontWeight: 500
    }
  }, "Lead"), "Parrot"), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      gap: "26px",
      marginLeft: "36px"
    }
  }, ["How it works", "Use cases", "Pricing", "Safety"].map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    className: "crest-link",
    href: "#",
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "12px",
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: "var(--ink-2)"
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm"
  }, "Log in"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm"
  }, "Start finding leads")));
}
function Hero() {
  const {
    Button,
    Eyebrow,
    Badge,
    Icon,
    ScoreBadge
  } = _DS_LAND;
  return /*#__PURE__*/React.createElement("section", {
    className: "crest-grain",
    style: {
      position: "relative",
      borderBottom: "1px solid var(--line-2)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "84px 32px 72px",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "9px",
      border: "1px solid var(--line-2)",
      background: "var(--surface)",
      padding: "6px 12px",
      marginBottom: "30px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "999px",
      background: "var(--accent)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: "var(--ink-2)"
    }
  }, "Lead discovery + reply drafts \xB7 No auto-posting")), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 300,
      fontSize: "72px",
      lineHeight: 1.02,
      letterSpacing: "-0.025em",
      color: "var(--ink)",
      margin: 0,
      maxWidth: 880
    }
  }, "Find customers already asking for what you sell."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "19px",
      lineHeight: 1.5,
      color: "var(--ink-2)",
      margin: "26px 0 0",
      maxWidth: 600
    }
  }, "LeadParrot monitors public conversations, scores buyer intent, and drafts helpful replies \u2014 so you show up at the right moment, before your competitors see the thread."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "12px",
      marginTop: "34px"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg"
  }, "Start finding leads"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg",
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 15
    })
  }, "Try demo search")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "60px",
      border: "1px solid var(--line-2)",
      background: "var(--surface)",
      maxWidth: 720
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "12px 18px",
      borderBottom: "1px solid var(--line)"
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "accent",
    solid: true
  }, "Reddit"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "10.5px",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--ink-4)"
    }
  }, "r/agency \xB7 u/agency_ops \xB7 1d ago"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(ScoreBadge, {
    score: 81,
    size: "sm"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 400,
      fontSize: "20px",
      color: "var(--ink)",
      margin: 0
    }
  }, "Frustrated with PandaDoc pricing \u2014 any cheaper alternatives?"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "13px",
      lineHeight: 1.55,
      color: "var(--ink-3)",
      margin: "10px 0 0"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "10.5px",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "var(--accent)",
      marginRight: "8px"
    }
  }, "Why"), "Competitor mention + explicit budget pressure + a decision deadline this week.")))));
}
function Steps() {
  const {
    Eyebrow
  } = _DS_LAND;
  const steps = [{
    n: "01",
    t: "Describe your business",
    b: "Product, ideal customer, keywords, competitors, and negative keywords."
  }, {
    n: "02",
    t: "Pick topics & communities",
    b: "Reddit, Hacker News, RSS, or paste posts manually. Public sources only."
  }, {
    n: "03",
    t: "Get daily high-intent leads",
    b: "AI scores relevance, intent, urgency and fit, then ranks the best."
  }, {
    n: "04",
    t: "Copy a helpful reply draft",
    b: "Review a transparent, non-spammy draft and decide whether to respond."
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "80px 32px"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "How it works"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 300,
      fontSize: "42px",
      letterSpacing: "-0.02em",
      color: "var(--ink)",
      margin: "16px 0 40px",
      maxWidth: 620
    }
  }, "From public conversation to helpful reply, in one place."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      border: "1px solid var(--line-2)",
      background: "var(--line-2)",
      gap: "1px"
    }
  }, steps.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.n,
    style: {
      background: "var(--surface)",
      padding: "28px 24px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "12px",
      letterSpacing: "0.1em",
      color: "var(--accent)"
    }
  }, s.n), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 400,
      fontSize: "20px",
      color: "var(--ink)",
      margin: "20px 0 0"
    }
  }, s.t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "13px",
      lineHeight: 1.55,
      color: "var(--ink-3)",
      margin: "10px 0 0"
    }
  }, s.b)))));
}
function UseCases() {
  const {
    Eyebrow,
    Icon
  } = _DS_LAND;
  const cases = [{
    i: "rocket",
    t: "SaaS founders",
    b: "Catch people comparing tools or asking for alternatives to your competitors."
  }, {
    i: "users",
    t: "Agencies",
    b: "Find businesses publicly asking for the exact services you deliver."
  }, {
    i: "lightbulb",
    t: "Consultants",
    b: "Spot problem-aware posts where your expertise is the answer."
  }, {
    i: "boxes",
    t: "B2B services",
    b: "Surface buying-intent threads in niche communities you can't watch all day."
  }, {
    i: "bot",
    t: "AI tools",
    b: "Be first to helpful workflows people are trying to automate."
  }, {
    i: "compass",
    t: "Niche services",
    b: "Monitor the handful of forums where your customers actually hang out."
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      borderTop: "1px solid var(--line-2)",
      borderBottom: "1px solid var(--line-2)",
      background: "var(--paper-sunk)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "80px 32px"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    tone: "accent"
  }, "Who it's for"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 300,
      fontSize: "42px",
      letterSpacing: "-0.02em",
      color: "var(--ink)",
      margin: "16px 0 40px",
      maxWidth: 640
    }
  }, "Built for people who sell by being helpful."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "16px"
    }
  }, cases.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.t,
    style: {
      background: "var(--surface)",
      border: "1px solid var(--line-2)",
      padding: "24px"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: c.i,
    size: 20,
    color: "var(--accent)"
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 400,
      fontSize: "19px",
      color: "var(--ink)",
      margin: "16px 0 0"
    }
  }, c.t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "13px",
      lineHeight: 1.55,
      color: "var(--ink-3)",
      margin: "9px 0 0"
    }
  }, c.b))))));
}
function Pricing() {
  const {
    Eyebrow,
    Button,
    Badge,
    Icon
  } = _DS_LAND;
  const plans = [{
    name: "Free",
    price: 0,
    tag: "Validate the workflow with one project.",
    feats: ["1 project", "Manual source", "20 scanned posts / mo", "10 reply drafts / mo"],
    hi: false
  }, {
    name: "Starter",
    price: 19,
    tag: "For solo founders finding their first leads.",
    feats: ["3 projects", "Reddit, HN, RSS + manual", "500 scanned posts / mo", "Daily digest email"],
    hi: false
  }, {
    name: "Pro",
    price: 49,
    tag: "For consultants scaling outreach.",
    feats: ["10 projects", "3,000 scanned posts / mo", "1,000 reply drafts / mo", "Advanced filters"],
    hi: true
  }, {
    name: "Agency",
    price: 99,
    tag: "For agencies managing clients.",
    feats: ["25 projects", "10,000 scanned posts / mo", "Multi-client workspace", "White-label digest"],
    hi: false
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "80px 32px"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Pricing"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 300,
      fontSize: "42px",
      letterSpacing: "-0.02em",
      color: "var(--ink)",
      margin: "16px 0 40px"
    }
  }, "Simple, founder-friendly pricing."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      border: "1px solid var(--line-2)",
      background: "var(--line-2)",
      gap: "1px"
    }
  }, plans.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.name,
    style: {
      background: p.hi ? "var(--ink)" : "var(--surface)",
      padding: "28px 24px",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "16px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "12px",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: p.hi ? "var(--paper)" : "var(--ink-2)"
    }
  }, p.name), p.hi && /*#__PURE__*/React.createElement(Badge, {
    tone: "accent",
    solid: true
  }, "Popular")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: "4px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 300,
      fontSize: "48px",
      letterSpacing: "-0.02em",
      color: p.hi ? "var(--paper)" : "var(--ink)"
    }
  }, "$", p.price), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      color: p.hi ? "var(--paper-sunk)" : "var(--ink-4)"
    }
  }, "/mo")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "12.5px",
      lineHeight: 1.45,
      color: p.hi ? "var(--paper-sunk)" : "var(--ink-3)",
      margin: "10px 0 18px",
      minHeight: 34
    }
  }, p.tag), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "9px",
      flex: 1,
      marginBottom: "20px"
    }
  }, p.feats.map(f => /*#__PURE__*/React.createElement("div", {
    key: f,
    style: {
      display: "flex",
      gap: "8px",
      fontFamily: "var(--font-sans)",
      fontSize: "13px",
      color: p.hi ? "var(--paper)" : "var(--ink-2)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--accent-soft)",
      fontFamily: "var(--font-mono)"
    }
  }, "\u2713"), f))), /*#__PURE__*/React.createElement("button", {
    className: p.hi ? "crest-btn crest-btn--primary" : "crest-btn crest-btn--secondary",
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: 500,
      fontSize: "12px",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      padding: "10px 18px",
      cursor: "pointer",
      background: p.hi ? "var(--accent)" : "transparent",
      color: p.hi ? "var(--on-accent)" : "var(--paper)",
      border: `1px solid ${p.hi ? "var(--accent)" : "var(--paper)"}`
    }
  }, p.price === 0 ? "Start free" : `Choose ${p.name}`)))));
}
function SafetyBlock() {
  const {
    Eyebrow,
    Notice
  } = _DS_LAND;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      borderTop: "1px solid var(--line-2)",
      background: "var(--accent)",
      color: "var(--on-accent)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "crest-grain",
    style: {
      position: "relative",
      maxWidth: 1200,
      margin: "0 auto",
      padding: "72px 32px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "12px",
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "var(--accent-tint)"
    }
  }, "Platform-safe by design"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 300,
      fontSize: "44px",
      letterSpacing: "-0.02em",
      color: "var(--on-accent)",
      margin: "18px 0 0",
      maxWidth: 760
    }
  }, "No auto-posting. No auto-DMs. You stay in control."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "16px",
      lineHeight: 1.6,
      color: "var(--accent-tint)",
      margin: "18px 0 0",
      maxWidth: 620
    }
  }, "LeadParrot is a discovery and drafting tool \u2014 not an automation bot. We use official APIs and public feeds, respect platform rules and rate limits, and never message anyone on your behalf. Every reply is reviewed and posted by you.")));
}
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: "1px solid var(--line-2)",
      background: "var(--surface)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "32px",
      display: "flex",
      alignItems: "center",
      gap: "16px",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/crest-mark-outline.svg",
    alt: "",
    style: {
      width: 24,
      height: 24
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--ink-3)"
    }
  }, "\xA9 2026 LeadParrot"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--ink-4)"
    }
  }, "No auto-posting \xB7 No auto-DMs \xB7 Official APIs only")));
}
function Landing() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--paper)"
    }
  }, /*#__PURE__*/React.createElement(Nav, null), /*#__PURE__*/React.createElement(Hero, null), /*#__PURE__*/React.createElement(Steps, null), /*#__PURE__*/React.createElement(UseCases, null), /*#__PURE__*/React.createElement(Pricing, null), /*#__PURE__*/React.createElement(SafetyBlock, null), /*#__PURE__*/React.createElement(Footer, null));
}
Object.assign(window, {
  Landing
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Landing.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Meter = __ds_scope.Meter;

__ds_ns.ScoreBadge = __ds_scope.ScoreBadge;

__ds_ns.ScoreBars = __ds_scope.ScoreBars;

__ds_ns.Notice = __ds_scope.Notice;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Bento = __ds_scope.Bento;

__ds_ns.BentoItem = __ds_scope.BentoItem;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Stat = __ds_scope.Stat;

__ds_ns.ActionButton = __ds_scope.ActionButton;

__ds_ns.LeadDetailCard = __ds_scope.LeadDetailCard;

__ds_ns.TypographySpecimen = __ds_scope.TypographySpecimen;

})();
