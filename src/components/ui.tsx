import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("card p-5", className)}>{children}</div>;
}

export function SectionTitle({ children, subtitle }: { children: ReactNode; subtitle?: ReactNode }) {
  return (
    <div className="mb-4">
      <h2 className="font-display text-xl font-normal tracking-tightest text-ink">{children}</h2>
      {subtitle && <p className="mt-0.5 text-sm text-ink-3">{subtitle}</p>}
    </div>
  );
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="card p-4">
      <div className="font-mono text-2xs font-medium uppercase tracking-caps text-ink-3">{label}</div>
      <div className="mt-1.5 font-display text-3xl font-light tabular-nums text-ink">{value}</div>
      {hint && <div className="mt-1 text-xs text-ink-4">{hint}</div>}
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
      {icon && <div className="text-accent">{icon}</div>}
      <div>
        <h3 className="font-display text-lg font-normal tracking-tightest text-ink">{title}</h3>
        {description && <p className="mx-auto mt-1 max-w-md text-sm text-ink-3">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function SafetyNotice({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <div className={cn("border-l-2 border-accent bg-accent-tint px-4 py-3 text-xs text-ink-2", className)}>
      <span className="mb-1 block font-mono text-3xs font-medium uppercase tracking-caps text-accent">
        Platform safety
      </span>
      <span>
        {children ??
          "The Leads Nest helps you discover public conversations and draft replies. You are responsible for following each platform's rules before responding."}
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
