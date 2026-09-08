"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

/**
 * Theme switch, named by CSS rather than by state.
 *
 * The icon was always CSS-driven — a Sun under `.dark`, a Moon otherwise — so
 * it was right from first paint. The accessible name was not: it came from
 * `resolvedTheme`, which is unknown until next-themes has mounted, and until
 * then the button announced "Switch to dark theme" while sitting on the dark
 * theme it defaults to. A screen-reader user reading the header before
 * hydration was simply told the wrong thing.
 *
 * Both names are therefore in the markup, and the same `dark:` variant that
 * picks the icon picks which one is exposed. `hidden` is display:none, so the
 * inactive name is not merely invisible but absent from the accessibility
 * tree; the active one is `sr-only`, so nothing changes on screen. No mount
 * flag, no hydration gap, and the button reads correctly with JavaScript
 * still in flight.
 */
export function ThemeToggle({ labelLight, labelDark }: { labelLight: string; labelDark: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-secondary"
    >
      <Sun className="hidden size-4 dark:block" aria-hidden="true" />
      <Moon className="block size-4 dark:hidden" aria-hidden="true" />
      <span className="sr-only hidden dark:inline">{labelLight}</span>
      <span className="sr-only dark:hidden">{labelDark}</span>
    </button>
  );
}
