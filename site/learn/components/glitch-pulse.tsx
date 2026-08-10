"use client";

import * as React from "react";

/**
 * One rhythm the hero glitches to. The Æ ligature and the terminal subscribe
 * to the same pulse, so the chromatic split and the tremor are one event
 * rather than two coincidences that happen to land near each other.
 *
 * The header deliberately stays outside this: it sits above every page, and
 * syncing it would turn a local stutter into a whole-page blink.
 */

const PulseContext = React.createContext<boolean | null>(null);

/** How long one burst runs. Must match the animations in globals.css. */
export const BURST_MS = 1250;

/**
 * The irregular schedule itself: 2.5–8s between bursts, uniformly random, so
 * it never settles into a metronome. Pass `enabled: false` to stay quiet —
 * used by consumers that are already following a shared pulse. Reduced motion
 * disables scheduling entirely.
 */
export function useGlitchSchedule(enabled = true): boolean {
  const [pulsing, setPulsing] = React.useState(false);

  React.useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let start: number;
    let end: number;

    const schedule = () => {
      start = window.setTimeout(
        () => {
          setPulsing(true);
          end = window.setTimeout(() => {
            setPulsing(false);
            schedule();
          }, BURST_MS);
        },
        2500 + Math.random() * 5500,
      );
    };

    schedule();
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(end);
    };
  }, [enabled]);

  return enabled ? pulsing : false;
}

/** Broadcasts one schedule to everything beneath it. Renders no markup. */
export function GlitchPulse({ children }: { children: React.ReactNode }) {
  const pulsing = useGlitchSchedule();
  return <PulseContext.Provider value={pulsing}>{children}</PulseContext.Provider>;
}

/** The shared pulse, or null when nothing above is broadcasting one. */
export function useGlitchPulse(): boolean | null {
  return React.useContext(PulseContext);
}

/**
 * Answers the pulse with a tremor. Deliberately displacement only — the
 * terminal shakes in its frame, it does not flare, so the transcript stays
 * readable straight through.
 */
export function GlitchQuake({ children }: { children: React.ReactNode }) {
  const pulsing = useGlitchPulse();
  return <div className={pulsing ? "aeon-term-quake" : undefined}>{children}</div>;
}
