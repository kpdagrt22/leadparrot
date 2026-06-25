import { getPlanLimits, type PlanLimits } from "@/lib/plans";
import type { PlanId } from "@/lib/types";

export type UsageMetric = "posts_scanned" | "reply_drafts" | "projects";

export interface UsageSnapshot {
  posts_scanned_this_month: number;
  reply_drafts_this_month: number;
  projects_count: number;
}

export interface LimitCheck {
  allowed: boolean;
  metric: UsageMetric;
  used: number;
  limit: number;
  remaining: number;
  reason?: string;
}

function limitFor(metric: UsageMetric, limits: PlanLimits): number {
  switch (metric) {
    case "posts_scanned":
      return limits.postsPerMonth;
    case "reply_drafts":
      return limits.replyDraftsPerMonth;
    case "projects":
      return limits.projects;
  }
}

function usedFor(metric: UsageMetric, usage: UsageSnapshot): number {
  switch (metric) {
    case "posts_scanned":
      return usage.posts_scanned_this_month;
    case "reply_drafts":
      return usage.reply_drafts_this_month;
    case "projects":
      return usage.projects_count;
  }
}

/**
 * Check whether `count` additional units of `metric` are within plan limits.
 * Simple, deterministic monthly counting — no heavy metering pipeline.
 */
export function checkUsage(
  plan: PlanId | string,
  metric: UsageMetric,
  usage: UsageSnapshot,
  count = 1,
): LimitCheck {
  const limits = getPlanLimits(plan);
  const limit = limitFor(metric, limits);
  const used = usedFor(metric, usage);
  const remaining = Math.max(0, limit - used);
  const allowed = used + count <= limit;
  return {
    allowed,
    metric,
    used,
    limit,
    remaining,
    reason: allowed
      ? undefined
      : `Plan limit reached for ${metric.replace("_", " ")} (${used}/${limit}). Upgrade to continue.`,
  };
}

/** Convenience: how much of each metric is left for the dashboard meters. */
export function usagePercents(plan: PlanId | string, usage: UsageSnapshot) {
  const limits = getPlanLimits(plan);
  const pct = (used: number, limit: number) =>
    limit <= 0 ? 0 : Math.min(100, Math.round((used / limit) * 100));
  return {
    posts: {
      used: usage.posts_scanned_this_month,
      limit: limits.postsPerMonth,
      pct: pct(usage.posts_scanned_this_month, limits.postsPerMonth),
    },
    replies: {
      used: usage.reply_drafts_this_month,
      limit: limits.replyDraftsPerMonth,
      pct: pct(usage.reply_drafts_this_month, limits.replyDraftsPerMonth),
    },
    projects: {
      used: usage.projects_count,
      limit: limits.projects,
      pct: pct(usage.projects_count, limits.projects),
    },
  };
}
