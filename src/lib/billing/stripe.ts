import crypto from "node:crypto";
import { env, isStripeConfigured } from "@/lib/env";
import { getPlan } from "@/lib/plans";
import type { PlanId } from "@/lib/types";

/**
 * Lightweight Stripe abstraction implemented over the REST API via fetch (no
 * SDK dependency). Everything degrades to a "not configured" response when
 * STRIPE_SECRET_KEY / publishable key are missing.
 */

export interface CheckoutResult {
  ok: boolean;
  url?: string;
  error?: string;
  notConfigured?: boolean;
}

function priceIdForPlan(plan: PlanId): string | undefined {
  switch (plan) {
    case "starter":
      return env.stripePriceStarter;
    case "pro":
      return env.stripePricePro;
    case "agency":
      return env.stripePriceAgency;
    default:
      return undefined;
  }
}

/** Create a Stripe Checkout Session and return its hosted URL. */
export async function createCheckoutSession(opts: {
  plan: PlanId;
  orgId: string;
  customerEmail?: string | null;
}): Promise<CheckoutResult> {
  if (!isStripeConfigured()) {
    return { ok: false, notConfigured: true, error: "Billing not configured." };
  }
  const priceId = priceIdForPlan(opts.plan);
  if (!priceId) {
    return { ok: false, error: `No Stripe price configured for the ${getPlan(opts.plan).name} plan.` };
  }

  const params = new URLSearchParams();
  params.set("mode", "subscription");
  params.set("success_url", `${env.appUrl}/app/billing?status=success`);
  params.set("cancel_url", `${env.appUrl}/app/billing?status=cancelled`);
  params.set("line_items[0][price]", priceId);
  params.set("line_items[0][quantity]", "1");
  params.set("client_reference_id", opts.orgId);
  params.set("metadata[organization_id]", opts.orgId);
  params.set("metadata[plan]", opts.plan);
  if (opts.customerEmail) params.set("customer_email", opts.customerEmail);

  try {
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    const data = (await res.json()) as { url?: string; error?: { message?: string } };
    if (!res.ok) return { ok: false, error: data.error?.message ?? `Stripe error ${res.status}` };
    return { ok: true, url: data.url };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Checkout failed" };
  }
}

export interface StripeWebhookEvent {
  type: string;
  data: { object: Record<string, unknown> };
}

/**
 * Verify a Stripe webhook signature (HMAC-SHA256 over `${timestamp}.${body}`)
 * without the SDK. Returns the parsed event or throws on a bad signature.
 */
export function verifyWebhook(rawBody: string, signatureHeader: string | null): StripeWebhookEvent {
  if (!env.stripeWebhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET not configured");
  }
  if (!signatureHeader) throw new Error("Missing Stripe-Signature header");

  const parts = Object.fromEntries(
    signatureHeader.split(",").map((kv) => {
      const [k, v] = kv.split("=");
      return [k.trim(), v?.trim() ?? ""];
    }),
  );
  const timestamp = parts["t"];
  const signature = parts["v1"];
  if (!timestamp || !signature) throw new Error("Malformed Stripe-Signature header");

  const expected = crypto
    .createHmac("sha256", env.stripeWebhookSecret)
    .update(`${timestamp}.${rawBody}`, "utf8")
    .digest("hex");

  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    throw new Error("Stripe signature verification failed");
  }
  return JSON.parse(rawBody) as StripeWebhookEvent;
}

/** Map a Stripe Checkout/subscription event to our internal plan + status. */
export function planFromWebhook(event: StripeWebhookEvent): {
  orgId?: string;
  plan?: PlanId;
  status?: string;
  customerId?: string;
  subscriptionId?: string;
} | null {
  const obj = event.data.object;
  switch (event.type) {
    case "checkout.session.completed":
      return {
        orgId: (obj.metadata as Record<string, string>)?.organization_id || (obj.client_reference_id as string),
        plan: ((obj.metadata as Record<string, string>)?.plan as PlanId) ?? undefined,
        status: "active",
        customerId: obj.customer as string,
        subscriptionId: obj.subscription as string,
      };
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      return {
        orgId: (obj.metadata as Record<string, string>)?.organization_id,
        status: event.type === "customer.subscription.deleted" ? "canceled" : (obj.status as string),
        customerId: obj.customer as string,
        subscriptionId: obj.id as string,
      };
    default:
      return null;
  }
}
