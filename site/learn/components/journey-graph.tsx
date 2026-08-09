import {
  Award,
  Bot,
  ChevronDown,
  ClipboardCheck,
  FileCheck2,
  MessageCircleQuestion,
  Microscope,
  Network,
  Play,
  Repeat2,
  RotateCcw,
  Settings2,
  SquareTerminal,
  type LucideIcon,
} from "lucide-react";
import { t, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * The README's Mermaid journey flowchart, hand-built in the site's design
 * system: token-styled nodes, the learning-contract gate with its revise
 * loop, the session loop, and the protocol's state names as chips. Pure
 * server-rendered markup — no diagram runtime, the site stays static.
 */

function StateChip({ state }: { state: string }) {
  return (
    <span className="rounded border border-primary/30 bg-accent px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-accent-foreground">
      {state}
    </span>
  );
}

function Node({
  icon: Icon,
  title,
  sub,
  state,
  variant = "default",
}: {
  icon: LucideIcon;
  title: string;
  sub?: string;
  state?: string;
  variant?: "default" | "mono" | "gate" | "final";
}) {
  return (
    <div
      className={cn(
        "relative z-10 rounded-xl border px-4 py-3",
        variant === "default" && "border-border bg-card",
        variant === "mono" && "border-border bg-card font-mono",
        variant === "gate" && "border-2 border-primary/60 bg-accent",
        variant === "final" && "border-primary bg-primary/10",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <span className="flex items-center gap-2 text-sm font-semibold">
          <Icon
            className={cn("size-4 shrink-0", variant === "gate" ? "text-accent-foreground" : "text-primary")}
            aria-hidden="true"
          />
          {title}
        </span>
        {state ? <StateChip state={state} /> : null}
      </div>
      {sub ? <p className="mt-1 text-xs text-muted-foreground">{sub}</p> : null}
    </div>
  );
}

function Edge({ label }: { label?: string }) {
  return (
    <div aria-hidden="true" className="flex flex-col items-center py-0.5">
      <span className="h-4 w-px bg-border" />
      {label ? (
        <span className="my-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-primary">
          {label}
        </span>
      ) : null}
      <span className={cn("w-px bg-border", label ? "h-2" : "h-1")} />
      <ChevronDown className="-mt-1.5 size-3.5 text-border" strokeWidth={3} />
    </div>
  );
}

/**
 * Dashed feedback rail on the right edge of a loop scope. The wrapper spans
 * exactly the looped rows by DOM construction, so the rail's height is always
 * correct — no measuring, no JS.
 */
function LoopRail({ label }: { label: string }) {
  return (
    <div aria-hidden="true" className="absolute -right-3 bottom-8 top-8 hidden w-3 sm:block md:-right-6 md:w-6">
      <div className="absolute inset-0 rounded-r-xl border-2 border-l-0 border-dashed border-primary/40" />
      <RotateCcw className="absolute -left-2 -top-2 size-4 text-primary" />
      <span className="absolute -right-2 top-1/2 -translate-y-1/2 md:-right-3">
        <span className="block whitespace-nowrap rounded border border-primary/40 bg-background px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-primary [writing-mode:vertical-rl]">
          {label}
        </span>
      </span>
    </div>
  );
}

export function JourneyGraph({ lang }: { lang: Lang }) {
  const g = t(lang).how.graph;

  return (
    <figure aria-label={g.title} className="mx-auto max-w-lg">
      <Node icon={SquareTerminal} title={g.invocation} sub={g.invocationSub} variant="mono" />
      <Edge />
      <Node icon={Bot} title={g.orchestrator} sub={g.orchestratorSub} />
      <Edge />
      <Node icon={Settings2} title={g.capabilities} sub={g.capabilitiesSub} state="UNINITIALIZED" />
      <Edge />

      {/* Revise loop: contract gate feeds back into discovery */}
      <div className="relative">
        <LoopRail label={g.edgeNo} />
        <Node icon={MessageCircleQuestion} title={g.discovery} sub={g.discoverySub} state="DISCOVERY" />
        <Edge />
        <Node icon={Microscope} title={g.research} sub={g.researchSub} state="RESEARCHING" />
        <Edge />
        <Node icon={Network} title={g.map} sub={g.mapSub} state="MAPPING" />
        <Edge />
        <Node icon={FileCheck2} title={g.curriculum} sub={g.curriculumSub} state="CURRICULUM_READY" />
        <Edge />
        <Node icon={ClipboardCheck} title={g.gateContract} variant="gate" />
        {/* Edge labels on small screens, where the rail is hidden */}
        <p className="mt-2 text-center font-mono text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:hidden">
          {g.edgeNo} ↺
        </p>
      </div>
      <Edge label={g.edgeYes} />

      {/* Session loop inside the "progressive sessions" subgraph */}
      <div className="rounded-2xl border border-border bg-secondary/30 p-3 sm:p-4">
        <p className="mb-3 text-center font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {g.sessionsBox}
        </p>
        <div className="relative">
          <LoopRail label={g.edgeAdapt} />
          <Node icon={Play} title={g.session} sub={g.sessionSub} state="ACTIVE" />
          <Edge />
          <Node icon={Repeat2} title={g.retrieval} sub={g.retrievalSub} />
          <Edge />
          <Node icon={ClipboardCheck} title={g.gateAssessment} variant="gate" state="ASSESSING" />
          <p className="mt-2 text-center font-mono text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            <span className="sm:hidden">{g.edgeAdapt} ↺ · </span>
            {g.edgeNext} ↺ <span className="text-primary">ADAPTING</span>
          </p>
        </div>
      </div>
      <Edge label={g.edgeMastery} />

      <Node icon={Award} title={g.completion} sub={g.completionSub} state="COMPLETED" variant="final" />
    </figure>
  );
}
