"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Inbox, Radio, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Mobile bottom tab bar — rendered below `lg` only (display:none at desktop, so
 * its links never enter the desktop accessibility tree / e2e selectors). Four
 * tabs, deliberately NOT a mirror of the 6-item desktop sidebar. Safe-area aware,
 * 44px+ touch targets.
 */
const TABS = [
  { href: "/app", label: "Home", icon: Home, exact: true },
  { href: "/app/leads", label: "Inbox", icon: Inbox },
  { href: "/app/projects", label: "Sources", icon: Radio },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

export function MobileTabBar() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Primary mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-line-2 bg-surface/95 backdrop-blur lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {TABS.map((t) => {
        const active = t.exact ? pathname === t.href : pathname.startsWith(t.href);
        const Icon = t.icon;
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-[44px] flex-col items-center justify-center gap-1 py-2 font-mono text-3xs uppercase tracking-mono transition-colors",
              active ? "text-accent" : "text-ink-3 hover:text-ink",
            )}
          >
            <Icon size={18} strokeWidth={1.75} aria-hidden />
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
