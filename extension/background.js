// The Leads Nest — MV3 service worker.
//
// SAFETY CONTRACT (enforced here and in the popup):
//  ✅ Allowed: user-invoked, single-post capture of the page the user is
//     actively viewing; show score; copy a DISCLOSED reply draft; deep-link.
//  ❌ Banned: background crawling / feed scraping, auto-scroll harvesting,
//     reading DMs/private/paywalled content, any programmatic click/submit/
//     post/DM on the host platform, modifying the host page, <all_urls> or
//     broad host permissions.
//
// This worker does NO background work — there are no listeners that read pages,
// no alarms, no scheduled tasks, no host access. All capture is initiated by an
// explicit click in the popup (activeTab + user gesture). It exists only to
// satisfy MV3.
chrome.runtime.onInstalled.addListener(() => {
  // intentionally empty — no background crawling or scraping
});
