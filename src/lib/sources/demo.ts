import type { FetchedPost } from "@/lib/sources/types";
import type { SourceType } from "@/lib/types";

/**
 * Deterministic demo posts returned when a source isn't configured. They are
 * realistic high/medium/low-intent examples so the scoring pipeline produces a
 * varied, believable lead inbox out of the box.
 */
export function demoPosts(sourceType: SourceType, seed = "leads"): FetchedPost[] {
  const base: Omit<FetchedPost, "source_type" | "external_id">[] = [
    {
      title: "Looking for a proposal tool for freelance clients — anything better than Word?",
      body: "I'm a freelance designer sending 5-10 client proposals a month. Writing them in Word is painful and slow. Looking for recommendations for a proposal tool that handles templates and e-signatures. Budget is flexible if it saves me time.",
      author_display: "u/design_freelance",
      posted_at: "2026-06-25T14:20:00.000Z",
    },
    {
      title: "Frustrated with PandaDoc pricing — any cheaper alternatives?",
      body: "We've been using PandaDoc but the per-seat pricing is getting expensive as our agency grows. Anyone switched to something cheaper that still does proposals and contracts well? Need to decide this week.",
      author_display: "u/agency_ops",
      posted_at: "2026-06-25T09:05:00.000Z",
    },
    {
      title: "How do I write a better Upwork proposal?",
      body: "New to Upwork. Curious what makes a proposal stand out. Mostly looking for tips, not really shopping for software yet.",
      author_display: "u/newfreelancer",
      posted_at: "2026-06-24T18:40:00.000Z",
    },
    {
      title: "Best way to track which communities actually send clients?",
      body: "I post helpful answers in a few subreddits and forums but have no idea which ones actually convert to clients. Is there a tool, or do people just track this manually in a spreadsheet?",
      author_display: "u/consultant_jane",
      posted_at: "2026-06-24T11:15:00.000Z",
    },
    {
      title: "Marriage proposal ideas for a hiking trip?",
      body: "Planning to propose to my partner on a mountain trail next month and want it to be memorable. Any ideas?",
      author_display: "u/inlovehiker",
      posted_at: "2026-06-23T20:00:00.000Z",
    },
  ];

  return base.map((p, i) => ({
    ...p,
    source_type: sourceType,
    external_id: `demo_${sourceType}_${seed}_${i + 1}`,
    url: `https://example.com/${sourceType}/demo-${i + 1}`,
    permalink: `https://example.com/${sourceType}/demo-${i + 1}`,
    raw_json: { demo: true, index: i + 1 },
  }));
}
