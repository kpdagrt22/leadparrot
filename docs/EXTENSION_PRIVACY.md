# The Leads Nest — Browser Extension Privacy Policy

_Last updated: 2026._

The Leads Nest "Capture" extension helps you, the user, evaluate a **single
public post you are actively viewing**. It is a discovery companion — it does not
automate, scrape, or post.

## What it accesses

- **Only on your click.** When you press "Capture this post," the extension reads
  the **currently active tab** once (via the `activeTab` permission and an
  on-demand script injection). There is no background script that reads pages, no
  content script with host match patterns, and no scheduled/background activity.
- **What it reads:** the post's title, visible body text (your text selection if
  any, otherwise the page's main article text), the page URL, and a public author
  handle if present in page metadata. It does **not** read direct messages,
  logged-in/private/paywalled content, cookies, passwords, or other tabs.

## What it sends, and where

- The captured post is sent to **your own The Leads Nest workspace** at the API
  base URL you configure, authenticated with a token you generate and can revoke.
- It is sent **only** to that endpoint to produce a lead score and an optional
  reply draft. It is not sent to any third party by the extension.
- Your API base URL and token are stored **locally** in your browser
  (`chrome.storage.local`) and never transmitted anywhere except as the
  authorization for requests to your configured API.

## What it does NOT do

- No background crawling, feed scraping, or auto-scroll harvesting.
- No reading of private/DM/paywalled content.
- No automated clicking, posting, commenting, or messaging on any platform.
- No modification of the pages you visit (beyond the extension's own popup UI).
- No analytics, ad tracking, or selling of data.

## Data retention & control

- Captured posts become leads in your workspace, governed by The Leads Nest's
  main privacy and data policies. You control them in-app.
- Revoke the extension's access anytime: **Settings → Browser extension →
  Revoke**, or remove the extension.

## Contact

Questions: the support address listed in your The Leads Nest workspace.
