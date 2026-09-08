"use client";

import * as React from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Whether the visitor has asked for reduced motion — as a live subscription,
 * not a reading taken once at mount.
 *
 * The setting is a system preference, and people change it mid-session
 * precisely when something on screen is bothering them. A component that
 * sampled `matchMedia(...).matches` inside an effect kept animating until the
 * next full reload, which is the one moment the answer needed to be current.
 *
 * `false` on the server: the preference is a client fact, and rendering the
 * animated markup keeps the server output identical for every visitor
 * (globals.css disables the animations themselves under the same query, so a
 * reduced-motion visitor sees nothing move even before this resolves).
 */
export function usePrefersReducedMotion(): boolean {
  return React.useSyncExternalStore(
    React.useCallback((onChange: () => void) => {
      const mq = window.matchMedia(QUERY);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }, []),
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
