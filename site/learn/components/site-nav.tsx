"use client";

import * as React from "react";
import { BURST_MS } from "@/components/glitch-pulse";
import { activeSection, type SectionRect } from "@/lib/scrollspy";
import { cn } from "@/lib/utils";

export type NavItem = { href: string; label: string };

/** Where the reading line sits: just under the sticky header. */
const HEADER_OFFSET = 96;

/**
 * Section navigation that follows the scroll position. The section crossing
 * the reading line is marked current, and the moment it takes over, its label
 * fires the same chromatic burst the ÆON ligature uses while the header's
 * hairline flickers once. Arriving somewhere becomes visible instead of
 * something you have to look for.
 *
 * Deliberately scroll-driven rather than IntersectionObserver-driven: the
 * computation is five rect reads per event and no writes, and it behaves the
 * same in environments where observer callbacks are throttled.
 */
export function SiteNav({ items, label }: { items: NavItem[]; label: string }) {
  const [active, setActive] = React.useState<string | null>(null);
  const [burst, setBurst] = React.useState<string | null>(null);
  /** The last section handed to setActive. Kept here rather than read back
   *  out of the updater: firing setBurst from inside a state updater made the
   *  updater impure, so React re-running it (Strict Mode does, and concurrent
   *  rendering may) fired the burst for a section that had not changed. */
  const current = React.useRef<string | null>(null);

  React.useEffect(() => {
    const ids = items.map((item) => item.href.replace("#", ""));

    const read = () => {
      const rects = ids
        .map((id) => {
          const el = document.getElementById(id);
          if (!el) return null;
          const { top, bottom } = el.getBoundingClientRect();
          return { id, top, bottom };
        })
        .filter((rect): rect is SectionRect => rect !== null);

      const next = activeSection(rects, HEADER_OFFSET);
      if (next === current.current) return;
      current.current = next;
      setActive(next);
      if (next) setBurst(next);
    };

    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read, { passive: true });
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, [items]);

  React.useEffect(() => {
    if (!burst) return;
    const timer = window.setTimeout(() => setBurst(null), BURST_MS);
    return () => window.clearTimeout(timer);
  }, [burst]);

  return (
    <>
      {/* Subtle but present: the header's rail flickers once on arrival. */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 -bottom-px h-px opacity-0",
          burst && "aeon-rail-burst",
        )}
      />
      <nav className="hidden md:block" aria-label={label}>
        <ul className="flex items-center gap-6">
          {items.map((item) => {
            const id = item.href.replace("#", "");
            const isActive = active === id;
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                    burst === id && "aeon-glitch-burst",
                  )}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
