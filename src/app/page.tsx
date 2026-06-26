"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import "./landing.css";

/**
 * The Leads Nest — marketing landing (The Crest Design System).
 *
 * The markup is the finalized design (docs/The Leads Nest - Landing.html),
 * rendered inside a `.tln` wrapper whose styles are fully scoped in
 * landing.css. The interactions (intent-radar canvas, typed scan-log, marquee,
 * count-ups, reveal-on-scroll, FAQ) run in the effect below with cleanup.
 * Content is fully visible without JS — the animations only enhance.
 */
const LANDING_HTML = `
<div id="spotlight"></div>

<div class="announce">
  <div class="wrap">
    <span class="live"><span class="dot"></span>Live</span>
    <span>Now scanning Reddit, Hacker News &amp; RSS</span>
    <span class="sep">·</span>
    <span class="mono" style="color:var(--ink-4)">Official APIs only — never auto-posted</span>
    <a href="#how">Watch it work&nbsp;&nbsp;→</a>
  </div>
</div>

<nav class="top" id="nav">
  <div class="wrap nav-in">
    <a class="brand" href="#top">
      <img src="/crest-mark.svg" alt="The Leads Nest" />
      <span class="wm">The Leads <b>Nest</b></span>
    </a>
    <div class="nav-links">
      <a href="#how">How it works</a>
      <a href="#scoring">Scoring</a>
      <a href="#product">Product</a>
      <a href="#pricing">Pricing</a>
      <a href="#safety">Safety</a>
    </div>
    <div class="nav-cta">
      <a class="btn ghost sm" href="/login">Log in</a>
      <a class="btn sm" href="/signup">Start free</a>
    </div>
  </div>
</nav>

<header class="hero" id="top">
  <div class="wrap hero-in">
    <div class="hero-grid">
      <div data-reveal>
        <div class="pill"><span class="dot"></span><span>Lead discovery + AI reply drafts</span></div>
        <h1>Find customers already
          <span class="accent">asking<svg viewBox="0 0 300 20" preserveAspectRatio="none"><path d="M3 13 C 70 4, 150 4, 297 11" pathLength="1"/></svg></span>
          for what you sell.</h1>
        <p class="lede">The Leads Nest watches public conversations, scores buyer intent, and drafts a helpful reply you review and post yourself — so you arrive before your competitors see the thread.</p>
        <div class="hero-cta">
          <a class="btn lg" href="/signup">Start finding leads</a>
          <a class="btn ghost lg" href="#how">See how it works&nbsp;&nbsp;→</a>
        </div>
        <p class="hero-sub">No card required · Clickable demo workspace from minute one</p>
        <div class="hero-meta">
          <div class="m"><b data-count="4">4</b><span>Public sources</span></div>
          <div class="m"><b data-count="0">0</b><span>Auto-posts, ever</span></div>
          <div class="m"><b data-count="248">248</b><span>Leads / project / mo</span></div>
        </div>
      </div>

      <div data-reveal style="--d:120ms">
        <div class="radar">
          <div class="radar-head">
            <span class="rl">Intent radar</span>
            <span class="rstat"><span class="dot"></span>Scanning public posts</span>
          </div>
          <div class="radar-canvas-wrap">
            <canvas id="radar"></canvas>
            <div class="detect" id="detect">
              <div class="dt">High intent · 81</div>
              <div class="dq">&ldquo;any cheaper PandaDoc alternative?&rdquo;</div>
            </div>
          </div>
          <div class="radar-foot">
            <div class="rf"><div class="k">Posts scanned</div><div class="v" id="rf-scanned">0</div></div>
            <div class="rf"><div class="k">High intent</div><div class="v accent" id="rf-high">0</div></div>
            <div class="rf"><div class="k">Auto-posted</div><div class="v">0</div></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="marquee" aria-hidden="true" style="margin-top:64px">
    <div class="marquee-track" id="mq"></div>
  </div>
</header>

<section class="sec" id="problem">
  <div class="wrap split">
    <div data-reveal>
      <span class="eyebrow">The problem</span>
      <h2 style="font-size:clamp(32px,4.1vw,48px);line-height:1.06;margin-top:18px">Your next customers are already asking — in public.</h2>
      <p style="font-family:var(--font-sans);font-size:18px;line-height:1.55;color:var(--ink-2);margin-top:22px;max-width:520px">Every day, people post on Reddit, Hacker News and niche forums asking for recommendations, alternatives, and help with the exact problem you solve. You miss most of it — and by the time you find the thread, someone else has replied.</p>
      <div style="margin-top:30px;display:flex;gap:28px">
        <div><div class="serif" style="font-size:40px;color:var(--accent)">9 / 10</div><div class="mono" style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-4);margin-top:6px">Threads you never see</div></div>
        <div style="width:1px;background:var(--line-2)"></div>
        <div><div class="serif" style="font-size:40px;color:var(--ink)">1st</div><div class="mono" style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-4);margin-top:6px">Reply usually wins</div></div>
      </div>
    </div>
    <div class="quote-stack" data-reveal style="--d:120ms">
      <div class="qc"><span class="src">r/freelance</span>&ldquo;Looking for a proposal tool — anything better than Word?&rdquo;</div>
      <div class="qc"><span class="src">r/agency</span>&ldquo;Frustrated with [competitor] pricing — any alternatives?&rdquo;</div>
      <div class="qc"><span class="src">Ask HN</span>&ldquo;How do I track which communities actually send clients?&rdquo;</div>
      <div class="qc"><span class="src">r/SaaS</span>&ldquo;What are people using instead of a heavy CRM?&rdquo;</div>
    </div>
  </div>
</section>

<section class="sec scan-sec" id="how">
  <div class="wrap scan-grid">
    <div data-reveal>
      <span class="eyebrow accent">Watch it work</span>
      <h2 style="font-size:clamp(30px,3.8vw,44px);line-height:1.07;margin-top:18px">One scan. From public noise to ranked intent.</h2>
      <div class="phase-list" style="margin-top:30px">
        <div class="phase"><span class="pn">01</span><div><h4>Describe your business</h4><p>Product, ICP, keywords, competitors, and negative keywords. Narrow before broad.</p></div></div>
        <div class="phase"><span class="pn">02</span><div><h4>Scan public sources</h4><p>Reddit, Hacker News, RSS, or paste posts manually. Official APIs and public feeds only.</p></div></div>
        <div class="phase"><span class="pn">03</span><div><h4>Review &amp; reply, on your terms</h4><p>Copy a transparent, disclosed draft and decide whether to respond. You post it — never us.</p></div></div>
      </div>
    </div>
    <div data-reveal style="--d:120ms">
      <div class="terminal" id="scanlog">
        <div class="th"><span class="tdot"></span><span class="tdot"></span><span class="tdot"></span><span class="tt">nest · scan</span></div>
        <div class="tb" id="scanbody"></div>
      </div>
    </div>
  </div>
</section>

<section class="sec wrap">
  <div class="sec-head" data-reveal>
    <span class="eyebrow">The method</span>
    <h2>Four signals. One transparent score.</h2>
    <p>No black box, no vanity metrics. Every lead is explained — so you know exactly why it surfaced and how to help.</p>
  </div>
  <div class="bento cols-4" data-reveal>
    <div class="cell"><div class="n">01</div><h3>Relevance</h3><p>How closely the post matches your product, ICP and keywords. Weighted 35%.</p></div>
    <div class="cell"><div class="n">02</div><h3>Intent</h3><p>Signals that the author is actively looking to buy or switch. Weighted 30%.</p></div>
    <div class="cell ink"><div class="n">03</div><h3>Urgency</h3><p>Deadlines, frustration, and &ldquo;need this now&rdquo; language. Weighted 20%.</p></div>
    <div class="cell accent"><div class="n">04</div><h3>Fit</h3><p>Budget, company shape and decision authority. Weighted 15%.</p></div>
  </div>
</section>

<section class="sec scan-sec" id="scoring" style="background:var(--paper);border-bottom:1px solid var(--line-2)">
  <div class="wrap">
    <div class="sec-head" data-reveal style="margin-bottom:48px">
      <span class="eyebrow accent">The scoring model</span>
      <h2>Every post, weighed and explained.</h2>
    </div>
    <div class="score-grid">
      <div class="bigscore" data-reveal>
        <div class="num" data-count="81">81</div>
        <div class="lbl">Overall · High intent</div>
        <div class="tiers">
          <div class="tier"><b>High</b>≥ 70</div>
          <div class="tier"><b>Medium</b>40–69</div>
          <div class="tier"><b>Low</b>&lt; 40</div>
        </div>
      </div>
      <div class="formula" data-reveal style="--d:120ms">
        <div class="frow"><span class="fl">Relevance <em>· 35%</em></span><div class="ft"><div class="ff" data-w="88"></div></div><span class="fv">88</span></div>
        <div class="frow"><span class="fl">Intent <em>· 30%</em></span><div class="ft"><div class="ff" data-w="82"></div></div><span class="fv">82</span></div>
        <div class="frow"><span class="fl">Urgency <em>· 20%</em></span><div class="ft"><div class="ff" data-w="75"></div></div><span class="fv">75</span></div>
        <div class="frow"><span class="fl">Fit <em>· 15%</em></span><div class="ft"><div class="ff" data-w="70"></div></div><span class="fv">70</span></div>
        <div class="eq">overall = relevance·0.35 + intent·0.30 + urgency·0.20 + fit·0.15 → <b>81 · high</b></div>
      </div>
    </div>
  </div>
</section>

<section class="sec show-sec" id="product">
  <div class="wrap">
    <div class="sec-head center" data-reveal>
      <span class="eyebrow accent center">The workspace</span>
      <h2>Your nest of high-intent leads.</h2>
      <p>A calm, engineered inbox — scored, sourced, and ready to act on. Built on the same Crest system as this page.</p>
    </div>
    <div class="app-mock" data-reveal>
      <aside class="am-side">
        <div class="am-brand"><img src="/crest-mark.svg" alt="" /><span>The Leads <b style="font-weight:500">Nest</b></span></div>
        <nav class="am-nav">
          <a class="on">◆ Dashboard</a>
          <a>◇ Lead inbox</a>
          <a>◇ Projects</a>
          <a>◇ Sources</a>
          <a>◇ Daily digest</a>
          <a>◇ Settings</a>
        </nav>
      </aside>
      <div class="am-main">
        <div class="am-bento">
          <div class="am-stat"><div class="sl">Total leads</div><div class="sv">248</div></div>
          <div class="am-stat"><div class="sl">High-intent</div><div class="sv">41</div></div>
          <div class="am-stat ink"><div class="sl">Avg score</div><div class="sv">63</div></div>
          <div class="am-stat acc"><div class="sl">Replies copied</div><div class="sv">29</div></div>
        </div>
        <div class="am-lead">
          <div class="as">81</div>
          <div style="min-width:0">
            <div class="am-meta"><span class="am-badge">Reddit</span> r/agency · competitor-switching · 1d ago</div>
            <div class="at">Frustrated with PandaDoc pricing — any cheaper alternatives?</div>
          </div>
        </div>
        <div class="am-lead">
          <div class="as">74</div>
          <div style="min-width:0">
            <div class="am-meta"><span class="am-badge" style="background:var(--info)">Hacker News</span> Ask HN · problem-aware · 2d ago</div>
            <div class="at">How do you track which communities actually send you clients?</div>
          </div>
        </div>
        <div class="am-lead">
          <div class="as" style="color:var(--medium)">69</div>
          <div style="min-width:0">
            <div class="am-meta"><span class="am-badge">Reddit</span> r/freelance · solution-aware · 1d ago</div>
            <div class="at">Looking for a proposal tool — anything better than Word?</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="sec wrap" id="uses">
  <div class="sec-head" data-reveal>
    <span class="eyebrow">Who it's for</span>
    <h2>Built for people who sell by being helpful.</h2>
  </div>
  <div class="bento cols-3" data-reveal>
    <div class="cell"><div class="ico" data-ic="rocket"></div><h3>SaaS founders</h3><p>Catch people comparing tools or asking for alternatives to your competitors.</p></div>
    <div class="cell"><div class="ico" data-ic="users"></div><h3>Agencies</h3><p>Find businesses publicly asking for the exact services you deliver.</p></div>
    <div class="cell"><div class="ico" data-ic="lightbulb"></div><h3>Consultants</h3><p>Spot problem-aware posts where your expertise is the obvious answer.</p></div>
    <div class="cell"><div class="ico" data-ic="boxes"></div><h3>B2B services</h3><p>Surface buying-intent threads in niche communities you can't watch all day.</p></div>
    <div class="cell"><div class="ico" data-ic="bot"></div><h3>AI tools</h3><p>Be first to the workflows people are trying to automate right now.</p></div>
    <div class="cell"><div class="ico" data-ic="compass"></div><h3>Niche services</h3><p>Monitor the handful of forums where your customers actually hang out.</p></div>
  </div>
</section>

<section class="sec tight" style="border-top:1px solid var(--line-2);background:var(--paper-sunk)">
  <div class="wrap pquote" data-reveal>
    <blockquote>&ldquo;It feels less like a lead tool and more like a <span class="accent">research assistant who reads every thread for you</span> — and never embarrasses you by posting.&rdquo;</blockquote>
    <div class="by">— Founder, two-person SaaS · beta user</div>
  </div>
</section>

<section class="safety" id="safety">
  <div class="wrap">
    <span class="eyebrow on-dark" data-reveal>Platform-safe by design</span>
    <h2 data-reveal style="margin-top:20px">No auto-posting. No auto-DMs. You stay in control.</h2>
    <p class="lede2" data-reveal>The Leads Nest is a discovery and drafting tool — not an automation bot. We use official APIs and public feeds, respect platform rules and rate limits, and never message anyone on your behalf. Every reply is reviewed and posted by you, with your affiliation disclosed.</p>
    <div class="checks" data-reveal>
      <div class="chk"><div class="ci" data-ic="shield-check"></div><b>Official APIs only</b><span>Reddit's read-only API, public HN search, public RSS. No scraping.</span></div>
      <div class="chk"><div class="ci" data-ic="pen-line"></div><b>Disclosure in every draft</b><span>Affiliation surfaced up front, so replies stay honest.</span></div>
      <div class="chk"><div class="ci" data-ic="lock"></div><b>No private scraping</b><span>We never touch logged-in or private communities.</span></div>
      <div class="chk"><div class="ci" data-ic="hand"></div><b>You post, never us</b><span>Every draft is copied and posted manually, by you.</span></div>
    </div>
  </div>
</section>

<section class="sec wrap" id="pricing">
  <div class="sec-head center" data-reveal>
    <span class="eyebrow center">Pricing</span>
    <h2>Simple, founder-friendly pricing.</h2>
    <p>Start free. Upgrade when The Leads Nest is finding you real opportunities.</p>
  </div>
  <div class="price-grid" data-reveal>
    <div class="plan">
      <div class="pn">Free</div>
      <div class="pp"><b>$0</b><span>/mo</span></div>
      <div class="pt">Validate the workflow with one project.</div>
      <ul><li>1 project</li><li>Manual source</li><li>20 scanned posts / mo</li><li>10 reply drafts / mo</li></ul>
      <a class="btn ghost sm" href="/signup">Start free</a>
    </div>
    <div class="plan">
      <div class="pn">Starter</div>
      <div class="pp"><b>$19</b><span>/mo</span></div>
      <div class="pt">For solo founders finding their first leads.</div>
      <ul><li>3 projects</li><li>Reddit, HN, RSS + manual</li><li>500 scanned posts / mo</li><li>Daily digest email</li></ul>
      <a class="btn ghost sm" href="/signup">Choose Starter</a>
    </div>
    <div class="plan hi">
      <div class="pn">Pro <span class="tagpop">Popular</span></div>
      <div class="pp"><b>$49</b><span>/mo</span></div>
      <div class="pt">For consultants and small teams scaling outreach.</div>
      <ul><li>10 projects</li><li>3,000 scanned posts / mo</li><li>1,000 reply drafts / mo</li><li>Advanced filters</li></ul>
      <a class="btn on-dark sm" href="/signup">Choose Pro</a>
    </div>
    <div class="plan">
      <div class="pn">Agency</div>
      <div class="pp"><b>$99</b><span>/mo</span></div>
      <div class="pt">For agencies managing multiple clients.</div>
      <ul><li>25 projects</li><li>10,000 scanned posts / mo</li><li>Multi-client workspace</li><li>White-label digest</li></ul>
      <a class="btn ghost sm" href="/signup">Choose Agency</a>
    </div>
  </div>
</section>

<section class="sec tight" style="border-top:1px solid var(--line-2);background:var(--paper-sunk)">
  <div class="wrap">
    <div class="sec-head center" data-reveal style="margin-bottom:46px">
      <span class="eyebrow accent center">Questions</span>
      <h2>The honest answers.</h2>
    </div>
    <div class="faq" data-reveal>
      <div class="qa"><button><span class="q">Does The Leads Nest auto-post?</span><span class="ic">+</span></button><div class="a"><p>Never. It drafts a reply you copy and post yourself, manually. It does not post, comment, or DM on your behalf.</p></div></div>
      <div class="qa"><button><span class="q">Does it scrape private communities?</span><span class="ic">+</span></button><div class="a"><p>No. We only use official APIs and public RSS/search endpoints, and we respect platform rules and rate limits.</p></div></div>
      <div class="qa"><button><span class="q">Can I use it for Reddit?</span><span class="ic">+</span></button><div class="a"><p>Yes — through Reddit's official read-only API and manual replies only. We never auto-comment or scrape logged-in pages.</p></div></div>
      <div class="qa"><button><span class="q">Is this a CRM?</span><span class="ic">+</span></button><div class="a"><p>No. The Leads Nest is a lead-discovery and reply-assist tool, not a CRM or outreach-automation system.</p></div></div>
      <div class="qa"><button><span class="q">Can I cancel anytime?</span><span class="ic">+</span></button><div class="a"><p>Yes. Plans are month-to-month and you can cancel whenever you like.</p></div></div>
    </div>
  </div>
</section>

<section class="sec wrap">
  <div class="final-card" data-reveal>
    <span class="eyebrow accent center">Start free today</span>
    <h2 style="margin-top:18px">Get a useful reply draft<br/>before your competitors see the thread.</h2>
    <p class="lede">No card required. Runs in a clickable demo workspace from the first minute.</p>
    <div class="fc-cta">
      <a class="btn lg" href="/signup">Start finding leads</a>
      <a class="btn ghost lg" href="/demo">Try the demo&nbsp;&nbsp;→</a>
    </div>
  </div>
</section>

<footer class="site">
  <div class="wrap">
    <div class="foot">
      <div class="col lead">
        <a class="brand" href="#top"><img src="/crest-mark-outline.svg" alt="" style="width:26px;height:26px" /><span class="wm">The Leads <b>Nest</b></span></a>
        <p>Platform-safe, high-intent lead discovery and AI reply drafts from public conversations. You stay in control.</p>
      </div>
      <div class="col"><h5>Product</h5><a href="#how">How it works</a><a href="#scoring">Scoring</a><a href="#product">Workspace</a><a href="#pricing">Pricing</a></div>
      <div class="col"><h5>Company</h5><a href="#safety">Platform safety</a><a href="#uses">Use cases</a><a href="/demo">Demo search</a></div>
      <div class="col"><h5>Account</h5><a href="/login">Log in</a><a href="/signup">Start free</a><a href="/demo">Try the demo</a></div>
    </div>
    <div class="foot-base">
      <span class="dom">theleadsnest.com</span>
      <span style="flex:1"></span>
      <span class="meta">© 2026 The Leads Nest · No auto-posting · No auto-DMs · Official APIs only</span>
    </div>
  </div>
</footer>
`;

export default function LandingPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];
    let cancelled = false;

    try {
      // cursor spotlight
      const spot = root.querySelector<HTMLElement>("#spotlight");
      if (spot && !reduce) {
        const onMove = (e: PointerEvent) => {
          spot.style.setProperty("--mx", e.clientX + "px");
          spot.style.setProperty("--my", e.clientY + "px");
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        cleanups.push(() => window.removeEventListener("pointermove", onMove));
      }

      // sticky nav
      const nav = root.querySelector("#nav");
      if (nav) {
        const navState = () => nav.classList.toggle("stuck", window.scrollY > 12);
        navState();
        window.addEventListener("scroll", navState, { passive: true });
        cleanups.push(() => window.removeEventListener("scroll", navState));
      }

      // headline underline draw
      const uline = root.querySelector<SVGPathElement>(".hero h1 .accent path");
      if (uline) {
        try {
          const len = uline.getTotalLength();
          uline.style.strokeDasharray = String(len);
          uline.style.strokeDashoffset = String(len);
          if (reduce) uline.style.strokeDashoffset = "0";
          else
            setTimeout(() => {
              uline.style.transition = "stroke-dashoffset 1.1s cubic-bezier(0.16,1,0.3,1)";
              uline.style.strokeDashoffset = "0";
            }, 650);
        } catch {
          /* getTotalLength can throw before layout */
        }
      }

      // marquee
      const questions = [
        "anything better than Word for proposals?",
        "alternatives to PandaDoc that are cheaper?",
        "how do you track which communities send clients?",
        "best lightweight CRM for a 2-person agency?",
        "looking for a freelance proposal tool with e-sign",
        "what are people using instead of [competitor]?",
        "how to find customers without cold DMs?",
        "tools to draft client replies faster?",
      ];
      const mq = root.querySelector("#mq");
      if (mq) {
        const one = questions
          .map((q) => `<span class="mq"><span class="mq-item">“${q}”</span><span class="mq-sep">◆</span></span>`)
          .join("");
        mq.innerHTML = one + one;
      }

      // count-up
      const format = (n: number) => (n >= 1000 ? Math.round(n).toLocaleString() : Math.round(n).toString());
      const countUp = (el: HTMLElement) => {
        const target = parseFloat(el.getAttribute("data-count") || "0");
        const dur = 1300;
        let t0: number | null = null;
        if (reduce) {
          el.textContent = format(target);
          return;
        }
        const step = (ts: number) => {
          if (cancelled) return;
          if (t0 === null) t0 = ts;
          const p = Math.min((ts - t0) / dur, 1);
          const e = 1 - Math.pow(1 - p, 3);
          el.textContent = format(target * e);
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = format(target);
        };
        requestAnimationFrame(step);
      };

      // scoring bars
      const fillBars = (rootEl: Element) => {
        rootEl.querySelectorAll<HTMLElement>(".ff").forEach((bar, i) => {
          const w = bar.getAttribute("data-w");
          setTimeout(
            () => {
              bar.style.width = w + "%";
            },
            reduce ? 0 : 120 + i * 130,
          );
        });
      };

      // typed scan log
      let scanStarted = false;
      const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const runScanLog = () => {
        if (scanStarted) return;
        scanStarted = true;
        const box = root.querySelector("#scanbody");
        if (!box) return;
        const lines = [
          { t: '$ nest scan --project "proposal-tool" --sources reddit,hn,rss', c: "" },
          { t: "→ connecting to official APIs…", c: "c-dim" },
          { t: "✓ reddit  · r/freelance, r/agency, r/Upwork", c: "c-accent" },
          { t: "✓ hn      · Algolia search “proposal software”", c: "c-accent" },
          { t: "✓ rss     · indiehackers.com/feed", c: "c-accent" },
          { t: "→ pulled 342 public posts · filtering keywords…", c: "c-dim" },
          { t: "→ scoring intent  [relevance · intent · urgency · fit]", c: "c-dim" },
          { t: "★ 81  competitor-switching  “Frustrated with PandaDoc pricing…”", c: "c-hi" },
          { t: "★ 74  problem-aware        “how do you track which communities…”", c: "c-hi" },
          { t: "★ 69  solution-aware       “looking for a proposal tool…”", c: "c-hi" },
          { t: "✓ 41 high-intent leads ready · 0 posts published. you decide.", c: "c-accent" },
        ];
        if (reduce) {
          box.innerHTML = lines.map((l) => `<div class="ln ${l.c}">${esc(l.t)}</div>`).join("");
          return;
        }
        let li = 0;
        const typeLine = () => {
          if (cancelled || li >= lines.length) return;
          const l = lines[li];
          const div = document.createElement("div");
          div.className = "ln " + l.c;
          box.appendChild(div);
          let ci = 0;
          const txt = l.t;
          const speed = li === 0 ? 16 : 7;
          const typeChar = () => {
            if (cancelled) return;
            div.innerHTML = esc(txt.slice(0, ci)) + '<span class="cursor"></span>';
            ci++;
            if (ci <= txt.length) setTimeout(typeChar, speed + Math.random() * 14);
            else {
              div.innerHTML = esc(txt);
              li++;
              setTimeout(typeLine, 220);
            }
          };
          typeChar();
        };
        typeLine();
      };

      // reveal on scroll + triggers
      let watch = Array.prototype.slice.call(
        root.querySelectorAll("[data-reveal], [data-count], .formula, #scanlog"),
      ) as HTMLElement[];
      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el, i) => {
        el.style.setProperty("--d", (i % 4) * 70 + "ms");
      });
      const checkReveal = () => {
        const vh = window.innerHeight || document.documentElement.clientHeight;
        watch = watch.filter((el) => {
          const top = el.getBoundingClientRect().top;
          if (top < vh * 0.9) {
            el.classList.add("in");
            if (el.hasAttribute("data-count")) countUp(el);
            if (el.classList.contains("formula")) fillBars(el);
            if (el.id === "scanlog") runScanLog();
            return false;
          }
          return true;
        });
      };
      window.addEventListener("scroll", checkReveal, { passive: true });
      window.addEventListener("resize", checkReveal);
      cleanups.push(() => window.removeEventListener("scroll", checkReveal));
      cleanups.push(() => window.removeEventListener("resize", checkReveal));
      checkReveal();
      setTimeout(checkReveal, 300);
      setTimeout(checkReveal, 1200);

      // magnetic buttons
      if (!reduce && window.matchMedia("(pointer:fine)").matches) {
        root.querySelectorAll<HTMLElement>(".btn").forEach((b) => {
          const onMove = (e: PointerEvent) => {
            const r = b.getBoundingClientRect();
            const x = (e.clientX - r.left - r.width / 2) / r.width;
            const y = (e.clientY - r.top - r.height / 2) / r.height;
            b.style.transform = `translate(${(x * 6).toFixed(1)}px,${(y * 5).toFixed(1)}px)`;
          };
          const onLeave = () => {
            b.style.transform = "";
          };
          b.addEventListener("pointermove", onMove);
          b.addEventListener("pointerleave", onLeave);
        });
      }

      // Lucide placeholders (data-ic → data-lucide); icons render once Lucide is ready
      root.querySelectorAll("[data-ic]").forEach((el) => {
        if (el.querySelector("[data-lucide]")) return;
        const i = document.createElement("i");
        i.setAttribute("data-lucide", el.getAttribute("data-ic") || "");
        el.appendChild(i);
      });
      const w = window as unknown as { lucide?: { createIcons: (o?: unknown) => void } };
      if (w.lucide) w.lucide.createIcons({ attrs: { "stroke-width": 1.75, width: 22, height: 22 } });

      // FAQ accordion
      root.querySelectorAll<HTMLButtonElement>(".qa button").forEach((btn) => {
        const onClick = () => {
          const parent = btn.parentElement;
          if (!parent) return;
          const open = parent.classList.contains("open");
          root.querySelectorAll(".qa.open").forEach((o) => o.classList.remove("open"));
          if (!open) parent.classList.add("open");
        };
        btn.addEventListener("click", onClick);
      });

      // intent radar canvas
      const cv = root.querySelector<HTMLCanvasElement>("#radar");
      if (cv) {
        const stop = initRadar(cv, root, reduce);
        if (stop) cleanups.push(stop);
      }
    } catch {
      /* never let an animation failure break the (already-rendered) page */
    }

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <>
      <Script
        src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          const w = window as unknown as { lucide?: { createIcons: (o?: unknown) => void } };
          if (w.lucide) w.lucide.createIcons({ attrs: { "stroke-width": 1.75, width: 22, height: 22 } });
        }}
      />
      <div ref={rootRef} className="tln" dangerouslySetInnerHTML={{ __html: LANDING_HTML }} />
    </>
  );
}

interface RadarNode {
  ang: number;
  rr: number;
  intent: number;
  lit: number;
  scoredAt: number;
  drift: number;
  dspeed: number;
  rad: number;
}

/** Hero intent-radar canvas. Returns a cleanup that stops the loop. */
function initRadar(canvas: HTMLCanvasElement, root: HTMLElement, reduce: boolean): (() => void) | void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const COL = { accent: "#2E5E45", soft: "#5A7C66", line: "#CDC8B8", ink3: "#6F6A5C", ink4: "#9A9483" };
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  let W = 0,
    H = 0,
    cx = 0,
    cy = 0,
    R = 0;
  let nodes: RadarNode[] = [];
  let sweep = -Math.PI / 2;
  const mouse = { x: 0, y: 0, inside: false };
  const parallax = { x: 0, y: 0 };
  const detectEl = root.querySelector<HTMLElement>("#detect");
  const scannedEl = root.querySelector("#rf-scanned");
  const highEl = root.querySelector("#rf-high");
  let scanned = 0,
    highCount = 0;
  const qPool = [
    "any cheaper PandaDoc alternative?",
    "better than Word for proposals?",
    "which communities send clients?",
    "freelance proposal tool w/ e-sign?",
    "what do you use instead of X?",
    "lightweight CRM rec?",
  ];
  let qi = 0;
  let rafId = 0;
  let stopped = false;

  function seed() {
    nodes = [];
    for (let i = 0; i < 34; i++) {
      const roll = Math.random();
      const intent = roll > 0.86 ? 70 + Math.random() * 26 : roll > 0.6 ? 40 + Math.random() * 28 : 8 + Math.random() * 30;
      nodes.push({
        ang: Math.random() * Math.PI * 2,
        rr: 0.16 + Math.random() * 0.82,
        intent: Math.round(intent),
        lit: 0,
        scoredAt: -1e9,
        drift: Math.random() * Math.PI * 2,
        dspeed: 0.0006 + Math.random() * 0.0009,
        rad: 1.4 + Math.random() * 1.8,
      });
    }
  }
  function resize() {
    const rect = canvas.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx!.setTransform(DPR, 0, 0, DPR, 0, 0);
    cx = W / 2;
    cy = H / 2;
    R = Math.min(W, H) / 2 - 14;
    if (!nodes.length) seed();
  }
  function nodePos(n: RadarNode) {
    const wob = Math.sin(n.drift) * 0.012;
    const r = (n.rr + wob) * R;
    return {
      x: cx + Math.cos(n.ang) * r + parallax.x * (0.4 + n.rr * 0.6),
      y: cy + Math.sin(n.ang) * r + parallax.y * (0.4 + n.rr * 0.6),
    };
  }
  function angDiff(a: number, b: number) {
    let d = a - b;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    return d;
  }
  function drawGrid() {
    const c = ctx!;
    c.save();
    c.strokeStyle = COL.line;
    c.globalAlpha = 0.5;
    c.lineWidth = 1;
    [0.33, 0.66, 1].forEach((f) => {
      c.beginPath();
      c.arc(cx + parallax.x * 0.3, cy + parallax.y * 0.3, R * f, 0, Math.PI * 2);
      c.stroke();
    });
    c.globalAlpha = 0.32;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
      c.beginPath();
      c.moveTo(cx + parallax.x * 0.3, cy + parallax.y * 0.3);
      c.lineTo(cx + Math.cos(a) * R + parallax.x * 0.3, cy + Math.sin(a) * R + parallax.y * 0.3);
      c.stroke();
    }
    c.restore();
  }
  function drawSweep() {
    const c = ctx!;
    const gx = cx + parallax.x * 0.3,
      gy = cy + parallax.y * 0.3;
    const grad = c.createRadialGradient(gx, gy, 0, gx, gy, R);
    grad.addColorStop(0, "rgba(46,94,69,0.16)");
    grad.addColorStop(1, "rgba(46,94,69,0)");
    c.save();
    c.beginPath();
    c.moveTo(gx, gy);
    c.arc(gx, gy, R, sweep - 0.5, sweep);
    c.closePath();
    c.fillStyle = grad;
    c.fill();
    c.beginPath();
    c.moveTo(gx, gy);
    c.lineTo(gx + Math.cos(sweep) * R, gy + Math.sin(sweep) * R);
    c.strokeStyle = "rgba(46,94,69,0.55)";
    c.lineWidth = 1.5;
    c.stroke();
    c.restore();
  }
  function drawNode(n: RadarNode, p: { x: number; y: number }, prox: number) {
    const c = ctx!;
    const high = n.intent >= 70,
      med = n.intent >= 40;
    const base = high ? COL.accent : med ? COL.soft : COL.ink4;
    const r = n.rad + n.lit * 2.4 + prox * 3;
    if (high && n.lit > 0.05) {
      c.save();
      c.globalAlpha = n.lit * 0.5;
      c.strokeStyle = COL.accent;
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(cx + parallax.x * 0.3, cy + parallax.y * 0.3);
      c.lineTo(p.x, p.y);
      c.stroke();
      c.restore();
    }
    if (n.lit > 0.05 || prox > 0.05) {
      c.save();
      c.globalAlpha = Math.max(n.lit, prox) * 0.6;
      c.strokeStyle = base;
      c.lineWidth = 1;
      c.beginPath();
      c.arc(p.x, p.y, r + 4 + n.lit * 4, 0, Math.PI * 2);
      c.stroke();
      c.restore();
    }
    c.save();
    c.globalAlpha = 0.35 + (med ? 0.35 : 0) + n.lit * 0.4 + prox * 0.4;
    c.fillStyle = base;
    c.beginPath();
    c.arc(p.x, p.y, r, 0, Math.PI * 2);
    c.fill();
    c.restore();
    if ((high && n.lit > 0.4) || prox > 0.5) {
      c.save();
      c.globalAlpha = Math.max(n.lit, prox);
      c.fillStyle = high ? COL.accent : COL.ink3;
      c.font = "600 10px 'IBM Plex Mono', monospace";
      c.textAlign = "center";
      c.fillText(String(n.intent), p.x, p.y - r - 6);
      c.restore();
    }
  }
  function drawNest() {
    const c = ctx!;
    const gx = cx + parallax.x * 0.3,
      gy = cy + parallax.y * 0.3;
    c.save();
    c.translate(gx, gy);
    c.strokeStyle = COL.accent;
    c.lineWidth = 2;
    c.lineJoin = "miter";
    c.beginPath();
    c.moveTo(-8, 4);
    c.lineTo(0, -6);
    c.lineTo(8, 4);
    c.stroke();
    c.globalAlpha = 0.5;
    c.beginPath();
    c.moveTo(-5, 9);
    c.lineTo(0, 2);
    c.lineTo(5, 9);
    c.stroke();
    c.restore();
  }
  function updateFoot() {
    if (scannedEl) scannedEl.textContent = String(scanned);
    if (highEl) highEl.textContent = String(highCount);
  }
  let detectTimer: ReturnType<typeof setTimeout> | null = null;
  function surface(p: { x: number; y: number }) {
    if (!detectEl) return;
    detectEl.style.left = p.x + "px";
    detectEl.style.top = p.y + "px";
    const dq = detectEl.querySelector(".dq");
    if (dq) dq.textContent = "“" + qPool[qi % qPool.length] + "”";
    qi++;
    detectEl.classList.add("show");
    if (detectTimer) clearTimeout(detectTimer);
    detectTimer = setTimeout(() => detectEl.classList.remove("show"), 2600);
  }

  let last = performance.now();
  function frame(now: number) {
    if (stopped) return;
    const c = ctx!;
    const dt = Math.min(now - last, 50);
    last = now;
    c.clearRect(0, 0, W, H);
    const tx = mouse.inside ? (mouse.x - cx) * 0.04 : 0;
    const ty = mouse.inside ? (mouse.y - cy) * 0.04 : 0;
    parallax.x += (tx - parallax.x) * 0.06;
    parallax.y += (ty - parallax.y) * 0.06;
    drawGrid();
    if (!reduce) sweep += dt * 0.00052;
    if (sweep > Math.PI * 1.5) sweep -= Math.PI * 2;
    if (!reduce) drawSweep();
    nodes.forEach((n) => {
      n.drift += n.dspeed * dt;
      const p = nodePos(n);
      if (!reduce) {
        const na = Math.atan2(p.y - cy, p.x - cx);
        const diff = Math.abs(angDiff(na, sweep));
        if (diff < 0.06 && now - n.scoredAt > 4000) {
          n.lit = 1;
          n.scoredAt = now;
          scanned++;
          if (n.intent >= 70) {
            highCount++;
            surface(p);
          }
          updateFoot();
        }
      }
      n.lit *= Math.pow(0.9975, dt);
      let prox = 0;
      if (mouse.inside) {
        const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        prox = Math.max(0, 1 - d / 70);
      }
      drawNode(n, p, prox);
    });
    drawNest();
    rafId = requestAnimationFrame(frame);
  }

  const onMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
    mouse.inside = true;
  };
  const onLeave = () => {
    mouse.inside = false;
  };
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerleave", onLeave);

  const ro = new ResizeObserver(resize);
  if (canvas.parentElement) ro.observe(canvas.parentElement);
  resize();

  if (reduce) {
    nodes.forEach((n) => {
      if (n.intent >= 70) {
        n.lit = 1;
        highCount++;
      }
      scanned++;
    });
    updateFoot();
    ctx.clearRect(0, 0, W, H);
    drawGrid();
    nodes.forEach((n) => drawNode(n, nodePos(n), 0));
    drawNest();
  } else {
    rafId = requestAnimationFrame(frame);
  }

  return () => {
    stopped = true;
    cancelAnimationFrame(rafId);
    ro.disconnect();
    canvas.removeEventListener("pointermove", onMove);
    canvas.removeEventListener("pointerleave", onLeave);
    if (detectTimer) clearTimeout(detectTimer);
  };
}
