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
    if (reduce) { intro.parentNode && intro.parentNode.removeChild(intro); }
    else {
      var killIntro = function () {
        if (intro.classList.contains("done")) return;
        intro.classList.add("done");
        setTimeout(function () { intro.parentNode && intro.parentNode.removeChild(intro); }, 720);
      };
      setTimeout(killIntro, 2000);
      intro.addEventListener("click", killIntro);
    }
  }

  /* ---------- prominent custom cursor + spotlight ---------- */
  function ensureEl(id) {
    var e = document.getElementById(id);
    if (!e) { e = document.createElement("div"); e.id = id; document.body.appendChild(e); }
    return e;
  }
  var finePointer = window.matchMedia("(pointer:fine)").matches;
  var noCursor = document.documentElement.hasAttribute("data-no-cursor");
  if (finePointer && !reduce && !noCursor) {
    var spot = ensureEl("spotlight");
    var dot = ensureEl("cur-dot");
    var ring = ensureEl("cur-ring");
    var mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my;
    window.addEventListener("pointermove", function (e) {
      mx = e.clientX; my = e.clientY;
      spot.style.setProperty("--mx", mx + "px");
      spot.style.setProperty("--my", my + "px");
      dot.style.transform = "translate(" + mx + "px," + my + "px) translate(-50%,-50%)";
    }, { passive: true });
    (function ringLoop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
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
    window.addEventListener("pointerdown", function () { ring.classList.add("click"); });
    window.addEventListener("pointerup", function () { ring.classList.remove("click"); });
    document.addEventListener("mouseleave", function () { dot.style.opacity = ring.style.opacity = "0"; });
    document.addEventListener("mouseenter", function () { dot.style.opacity = ring.style.opacity = "1"; });
  } else {
    var sp = document.getElementById("spotlight");
    if (sp) sp.style.display = "none";
  }

  /* ---------- sticky nav ---------- */
  var nav = document.getElementById("nav");
  if (nav) {
    var navState = function () { nav.classList.toggle("stuck", window.scrollY > 12); };
    navState(); window.addEventListener("scroll", navState, { passive: true });
  }

  /* ---------- headline underline draw ---------- */
  var uline = document.querySelector(".hero h1 .accent path");
  if (uline) {
    try {
      var len = uline.getTotalLength();
      uline.style.strokeDasharray = len;
      uline.style.strokeDashoffset = len;
      if (reduce) { uline.style.strokeDashoffset = 0; }
      else {
        setTimeout(function () {
          uline.style.transition = "stroke-dashoffset 1.1s cubic-bezier(0.16,1,0.3,1)";
          uline.style.strokeDashoffset = 0;
        }, 650);
      }
    } catch (e) {}
  }

  /* ---------- marquee ---------- */
  var questions = [
    "anything better than Word for proposals?",
    "alternatives to PandaDoc that are cheaper?",
    "how do you track which communities send clients?",
    "best lightweight CRM for a 2-person agency?",
    "looking for a freelance proposal tool with e-sign",
    "what are people using instead of [competitor]?",
    "how to find customers without cold DMs?",
    "tools to draft client replies faster?"
  ];
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
    el.style.setProperty("--d", (i % 4) * 70 + "ms");
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
  window.addEventListener("scroll", checkReveal, { passive: true });
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
        if (!el.classList.contains("counted")) { el.classList.add("counted"); countUp(el); }
      });
    }, 700);
  });

  /* ---------- count-up ---------- */
  function countUp(el) {
    if (el.__counted) return;
    el.__counted = true;
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var dur = 1300, t0 = null;
    if (reduce) { el.textContent = format(target) + suffix; return; }
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = format(target * e) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = format(target) + suffix;
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
      setTimeout(function () { bar.style.width = w + "%"; }, reduce ? 0 : 120 + i * 130);
    });
  }

  /* ---------- typed scan log ---------- */
  var scanStarted = false;
  function runScanLog() {
    if (scanStarted) return; scanStarted = true;
    var box = document.getElementById("scanbody");
    if (!box) return;
    var lines = [
      { t: '$ nest scan --project "proposal-tool" --sources reddit,hn,rss', c: "" },
      { t: "→ connecting to official APIs\u2026", c: "c-dim" },
      { t: "✓ reddit  · r/freelance, r/agency, r/Upwork", c: "c-accent" },
      { t: "✓ hn      · Algolia search \u201Cproposal software\u201D", c: "c-accent" },
      { t: "✓ rss     · indiehackers.com/feed", c: "c-accent" },
      { t: "→ pulled 342 public posts · filtering keywords\u2026", c: "c-dim" },
      { t: "→ scoring intent  [relevance · intent · urgency · fit]", c: "c-dim" },
      { t: "★ 81  competitor-switching  \u201CFrustrated with PandaDoc pricing\u2026\u201D", c: "c-hi" },
      { t: "★ 74  problem-aware        \u201Chow do you track which communities\u2026\u201D", c: "c-hi" },
      { t: "★ 69  solution-aware       \u201Clooking for a proposal tool\u2026\u201D", c: "c-hi" },
      { t: "✓ 41 high-intent leads ready · 0 posts published. you decide.", c: "c-accent" }
    ];
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
      var ci = 0, txt = l.t;
      var speed = li === 0 ? 16 : 7;
      function typeChar() {
        div.innerHTML = esc(txt.slice(0, ci)) + '<span class="cursor"></span>';
        ci++;
        if (ci <= txt.length) setTimeout(typeChar, speed + Math.random() * 14);
        else { div.innerHTML = esc(txt); li++; setTimeout(typeLine, 220); }
      }
      typeChar();
    }
    typeLine();
  }
  function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  /* ---------- magnetic buttons ---------- */
  if (!reduce && window.matchMedia("(pointer:fine)").matches) {
    document.querySelectorAll(".btn").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) / r.width;
        var y = (e.clientY - r.top - r.height / 2) / r.height;
        b.style.transform = "translate(" + (x * 6).toFixed(1) + "px," + (y * 5).toFixed(1) + "px)";
      });
      b.addEventListener("pointerleave", function () { b.style.transform = ""; });
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
      document.querySelectorAll(".qa.open").forEach(function (o) { o.classList.remove("open"); });
      if (!open) btn.parentElement.classList.add("open");
    });
  });

  /* ============================================================
     INTERACTIVE INTENT RADAR (hero canvas)
     A field of public-post nodes. A slow sweep scans them; nodes
     light by intent, high-intent ones connect to the nest and
     surface a question. Cursor adds parallax + proximity glow.
     ============================================================ */
  var COL = { paper: "#F4F1E9", ink: "#1C1B17", accent: "#2E5E45", soft: "#5A7C66",
              line: "#CDC8B8", ink3: "#6F6A5C", ink4: "#9A9483", tint: "#E6EBE3" };

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
    var current = -1, locked = -1, lockUntil = 0;
    var prog = sec.querySelector(".tprog .trail i");
    var count = sec.querySelector(".tcount");
    function setStep(i) {
      if (i === current) return;
      current = i;
      tabs.forEach(function (t, idx) { t.classList.toggle("on", idx === i); });
      panels.forEach(function (p, idx) { p.classList.toggle("on", idx === i); });
      if (prog) prog.style.width = ((i + 1) / n * 100) + "%";
      if (count) count.textContent = pad(i + 1) + " / " + pad(n);
    }
    function pad(x) { return (x < 10 ? "0" : "") + x; }
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
          window.scrollTo({ top: target, behavior: "smooth" });
        }
      });
    });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    setStep(0);
    onScroll();
    setTimeout(onScroll, 200);
  })();

  function initRadar(canvas) {
    var ctx = canvas.getContext("2d");
    var W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);
    var cx, cy, R;
    var nodes = [];
    var sweep = -Math.PI / 2;
    var mouse = { x: 0, y: 0, inside: false };
    var parallax = { x: 0, y: 0 };
    var detectEl = document.getElementById("detect");
    var scannedEl = document.getElementById("rf-scanned");
    var highEl = document.getElementById("rf-high");
    var scanned = 0, highCount = 0;
    var qPool = [
      "any cheaper PandaDoc alternative?",
      "better than Word for proposals?",
      "which communities send clients?",
      "freelance proposal tool w/ e-sign?",
      "what do you use instead of X?",
      "lightweight CRM rec?"
    ];
    var qi = 0;

    function resize() {
      var rect = canvas.getBoundingClientRect();
      W = rect.width; H = rect.height;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      cx = W / 2; cy = H / 2; R = Math.min(W, H) / 2 - 14;
      if (!nodes.length) seed();
    }
    function seed() {
      nodes = [];
      var N = 34;
      for (var i = 0; i < N; i++) {
        var ang = Math.random() * Math.PI * 2;
        var rr = (0.16 + Math.random() * 0.82);
        // intent distribution: mostly low, a few high
        var roll = Math.random();
        var intent = roll > 0.86 ? 70 + Math.random() * 26
                   : roll > 0.6 ? 40 + Math.random() * 28
                   : 8 + Math.random() * 30;
        nodes.push({
          ang: ang, rr: rr,
          intent: Math.round(intent),
          lit: 0,            // 0..1 activation glow
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
      var dt = Math.min(now - last, 50); last = now;
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
            n.lit = 1; n.scoredAt = now;
            scanned++;
            if (n.intent >= 70) { highCount++; surface(n, p); }
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
      ctx.strokeStyle = COL.line; ctx.globalAlpha = 0.5; ctx.lineWidth = 1;
      [0.33, 0.66, 1].forEach(function (f) {
        ctx.beginPath(); ctx.arc(cx + parallax.x * 0.3, cy + parallax.y * 0.3, R * f, 0, Math.PI * 2); ctx.stroke();
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
      var gx = cx + parallax.x * 0.3, gy = cy + parallax.y * 0.3;
      var grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, R);
      grad.addColorStop(0, "rgba(46,94,69,0.16)");
      grad.addColorStop(1, "rgba(46,94,69,0)");
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.arc(gx, gy, R, sweep - 0.5, sweep);
      ctx.closePath();
      ctx.fillStyle = grad; ctx.fill();
      // leading line
      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.lineTo(gx + Math.cos(sweep) * R, gy + Math.sin(sweep) * R);
      ctx.strokeStyle = "rgba(46,94,69,0.55)"; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.restore();
    }

    function drawNode(n, p, prox) {
      var high = n.intent >= 70, med = n.intent >= 40;
      var base = high ? COL.accent : med ? COL.soft : COL.ink4;
      var r = n.rad + n.lit * 2.4 + prox * 3;

      // connecting hairline for lit high-intent
      if (high && n.lit > 0.05) {
        ctx.save();
        ctx.globalAlpha = n.lit * 0.5;
        ctx.strokeStyle = COL.accent; ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx + parallax.x * 0.3, cy + parallax.y * 0.3);
        ctx.lineTo(p.x, p.y); ctx.stroke();
        ctx.restore();
      }
      // glow ring
      if (n.lit > 0.05 || prox > 0.05) {
        ctx.save();
        ctx.globalAlpha = Math.max(n.lit, prox) * 0.6;
        ctx.strokeStyle = base; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(p.x, p.y, r + 4 + n.lit * 4, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
      }
      // dot
      ctx.save();
      ctx.globalAlpha = 0.35 + (med ? 0.35 : 0) + n.lit * 0.4 + prox * 0.4;
      ctx.fillStyle = base;
      ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      // score label for lit high-intent or hovered
      if ((high && n.lit > 0.4) || prox > 0.5) {
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
      var gx = cx + parallax.x * 0.3, gy = cy + parallax.y * 0.3;
      ctx.save();
      // chevron mark
      ctx.translate(gx, gy);
      ctx.strokeStyle = COL.accent; ctx.lineWidth = 2; ctx.lineJoin = "miter";
      ctx.beginPath(); ctx.moveTo(-8, 4); ctx.lineTo(0, -6); ctx.lineTo(8, 4); ctx.stroke();
      ctx.globalAlpha = 0.5;
      ctx.beginPath(); ctx.moveTo(-5, 9); ctx.lineTo(0, 2); ctx.lineTo(5, 9); ctx.stroke();
      ctx.restore();
    }

    function updateFoot() {
      if (scannedEl) scannedEl.textContent = (scanned).toString();
      if (highEl) highEl.textContent = (highCount).toString();
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
      detectTimer = setTimeout(function () { detectEl.classList.remove("show"); }, 2600);
    }

    canvas.addEventListener("pointermove", function (e) {
      var r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.inside = true;
    });
    canvas.addEventListener("pointerleave", function () { mouse.inside = false; });

    var ro = new ResizeObserver(resize); ro.observe(canvas.parentElement);
    resize();
    if (reduce) {
      // static: light all high-intent nodes once
      nodes.forEach(function (n) { if (n.intent >= 70) { n.lit = 1; highCount++; } scanned++; });
      updateFoot();
      // one static frame
      ctx.clearRect(0, 0, W, H); drawGrid();
      nodes.forEach(function (n) { drawNode(n, nodePos(n), 0); });
      drawNest();
    } else {
      requestAnimationFrame(frame);
    }
  }
})();
