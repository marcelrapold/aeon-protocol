"use client";

import * as React from "react";
import { Menu, X } from "lucide-react";

/**
 * Disclosure-pattern mobile navigation. No focus trap needed: the panel is an
 * inline disclosure (not a modal), Escape closes and returns focus.
 */
export function MobileNav({
  label,
  closeLabel,
  items,
}: {
  label: string;
  closeLabel: string;
  items: { href: string; label: string }[];
}) {
  const [open, setOpen] = React.useState(false);
  const toggleRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!items.length) return null;

  return (
    <div className="md:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? closeLabel : label}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-background hover:bg-secondary"
      >
        {open ? <X className="size-4" aria-hidden="true" /> : <Menu className="size-4" aria-hidden="true" />}
      </button>
      {open ? (
        <nav
          id="mobile-nav-panel"
          className="absolute inset-x-0 top-16 z-40 border-b border-border bg-background/95 backdrop-blur-md"
        >
          <ul className="mx-auto max-w-6xl xl:max-w-7xl 2xl:max-w-[90rem] [@media(min-width:1800px)]:max-w-[100rem] space-y-1 px-5 py-4">
            {items.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
