"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

/**
 * The icon itself is CSS-driven (dark: variants), so SSR output is correct
 * with no hydration flash; only the aria-label waits for mount.
 */
export function ThemeToggle({ labelLight, labelDark }: { labelLight: string; labelDark: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  // useSyncExternalStore-based mount flag avoids a cascading-render effect.
  const mounted = React.useSyncExternalStore(
    React.useCallback(() => () => {}, []),
    () => true,
    () => false,
  );

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={mounted ? (isDark ? labelLight : labelDark) : labelDark}
      className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-secondary"
    >
      <Sun className="hidden size-4 dark:block" aria-hidden="true" />
      <Moon className="block size-4 dark:hidden" aria-hidden="true" />
    </button>
  );
}
