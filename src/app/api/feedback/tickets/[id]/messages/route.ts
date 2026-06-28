import { NextResponse } from "next/server";
import { getContext } from "@/lib/auth";
import { getStore } from "@/lib/db";
import { rateLimit } from "@/lib/ratelimit";
import { ticketMessageSchema } from "@/lib/feedback/schema";
import { assertTicketBelongsToOrg, AuthorizationError } from "@/lib/auth/organizations";

export const dynamic = "force-dynamic";

/** Append a message to an org-scoped ticket (mobile transport). */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await getContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const store = await getStore();

  try {
    await assertTicketBelongsToOrg(id, ctx.organization.id);
  } catch (e) {
    if (e instanceof AuthorizationError) return NextResponse.json({ error: "Not found" }, { status: 404 });
    throw e;
  }

  // Rate-limit before any further work (incl. the closed-ticket probe).
  const rl = rateLimit(`feedback-msg:${ctx.user.id}`, { limit: 20, windowMs: 300_000 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": "60" } });
  }

  const ticket = await store.getTicket(ctx.organization.id, id);
  if (ticket?.status === "closed" && !ctx.isAdmin) {
    return NextResponse.json({ error: "Ticket is closed" }, { status: 409 });
  }

  const parsed = ticketMessageSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const msg = await store.addTicketMessage(ctx.organization.id, id, {
    author_id: ctx.user.id,
    author_role: ctx.isAdmin ? "admin" : "user",
    body: parsed.data.body,
  });
  return NextResponse.json({ id: msg.id }, { status: 201 });
}
