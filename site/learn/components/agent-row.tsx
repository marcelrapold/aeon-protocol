"use client";

import * as React from "react";
import { BRANDS, BrandMark } from "@/components/brand-marks";
import { useGlitchPulse } from "@/components/glitch-pulse";
import { AGENTS } from "@/lib/content";
import { cn } from "@/lib/utils";

/** Gap between one mark lighting and the next, in milliseconds. Seven marks
 *  at this spacing plus the flare's own length finish inside one burst. */
const STAGGER_MS = 70;

/**
 * The runtimes, beneath the transcript, on the hero's shared glitch rhythm.
 *
 * When the pulse fires the Æ splits and the terminal loses sync — both read as
 * damage. This row answers the same beat the other way round: each mark lights
 * in its own colour and settles, one after the next, so a charge appears to run
 * along the row. The same event, told as signal instead of fault.
 *
 * Outside a <GlitchPulse> the hook returns null and the row simply sits still.
 */
export function AgentRow({ label }: { label: string }) {
  const pulsing = useGlitchPulse();

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 lg:justify-start">
      <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {/* The list needs the same rule as its container: it stretches to the
          full width, so without this its wrapped rows both start at the left
          edge while the box around them is centred. */}
      <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 lg:justify-start">
        {AGENTS.map((agent, index) => {
          const hex = agent.brand ? BRANDS[agent.brand].hex : null;
          return (
            <li key={agent.name}>
              <a
                href={agent.href}
                target="_blank"
                rel="noopener noreferrer"
                style={
                  {
                    ...(hex ? { "--brand": hex } : {}),
                    "--flare-delay": `${index * STAGGER_MS}ms`,
                  } as React.CSSProperties
                }
                className={cn(
                  // The mark carries the foreground colour so it reads at a
                  // glance; the name stays quiet beside it. Both take the
                  // brand's own colour on hover — and on the pulse.
                  "group inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-[var(--brand,hsl(var(--foreground)))]",
                  pulsing && "aeon-brand-flare",
                )}
              >
                {agent.brand ? (
                  <BrandMark
                    slug={agent.brand}
                    className="size-4 shrink-0 text-foreground transition-colors group-hover:text-[var(--brand,hsl(var(--foreground)))]"
                  />
                ) : null}
                <span className="text-xs font-medium">{agent.name}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
