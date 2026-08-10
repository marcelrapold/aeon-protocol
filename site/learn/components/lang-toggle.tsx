"use client";

import { Languages } from "lucide-react";

/**
 * Language switch that records the explicit choice in the `lang-pref` cookie
 * before navigating. The cookie steers the Accept-Language redirect in
 * next.config.ts: an explicit choice always beats browser detection.
 *
 * Deliberately a plain anchor rather than next/link. A Link prefetches its
 * destination as soon as it enters the viewport — which, for a header, is
 * immediately and therefore before this cookie exists. On a German browser the
 * prefetch of `/` came back as the redirect to `/de`, that answer went into
 * the router cache, and the click then replayed it: the switch appeared to do
 * nothing. A full navigation asks the server once, after the cookie is set,
 * and a locale switch replaces the whole tree anyway.
 */
export function LangToggle({
  target,
  href,
  ariaLabel,
}: {
  target: "en" | "de";
  href: string;
  ariaLabel: string;
}) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      onClick={() => {
        document.cookie = `lang-pref=${target}; path=/; max-age=31536000; samesite=lax`;
      }}
      className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-background px-3 font-mono text-xs font-semibold uppercase tracking-wide hover:bg-secondary"
    >
      <Languages className="size-3.5" aria-hidden="true" />
      {target.toUpperCase()}
    </a>
  );
}
