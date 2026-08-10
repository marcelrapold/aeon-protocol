"use client";

import { useGlitchPulse, useGlitchSchedule } from "@/components/glitch-pulse";

/**
 * The Æ ligature with a chromatic glitch. Inside a <GlitchPulse> it fires on
 * the shared hero rhythm, in step with the terminal's tremor; anywhere else —
 * the header — it schedules its own, so the two never lock into a page-wide
 * blink. Reduced motion disables scheduling entirely.
 */
export function GlitchAe() {
  const shared = useGlitchPulse();
  const own = useGlitchSchedule(shared === null);
  const glitching = shared ?? own;

  return <span className={glitching ? "aeon-glitch-burst" : undefined}>Æ</span>;
}
