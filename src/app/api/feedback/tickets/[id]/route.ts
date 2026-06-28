import { NextResponse } from "next/server";
import { getContext } from "@/lib/auth";
import { getStore } from "@/lib/db";

export const dynamic = "force-dynamic";

/** A single ticket (org-scoped). Cross-org id resolves to 404. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await getContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const store = await getStore();
  const ticket = await store.getTicket(ctx.organization.id, id);
  if (!ticket) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ticket });
}
