import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("card p-5", className)}>{children}</div>;
}

export function SectionTitle({ children, subtitle }: { children: ReactNode; subtitle?: ReactNode }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-ink-900">{children}</h2>
      {subtitle && <p className="mt-0.5 text-sm text-ink-500">{subtitle}</p>}
    </div>
  );
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="card p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-ink-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-ink-900">{value}</div>
      {hint && <div className="mt-0.5 text-xs text-ink-400">{hint}</div>}
    </div>
  );
}

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("badge border-ink-200 bg-ink-100 text-ink-700", className)}>{children}</span>;
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      {icon && <div className="text-brand-600">{icon}</div>}
      <div>
        <h3 className="text-base font-semibold text-ink-900">{title}</h3>
        {description && <p className="mx-auto mt-1 max-w-md text-sm text-ink-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function SafetyNotice({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800",
        className,
      )}
    >
      <span aria-hidden className="mt-0.5">⚠️</span>
      <span>
        {children ??
          "LeadParrot helps you discover public conversations and draft replies. You are responsible for following each platform's rules before responding."}
      </span>
    </div>
  );
}

export function LinkButton({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}) {
  const cls = variant === "primary" ? "btn-primary" : variant === "secondary" ? "btn-secondary" : "btn-ghost";
  return (
    <Link href={href} className={cn(cls, className)}>
      {children}
    </Link>
  );
}
