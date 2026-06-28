---
name: browser-extension
description: Build or change The Leads Nest browser extension (Manifest V3, Chrome/Edge/Firefox) — a MANUAL capture + draft companion that, on a user click, captures the single public post on screen, scores it, and lets the user copy a disclosed reply draft they post themselves. Use for any work under extension/ or the /api/extension/* routes. Enforces the extension Safety Contract (no scraping, no auto-post, no broad permissions).
user-invocable: true
---

# Browser extension (manual capture + draft companion)

The full spec is **`docs/EXTENSION_BUILD_PROMPT.md`** — read it first, and apply
its **Section 0 (mandatory corrections)** before the body. This skill is the
guardrail summary.

## The Safety Contract (non-negotiable)
The extension is **read-only to the host platform, write-only to the clipboard,
single-post, and user-gesture-gated.** A browser extension is exactly the thing
that could violate LeadParrot's "no browser automation / no scraping / no
auto-post" law — design it out, don't add it later.

- ✅ **Allowed:** on an explicit click, capture the **one** public post the user is
  actively viewing (title, body excerpt, url, public author handle); send that
  single payload to the app's scoring endpoint; render score + breakdown + a
  **disclosed** reply draft in the extension's **own** popup; let the user **copy**
  it to post themselves; deep-link into the app.
- ❌ **Banned (build rejected):** auto-post/comment/DM or any send; programmatic
  clicks/`submit()`/writing host inputs; background crawling (tabs, `fetch` to
  platforms, link-following, pagination, infinite-scroll); capturing >1 post;
  reading DMs/private/paywalled surfaces; harvesting other users; running without
  a user gesture; `<all_urls>` or wildcard `host_permissions`; remote code/`eval`;
  reading host cookies/session.

## Technical controls (must all be present)
- MV3; permissions = `activeTab`, `scripting`, `clipboardWrite`, `storage`
  (+ optional `contextMenus`) **only**. **No** wildcard/`<all_urls>`
  `host_permissions`; for a self-hosted origin, request the **single exact https
  origin** at runtime via `chrome.permissions.request` (never a wildcard).
- Extraction injected via `chrome.scripting.executeScript` into the active tab
  **only at click time**; returns exactly **one** record on a field allowlist;
  read-only (no host-DOM mutation). Extension UI renders in a **closed Shadow
  DOM** — never injected into the host page (drop "Surface A" for v0.1).
- CSP `script-src 'self'`; `connect-src` limited to the app origin. Service worker
  is the only network caller and checks `sender.id === chrome.runtime.id`.

## Backend + auth
- Routes `POST /api/extension/capture` (+ `/api/extension/draft`) reuse the
  scan/scoring + reply pipeline (use the `wire-feature` skill). Zod-validated,
  org-scoped, rate-limited; **demo mode keys rate-limit by IP**.
- Auth = a **per-user, revocable, hashed** extension API token minted in
  `/app/settings` (migration `0005_extension_tokens.sql`; RLS UPDATE needs
  `with check (is_org_member(...))`). Validate token shape before the DB lookup;
  never cache verification. **Exclude `/api/extension` from `updateSession` in
  `src/middleware.ts`.**
- Signed-in capture **persists a lead** — disclose that in-UI and in the privacy
  policy; scope any "nothing saved" copy to the demo/extension-local layer.

## Done = 
Gesture-gated, single-post, read-only-to-platform, copy-only with disclosure,
minimal permissions, token revocable — then `platform-safety-audit` +
`security-compliance` + `release-gate` all pass. Style via `crest-design`.
