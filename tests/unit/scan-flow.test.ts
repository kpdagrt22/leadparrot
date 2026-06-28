import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
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

  // P5 — the platform-safety guarantee must survive persistence, and the
  // copy-only pipeline must never reach out to post anywhere.
  it("persists a reply draft that always carries a disclosure + a disclose reminder", async () => {
    const leads = await store.listLeads(DEMO_ORG_ID, { sort: "score" });
    const { draft } = await generateReplyForLead(store, DEMO_ORG_ID, "pro", leads[0].id, "helpful");
    expect(draft).not.toBeNull();

    // Re-read from the store — prove the guarantee is on the PERSISTED row, not
    // just the return value of the pure helper.
    const persisted = await store.getReplyDraftForLead(DEMO_ORG_ID, leads[0].id);
    expect(persisted).not.toBeNull();
    if (!persisted) throw new Error("reply draft was not persisted");
    expect(persisted.suggested_disclosure?.trim().length ?? 0).toBeGreaterThan(0);
    expect(persisted.safety_notes.join(" ")).toMatch(/disclos/i);
  });

  it("copy-only pipeline makes NO outbound network call (no auto-post)", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const project = await store.getProject(DEMO_ORG_ID, DEMO_PROJECT_ID);
    const { lead } = await scoreManualPost(store, DEMO_ORG_ID, "pro", project!, null, {
      title: "Need a client proposal tool",
      body: "Looking for something better than Word for proposals.",
    });
    await generateReplyForLead(store, DEMO_ORG_ID, "pro", lead!.id, "helpful");

    // Mock provider + in-memory store never touch the network; there is no
    // submit/post endpoint in the draft path — the user copies and posts it.
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("skips already-seen posts on a second scan (per-org dedupe, no double credit)", async () => {
    const project = await store.getProject(DEMO_ORG_ID, DEMO_PROJECT_ID);
    const sources = await store.listSources(DEMO_ORG_ID, DEMO_PROJECT_ID);
    const reddit = sources.find((s) => s.source_type === "reddit")!;

    await runSourceScan(store, DEMO_ORG_ID, "pro", reddit, project!);
    const second = await runSourceScan(store, DEMO_ORG_ID, "pro", reddit, project!);

    // Same demo posts → all duplicates on the second pass; no new leads, no spend.
    expect(second.skippedDuplicate).toBeGreaterThan(0);
    expect(second.leadsCreated).toBe(0);
  });

  it("records a failed source run (never throws) when a store write blows up mid-scan", async () => {
    const project = await store.getProject(DEMO_ORG_ID, DEMO_PROJECT_ID);
    const sources = await store.listSources(DEMO_ORG_ID, DEMO_PROJECT_ID);
    const reddit = sources.find((s) => s.source_type === "reddit")!;
    vi.spyOn(store, "upsertRawPost").mockRejectedValue(new Error("db write failed"));

    const summary = await runSourceScan(store, DEMO_ORG_ID, "pro", reddit, project!);
    expect(summary.error).toBeTruthy();

    const runs = await store.listSourceRuns(DEMO_ORG_ID, { limit: 1 });
    expect(runs[0]?.status).toBe("error");
  });
});

afterEach(() => vi.restoreAllMocks());
