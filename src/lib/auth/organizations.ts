import { getSessionUser, getContext, type AppContext, type SessionUser } from "@/lib/auth";
import { getStore } from "@/lib/db";

/**
 * Centralized authorization helpers for server actions and route handlers.
 *
 * LeadParrot already scopes every data-store getter by `organization_id` (and,
 * in Supabase mode, RLS enforces the same). These helpers give server code one
 * explicit, testable place to assert "this user belongs to this org" and "this
 * object belongs to this org" so a forged client-supplied id is rejected with a
 * clear error rather than silently acted on — defense-in-depth.
 *
 * They THROW `AuthorizationError` (rather than redirect) so they are safe in
 * route handlers as well as actions. Page guards should keep using
 * requireContext/requireAdmin from "@/lib/auth", which redirect.
 */

export class AuthorizationError extends Error {
  constructor(message = "Not authorized") {
    super(message);
    this.name = "AuthorizationError";
  }
}

/** Require an authenticated user (throws, does not redirect). */
export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new AuthorizationError("Not authenticated");
  return user;
}

/**
 * Require the current user to be a member of `organizationId`. In the MVP each
 * user has exactly one organization (the one they own), so membership means the
 * resolved org id matches.
 */
export async function requireOrganizationMember(organizationId: string): Promise<AppContext> {
  const ctx = await getContext();
  if (!ctx) throw new AuthorizationError("Not authenticated or no organization");
  if (ctx.organization.id !== organizationId) {
    throw new AuthorizationError("You are not a member of this organization");
  }
  return ctx;
}

/** Require the current user to be the org owner OR a configured admin. */
export async function requireOrganizationOwnerOrAdmin(organizationId: string): Promise<AppContext> {
  const ctx = await requireOrganizationMember(organizationId);
  if (ctx.organization.owner_id !== ctx.user.id && !ctx.isAdmin) {
    throw new AuthorizationError("Requires owner or admin role");
  }
  return ctx;
}

async function assertExists<T>(value: T | null, label: string): Promise<void> {
  if (value == null) {
    throw new AuthorizationError(`${label} does not belong to this organization`);
  }
}

export async function assertProjectBelongsToOrg(projectId: string, orgId: string): Promise<void> {
  const store = await getStore();
  await assertExists(await store.getProject(orgId, projectId), "Project");
}

export async function assertSourceBelongsToOrg(sourceId: string, orgId: string): Promise<void> {
  const store = await getStore();
  await assertExists(await store.getSource(orgId, sourceId), "Source");
}

export async function assertRawPostBelongsToOrg(rawPostId: string, orgId: string): Promise<void> {
  const store = await getStore();
  await assertExists(await store.getRawPost(orgId, rawPostId), "Post");
}

export async function assertLeadBelongsToOrg(leadCandidateId: string, orgId: string): Promise<void> {
  const store = await getStore();
  await assertExists(await store.getLead(orgId, leadCandidateId), "Lead");
}

export async function assertReplyDraftBelongsToOrg(replyDraftId: string, orgId: string): Promise<void> {
  const store = await getStore();
  await assertExists(await store.getReplyDraftById(orgId, replyDraftId), "Reply draft");
}

export async function assertSavedLeadBelongsToOrg(savedLeadId: string, orgId: string): Promise<void> {
  const store = await getStore();
  await assertExists(await store.getSavedLeadById(orgId, savedLeadId), "Saved lead");
}
