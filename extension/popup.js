// The Leads Nest — popup. User-invoked, single-post capture only.
//   1. read the post on screen (activeTab injection, on click)
//   2. POST it to the app's capture API (Bearer token) → score
//   3. optionally request a DISCLOSED reply draft → copy it
// No background work, no scraping, no posting.

const $ = (id) => document.getElementById(id);
let cfg = {};
let lastLeadId = null;
let draftClip = "";

function show(id, on) { $(id).hidden = !on; }
function setStatus(msg, kind) {
  const e = $("status");
  e.textContent = msg || "";
  e.className = "status " + (kind || "");
}

// Injected into the active tab on click. Read-only DOM read of the post the user
// is viewing (their selection if any, else the main article text). No clicks, no
// scrolling, no network, no DOM changes.
function extractPost() {
  function meta(p) {
    const e = document.querySelector('meta[property="' + p + '"],meta[name="' + p + '"]');
    return e ? e.content : "";
  }
  const sel = String(window.getSelection ? window.getSelection() : "").trim();
  const title = meta("og:title") || document.title || "";
  let body = sel;
  if (!body) {
    const main = document.querySelector("article, main, [role=main]");
    body = (main && main.innerText) || meta("og:description") || (document.body && document.body.innerText) || "";
  }
  body = body.replace(/[ \t]+\n/g, "\n").trim().slice(0, 6000);
  const author = meta("author") || meta("article:author") || "";
  return {
    title: String(title).slice(0, 400),
    body: body,
    url: String(location.href).slice(0, 1500),
    author: String(author).slice(0, 150),
  };
}

function clampBar(v) {
  return Math.max(0, Math.min(100, v | 0));
}

function renderResult(d) {
  setStatus("");
  lastLeadId = d.lead_id;
  $("score").textContent = d.overall;
  $("score").className = "score tier-" + (d.tier || "low");
  $("tier").textContent = d.tier === "high" ? "High intent" : d.tier === "medium" ? "Medium" : "Low";
  $("reason").textContent = d.reason || "";
  const rows = [
    ["Relevance", d.scores.relevance, "35%"],
    ["Intent", d.scores.intent, "30%"],
    ["Urgency", d.scores.urgency, "20%"],
    ["Fit", d.scores.fit, "15%"],
  ];
  $("bars").innerHTML = rows
    .map(
      (x) =>
        '<div class="frow"><span class="fl">' + x[0] + " · " + x[2] + '</span><span class="fv">' + x[1] +
        '</span></div><div class="ft"><div class="ff" style="width:' + clampBar(x[1]) + '%"></div></div>',
    )
    .join("");
  $("openApp").href = d.app_url || cfg.apiBase + "/app/leads";
  show("result", true);
}

async function capture() {
  if (!cfg.apiBase || !cfg.token) {
    show("setup", true);
    return;
  }
  show("result", false);
  show("draftCard", false);
  setStatus("Reading this post…");

  let tab;
  try {
    [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  } catch {
    /* ignore */
  }
  if (!tab || !tab.id) {
    setStatus("No active tab.", "err");
    return;
  }

  let post;
  try {
    const [res] = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: extractPost });
    post = res && res.result;
  } catch {
    setStatus("Can't read this page here (the browser blocks it).", "err");
    return;
  }
  if (!post || !post.body) {
    setStatus("No post text found — select the post and try again.", "err");
    return;
  }

  setStatus("Scoring…");
  try {
    const r = await fetch(cfg.apiBase + "/api/extension/capture", {
      method: "POST",
      headers: { Authorization: "Bearer " + cfg.token, "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });
    const data = await r.json().catch(() => ({}));
    if (r.status === 401) {
      setStatus("Token rejected — check Options.", "err");
      show("setup", true);
      return;
    }
    if (r.status === 409 && data.needsProject) {
      setStatus("Create a project in the app first.", "err");
      return;
    }
    if (!r.ok) {
      setStatus(data.error || "Error " + r.status, "err");
      return;
    }
    renderResult(data);
  } catch {
    setStatus("Network error reaching the app.", "err");
  }
}

async function draft() {
  if (!lastLeadId) return;
  setStatus("Drafting a disclosed reply…");
  try {
    const r = await fetch(cfg.apiBase + "/api/extension/draft", {
      method: "POST",
      headers: { Authorization: "Bearer " + cfg.token, "Content-Type": "application/json" },
      body: JSON.stringify({ lead_id: lastLeadId }),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      setStatus(data.error || "Error " + r.status, "err");
      return;
    }
    setStatus("");
    $("draftText").value = data.draft_text || "";
    $("disclosure").textContent = data.disclosure ? "Disclosure: " + data.disclosure : "";
    $("disclaimer").textContent = data.disclaimer || "";
    draftClip = (data.draft_text || "") + (data.disclosure ? "\n\n" + data.disclosure : "");
    show("draftCard", true);
  } catch {
    setStatus("Network error.", "err");
  }
}

async function copyDraft() {
  try {
    await navigator.clipboard.writeText(draftClip || $("draftText").value);
    $("copyBtn").textContent = "Copied";
    setTimeout(() => ($("copyBtn").textContent = "Copy reply"), 1500);
  } catch {
    /* clipboard blocked */
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  cfg = await chrome.storage.local.get(["apiBase", "token"]);
  if (!cfg.apiBase || !cfg.token) show("setup", true);
  $("captureBtn").addEventListener("click", capture);
  $("draftBtn").addEventListener("click", draft);
  $("copyBtn").addEventListener("click", copyDraft);
  const openOpts = (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  };
  $("openOptions").addEventListener("click", openOpts);
  const o2 = $("openOptions2");
  if (o2) o2.addEventListener("click", openOpts);
});
