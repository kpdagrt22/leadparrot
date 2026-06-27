// Store the API base URL + token locally (chrome.storage.local). No secrets ever
// leave the browser except as the Bearer token on requests to YOUR API base.
const $ = (id) => document.getElementById(id);

function normalizeBase(v) {
  return (v || "").trim().replace(/\/+$/, "");
}

chrome.storage.local.get(["apiBase", "token"], (cfg) => {
  $("apiBase").value = cfg.apiBase || "https://theleadsnest.com";
  $("token").value = cfg.token || "";
});

$("save").addEventListener("click", () => {
  const apiBase = normalizeBase($("apiBase").value);
  const token = $("token").value.trim();
  chrome.storage.local.set({ apiBase, token }, () => {
    const el = $("saved");
    el.hidden = false;
    setTimeout(() => (el.hidden = true), 1800);
  });
});
