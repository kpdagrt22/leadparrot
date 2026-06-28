import { env } from "@/lib/env";

/**
 * Product-team intake sink for new support tickets.
 *
 * SAFETY BOUNDARY (do not remove): this is a SEPARATE sink from `@/lib/notify`.
 * Ticket code must NEVER import notify()/recipientFor() — that path resolves to
 * the org owner's / lead-safe addresses. This webhook addresses the PRODUCT TEAM
 * only and carries IDS/LABELS ONLY — never the subject, body, email, page route,
 * or any lead data (observability PII rule). No code path here can reach a lead.
 */
export function logTicketCreated(event: { ticketId: string; orgId: string; ticketType: string }): void {
  const payload = {
    source: "leadparrot",
    kind: "support_ticket",
    ticket_id: event.ticketId,
    org_id: event.orgId,
    ticket_type: event.ticketType,
    at: new Date().toISOString(),
  };

  // 1. Always: a single-line structured log (ids/labels only).
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(payload));

  // 2. If a product-team sink is configured, fire-and-forget the same id-only
  //    event. Unset (default/demo) → silent no-op. Never blocks/fails the action.
  const url = env.errorWebhookUrl;
  if (url) {
    void fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {
      /* intake is best-effort — observability must never break the request */
    });
  }
}
