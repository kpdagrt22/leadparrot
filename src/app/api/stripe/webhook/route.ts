import { NextResponse } from "next/server";
import { env, isStripeConfigured } from "@/lib/env";
import { verifyWebhook, planFromWebhook } from "@/lib/billing/stripe";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { captureError } from "@/lib/observability";

/**
 * Stripe webhook handler. Verifies the signature, maps the event to a plan
 * change, and updates the subscriptions table via the service-role client.
 *
 * Security posture:
 *  - If Stripe billing is entirely unconfigured, this is a safe 200 no-op so
 *    the route exists without crashing.
 *  - If Stripe IS configured but STRIPE_WEBHOOK_SECRET is missing, we refuse
 *    (500) rather than silently trusting unverifiable events.
 *  - Otherwise every event must carry a valid signature or it is rejected.
 */
export async function POST(req: Request) {
  // Safe placeholder ONLY when billing is entirely unconfigured.
  if (!isStripeConfigured() && !env.stripeWebhookSecret) {
    return NextResponse.json({ received: true, note: "Stripe not configured (placeholder)." });
  }

  // Configured (at least partially) but no secret to verify with → refuse.
  if (!env.stripeWebhookSecret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET is not set; refusing to process unverified webhooks." },
      { status: 500 },
    );
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
      try {
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
      } catch (err) {
        captureError(err, { scope: "stripe-webhook", orgId: mapped.orgId, eventType: event.type });
        return NextResponse.json({ error: "Failed to apply subscription update" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
