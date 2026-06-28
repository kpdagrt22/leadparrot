/* ============================================================
   THE LEADS NEST — Mobile prototype logic
   Navigator (push/pop/tab) + screens + events. Vanilla.
   ============================================================ */
(function () {
  "use strict";

  /* ---------------- data ---------------- */
  var DATA = {
    org: { name: "Acme Proposals", plan: "Starter", initials: "AP", user: "Maya Okafor", handle: "maya@acme.co" },
    stats: { total: 248, high: 41, avg: 63, copied: 29 },
    usage: { posts: [342, 500], replies: [88, 100], projects: [2, 3] },
    keywords: ["proposal tool", "client proposal", "Upwork proposal", "freelance proposal"],
    leads: [
      { id: "l1", score: 81, tier: "high", source: "Reddit", badge: "", sub: "r/agency", author: "u/agency_ops", posted: "1d", stage: "competitor-switching", saved: false,
        title: "Frustrated with PandaDoc pricing — any cheaper alternatives?",
        body: "We've been using PandaDoc but the per-seat pricing is getting expensive as our agency grows. Anyone switched to something cheaper that still does proposals and contracts well? Need to decide this week.",
        relevance: 88, intent: 82, urgency: 75, fit: 70, confidence: 62,
        reason: "Mentions a competitor (PandaDoc) and explicit budget pressure, with strong buying signals and a near-term decision deadline.",
        angle: "Acknowledge the pricing frustration, share one concrete way to cut proposal time, then mention Acme with disclosure.",
        signals: ["frustrated with", "alternative", "decide this week"], pains: ["Cost / pricing", "Outgrowing tool"],
        draft: "Totally get the PandaDoc pricing pain as you add seats. One thing that helped us before switching anything: standardise 2–3 proposal templates so you're not rebuilding each one — that alone cut our prep time a lot. I'm building a small proposal tool in this space (Acme Proposals) — happy to share if it's useful, no pressure.",
        disclosure: "I'm building a small proposal tool in this space (Acme Proposals) — sharing because it's relevant, not to pitch." },
      { id: "l3", score: 74, tier: "high", source: "Hacker News", badge: "info", sub: "Ask HN", author: "swyx_builds", posted: "2d", stage: "problem-aware", saved: false,
        title: "Ask HN: how do you track which communities actually send you clients?",
        body: "Running a small dev agency. We get clients from a few subreddits and Slack groups but have no idea which ones convert. How are people attributing this without a heavy CRM?",
        relevance: 71, intent: 64, urgency: 55, fit: 80, confidence: 51,
        reason: "Problem-aware post about attribution; adjacent to our ICP and a natural place to be genuinely helpful first.",
        angle: "Share a lightweight attribution approach; only mention the product if asked.",
        signals: ["how do you", "track", "without a heavy CRM"], pains: ["No attribution", "Avoiding heavy CRM"], draft: null },
      { id: "l2", score: 69, tier: "med", source: "Reddit", badge: "", sub: "r/freelance", author: "u/design_freelance", posted: "1d", stage: "solution-aware", saved: true,
        title: "Looking for a proposal tool — anything better than Word?",
        body: "I'm a freelance designer sending 5–10 client proposals a month. Writing them in Word is painful. Looking for a proposal tool that handles templates and e-signatures. Budget is flexible if it saves time.",
        relevance: 84, intent: 68, urgency: 40, fit: 72, confidence: 58,
        reason: "Freelancer explicitly looking for a proposal tool with templates and e-signatures; flexible budget signals real intent.",
        angle: "Lead with a concrete tip on reusable templates, then mention Acme lightly with disclosure.",
        signals: ["looking for", "recommend", "budget is flexible"], pains: ["Manual workflow", "Wants e-sign"], draft: null },
      { id: "l4", score: 33, tier: "low", source: "RSS", badge: "gray", sub: "indiehackers", author: "maker_jo", posted: "3d", stage: "research", saved: false,
        title: "Roundup: 12 tools I tried for client onboarding this year",
        body: "A long blog post listing onboarding tools. Mentions proposals briefly but mostly about contracts and scheduling.",
        relevance: 48, intent: 22, urgency: 15, fit: 40, confidence: 44,
        reason: "Low intent — a retrospective roundup, not someone actively asking. Weak fit.",
        angle: "Probably skip. No active buying question.", signals: [], pains: [], draft: null }
    ],
    sources: [
      { type: "Reddit", meta: "Official API · 30m ago", name: "r/freelance, r/agency, r/Upwork", on: true },
      { type: "Hacker News", meta: "Algolia search · 2h ago", name: "\u201cproposal software\u201d", on: true },
      { type: "RSS", meta: "Public feed · 1d ago", name: "indiehackers.com/feed", on: true },
      { type: "Manual", meta: "Paste a public URL", name: "Manual posts", on: false }
    ],
    projects: [
      { name: "Proposal tool — Reddit + HN", status: "Active", sources: 4, leads: 248 },
      { name: "Contract e-sign — niche forums", status: "Active", sources: 2, leads: 96 },
      { name: "Onboarding flows — draft", status: "Paused", sources: 0, leads: 0 }
    ]
  };
  var saved = {}, setTog = { digest: true, weekly: false };
  function isSaved(l) { return l.id in saved ? saved[l.id] : l.saved; }
  function lead(id) { return DATA.leads.filter(function (l) { return l.id === id; })[0]; }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function countUp(n, rm) {
    var target = parseFloat(n.getAttribute("data-count")); if (isNaN(target)) return;
    if (rm) { n.textContent = Math.round(target).toLocaleString(); return; }
    var dur = 720, t0 = null;
    function step(ts) { if (!t0) t0 = ts; var p = Math.min((ts - t0) / dur, 1); var e = 1 - Math.pow(1 - p, 3); n.textContent = Math.round(target * e).toLocaleString(); if (p < 1) requestAnimationFrame(step); else n.textContent = Math.round(target).toLocaleString(); }
    requestAnimationFrame(step);
  }

  /* ---------------- chrome helpers ---------------- */
  function icon(name, sz) { return '<i data-lucide="' + name + '"' + (sz ? ' style="width:' + sz + 'px;height:' + sz + 'px"' : '') + '></i>'; }
  function badge(l) { return '<span class="m-badge ' + (l.badge || "") + '">' + l.source + '</span>'; }
  function tierColor(t) { return t === "high" ? "var(--accent)" : t === "med" ? "var(--medium)" : "var(--low)"; }
  function tierCls(t) { return t === "med" ? " med" : t === "low" ? " low" : ""; }

  function tabbar(active) {
    var t = [["home", "home", "Home"], ["inbox", "inbox", "Inbox"], ["sources", "radio", "Sources"], ["settings", "settings", "Settings"]];
    return '<div class="tabbar">' + t.map(function (x) {
      return '<a data-tab="' + x[0] + '" class="' + (active === x[0] ? "on" : "") + '"><span class="tdot"></span>' + icon(x[1], 20) + '<span class="tl">' + x[2] + '</span></a>';
    }).join("") + '</div>';
  }

  function leadRow(l) {
    return '<div class="m-lead" data-open-lead="' + l.id + '"><div class="lscore' + tierCls(l.tier) + '">' + l.score + '</div>' +
      '<div style="min-width:0"><div class="lmeta">' + badge(l) + '<span>' + esc(l.sub) + ' · ' + l.posted + '</span></div>' +
      '<div class="ltitle">' + esc(l.title) + '</div></div></div>';
  }
  function meter(label, pair) {
    var pct = Math.min(100, pair[0] / pair[1] * 100), warn = pct >= 90 ? " warn" : "";
    return '<div class="m-meter"><div class="mh"><span class="ml">' + label + '</span><span class="mv">' + pair[0] + ' <span class="dim">/ ' + pair[1] + '</span></span></div>' +
      '<div class="mt"><div class="mf' + warn + '" style="width:0" data-fill="' + pct + '"></div></div></div>';
  }
  function sbar(label, w, v) {
    return '<div class="m-sbar"><div class="sh"><span class="sl2">' + label + '<em>· ' + w + '</em></span><span class="sv2">' + v + '</span></div><div class="st"><div class="sf" style="width:0" data-fill="' + v + '"></div></div></div>';
  }
  function ring(score) {
    var c = 2 * Math.PI * 36, off = c * (1 - score / 100);
    return '<div class="ring"><svg width="84" height="84" viewBox="0 0 84 84">' +
      '<circle class="rt-bg" cx="42" cy="42" r="36" fill="none" stroke-width="5"/>' +
      '<circle class="rt-fg" cx="42" cy="42" r="36" fill="none" stroke-width="5" stroke-dasharray="' + c + '" stroke-dashoffset="' + c + '" data-ring-off="' + off + '"/>' +
      '</svg><div class="rnum"><b data-count="' + score + '">' + score + '</b></div></div>';
  }

  /* ---------------- SCREENS ---------------- */
  var SCREENS = {};

  SCREENS.splash = function () {
    return { dark: true, status: "dark", noIndicator: true, body:
      '<div class="scr-inner" style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center">' +
      '<svg class="smk" viewBox="0 0 48 48"><path d="M12 30 L24 16 L36 30"/><path class="p2" d="M18 35 L24 28 L30 35"/></svg>' +
      '<div class="sw">The Leads <b>Nest</b></div><div class="scap">Calibrating intent radar</div></div>',
      rootClass: "splash",
      onMount: function () { setTimeout(function () { go("onboarding", {}, "fade"); }, 1750); } };
  };

  SCREENS.onboarding = function () {
    function obar(label, w, v) { return '<div class="m-sbar"><div class="sh"><span class="sl2">' + label + '<em>· ' + w + '</em></span><span class="sv2">' + v + '</span></div><div class="st"><div class="sf" style="width:0" data-fill="' + v + '"></div></div></div>'; }
    function ocheck(t) { return '<div class="ocheck">' + icon("check", 14) + '<span>' + t + '</span></div>'; }
    var slides = [
      { eb: "01 · Discover", h: 'Find customers already <span class="accent">asking.</span>', p: "We watch public conversations on Reddit, Hacker News and RSS for people describing the problem you solve.",
        hero: '<div class="onb-radar"><span class="orr" style="width:96px;height:96px"></span><span class="orr" style="width:164px;height:164px"></span><span class="orr" style="width:232px;height:232px"></span><span class="osweep"></span>' +
          '<div class="ochip"><div class="lmeta"><span class="m-badge">Reddit</span><span>r/agency · 1d</span></div><div class="ltitle">Frustrated with PandaDoc pricing — any alternatives?</div><span class="oscore">81</span></div></div>' },
      { eb: "02 · Score", h: 'Ranked by <span class="accent">real intent.</span>', p: "Relevance, intent, urgency and fit — one transparent score, so you act on the right threads first.",
        hero: '<div class="onb-score">' + ring(81) + '<div class="obars">' + obar("Relevance", "35%", 88) + obar("Intent", "30%", 82) + obar("Urgency", "20%", 75) + obar("Fit", "15%", 70) + '</div></div>' },
      { eb: "03 · Safe", h: 'You post. <span class="accent">Never us.</span>', p: "We draft a disclosed reply you review and send yourself — no auto-posting, no auto-DMs, official APIs only.",
        hero: '<div class="onb-safe"><div class="oshield">' + icon("shield-check", 40) + '</div><div class="ochecks">' + ocheck("Official APIs only") + ocheck("No auto-posting, ever") + ocheck("Disclosure in every draft") + '</div></div>' }
    ];
    return { status: "light", rootClass: "onb", noBody: true, body:
      '<div class="onb-top"><span class="onb-logo"><img src="assets/crest-mark.svg" alt=""/><span>The Leads <b>Nest</b></span></span><a class="onb-skip" data-go="signup">Skip</a></div>' +
      '<div class="onb-pager" id="onbPager">' + slides.map(function (s) {
        return '<div class="onb-slide"><div class="ohero">' + s.hero + '</div>' +
          '<span class="eyebrow-m accent">' + s.eb + '</span>' +
          '<h2 style="margin-top:12px">' + s.h + '</h2><p>' + s.p + '</p></div>';
      }).join("") + '</div>' +
      '<div class="onb-foot"><div class="onb-trust">Trusted by 1,200+ founder-led teams · Official APIs only</div>' +
        '<div class="dots" id="onbDots">' + slides.map(function (_, i) { return '<i class="' + (i === 0 ? "on" : "") + '"></i>'; }).join("") + '</div>' +
        '<button class="m-btn" data-go="signup">Get started</button>' +
        '<div style="text-align:center;margin-top:14px"><a class="lnk" data-go="login" style="font-family:var(--font-mono);font-size:11px;letter-spacing:0.04em;text-transform:uppercase;color:var(--ink-3)">I already have an account</a></div></div>',
      onMount: function (el) {
        var pager = el.querySelector("#onbPager"), dots = el.querySelectorAll("#onbDots i");
        pager.addEventListener("scroll", function () {
          var i = Math.round(pager.scrollLeft / pager.clientWidth);
          dots.forEach(function (d, idx) { d.classList.toggle("on", idx === i); });
        }, { passive: true });
        setTimeout(function () {
          el.querySelectorAll("[data-fill]").forEach(function (b, k) { setTimeout(function () { b.style.width = b.getAttribute("data-fill") + "%"; }, k * 130); });
          var os = el.querySelector(".oscore"); if (os) os.classList.add("pop");
        }, 420);
        if (window.lucide) window.lucide.createIcons();
      } };
  };

  SCREENS.login = function () {
    return { status: "light", topbar: backbar("Log in"), body:
      '<div style="padding-top:6px"><h1 class="h-display" style="font-size:30px">Welcome back</h1>' +
      '<p style="font-family:var(--font-sans);font-size:14px;color:var(--ink-3);margin:10px 0 26px">Log in to your nest.</p>' +
      googleBtn("Continue with Google") + '<div class="m-divider"><span>or</span></div>' +
      '<div class="m-field"><label>Email</label><input type="email" value="maya@acme.co" inputmode="email"/></div>' +
      '<div class="m-field"><label>Password</label><input type="password" value="123456789"/></div>' +
      '<button class="m-btn" data-auth style="margin-top:6px">Log in</button>' +
      '<div style="text-align:center;margin-top:20px;font-family:var(--font-sans);font-size:13px;color:var(--ink-3)">New here? <a data-go="signup" style="color:var(--accent)">Create an account</a></div></div>' };
  };

  SCREENS.signup = function () {
    return { status: "light", topbar: backbar("Start free"), body:
      '<div style="padding-top:6px"><h1 class="h-display" style="font-size:28px">Create your account</h1>' +
      '<p style="font-family:var(--font-sans);font-size:14px;color:var(--ink-3);margin:10px 0 24px">No card required. Demo workspace from minute one.</p>' +
      googleBtn("Sign up with Google") + '<div class="m-divider"><span>or</span></div>' +
      '<div class="m-field"><label>Full name</label><input type="text" value="Maya Okafor"/></div>' +
      '<div class="m-field"><label>Work email</label><input type="email" value="maya@acme.co"/></div>' +
      '<div class="m-field"><label>Password</label><input type="password" value="123456789"/></div>' +
      '<div style="display:flex;gap:10px;align-items:flex-start;margin:2px 0 16px"><span class="m-sw" style="width:42px;transform:scale(.8);transform-origin:left" data-static></span>' +
        '<span style="font-family:var(--font-sans);font-size:12px;line-height:1.45;color:var(--ink-3)">I\'ll review and post replies myself, with disclosure.</span></div>' +
      '<button class="m-btn" data-auth>Create free account</button>' +
      '<div style="text-align:center;margin-top:20px;font-family:var(--font-sans);font-size:13px;color:var(--ink-3)">Have an account? <a data-go="login" style="color:var(--accent)">Log in</a></div></div>' };
  };

  SCREENS.home = function () {
    var s = DATA.stats, recent = DATA.leads.filter(function (l) { return l.tier === "high"; });
    return { status: "light", tab: "home", fab: '<button class="fab" data-scan>' + icon("scan-line", 22) + '</button>',
      topbar: '<div style="display:flex;align-items:center;gap:11px;width:100%">' +
        '<span class="m-av acc" style="width:34px;height:34px;font-size:13px">' + DATA.org.initials + '</span>' +
        '<div style="flex:1;min-width:0"><div style="font-family:var(--font-display);font-size:18px;color:var(--ink);line-height:1">' + DATA.org.name + '</div>' +
        '<div style="font-family:var(--font-mono);font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-4);margin-top:2px">' + DATA.org.plan + ' plan</div></div>' +
        '<button class="iconbtn" data-go="digest">' + icon("bell", 16) + '</button></div>',
      body:
      '<span class="eyebrow-m">Good morning, Maya</span>' +
      '<h1 class="h-display" style="font-size:27px;margin-top:12px">' + s.high + ' leads worth a look.</h1>' +
      '<div class="m-notice caution" style="margin:18px 0"><span style="color:var(--medium);flex:0 0 auto">' + icon("shield-check", 16) + '</span><div><div class="nt">Platform safety</div><p>We draft replies — you review and post them yourself.</p></div></div>' +
      '<div class="stat-row" style="margin-bottom:18px">' +
        '<div class="stat-cell"><div class="sl">Total leads</div><div class="sv" data-count="' + s.total + '">' + s.total + '</div><div class="sh">▲ 12 this week</div></div>' +
        '<div class="stat-cell"><div class="sl">High-intent</div><div class="sv" data-count="' + s.high + '">' + s.high + '</div><div class="sh">score ≥ 70</div></div>' +
        '<div class="stat-cell ink"><div class="sl">Avg score</div><div class="sv" data-count="' + s.avg + '">' + s.avg + '</div></div>' +
        '<div class="stat-cell acc"><div class="sl">Replies copied</div><div class="sv" data-count="' + s.copied + '">' + s.copied + '</div></div>' +
      '</div>' +
      '<div style="display:flex;gap:8px;margin-bottom:22px">' +
        chip("projects", "folder-kanban", "Projects") + chip("sources", "radio", "Sources") + chip("digest", "mail", "Digest") + '</div>' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">' +
        '<span class="eyebrow-m accent">Recent high-intent</span><a data-tab="inbox" style="font-family:var(--font-mono);font-size:10px;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink-3)">All →</a></div>' +
      recent.map(leadRow).join("") +
      '<div style="margin-top:20px"><span class="eyebrow-m">This month</span><div class="m-card" style="margin-top:10px">' +
        meter("Posts scanned", DATA.usage.posts) + meter("Reply drafts", DATA.usage.replies) + '</div></div>' };
  };

  SCREENS.inbox = function (p) {
    var seg = p.seg || "high";
    var counts = { all: DATA.leads.length, high: DATA.leads.filter(function (l) { return l.tier === "high"; }).length, saved: DATA.leads.filter(isSaved).length };
    var list = DATA.leads.filter(function (l) { return seg === "all" ? true : seg === "high" ? l.tier === "high" : isSaved(l); });
    function sb(id, label, c) { return '<button data-seg="' + id + '" class="' + (seg === id ? "on" : "") + '">' + label + ' <span class="c">' + c + '</span></button>'; }
    return { status: "light", tab: "inbox",
      topbar: '<div class="tb-title">Lead inbox</div><div class="spacer"></div><button class="iconbtn" data-scan>' + icon("scan-line", 16) + '</button>',
      body:
      '<div class="m-search" style="margin-bottom:14px">' + icon("search", 15) + '<input placeholder="Search leads, keywords…"/></div>' +
      '<div class="seg" style="margin-bottom:6px">' + sb("all", "All", counts.all) + sb("high", "High", counts.high) + sb("saved", "Saved", counts.saved) + '</div>' +
      '<div style="font-family:var(--font-mono);font-size:10px;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink-4);margin:14px 0 2px">' + list.length + ' shown</div>' +
      (list.length ? list.map(leadRow).join("") : '<div style="padding:40px 0;text-align:center;font-family:var(--font-sans);font-size:14px;color:var(--ink-3)">Nothing here yet.</div>') };
  };

  SCREENS.lead = function (p) {
    var l = lead(p.id) || DATA.leads[0], sv = isSaved(l), d = l.draft;
    return { status: "light", topbar: backbar(l.source + " · " + l.sub),
      body:
      '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">' +
        '<span class="m-badge ' + (l.badge || "") + '">' + l.source + '</span><span class="m-badge gray">' + l.stage.replace(/-/g, " ") + '</span>' +
        '<span style="font-family:var(--font-mono);font-size:9px;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink-4)">' + l.posted + ' ago</span></div>' +
      '<h1 class="h-display" style="font-size:24px;line-height:1.18">' + esc(l.title) + '</h1>' +
      '<div class="ring-wrap" style="margin:18px 0"><div>' + ring(l.score) + '</div>' +
        '<div><div class="eyebrow-m bare" style="color:' + tierColor(l.tier) + '">' + (l.tier === "high" ? "High intent" : l.tier === "med" ? "Medium" : "Low") + '</div>' +
        '<div style="font-family:var(--font-mono);font-size:10px;letter-spacing:0.04em;color:var(--ink-4);margin-top:6px">' + l.confidence + '% confidence</div></div></div>' +
      '<div class="m-card"><div style="display:flex;align-items:center;gap:9px;margin-bottom:12px"><span class="m-av soft" style="width:28px;height:28px;font-size:10px">' + l.author.replace(/^u\//, "").slice(0, 2).toUpperCase() + '</span>' +
        '<span style="font-family:var(--font-mono);font-size:11px;color:var(--ink-2)">' + esc(l.author) + '</span></div>' +
        '<p style="font-family:var(--font-sans);font-size:14px;line-height:1.6;color:var(--ink);margin:0">' + esc(l.body) + '</p></div>' +
      '<div style="margin:18px 0 8px"><span class="eyebrow-m accent">Reply draft</span></div>' +
      (d ?
        '<div class="draft">' + esc(d) + '</div>' +
        '<button class="m-btn" data-copy style="margin-top:12px">' + icon("clipboard", 13) + ' Copy reply</button>' +
        '<div class="m-notice accent" style="margin-top:12px"><span style="color:var(--accent);flex:0 0 auto">' + icon("pen-line", 15) + '</span><div><div class="nt">Suggested disclosure</div><p>' + esc(l.disclosure) + '</p></div></div>' +
        '<div class="m-notice caution" style="margin-top:10px"><span style="color:var(--medium);flex:0 0 auto">' + icon("shield-check", 15) + '</span><div><div class="nt">Before you post</div><ul><li>Disclose your affiliation first.</li><li>Personalise — don\'t reuse across threads.</li><li>Check the community\'s rules.</li></ul></div></div>'
        : '<button class="m-btn" data-gen>' + icon("sparkles", 13) + ' Generate reply</button>' +
          '<p style="font-family:var(--font-sans);font-size:13px;line-height:1.55;color:var(--ink-3);margin:12px 0 0">A helpful, transparent draft you review and copy. The Leads Nest never posts for you.</p>') +
      '<div style="margin:20px 0 8px"><span class="eyebrow-m">AI score breakdown</span></div>' +
      '<div class="m-card">' + sbar("Relevance", "35%", l.relevance) + sbar("Intent", "30%", l.intent) + sbar("Urgency", "20%", l.urgency) + sbar("Fit", "15%", l.fit) + '</div>' +
      (l.signals.length ? '<div style="margin:18px 0 8px"><span class="eyebrow-m">Why it\'s a lead</span></div>' +
        '<p style="font-family:var(--font-sans);font-size:13px;line-height:1.55;color:var(--ink-2)">' + esc(l.reason) + '</p>' +
        '<div class="m-tags" style="margin-top:12px">' + l.signals.map(function (x) { return '<span class="m-tag">' + esc(x) + '</span>'; }).join("") + '</div>' : "") +
      '<div style="display:flex;gap:10px;margin-top:22px">' +
        '<button class="m-btn ' + (sv ? "" : "ghost") + '" data-save>' + icon("bookmark", 13) + ' ' + (sv ? "Saved" : "Save") + '</button>' +
        '<button class="m-btn danger" data-back>Not a lead</button></div>' };
  };

  SCREENS.sources = function () {
    return { status: "light", tab: "sources",
      topbar: '<div class="tb-title">Sources</div><div class="spacer"></div><button class="iconbtn" data-toast="Add a public source">' + icon("plus", 16) + '</button>',
      body:
      '<div class="m-notice accent" style="margin-bottom:16px"><span style="color:var(--accent);flex:0 0 auto">' + icon("shield-check", 15) + '</span><div><div class="nt">Public sources only</div><p>Official APIs and public feeds. No scraping, no logged-in pages.</p></div></div>' +
      DATA.sources.map(function (s, i) {
        return '<div class="m-row"><div class="grow"><div class="rs2"><span class="m-badge ' + (s.on ? "tint" : "gray") + '">' + s.type + '</span> ' + esc(s.meta) + '</div>' +
          '<div class="rt2" style="font-size:15px">' + esc(s.name) + '</div></div><span class="m-sw' + (s.on ? "" : " off") + '" data-toggle-src="' + i + '"></span></div>';
      }).join("") };
  };

  SCREENS.projects = function () {
    return { status: "light", topbar: backbar("Projects"),
      body: '<span class="eyebrow-m">2 of 3 active</span><div style="margin-top:14px">' +
      DATA.projects.map(function (p) {
        var paused = p.status === "Paused";
        return '<div class="m-row"' + (paused ? ' style="opacity:.6"' : "") + '><div class="grow"><div class="rs2"><span class="m-badge ' + (paused ? "gray" : "tint") + '">' + p.status + '</span> ' + p.sources + ' sources · ' + p.leads + ' leads</div>' +
          '<div class="rt2">' + esc(p.name) + '</div></div>' + icon("chevron-right", 16) + '</div>';
      }).join("") + '</div>' +
      '<button class="m-btn ghost" data-toast="New project" style="margin-top:18px">' + icon("plus", 14) + ' New project</button>' };
  };

  SCREENS.digest = function () {
    var top = DATA.leads.filter(function (l) { return l.tier !== "low"; });
    return { status: "light", topbar: backbar("Daily digest"),
      body: '<span class="eyebrow-m accent">Sent 7:00 AM</span><h1 class="h-display" style="font-size:24px;margin-top:12px">' + top.length + ' high-intent leads today</h1>' +
      '<div style="font-family:var(--font-mono);font-size:10px;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink-4);margin:8px 0 18px">digest@theleadsnest.com</div>' +
      top.map(leadRow).join("") +
      '<button class="m-btn ghost" data-go="settings" style="margin-top:20px">Digest settings</button>' };
  };

  SCREENS.settings = function () {
    return { status: "light", tab: "settings",
      topbar: '<div class="tb-title">Settings</div>',
      body:
      '<div class="m-row" data-go="profile" style="border-top:1px solid var(--line)"><span class="m-av acc" style="width:44px;height:44px;font-size:15px">' + DATA.org.initials + '</span>' +
        '<div class="grow"><div class="rt2">' + DATA.org.user + '</div><div style="font-family:var(--font-mono);font-size:10px;color:var(--ink-4);margin-top:3px">' + DATA.org.handle + '</div></div>' + icon("chevron-right", 16) + '</div>' +
      '<div style="margin:22px 0 8px"><span class="eyebrow-m">Workspace</span></div>' +
      '<div class="m-field"><label>Workspace name</label><input value="Acme Proposals"/></div>' +
      '<div class="m-field"><label>Plan</label><input value="Starter — $19 / mo" readonly/></div>' +
      '<div style="margin:18px 0 4px"><span class="eyebrow-m">Notifications</span></div>' +
      '<div class="m-row"><div class="grow"><div class="rt2" style="font-size:14px">Daily digest email</div><div style="font-family:var(--font-mono);font-size:9px;letter-spacing:0.04em;text-transform:uppercase;color:var(--ink-4);margin-top:3px">7:00 AM · your timezone</div></div><span class="m-sw' + (setTog.digest ? "" : " off") + '" data-toggle-set="digest"></span></div>' +
      '<div class="m-row"><div class="grow"><div class="rt2" style="font-size:14px">Weekly summary</div><div style="font-family:var(--font-mono);font-size:9px;letter-spacing:0.04em;text-transform:uppercase;color:var(--ink-4);margin-top:3px">Mondays · top movers</div></div><span class="m-sw' + (setTog.weekly ? "" : " off") + '" data-toggle-set="weekly"></span></div>' +
      '<div class="m-row"><div class="grow"><div class="rt2" style="font-size:14px">Auto-post replies</div><div style="font-family:var(--font-mono);font-size:9px;letter-spacing:0.04em;text-transform:uppercase;color:var(--ink-4);margin-top:3px">Disabled by design</div></div><span class="m-sw off" style="opacity:.5"></span></div>' +
      '<div style="margin:18px 0 4px"><span class="eyebrow-m">Support</span></div>' +
      '<div class="m-row" data-go="help"><div class="grow"><div class="rt2" style="font-size:14px">Help & Feedback</div><div style="font-family:var(--font-mono);font-size:9px;letter-spacing:0.04em;text-transform:uppercase;color:var(--ink-4);margin-top:3px">Raise a ticket · send feedback</div></div>' + icon("chevron-right", 16) + '</div>' +
      '<button class="m-btn ghost" data-logout style="margin-top:22px">Log out</button>' };
  };

  SCREENS.profile = function () {
    return { status: "light", topbar: backbar("Profile"),
      body: '<div style="display:flex;flex-direction:column;align-items:center;text-align:center;padding:10px 0 20px">' +
        '<span class="m-av acc" style="width:74px;height:74px;font-size:26px;border-radius:3px">' + DATA.org.initials + '</span>' +
        '<div class="h-display" style="font-size:24px;margin-top:14px">' + DATA.org.user + '</div>' +
        '<div style="font-family:var(--font-mono);font-size:11px;color:var(--ink-4);margin-top:5px">' + DATA.org.handle + '</div></div>' +
      '<div class="stat-row"><div class="stat-cell"><div class="sl">Leads found</div><div class="sv" data-count="248">248</div></div><div class="stat-cell"><div class="sl">Replies sent</div><div class="sv" data-count="29">29</div></div></div>' +
      '<div style="margin:20px 0 8px"><span class="eyebrow-m">Watched keywords</span></div>' +
      '<div class="m-tags">' + DATA.keywords.map(function (k) { return '<span class="m-tag">' + esc(k) + '</span>'; }).join("") + '</div>' +
      '<button class="m-btn ghost" data-back style="margin-top:24px">Done</button>' };
  };

  /* ---------------- support / feedback (Phase 11 prototype) ---------------- */
  var TICKETS = [
    { id: "t1", type: "bug", status: "in_progress", subject: "Score badge clips on small screens", body: "On my phone the score badge overlaps the title when the subject is long.", when: "2d", thread: [{ who: "you", body: "Happens on iOS Safari specifically." }, { who: "support", body: "Reproduced — fix lands in the next design pass." }] },
    { id: "t2", type: "feature", status: "open", subject: "Add CSV export for saved leads", body: "Would love to export my saved leads to CSV for my spreadsheet.", when: "1d", thread: [] }
  ];
  var fbType = "bug", ticketSeg = "open";
  function ticketById(id) { return TICKETS.filter(function (t) { return t.id === id; })[0]; }
  function fbBadge(label, bg, fg, bd) { return '<span style="display:inline-flex;align-items:center;border:1px solid ' + bd + ';background:' + bg + ';color:' + fg + ';font-family:var(--font-mono);font-size:9px;letter-spacing:0.06em;text-transform:uppercase;padding:2px 7px;border-radius:999px">' + label + '</span>'; }
  function statusBadge(s) {
    if (s === "open") return fbBadge("Open", "var(--accent-tint,#E6EBE3)", "var(--accent,#2E5E45)", "var(--accent-line,#BFCDBF)");
    if (s === "in_progress") return fbBadge("In progress", "var(--info-tint,#DEE7E9)", "var(--info,#355C6B)", "var(--line-2,#CDC8B8)");
    return fbBadge(s.charAt(0).toUpperCase() + s.slice(1), "var(--paper-sunk,#ECE8DD)", "var(--ink-3,#6F6A5C)", "var(--line-2,#CDC8B8)");
  }
  function typeBadge(tp) { return fbBadge(tp, "var(--paper-sunk,#ECE8DD)", "var(--ink-2,#4A463C)", "var(--line-2,#CDC8B8)"); }
  function fbNotice(text, accent) {
    var c = accent ? "var(--accent,#2E5E45)" : "var(--info,#355C6B)";
    var bg = accent ? "var(--accent-tint,#E6EBE3)" : "var(--info-tint,#DEE7E9)";
    return '<div style="border-left:2px solid ' + c + ';background:' + bg + ';padding:10px 12px;font-size:12px;color:var(--ink-2,#4A463C)">' + text + '</div>';
  }
  function fbSeg(active, opts, attr) {
    return '<div style="display:flex;gap:4px;border:1px solid var(--line-2,#CDC8B8);padding:3px;border-radius:999px">' + opts.map(function (o) {
      var on = o.v === active;
      return '<button ' + attr + '="' + o.v + '" role="radio" aria-checked="' + on + '" style="flex:1;border:none;border-radius:999px;padding:7px 6px;font-family:var(--font-mono);font-size:9px;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;background:' + (on ? "var(--accent,#2E5E45)" : "transparent") + ';color:' + (on ? "var(--on-accent,#F4F1E9)" : "var(--ink-3,#6F6A5C)") + '">' + o.l + '</button>';
    }).join("") + '</div>';
  }

  SCREENS.help = function () {
    var list = TICKETS.filter(function (t) {
      if (ticketSeg === "all") return true;
      if (ticketSeg === "open") return t.status === "open" || t.status === "in_progress";
      return t.status === "resolved" || t.status === "closed";
    });
    var rows = list.length ? list.map(function (t) {
      return '<div class="m-row" data-open-ticket="' + t.id + '">' + statusBadge(t.status) + ' ' + typeBadge(t.type) +
        '<div class="grow" style="margin-left:8px"><div class="rt2" style="font-size:14px">' + esc(t.subject) + '</div>' +
        '<div style="font-family:var(--font-mono);font-size:9px;letter-spacing:0.04em;text-transform:uppercase;color:var(--ink-4);margin-top:3px">' + t.when + ' ago</div></div>' + icon("chevron-right", 16) + '</div>';
    }).join("") : '<div style="padding:18px;text-align:center;font-size:13px;color:var(--ink-3)">No tickets in this view.</div>';
    return { status: "light", topbar: backbar("Help & Feedback"), body:
      fbNotice("Support requests go to our team — we never message your leads. Please don't paste anyone else's private data.", true) +
      '<button class="m-btn" data-feedback style="margin:16px 0 22px">Send feedback / Raise a ticket</button>' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin:0 0 10px"><span class="eyebrow-m">My tickets</span><span style="font-family:var(--font-mono);font-size:10px;color:var(--ink-4)">' + TICKETS.length + '</span></div>' +
      '<div style="margin-bottom:12px">' + fbSeg(ticketSeg, [{ v: "open", l: "Open" }, { v: "resolved", l: "Closed" }, { v: "all", l: "All" }], "data-ticket-seg") + '</div>' +
      rows };
  };

  SCREENS.ticket = function (p) {
    var t = ticketById(p.id);
    if (!t) return { status: "light", topbar: backbar("Ticket"), body: '<div style="padding:18px;color:var(--ink-3)">Ticket not found.</div>' };
    var thread = t.thread.map(function (m) {
      var admin = m.who === "support";
      return '<div style="border-left:2px solid ' + (admin ? "var(--accent,#2E5E45)" : "var(--line-2,#CDC8B8)") + ';background:' + (admin ? "var(--accent-tint,#E6EBE3)" : "var(--surface,#FBFAF5)") + ';padding:10px 12px;margin-top:10px">' +
        '<div style="font-family:var(--font-mono);font-size:9px;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink-4);margin-bottom:4px">' + (admin ? "Support" : "You") + '</div>' +
        '<div style="font-size:13px;color:var(--ink-2)">' + esc(m.body) + '</div></div>';
    }).join("");
    return { status: "light", topbar: backbar("Ticket"), body:
      '<div style="display:flex;gap:6px;margin-bottom:10px">' + typeBadge(t.type) + statusBadge(t.status) + '</div>' +
      '<div class="h-display" style="font-size:22px;margin-bottom:12px">' + esc(t.subject) + '</div>' +
      '<div class="draft" style="white-space:pre-wrap">' + esc(t.body) + '</div>' +
      (thread ? '<div style="margin:18px 0 4px"><span class="eyebrow-m">Thread</span></div>' + thread : "") +
      '<button class="m-btn ghost" data-feedback style="margin-top:20px">Add a comment</button>' };
  };

  function openFeedbackSheet() {
    var mask = document.createElement("div");
    mask.className = "sheet-mask";
    var types = [{ v: "bug", l: "Bug" }, { v: "feature", l: "Feature" }, { v: "question", l: "Question" }, { v: "feedback", l: "Feedback" }];
    mask.innerHTML = '<div class="sheet" role="dialog" aria-modal="true" aria-label="Send feedback"><div class="grab"></div>' +
      '<div style="text-align:center;margin-bottom:2px"><span class="eyebrow-m accent bare" style="justify-content:center">Send feedback</span></div>' +
      '<div class="h-display" style="font-size:22px;text-align:center;margin-bottom:14px">How can we help?</div>' +
      '<div id="fbTypes" role="radiogroup" aria-label="Type" style="margin-bottom:12px">' + fbSeg(fbType, types, "data-fbtype") + '</div>' +
      '<div class="m-field"><label>Subject</label><input id="fbSubject" maxlength="120" placeholder="Short summary"/></div>' +
      '<div class="m-field"><label>Details</label><textarea id="fbBody" rows="5" maxlength="4000" placeholder="What happened, or what would you like?"></textarea></div>' +
      '<div style="margin:6px 0 14px">' + fbNotice("Sent with this screen and app version 1.x. No personal data from your leads is attached.", false) + '</div>' +
      '<button class="m-btn" data-feedback-submit>Submit</button>' +
      '<button class="m-btn ghost" data-feedback-cancel style="margin-top:8px">Cancel</button>' +
      '</div>';
    document.querySelector(".mask").appendChild(mask);
    requestAnimationFrame(function () { mask.classList.add("show"); });
    function close() { mask.classList.remove("show"); setTimeout(function () { if (mask.parentNode) mask.parentNode.removeChild(mask); }, 360); }
    mask.addEventListener("click", function (e) {
      if (e.target === mask) return close();
      var b = e.target.closest("[data-fbtype],[data-feedback-submit],[data-feedback-cancel]");
      if (!b) return;
      if (b.hasAttribute("data-fbtype")) {
        fbType = b.getAttribute("data-fbtype");
        mask.querySelector("#fbTypes").innerHTML = fbSeg(fbType, types, "data-fbtype");
      } else if (b.hasAttribute("data-feedback-cancel")) {
        close();
      } else if (b.hasAttribute("data-feedback-submit")) {
        var subj = (mask.querySelector("#fbSubject").value || "").trim();
        var body = (mask.querySelector("#fbBody").value || "").trim();
        if (subj.length < 3 || body.length < 10) { toast("Add a subject and a little more detail"); return; }
        TICKETS.unshift({ id: "t" + (TICKETS.length + 1), type: fbType, status: "open", subject: subj, body: body, when: "now", thread: [] });
        close();
        ticketSeg = "open";
        if (cur().id === "help") render("fade"); else go("help", {}, "push");
        toast("Thanks — ticket raised");
      }
    });
  }

  function backbar(title) { return '<button class="iconbtn" data-back>' + icon("arrow-left", 16) + '</button><div class="tb-title">' + title + '</div>'; }
  function chip(go, ic, label) { return '<button class="m-card" data-go="' + go + '" style="flex:1;padding:14px 10px;display:flex;flex-direction:column;align-items:center;gap:7px"><span style="color:var(--accent)">' + icon(ic, 18) + '</span><span style="font-family:var(--font-mono);font-size:9px;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink-2)">' + label + '</span></button>'; }
  function googleBtn(t) { return '<button class="m-oauth" data-auth><svg width="15" height="15" viewBox="0 0 48 48"><path fill="#4285F4" d="M45 24c0-1.6-.1-3.1-.4-4.5H24v9h11.8c-.5 2.7-2 5-4.3 6.6v5.5h7C42.6 36.8 45 31 45 24z"/><path fill="#34A853" d="M24 46c5.9 0 10.8-2 14.4-5.3l-7-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.5-3.8-12.2-9H4.5v5.7C8.1 41.1 15.5 46 24 46z"/><path fill="#FBBC05" d="M11.8 28.3c-.4-1.3-.7-2.7-.7-4.3s.3-3 .7-4.3v-5.7H4.5C2.9 17.3 2 20.5 2 24s.9 6.7 2.5 9.7l7.3-5.4z"/><path fill="#EA4335" d="M24 10.8c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.8 4.1 29.9 2 24 2 15.5 2 8.1 6.9 4.5 14.3l7.3 5.7c1.7-5.2 6.5-9.2 12.2-9.2z"/></svg>' + t + '</button>'; }

  /* ---------------- navigator ---------------- */
  var viewport = document.getElementById("viewport");
  var statusbarEl = document.getElementById("statusbar");
  var homeInd = document.getElementById("homeInd");
  var nav = [{ id: "splash", p: {} }];
  var curEl = null;
  function cur() { return nav[nav.length - 1]; }

  function go(id, p, dir) { nav.push({ id: id, p: p || {} }); render(dir || "push"); }
  function back() { if (nav.length > 1) { nav.pop(); render("pop"); } }
  function setTab(tab) {
    // if already in this tab root, no-op; else reset stack to tab
    nav = [{ id: tab, p: {} }];
    render("fade");
  }
  function authIn() { nav = [{ id: "home", p: {} }]; render("fade"); }

  function render(dir) {
    var def = SCREENS[cur().id](cur().p);
    var el = document.createElement("div");
    el.className = "scr" + (def.dark ? " dark" : "") + (def.rootClass ? " " + def.rootClass : "") + " " + (dir === "push" ? "in-right" : dir === "pop" ? "in-left" : "in-fade");
    var topbar = def.topbar ? '<div class="topbar' + (def.dark ? " dark" : "") + '">' + def.topbar + '</div>' : "";
    var inner;
    if (def.noBody) inner = def.body;
    else inner = '<div class="body' + (def.tab ? " has-tabbar" : "") + (def.topbar ? " has-topbar" : "") + '">' + def.body + '</div>';
    el.innerHTML = topbar + inner + (def.fab || "") + (def.tab ? tabbar(def.tab) : "");
    viewport.appendChild(el);

    statusbarEl.className = "statusbar " + (def.status || "light");
    homeInd.className = "home-ind" + (def.dark ? " on-dark" : "");
    homeInd.style.display = def.noIndicator ? "none" : "block";

    if (window.lucide) window.lucide.createIcons({ attrs: { "stroke-width": 1.75, width: 18, height: 18 } });
    if (def.onMount) def.onMount(el);
    // ring animation
    el.querySelectorAll("[data-ring-off]").forEach(function (c) {
      requestAnimationFrame(function () { setTimeout(function () { c.style.strokeDashoffset = c.getAttribute("data-ring-off"); }, 120); });
    });
    // score bars / meters fill, count-ups, list stagger
    var _rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.querySelectorAll("[data-fill]").forEach(function (f, k) {
      if (_rm) { f.style.width = f.getAttribute("data-fill") + "%"; return; }
      setTimeout(function () { f.style.width = f.getAttribute("data-fill") + "%"; }, 140 + k * 70);
    });
    el.querySelectorAll("[data-count]").forEach(function (n) { countUp(n, _rm); });
    ["m-lead", "m-row", "acardrow"].forEach(function (cls) {
      var items = el.getElementsByClassName(cls);
      for (var k = 0; k < items.length; k++) items[k].style.animationDelay = Math.min(k * 0.045, 0.3) + "s";
    });

    var prev = curEl;
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      el.classList.add("settle"); el.classList.remove("in-right", "in-left", "in-fade");
      if (prev) { prev.classList.add(dir === "pop" ? "out-right" : dir === "push" ? "out-left" : "out-fade"); var pr = prev; setTimeout(function () { if (pr.parentNode) pr.parentNode.removeChild(pr); }, 380); }
    }); });
    curEl = el;
    var b = el.querySelector(".body"); if (b) b.scrollTop = 0;
  }

  /* ---------------- scan sheet ---------------- */
  function openScan() {
    var mask = document.createElement("div");
    mask.className = "sheet-mask";
    mask.innerHTML = '<div class="sheet"><div class="grab"></div>' +
      '<div style="text-align:center"><span class="eyebrow-m accent bare" style="justify-content:center">Scanning public sources</span></div>' +
      '<div class="scan-radar" id="scanRadar"><svg width="150" height="150" viewBox="0 0 150 150">' +
        '<circle cx="75" cy="75" r="24" fill="none" stroke="var(--line)" stroke-width="1"/>' +
        '<circle cx="75" cy="75" r="48" fill="none" stroke="var(--line)" stroke-width="1"/>' +
        '<circle cx="75" cy="75" r="70" fill="none" stroke="var(--line)" stroke-width="1"/>' +
        '<line id="sweep" x1="75" y1="75" x2="75" y2="5" stroke="var(--accent)" stroke-width="2"/>' +
        '<g id="blips"></g></svg></div>' +
      '<div style="text-align:center;font-family:var(--font-mono);font-size:13px;color:var(--ink);font-variant-numeric:tabular-nums" id="scanCount">0 posts scanned</div>' +
      '<div style="text-align:center;font-family:var(--font-mono);font-size:10px;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink-4);margin-top:6px" id="scanStat">Reddit · Hacker News · RSS</div>' +
      '</div>';
    document.querySelector(".mask").appendChild(mask);
    requestAnimationFrame(function () { mask.classList.add("show"); });

    var sweep = mask.querySelector("#sweep"), blips = mask.querySelector("#blips"), countEl = mask.querySelector("#scanCount");
    var ang = -90, count = 0, target = 342, t0 = performance.now(), raf;
    function frame(now) {
      ang += 4; var rad = ang * Math.PI / 180;
      sweep.setAttribute("x2", (75 + Math.cos(rad) * 70).toFixed(1));
      sweep.setAttribute("y2", (75 + Math.sin(rad) * 70).toFixed(1));
      if (Math.random() > 0.78) {
        var r = 16 + Math.random() * 54, a = Math.random() * Math.PI * 2;
        var c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        c.setAttribute("cx", (75 + Math.cos(a) * r).toFixed(1)); c.setAttribute("cy", (75 + Math.sin(a) * r).toFixed(1));
        c.setAttribute("r", "2.5"); c.setAttribute("fill", Math.random() > 0.7 ? "var(--accent)" : "var(--accent-soft)");
        blips.appendChild(c); setTimeout(function () { if (c.parentNode) c.parentNode.removeChild(c); }, 900);
      }
      count = Math.min(target, Math.round((now - t0) / 1900 * target));
      countEl.textContent = count.toLocaleString() + " posts scanned";
      if (now - t0 < 1950) raf = requestAnimationFrame(frame);
      else finish();
    }
    function finish() {
      mask.querySelector("#scanStat").textContent = "Done · 3 new high-intent leads";
      setTimeout(function () {
        mask.classList.remove("show");
        setTimeout(function () { if (mask.parentNode) mask.parentNode.removeChild(mask); }, 360);
        if (cur().id !== "inbox") setTab("inbox");
        toast("Scan complete — 3 new high-intent leads");
      }, 700);
    }
    raf = requestAnimationFrame(frame);
    mask.addEventListener("click", function (e) { if (e.target === mask) { cancelAnimationFrame(raf); mask.classList.remove("show"); setTimeout(function () { if (mask.parentNode) mask.parentNode.removeChild(mask); }, 360); } });
  }

  /* ---------------- toast ---------------- */
  var toastEl = document.getElementById("toast");
  function toast(msg) { toastEl.textContent = msg; toastEl.classList.add("show"); clearTimeout(toastEl._h); toastEl._h = setTimeout(function () { toastEl.classList.remove("show"); }, 2200); }

  /* ---------------- events ---------------- */
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-go],[data-back],[data-tab],[data-seg],[data-open-lead],[data-gen],[data-copy],[data-save],[data-scan],[data-toggle-src],[data-toggle-set],[data-logout],[data-auth],[data-toast],[data-feedback],[data-open-ticket],[data-ticket-seg]");
    if (!t) return;
    if (t.hasAttribute("data-go")) go(t.getAttribute("data-go"), {}, "push");
    else if (t.hasAttribute("data-back")) back();
    else if (t.hasAttribute("data-tab")) setTab(t.getAttribute("data-tab"));
    else if (t.hasAttribute("data-seg")) { nav[nav.length - 1] = { id: "inbox", p: { seg: t.getAttribute("data-seg") } }; render("fade"); }
    else if (t.hasAttribute("data-open-lead")) go("lead", { id: t.getAttribute("data-open-lead") }, "push");
    else if (t.hasAttribute("data-gen")) { var l = lead(cur().p.id); if (l) { l.draft = l.draft || draftFor(l); toast("Draft generated — review before posting"); render("fade"); } }
    else if (t.hasAttribute("data-copy")) toast("Copied — now post it yourself");
    else if (t.hasAttribute("data-save")) { var l2 = lead(cur().p.id); saved[l2.id] = !isSaved(l2); toast(saved[l2.id] ? "Lead saved" : "Removed"); render("fade"); }
    else if (t.hasAttribute("data-scan")) openScan();
    else if (t.hasAttribute("data-toggle-src")) { var i = +t.getAttribute("data-toggle-src"); DATA.sources[i].on = !DATA.sources[i].on; t.classList.toggle("off"); toast(DATA.sources[i].on ? "Source enabled" : "Source paused"); }
    else if (t.hasAttribute("data-toggle-set")) { var k = t.getAttribute("data-toggle-set"); setTog[k] = !setTog[k]; t.classList.toggle("off"); }
    else if (t.hasAttribute("data-logout")) { nav = [{ id: "login", p: {} }]; render("fade"); toast("Logged out"); }
    else if (t.hasAttribute("data-auth")) authIn();
    else if (t.hasAttribute("data-toast")) toast(t.getAttribute("data-toast"));
    else if (t.hasAttribute("data-feedback")) openFeedbackSheet();
    else if (t.hasAttribute("data-open-ticket")) go("ticket", { id: t.getAttribute("data-open-ticket") }, "push");
    else if (t.hasAttribute("data-ticket-seg")) { ticketSeg = t.getAttribute("data-ticket-seg"); render("fade"); }
  });

  function draftFor(l) { return "Hey — saw your post about " + l.stage.replace(/-/g, " ") + ". A quick tip that helped us: standardise a couple of reusable templates so each one isn't from scratch. Happy to share what worked. (I build a small tool in this space — only mentioning since it's relevant, no pressure.)"; }

  /* ---------------- scale device ---------------- */
  function scale() {
    var phone = document.querySelector(".phone");
    var s = Math.min((window.innerHeight - 36) / 844, (window.innerWidth - 24) / 390, 1);
    phone.style.transform = "scale(" + s + ")";
  }
  window.addEventListener("resize", scale); scale();

  render("fade");
})();
