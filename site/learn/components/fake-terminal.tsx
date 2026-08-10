"use client";

import * as React from "react";
import { useGlitchPulse } from "@/components/glitch-pulse";
import { cn } from "@/lib/utils";

/**
 * A fictional ÆON Learn orchestrator run, played back in a cyberpunk-violet
 * terminal. Deliberately English on both locales — it impersonates agent
 * output, matching the English invocation. The transcript mirrors the real
 * protocol phases and state machine, so the animation doubles as
 * documentation. Decorative: aria-hidden, with reduced-motion fallback to a
 * static transcript.
 */

type LineKind = "cmd" | "ok" | "state" | "ask" | "out" | "approve";

const SCRIPT: { kind: LineKind; text: string }[] = [
  { kind: "cmd", text: 'aeon learn --invoke "Teach me Austrian Economics"' },
  { kind: "ok", text: "fetching learn.rapold.io/llms.txt … ok · ÆON Learn 0.1" },
  { kind: "out", text: "role: orchestrator · runtime: your agent" },
  { kind: "out", text: "capabilities  web_research ✓  file_generation ✓  scheduled_tasks ✗" },
  { kind: "state", text: "UNINITIALIZED → DISCOVERY" },
  { kind: "ask", text: 'current knowledge? … "read some Hazlitt"' },
  { kind: "ask", text: 'goal? … "reason about business cycles"' },
  { kind: "ask", text: "time budget? … 20 min/day · 14 days" },
  { kind: "state", text: "DISCOVERY → RESEARCHING" },
  { kind: "ok", text: "evidence map · Tier 1: Menger 1871 · Mises 1920 · Hayek 1945" },
  { kind: "ok", text: "Tier 2: reviews + textbooks … 12 sources anchored" },
  { kind: "state", text: "RESEARCHING → MAPPING" },
  { kind: "out", text: "knowledge graph: 23 concepts · 4 controversies · 6 misconceptions" },
  { kind: "state", text: "MAPPING → CURRICULUM_READY" },
  { kind: "out", text: "14 modules compiled, dependency-ordered" },
  { kind: "out", text: "learning contract → awaiting approval" },
  { kind: "approve", text: "approve" },
  { kind: "state", text: "CURRICULUM_READY → ACTIVE" },
  { kind: "ok", text: "session 01/14: subjective value — why price ≠ cost" },
];

const KIND_CLASS: Record<LineKind, string> = {
  cmd: "text-violet-300",
  ok: "text-fuchsia-300/90",
  state: "text-cyan-300",
  ask: "text-violet-200/80",
  out: "text-slate-300/80",
  approve: "text-violet-300",
};

const KIND_PREFIX: Record<LineKind, string> = {
  cmd: "$ ",
  ok: "▸ ",
  state: "⟨state⟩ ",
  ask: "? ",
  out: "  ",
  approve: "> ",
};

const TYPE_MS = 14; // per character
const LINE_PAUSE_MS = 260;
const RESTART_PAUSE_MS = 7000;

function usePrefersReducedMotion() {
  return React.useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

export function FakeTerminal({ title }: { title: string }) {
  const reduced = usePrefersReducedMotion();
  // Shares the hero's glitch rhythm: when the Æ ligature splits, this screen
  // loses sync. Null outside a <GlitchPulse>, and then nothing happens.
  const glitching = useGlitchPulse();
  const [progress, setProgress] = React.useState({ line: 0, chars: 0 });

  React.useEffect(() => {
    if (reduced) return;
    let line = 0;
    let chars = 0;
    let timer: number;

    const tick = () => {
      if (line >= SCRIPT.length) {
        timer = window.setTimeout(() => {
          line = 0;
          chars = 0;
          setProgress({ line: 0, chars: 0 });
          timer = window.setTimeout(tick, 400);
        }, RESTART_PAUSE_MS);
        return;
      }
      const current = SCRIPT[line].text;
      if (chars < current.length) {
        chars += 2; // two chars per tick keeps the run brisk
        setProgress({ line, chars });
        timer = window.setTimeout(tick, TYPE_MS);
      } else {
        line += 1;
        chars = 0;
        setProgress({ line, chars });
        timer = window.setTimeout(tick, LINE_PAUSE_MS);
      }
    };

    timer = window.setTimeout(tick, 600);
    return () => window.clearTimeout(timer);
  }, [reduced]);

  const visible = reduced
    ? SCRIPT.map((l) => ({ ...l, shown: l.text }))
    : SCRIPT.slice(0, progress.line + 1).map((l, i) => ({
        ...l,
        shown: i < progress.line ? l.text : l.text.slice(0, progress.chars),
      }));

  return (
    <div
      aria-hidden="true"
      className="animate-term-breathe relative overflow-hidden rounded-xl border border-primary/30 bg-[#0b0918]/95 shadow-[0_0_60px_-12px_hsl(var(--primary)/0.45)]"
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-primary/20 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-primary/40" />
        <span className="size-2.5 rounded-full bg-primary/25" />
        <span className="size-2.5 rounded-full bg-primary/15" />
        <span className="ml-2 font-mono text-[11px] uppercase tracking-widest text-violet-300/60">
          {title}
        </span>
      </div>

      {/* Transcript — bottom-anchored like a real tail */}
      {/* Bottom-anchored like a real tail; grows with the viewport so big
          displays get more transcript and laptops stay compact. */}
      <div
        className={cn(
          "flex h-[19rem] flex-col justify-end overflow-hidden px-4 pb-4 pt-2 sm:h-[21rem] [@media(min-height:940px)]:h-[23rem] 2xl:[@media(min-height:1000px)]:h-[27rem]",
          glitching && "aeon-crt-glitch",
        )}
      >
        {visible.map((line, i) => (
          <p
            key={`${i}-${line.text.slice(0, 8)}`}
            className={cn("whitespace-pre-wrap font-mono text-[12px] leading-5", KIND_CLASS[line.kind])}
          >
            <span className="select-none opacity-70">{KIND_PREFIX[line.kind]}</span>
            {line.shown}
            {!reduced && i === visible.length - 1 ? (
              <span className="ml-0.5 inline-block h-3.5 w-[7px] translate-y-0.5 animate-pulse bg-violet-300/80" />
            ) : null}
          </p>
        ))}
      </div>

      {/* Scanlines + vignette for the CRT feel */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--primary)) 2px, hsl(var(--primary)) 3px)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(5,3,15,0.55))]" />
    </div>
  );
}
