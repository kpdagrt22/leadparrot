import { describe, it, expect, beforeEach } from "vitest";
import { MemoryStore, __resetMemoryStore } from "@/lib/db/memory-store";
import { DEMO_ORG_ID, DEMO_PROJECT_ID } from "@/lib/db/seed";
import { runSourceScan, scoreManualPost, generateReplyForLead } from "@/lib/scan";

/**
 * Integration test for the core vertical slice against the in-memory store:
 * source scan → lead creation, manual post scoring, reply draft generation,
 * and usage accounting.
 */
describe("scan flow (memory store)", () => {
  let store: MemoryStore;

  beforeEach(() => {
    __resetMemoryStore();
    store = new MemoryStore();
  });

  it("runs a reddit scan and creates leads from demo data", async () => {
    const project = await store.getProject(DEMO_ORG_ID, DEMO_PROJECT_ID);
    const sources = await store.listSources(DEMO_ORG_ID, DEMO_PROJECT_ID);
    const reddit = sources.find((s) => s.source_type === "reddit")!;

    const summary = await runSourceScan(store, DEMO_ORG_ID, "pro", reddit, project!);
    expect(summary.error).toBeUndefined();
    expect(summary.usedMock).toBe(true); // no reddit creds in test env
    expect(summary.leadsCreated).toBeGreaterThan(0);

    const runs = await store.listSourceRuns(DEMO_ORG_ID, { limit: 1 });
    expect(runs[0]?.status).toBe("success");

    const usage = await store.getUsageSnapshot(DEMO_ORG_ID);
    expect(usage.posts_scanned_this_month).toBe(summary.scored);
  });

  it("filters out negative-keyword posts during a scan", async () => {
    const project = await store.getProject(DEMO_ORG_ID, DEMO_PROJECT_ID);
    const sources = await store.listSources(DEMO_ORG_ID, DEMO_PROJECT_ID);
    const reddit = sources.find((s) => s.source_type === "reddit")!;

    const summary = await runSourceScan(store, DEMO_ORG_ID, "pro", reddit, project!);
    // The demo set includes a "marriage proposal" post -> blocked by negative keyword.
    expect(summary.skippedByFilter).toBeGreaterThan(0);
  });

  it("enforces the monthly scan limit", async () => {
    const project = await store.getProject(DEMO_ORG_ID, DEMO_PROJECT_ID);
    const sources = await store.listSources(DEMO_ORG_ID, DEMO_PROJECT_ID);
    const reddit = sources.find((s) => s.source_type === "reddit")!;

    // Free plan = 20 posts/month; pre-fill 20 usage events.
    for (let i = 0; i < 20; i++) {
      await store.recordUsageEvent(DEMO_ORG_ID, "post_scanned", { i });
    }
    const summary = await runSourceScan(store, DEMO_ORG_ID, "free", reddit, project!);
    expect(summary.limitReached).toBe(true);
    expect(summary.leadsCreated).toBe(0);
  });

  it("scores a manual post and creates one lead", async () => {
    const project = await store.getProject(DEMO_ORG_ID, DEMO_PROJECT_ID);
    const before = (await store.listLeads(DEMO_ORG_ID)).length;
    const { lead, limitReached } = await scoreManualPost(store, DEMO_ORG_ID, "pro", project!, null, {
      title: "Need a client proposal tool",
      body: "Looking for something better than Word for proposals.",
    });
    expect(limitReached).toBe(false);
    expect(lead).not.toBeNull();
    const after = (await store.listLeads(DEMO_ORG_ID)).length;
    expect(after).toBe(before + 1);
  });

  it("generates a reply draft and counts usage", async () => {
    const leads = await store.listLeads(DEMO_ORG_ID, { sort: "score" });
    const lead = leads[0];
    const { draft, limitReached } = await generateReplyForLead(store, DEMO_ORG_ID, "pro", lead.id, "helpful");
    expect(limitReached).toBe(false);
    expect(draft?.draft_text.length).toBeGreaterThan(0);

    const usage = await store.getUsageSnapshot(DEMO_ORG_ID);
    expect(usage.reply_drafts_this_month).toBe(1);
  });

  it("blocks reply generation when over the monthly reply limit", async () => {
    const leads = await store.listLeads(DEMO_ORG_ID, { sort: "score" });
    for (let i = 0; i < 10; i++) {
      await store.recordUsageEvent(DEMO_ORG_ID, "reply_drafted", { i });
    }
    const { limitReached } = await generateReplyForLead(store, DEMO_ORG_ID, "free", leads[0].id, "helpful");
    expect(limitReached).toBe(true);
  });
});
