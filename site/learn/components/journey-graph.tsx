import {
  ArrowRight,
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
import { STEPS } from "@/lib/content";
import { t, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * The method section's single source of truth: the journey flowchart with the
 * five phases folded in as group headers. One narrative — no parallel
 * step-list, no diagram runtime, pure server-rendered markup.
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
  children,
}: {
  icon: LucideIcon;
  title: string;
  sub?: string;
  state?: string;
  variant?: "default" | "mono" | "gate" | "final";
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative z-10 h-full rounded-xl border px-4 py-3",
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
      {children}
    </div>
  );
}

function Edge({ label }: { label?: string }) {
  return (
    <div aria-hidden="true" className="flex flex-col items-center py-0.5">
      <span className="h-4 w-px bg-border xl:h-8" />
      {label ? (
        <span className="my-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-primary">
          {label}
        </span>
      ) : null}
      <span className={cn("w-px bg-border", label ? "h-2" : "h-1 xl:h-4")} />
      <ChevronDown className="-mt-1.5 size-3.5 text-border" strokeWidth={3} />
    </div>
  );
}

/**
 * Two sequential nodes side by side on wide screens (with a horizontal
 * arrow), stacked with a vertical edge below xl. `hidden` elements are not
 * grid items, so the same DOM serves both layouts.
 */
function Pair({ a, b }: { a: React.ReactNode; b: React.ReactNode }) {
  return (
    <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] xl:items-stretch xl:gap-2">
      {a}
      <div className="xl:hidden">
        <Edge />
      </div>
      <div aria-hidden="true" className="hidden xl:flex xl:items-center">
        <ArrowRight className="size-4 text-border" strokeWidth={3} />
      </div>
      {b}
    </div>
  );
}

/**
 * Phase group header — number, icon, title and the explanatory sentence.
 *
 * On large screens the header moves into the left rail beside the flow:
 * `lg:absolute` with an auto `top` keeps the element's static (in-flow)
 * vertical position, so it sits exactly at the height of its first node —
 * no measuring, no JS. `inline` keeps a header in the flow at every
 * breakpoint (used inside the sessions box, whose positioned loop wrapper
 * would otherwise capture the absolute header).
 */
function Phase({
  n,
  title,
  body,
  icon: Icon,
  inline = false,
  insideLoop = false,
}: {
  n: string;
  title: string;
  body: string;
  icon: LucideIcon;
  inline?: boolean;
  /** Headers inside the positioned loop wrapper anchor to it, not to the
   *  figure — they need a negative left equal to the gutter (pl-72) to
   *  escape into the rail. */
  insideLoop?: boolean;
}) {
  return (
    <div
      className={cn(
        "mb-3 mt-6",
        !inline && "lg:absolute lg:mb-0 lg:mt-0 lg:w-64 xl:w-72",
        !inline && (insideLoop ? "lg:-left-72 xl:-left-80" : "lg:left-0"),
      )}
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-background font-mono text-xs font-semibold text-primary"
        >
          {n}
        </span>
        <Icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
        <h3 className="text-base font-semibold">{title}</h3>
        <span aria-hidden="true" className="h-px flex-1 bg-border" />
      </div>
      <p className={cn("mt-1.5 pl-11 text-sm text-muted-foreground", !inline && "lg:text-xs")}>
        {body}
      </p>
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
  const tt = t(lang);
  const g = tt.how.graph;
  const phase = (
    key: (typeof STEPS)[number]["key"],
    opts: { inline?: boolean; insideLoop?: boolean } = {},
  ) => {
    const step = STEPS.find((s) => s.key === key)!;
    const prose = tt.how.steps[key];
    return (
      <Phase
        n={step.n}
        title={prose.title}
        body={prose.body}
        icon={step.icon}
        inline={opts.inline}
        insideLoop={opts.insideLoop}
      />
    );
  };

  return (
    // On lg+ the phase headers float into a left rail (see Phase); on xl+ the
    // figure fills the section and sequential nodes sit in side-by-side pairs.
    // Capped on ultrawide displays: past ~1400px the node pairs get airy
    // without carrying more meaning.
    <figure
      aria-label={tt.how.title}
      className="relative mx-auto max-w-lg lg:max-w-3xl lg:pl-72 xl:max-w-[88rem] xl:pl-80"
    >
      <Node icon={SquareTerminal} title={tt.how.input} sub={tt.how.inputCaption} variant="mono" />
      <Edge />
      <Node icon={Bot} title={g.orchestrator} sub={g.orchestratorSub} />
      <Edge />

      {phase("discover")}

      {/* Revise loop: the contract gate feeds back into discovery */}
      <div className="relative">
        <LoopRail label={g.edgeNo} />
        <Pair
          a={<Node icon={Settings2} title={g.capabilities} sub={g.capabilitiesSub} state="UNINITIALIZED" />}
          b={<Node icon={MessageCircleQuestion} title={g.discovery} sub={g.discoverySub} state="DISCOVERY" />}
        />
        <Edge />

        {phase("research", { insideLoop: true })}
        <Node icon={Microscope} title={g.research} sub={g.researchSub} state="RESEARCHING">
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {tt.how.tiers.map((tier) => (
              <li
                key={tier}
                className="rounded-full border border-border bg-secondary px-2 py-0.5 font-mono text-[10px] text-secondary-foreground"
              >
                {tier}
              </li>
            ))}
          </ul>
        </Node>
        <Edge />

        {phase("structure", { insideLoop: true })}
        <Pair
          a={<Node icon={Network} title={g.map} sub={g.mapSub} state="MAPPING" />}
          b={<Node icon={FileCheck2} title={g.curriculum} sub={g.curriculumSub} state="CURRICULUM_READY" />}
        />
        <Edge />
        <Node icon={ClipboardCheck} title={g.gateContract} variant="gate" />
        {/* Edge label on small screens, where the rail is hidden */}
        <p className="mt-2 text-center font-mono text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:hidden">
          {g.edgeNo} ↺
        </p>
      </div>
      <Edge label={g.edgeYes} />

      {phase("learn")}
      <div className="rounded-2xl border border-border bg-secondary/30 p-3 sm:p-4">
        <p className="mb-3 text-center font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {g.sessionsBox}
        </p>
        <div className="relative">
          <LoopRail label={g.edgeAdapt} />
          <Pair
            a={<Node icon={Play} title={g.session} sub={g.sessionSub} state="ACTIVE" />}
            b={<Node icon={Repeat2} title={g.retrieval} sub={g.retrievalSub} />}
          />
          <Edge />

          {phase("adapt", { inline: true })}
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
