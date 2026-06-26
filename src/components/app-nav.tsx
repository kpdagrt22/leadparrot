"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/app", label: "Dashboard", exact: true },
  { href: "/app/projects", label: "Projects" },
  { href: "/app/leads", label: "Lead inbox" },
  { href: "/app/digest", label: "Daily digest" },
  { href: "/app/billing", label: "Billing" },
  { href: "/app/settings", label: "Settings" },
];

export function AppNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const items = isAdmin ? [...NAV, { href: "/app/admin", label: "Admin" }] : NAV;
  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block px-3 py-2 font-mono text-2xs uppercase tracking-mono transition-colors",
              active
                ? "border-l-2 border-accent bg-accent-tint text-accent"
                : "border-l-2 border-transparent text-ink-3 hover:bg-paper-sunk hover:text-ink",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
