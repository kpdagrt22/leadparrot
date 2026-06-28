"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { requireContext } from "@/lib/auth";
import { getStore, getAdminStore } from "@/lib/db";
import { rateLimit } from "@/lib/ratelimit";
import { AuthorizationError, requireOrganizationOwnerOrAdmin } from "@/lib/auth/organizations";
import { ticketCreateSchema, ticketMessageSchema, ticketStatusSchema } from "@/lib/feedback/schema";
import { logTicketCreated } from "@/lib/feedback/intake";
import type { ActionResult } from "@/lib/actions";
import type { TicketStatus } from "@/lib/types";

/**
 * Feedback / support-ticket server actions (web, progressive enhancement).
 *
 * Org + author are ALWAYS session-derived (requireContext → ctx.organization.id /
 * ctx.user.id) — never read from the form. Validation is the shared Zod schema;
 * every authed surface is rate-limited. This module must NEVER import @/lib/notify:
 * tickets are internal support and can never address a lead.
 */
export interface SubmitTicketResult extends ActionResult {
  ticketId?: string;
}

export async function submitTicketAction(
  _prev: SubmitTicketResult | null,
  fd: FormData,
): Promise<SubmitTicketResult> {
  const ctx = await requireContext();

  const rl = rateLimit(`feedback-create:${ctx.organization.id}:${ctx.user.id}`, { limit: 5, windowMs: 300_000 });
  if (!rl.allowed) {
    return { ok: false, message: "You're sending feedback too quickly. Please wait a moment." };
  }

  const parsed = ticketCreateSchema.safeParse({
    type: fd.get("type"),
    subject: fd.get("subject"),
    body: fd.get("body"),
    severity: fd.get("severity") ?? undefined,
    page_path: fd.get("page_path") ?? undefined,
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  const store = await getStore();
  const userAgent = (await headers()).get("user-agent");
  const ticket = await store.createTicket(ctx.organization.id, {
    created_by: ctx.user.id,
    type: parsed.data.type,
    subject: parsed.data.subject,
    body: parsed.data.body,
    severity: parsed.data.severity,
    // page_context is server-built: client-sent url/org/user are ignored.
    page_context: { route: parsed.data.page_path ?? null, url: null, user_agent: userAgent ?? null },
  });

  // Product-team sink (id-only, fire-and-forget). NOT @/lib/notify — see intake.ts.
  logTicketCreated({ ticketId: ticket.id, orgId: ctx.organization.id, ticketType: ticket.type });

  revalidatePath("/app/feedback");
  return { ok: true, ticketId: ticket.id, message: "Thanks — your ticket was created." };
}

export async function addTicketMessageAction(
  ticketId: string,
  _prev: ActionResult | null,
  fd: FormData,
): Promise<ActionResult> {
  const ctx = await requireContext();

  // In-org first (RLS-safe). If absent and the caller is a platform admin,
  // resolve cross-org via the service-role store (admin triage path).
  const store = await getStore();
  let ticket = await store.getTicket(ctx.organization.id, ticketId);
  let targetOrgId = ctx.organization.id;
  let writeStore = store;
  if (!ticket && ctx.isAdmin) {
    const admin = getAdminStore();
    const any = await admin.getTicketAnyOrg(ticketId);
    if (any) {
      ticket = any;
      targetOrgId = any.organization_id;
      writeStore = admin;
    }
  }
  if (!ticket) return { ok: false, message: "Not authorized for this ticket." };

  // Rate-limit before the closed-ticket probe so it can't be used unbounded.
  const rl = rateLimit(`feedback-msg:${ctx.user.id}`, { limit: 20, windowMs: 300_000 });
  if (!rl.allowed) return { ok: false, message: "You're posting too quickly. Please wait a moment." };

  // A closed ticket is read-only for the reporter; admins may always respond.
  if (ticket.status === "closed" && !ctx.isAdmin) {
    return { ok: false, message: "This ticket is closed. Reopen it to add a message." };
  }

  const parsed = ticketMessageSchema.safeParse({ body: fd.get("body") });
  if (!parsed.success) return { ok: false, message: "Please write a message before sending." };

  await writeStore.addTicketMessage(targetOrgId, ticketId, {
    author_id: ctx.user.id,
    author_role: ctx.isAdmin ? "admin" : "user",
    body: parsed.data.body,
  });
  revalidatePath(`/app/feedback/${ticketId}`);
  revalidatePath(`/app/admin/feedback/${ticketId}`);
  return { ok: true, message: "Reply added." };
}

export async function updateTicketStatusAction(ticketId: string, status: TicketStatus): Promise<ActionResult> {
  const ctx = await requireContext();

  // Triage is owner-or-admin only. requireOrganizationOwnerOrAdmin already
  // permits ctx.isAdmin (env allow-list) for the cross-org platform admin, and
  // throws AuthorizationError otherwise — mirror the actions.ts catch pattern.
  try {
    await requireOrganizationOwnerOrAdmin(ctx.organization.id);
  } catch (e) {
    if (e instanceof AuthorizationError) return { ok: false, message: "Requires owner or admin." };
    throw e;
  }

  const parsed = ticketStatusSchema.safeParse({ status });
  if (!parsed.success) return { ok: false, message: "Invalid status." };

  // In-org owner write (RLS-allowed). If the ticket isn't in the caller's org
  // and the caller is a platform admin, triage cross-org via service-role.
  const store = await getStore();
  const own = await store.getTicket(ctx.organization.id, ticketId);
  if (own) {
    await store.updateTicketStatus(ctx.organization.id, ticketId, parsed.data.status);
  } else if (ctx.isAdmin) {
    const admin = getAdminStore();
    const any = await admin.getTicketAnyOrg(ticketId);
    if (!any) return { ok: false, message: "Ticket not found." };
    await admin.updateTicketStatus(any.organization_id, ticketId, parsed.data.status);
  } else {
    return { ok: false, message: "Not authorized for this ticket." };
  }

  revalidatePath(`/app/feedback/${ticketId}`);
  revalidatePath(`/app/admin/feedback/${ticketId}`);
  revalidatePath("/app/admin");
  return { ok: true, message: "Status updated." };
}
