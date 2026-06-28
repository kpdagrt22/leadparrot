import { NextResponse } from "next/server";
import { getContext } from "@/lib/auth";
import { getStore, getAdminStore } from "@/lib/db";
import { rateLimit } from "@/lib/ratelimit";
import { ticketCreateSchema } from "@/lib/feedback/schema";
import { logTicketCreated } from "@/lib/feedback/intake";
import { TICKET_STATUSES } from "@/lib/feedback/schema";
import type { TicketStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * Mobile JSON transport for tickets. Mirrors the extension capture route:
 * getContext() (non-redirecting) → manual 401, NEVER requireContext() (which
 * 307-redirects). Org/user are session-derived; client-sent ids are ignored.
 */
function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  return xff?.split(",")[0]?.trim() || "unknown";
}

export async function POST(req: Request) {
  const ctx = await getContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Primary key = session user (un-spoofable); IP is only a coarse secondary guard.
  const userRl = rateLimit(`feedback-create:${ctx.organization.id}:${ctx.user.id}`, { limit: 5, windowMs: 300_000 });
  const ipRl = rateLimit(`feedback-ip:${clientIp(req)}`, { limit: 30, windowMs: 60_000 });
  if (!userRl.allowed || !ipRl.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": "60" } });
  }

  const parsed = ticketCreateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const store = await getStore();
  const ticket = await store.createTicket(ctx.organization.id, {
    created_by: ctx.user.id,
    type: parsed.data.type,
    subject: parsed.data.subject,
    body: parsed.data.body,
    severity: parsed.data.severity,
    // Server-built only: client url/org/user/screenshot are never trusted.
    page_context: { route: parsed.data.page_path ?? null, url: null, user_agent: req.headers.get("user-agent") },
  });
  logTicketCreated({ ticketId: ticket.id, orgId: ctx.organization.id, ticketType: ticket.type });
  return NextResponse.json({ id: ticket.id }, { status: 201 });
}

export async function GET(req: Request) {
  const ctx = await getContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const rawStatus = url.searchParams.get("status");
  const status = (TICKET_STATUSES as readonly string[]).includes(rawStatus ?? "")
    ? (rawStatus as TicketStatus)
    : undefined;

  // Admin triage export for the support-feedback agent (cross-org, service-role).
  if (url.searchParams.get("format") === "triage") {
    if (!ctx.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const all = await getAdminStore().listAllTickets({ status, sort: "newest" });
    return NextResponse.json({
      tickets: all.map((t) => ({
        id: t.id,
        type: t.type,
        subject: t.subject,
        body: t.body,
        status: t.status,
        created_at: t.created_at,
        route: t.page_context?.route ?? null,
      })),
    });
  }

  const store = await getStore();
  const tickets = await store.listTickets(ctx.organization.id, { created_by: ctx.user.id, status });
  return NextResponse.json({ tickets });
}
