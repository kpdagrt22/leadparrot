# The Leads Nest — Capture (MV3 browser extension)

A discovery **companion**: while viewing a **public** thread, capture the single
post on screen with one click, see its lead score, and copy a **disclosed**
reply draft you post yourself. It is **not** automation.

## Safety contract (non-negotiable)

- ✅ **Allowed:** user-invoked, single-post capture of the page the user is
  actively viewing (title/body/url/author handle); show score + breakdown; copy
  a **disclosed** reply draft; deep-link into the app.
- ❌ **Banned:** background crawling / feed scraping, auto-scroll harvesting,
  reading DMs/private/paywalled content, any programmatic click/submit/post/DM on
  the host platform, modifying the host page beyond the extension's own UI,
  `<all_urls>` or broad host permissions.
- **Enforced by:** `activeTab` + explicit user gesture only (capture runs an
  on-click injection — there is **no declared content script** and no host
  match patterns); `host_permissions` limited to the app's API origin; read-only
  DOM capture; copy-only drafts that always carry an affiliation disclosure.

## Install (developer / load unpacked)

1. In the app: **Settings → Browser extension → Generate token**, copy it.
2. Chrome/Edge: visit `chrome://extensions`, enable **Developer mode**, click
   **Load unpacked**, and select this `extension/` folder.
3. Open the extension's **Options**, set the **API base URL** (e.g.
   `https://theleadsnest.com` or `http://localhost:3000` for dev) and paste the
   **token**. (For a non-production origin, also add it to `host_permissions` in
   `manifest.json`.)
4. Open a public thread, click the extension, then **Capture this post**.

## Notes

- **Icons:** none are bundled (Chrome shows a default). For Web Store submission,
  add `icons/16.png`, `48.png`, `128.png` and an `"icons"` key to the manifest.
- **Auth:** a per-user, revocable, hashed token (revoke anytime in the app). The
  token lives only in this browser's `chrome.storage.local`.
- **Backend:** `POST /api/extension/capture` and `/api/extension/draft` — the
  same scoring + reply pipeline as the app, Zod-validated, org-scoped, and
  rate-limited. Production token resolution requires `SUPABASE_SERVICE_ROLE_KEY`.
- **Distribution:** Chrome Web Store (one-time $5 developer account); Edge
  Add-ons and Firefox AMO are free. A privacy policy is required — see
  [`docs/EXTENSION_PRIVACY.md`](../docs/EXTENSION_PRIVACY.md).
- Run the `platform-safety-audit` skill on any change to this folder or the
  `/api/extension/*` routes.
