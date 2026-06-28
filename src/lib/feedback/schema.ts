import { z } from "zod";

/**
 * Single source of truth for feedback/ticket validation — shared by the RHF
 * resolver (web dialog), the server actions, and the mobile route handlers.
 * Length caps double as an abuse/DoS guard. page_path is a breadcrumb only:
 * query string stripped (PII); the server re-derives url/user-agent.
 */
export const TICKET_TYPES = ["bug", "feature", "question", "feedback"] as const;
export const TICKET_SEVERITIES = ["low", "normal", "high", "critical"] as const;
export const TICKET_STATUSES = ["open", "in_progress", "resolved", "closed"] as const;

export const ticketCreateSchema = z.object({
  type: z.enum(TICKET_TYPES),
  subject: z.string().trim().min(3).max(120),
  body: z.string().trim().min(10).max(4000),
  severity: z.enum(TICKET_SEVERITIES).optional(),
  page_path: z
    .string()
    .trim()
    .max(256)
    .optional()
    .transform((p) => (p?.startsWith("/") ? p.split("?")[0] : undefined)),
});

export const ticketMessageSchema = z.object({ body: z.string().trim().min(1).max(4000) });
export const ticketStatusSchema = z.object({ status: z.enum(TICKET_STATUSES) });

export type TicketCreateInput = z.infer<typeof ticketCreateSchema>;
