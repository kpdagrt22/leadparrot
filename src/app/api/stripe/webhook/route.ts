import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { verifyWebhook, planFromWebhook } from "@/lib/billing/stripe";
import { createAdminSupabase } from "@/lib/supabase/admin";

/**
 * Stripe webhook handler. Verifies the signature, maps the event to a plan
 * change, and updates the subscriptions table via the service-role client.
 *
 * If Stripe / Supabase aren't configured this is a safe no-op placeholder so
 * the route exists without crashing.
 */
export async function POST(req: Request) {
  if (!env.stripeWebhookSecret) {
    return NextResponse.json({ received: true, note: "Stripe webhook not configured (placeholder)." });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event;
  try {
    event = verifyWebhook(rawBody, signature);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Invalid signature" },
      { status: 400 },
    );
  }

  const mapped = planFromWebhook(event);
  if (mapped?.orgId) {
    const sb = createAdminSupabase();
    if (sb) {
      await sb
        .from("subscriptions")
        .update({
          plan: mapped.plan ?? undefined,
          status: mapped.status ?? "active",
          stripe_customer_id: mapped.customerId ?? null,
          stripe_subscription_id: mapped.subscriptionId ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq("organization_id", mapped.orgId);
    }
  }

  return NextResponse.json({ received: true });
}
