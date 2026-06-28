import { Badge } from "@/components/ui";
import type { TicketStatus, TicketType, TicketSeverity } from "@/lib/types";

const STATUS_LABEL: Record<TicketStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  resolved: "Resolved",
  closed: "Closed",
};
const STATUS_CLASS: Record<TicketStatus, string> = {
  open: "border-accent-line bg-accent-tint text-accent",
  in_progress: "border-info bg-info-tint text-info",
  resolved: "border-line-2 bg-paper-sunk text-ink-3",
  closed: "border-line-2 bg-paper-sunk text-ink-3",
};
const SEVERITY_CLASS: Record<TicketSeverity, string> = {
  low: "border-line-2 bg-paper-sunk text-ink-3",
  normal: "border-line-2 bg-paper-sunk text-ink-2",
  high: "border-medium bg-medium-tint text-medium",
  critical: "border-danger bg-danger-tint text-danger",
};

export function StatusBadge({ status }: { status: TicketStatus }) {
  return <Badge className={STATUS_CLASS[status]}>{STATUS_LABEL[status]}</Badge>;
}

export function TypeBadge({ type }: { type: TicketType }) {
  return <Badge>{type}</Badge>;
}

export function SeverityBadge({ severity }: { severity: TicketSeverity }) {
  return <Badge className={SEVERITY_CLASS[severity]}>{severity}</Badge>;
}
