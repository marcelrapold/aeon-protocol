"use client";

import * as React from "react";

/**
 * The Æ ligature with a chromatic glitch that fires at irregular intervals
 * (3.5–11s, uniformly random) — organic rather than metronomic. Each
 * instance schedules independently, so the header and hero never glitch in
 * sync. Reduced motion disables scheduling entirely.
 */
export function GlitchAe() {
  const [glitching, setGlitching] = React.useState(false);

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: number;
    let off: number;

    const schedule = () => {
      timer = window.setTimeout(() => {
        setGlitching(true);
        off = window.setTimeout(() => {
          setGlitching(false);
          schedule();
        }, 750);
      }, 2500 + Math.random() * 5500);
    };

    schedule();
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(off);
    };
  }, []);

  return <span className={glitching ? "aeon-glitch-burst" : undefined}>Æ</span>;
}
