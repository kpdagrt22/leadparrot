import { redirect } from "next/navigation";
import { isDemoMode, isAdminEmail } from "@/lib/env";
import { createServerSupabase } from "@/lib/supabase/server";
import { getStore } from "@/lib/db";
import type { Organization, Subscription } from "@/lib/types";
import { DEMO_USER_ID, DEMO_USER_EMAIL } from "@/lib/db/seed";

export interface SessionUser {
  id: string;
  email: string | null;
  full_name: string | null;
}

export interface AppContext {
  user: SessionUser;
  organization: Organization;
  subscription: Subscription;
  isAdmin: boolean;
  demo: boolean;
}

/** Resolve the current signed-in user, or null. */
export async function getSessionUser(): Promise<SessionUser | null> {
  if (isDemoMode()) {
    return { id: DEMO_USER_ID, email: DEMO_USER_EMAIL, full_name: "Demo Founder" };
  }
  const sb = await createServerSupabase();
  if (!sb) return null;
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return null;
  return {
    id: user.id,
    email: user.email ?? null,
    full_name: (user.user_metadata?.full_name as string) ?? null,
  };
}

/**
 * Resolve the full app context (user + org + subscription). Returns null when
 * the user is signed out OR has not completed onboarding (no organization yet).
 */
export async function getContext(): Promise<AppContext | null> {
  const user = await getSessionUser();
  if (!user) return null;
  const store = await getStore();
  const organization = await store.getOrganizationForUser(user.id);
  if (!organization) return null;
  const subscription = await store.getSubscription(organization.id);
  return {
    user,
    organization,
    subscription,
    isAdmin: isAdminEmail(user.email),
    demo: isDemoMode(),
  };
}

/** For pages in /app: require a fully onboarded user or redirect. */
export async function requireContext(): Promise<AppContext> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const ctx = await getContext();
  if (!ctx) redirect("/onboarding");
  return ctx;
}

/** For the admin page. */
export async function requireAdmin(): Promise<AppContext> {
  const ctx = await requireContext();
  if (!ctx.isAdmin) redirect("/app");
  return ctx;
}
