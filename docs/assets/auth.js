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

  var POSTS = [
    { src: "Reddit", sub: "r/agency", q: "Any cheaper PandaDoc alternative?", score: 81 },
    { src: "Hacker News", sub: "Ask HN", q: "How do you track which communities convert?", score: 74 },
    { src: "Reddit", sub: "r/freelance", q: "A proposal tool better than Word?", score: 69 },
    { src: "Reddit", sub: "r/SaaS", q: "What do you use instead of a heavy CRM?", score: 77 },
    { src: "RSS", sub: "indiehackers", q: "Faster way to draft client replies?", score: 66 },
    { src: "Reddit", sub: "r/Upwork", q: "Best e-sign tool for freelance contracts?", score: 72 }
  ];

  function chipEl(p) {
    var el = document.createElement("div");
    el.className = "flchip";
    el.innerHTML =
      '<div class="fl-meta"><span class="fl-badge">' + p.src + '</span><span>' + p.sub + '</span></div>' +
      '<div class="fl-q">' + p.q + '</div>' +
      '<div class="fl-score">' + p.score + '</div>';
    return el;
  }

  if (reduce) {
    // static: three chips, the middle one lit
    [0, 1, 2].forEach(function (k) {
      var el = chipEl(POSTS[k]);
      el.style.top = (28 + k * 84) + "px";
      if (k === 1) el.classList.add("lit");
      stream.appendChild(el);
    });
    return;
  }

  var lane = [], i = 0;
  function spawn() {
    var el = chipEl(POSTS[i % POSTS.length]); i++;
    el.style.top = (stream.clientHeight + 12) + "px";
    stream.appendChild(el);
    lane.push({ el: el, y: stream.clientHeight + 12 });
  }
  var GAP = 30;
  function tick() {
    var h = stream.clientHeight, mid = h / 2;
    for (var j = lane.length - 1; j >= 0; j--) {
      var o = lane[j];
      o.y -= 0.42;
      o.el.style.top = o.y + "px";
      var cy = o.y + o.el.offsetHeight / 2;
      o.el.classList.toggle("lit", Math.abs(cy - mid) < 40);
      if (o.y < -o.el.offsetHeight - 12) { o.el.remove(); lane.splice(j, 1); }
    }
    // self-paced spawn: only when the newest chip has cleared a gap
    var last = lane[lane.length - 1];
    if (!last || last.y < h - last.el.offsetHeight - GAP) spawn();
    requestAnimationFrame(tick);
  }
  spawn();
  requestAnimationFrame(tick);
})();
