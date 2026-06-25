import { env } from "@/lib/env";

/**
 * Lightweight error capture + structured logging.
 *
 * Two layers, both safe with zero configuration:
 *  1. Always emits a single-line structured JSON log to stderr — picked up by
 *     Vercel / any log drain, so production errors are never silent.
 *  2. If ERROR_WEBHOOK_URL is set, fire-and-forget POSTs the same event to an
 *     external sink (a collector, a Slack incoming webhook, etc.). No-op when
 *     unset; failures here never throw back into the caller.
 *
 * Keep `context` free of PII — pass ids and short labels, never post bodies or
 * user content.
 */
export type ErrorContext = Record<string, unknown>;

export function captureError(error: unknown, context: ErrorContext = {}): void {
  const event = {
    source: "leadparrot",
    level: "error" as const,
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    at: new Date().toISOString(),
    ...context,
  };

  // eslint-disable-next-line no-console
  console.error(JSON.stringify(event));

  const url = env.errorWebhookUrl;
  if (url) {
    void fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    }).catch(() => {
      /* never let observability break the request */
    });
  }
}
