"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll-reveal wrapper. Server-rendered children pass through as slots.
 * `immediate` renders revealed from first paint (above-the-fold/LCP content).
 * CSS fallbacks in globals.css force visibility under prefers-reduced-motion
 * and in no-JS environments.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  immediate = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  immediate?: boolean;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = React.useState(immediate);

  /**
   * Whether this environment can observe anything at all.
   *
   * Without an observer nothing ever flips `data-revealed`, and `.reveal`
   * starts at opacity 0 — so every section below the fold stayed permanently
   * invisible. The `(scripting: none)` fallback in globals.css does not cover
   * that case: scripting is on, the API is simply absent.
   *
   * Read through useSyncExternalStore rather than in the effect, so the
   * answer arrives with the first client render instead of as a second pass,
   * and so the server keeps rendering the unrevealed markup it always did.
   */
  const observable = React.useSyncExternalStore(
    React.useCallback(() => () => {}, []),
    () => typeof IntersectionObserver === "function",
    () => true,
  );

  React.useEffect(() => {
    if (immediate || !observable) return;
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-80px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [immediate, observable]);

  return (
    <div
      ref={ref}
      className={cn("reveal", className)}
      data-revealed={revealed || !observable}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
