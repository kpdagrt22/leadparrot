import { NextResponse } from "next/server";
import { requireContext } from "@/lib/auth";
import { createCheckoutSession } from "@/lib/billing/stripe";
import type { PlanId } from "@/lib/types";

export async function POST(req: Request) {
  const ctx = await requireContext();
  const body = (await req.json().catch(() => ({}))) as { plan?: PlanId };
  const plan = body.plan;
  if (!plan || !["starter", "pro", "agency"].includes(plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const result = await createCheckoutSession({
    plan,
    orgId: ctx.organization.id,
    customerEmail: ctx.organization.notification_email ?? ctx.user.email,
  });

  if (result.notConfigured) {
    return NextResponse.json({ notConfigured: true, error: result.error });
  }
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ url: result.url });
}
