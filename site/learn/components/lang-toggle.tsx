"use client";

import Link from "next/link";
import { Languages } from "lucide-react";

/**
 * Language switch that records the explicit choice in the `lang-pref` cookie
 * before navigating. The cookie steers the Accept-Language redirect in
 * next.config.ts: an explicit choice always beats browser detection.
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
    <Link
      href={href}
      aria-label={ariaLabel}
      onClick={() => {
        document.cookie = `lang-pref=${target}; path=/; max-age=31536000; samesite=lax`;
      }}
      className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-background px-3 font-mono text-xs font-semibold uppercase tracking-wide hover:bg-secondary"
    >
      <Languages className="size-3.5" aria-hidden="true" />
      {target.toUpperCase()}
    </Link>
  );
}
