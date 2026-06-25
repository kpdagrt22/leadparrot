import type { PlanId } from "@/lib/types";

export interface PlanLimits {
  /** Max active projects. */
  projects: number;
  /** Max raw posts scanned per calendar month. */
  postsPerMonth: number;
  /** Max reply drafts generated per calendar month. */
  replyDraftsPerMonth: number;
}

export interface Plan {
  id: PlanId;
  name: string;
  priceMonthly: number;
  /** Stripe price env key resolved at checkout time. */
  stripePriceEnv?: "stripePriceStarter" | "stripePricePro" | "stripePriceAgency";
  tagline: string;
  features: string[];
  limits: PlanLimits;
  highlighted?: boolean;
}

/**
 * Plan catalog. Limits are intentionally simple integer caps — usage metering
 * is enforced with plain monthly counts (see src/lib/usage/limits.ts), not a
 * heavy metering pipeline.
 */
export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Free",
    priceMonthly: 0,
    tagline: "Validate the workflow with one project.",
    features: [
      "1 project",
      "Manual source",
      "20 scanned posts / month",
      "10 reply drafts / month",
    ],
    limits: { projects: 1, postsPerMonth: 20, replyDraftsPerMonth: 10 },
  },
  starter: {
    id: "starter",
    name: "Starter",
    priceMonthly: 19,
    stripePriceEnv: "stripePriceStarter",
    tagline: "For solo founders finding their first leads.",
    features: [
      "3 projects",
      "Reddit, HN, RSS + manual sources",
      "500 scanned posts / month",
      "100 reply drafts / month",
      "Daily digest email",
    ],
    limits: { projects: 3, postsPerMonth: 500, replyDraftsPerMonth: 100 },
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceMonthly: 49,
    stripePriceEnv: "stripePricePro",
    tagline: "For consultants and small teams scaling outreach.",
    highlighted: true,
    features: [
      "10 projects",
      "3,000 scanned posts / month",
      "1,000 reply drafts / month",
      "Advanced filters",
      "Reply draft assistant",
    ],
    limits: { projects: 10, postsPerMonth: 3000, replyDraftsPerMonth: 1000 },
  },
  agency: {
    id: "agency",
    name: "Agency",
    priceMonthly: 99,
    stripePriceEnv: "stripePriceAgency",
    tagline: "For agencies managing multiple clients.",
    features: [
      "25 projects",
      "10,000 scanned posts / month",
      "5,000 reply drafts / month",
      "Multi-client workspace",
      "White-label digest (placeholder)",
    ],
    limits: { projects: 25, postsPerMonth: 10000, replyDraftsPerMonth: 5000 },
  },
};

export const PLAN_ORDER: PlanId[] = ["free", "starter", "pro", "agency"];

export function getPlan(plan: PlanId | string | null | undefined): Plan {
  if (plan && plan in PLANS) return PLANS[plan as PlanId];
  return PLANS.free;
}

export function getPlanLimits(plan: PlanId | string | null | undefined): PlanLimits {
  return getPlan(plan).limits;
}
