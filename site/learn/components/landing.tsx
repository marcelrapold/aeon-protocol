import { ArrowRight, ArrowUpRight, FileJson2, FlaskConical, ListChecks, ScrollText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { topicHref } from "@/components/topic-page";
import { AuditorMark } from "@/components/auditor-mark";
import { BRANDS, BrandMark } from "@/components/brand-marks";
import { CommandBlock, CopyChip, CopyCommandButton } from "@/components/copy-command";
import { FakeTerminal } from "@/components/fake-terminal";
import { GlitchAe } from "@/components/glitch-ae";
import { GlitchPulse } from "@/components/glitch-pulse";
import { HeroArtworkStack } from "@/components/hero-artwork-stack";
import { HeroKnowledgeParticles } from "@/components/hero-knowledge-particles";
import { JourneyGraph } from "@/components/journey-graph";
import { Reveal } from "@/components/reveal";
import { GroupVisual, TopicVisual } from "@/components/topic-visual";
import { SiteFooter, SiteHeader, homeNav } from "@/components/site-chrome";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  AGENTS,
  blobUrl,
  CHARISMA,
  ORIGIN_CHAIN,
  PACKAGE_GROUPS,
  packagesIn,
  PRINCIPLES,
  REPO,
  STACK,
  treeUrl,
  VERSION,
} from "@/lib/content";
import { t, type Lang } from "@/lib/i18n";
import { DESCRIPTION, SITE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

/* ── Section scaffold ───────────────────────────────────────────────── */

/**
 * Placement variants for the section aura — the hero's violet bloom, echoed
 * through the page in different positions and strengths so it reads as an
 * atmosphere, not a repeated asset.
 */
const AURA: Record<string, string> = {
  left: "-left-48 -top-32 h-[26rem] w-[40rem] bg-primary/10",
  right: "-right-48 -top-24 h-[24rem] w-[38rem] bg-primary/10",
  "left-soft": "-left-40 top-1/3 h-[20rem] w-[30rem] bg-primary/[0.07]",
  "right-soft": "-right-40 top-1/4 h-[20rem] w-[30rem] bg-primary/[0.07]",
  floor: "-bottom-56 left-1/2 h-[24rem] w-[48rem] -translate-x-1/2 bg-primary/[0.08]",
};

function Section({
  id,
  eyebrow,
  title,
  lead,
  aura,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  lead?: string;
  aura?: keyof typeof AURA;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="relative overflow-hidden border-b border-border/60 py-20 md:py-28">
      {aura ? (
        <div
          aria-hidden="true"
          className={cn("pointer-events-none absolute -z-10 rounded-full blur-3xl", AURA[aura])}
        />
      ) : null}
      <div className="mx-auto max-w-6xl xl:max-w-7xl 2xl:max-w-[90rem] [@media(min-width:1800px)]:max-w-[100rem] px-5">
        <Reveal>
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
            {eyebrow}
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl 2xl:max-w-4xl 2xl:text-5xl">
            {title}
          </h2>
          {lead ? (
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground 2xl:max-w-3xl 2xl:text-xl">
              {lead}
            </p>
          ) : null}
        </Reveal>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

/* ── Hero ───────────────────────────────────────────────────────────── */

function Hero({ lang }: { lang: Lang }) {
  const tt = t(lang);

  return (
    <section id="top" className="relative overflow-hidden border-b border-border/60">
      {/* Layered hero artwork: raw information gathered, structured, and
          turned into adaptive knowledge. The terminal stays the foreground
          object; these layers give it space to sit in. */}
      {/* The artwork is a dark master: bright signals drawn on near-black. On
          the dark theme it sits behind the page at full strength. On the light
          theme the same pixels are a dark slab on a white sheet, so it runs at
          a fraction of the opacity and reads as a tint rather than a picture. */}
      <HeroArtworkStack className="absolute inset-0 -z-30 opacity-25 [mask-image:linear-gradient(to_bottom,transparent,black_7%,black_92%,transparent)] lg:opacity-35 dark:opacity-70 dark:lg:opacity-100" />
      {/* Light needs its own colour, not a faded copy of the dark master —
          dimming a near-black image over white yields grey, and grey is what
          made the hero read as empty. So the light theme gets the page's own
          violet as a bloom behind the terminal and a second, cooler one low on
          the left, and the artwork drops to a texture underneath them. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(ellipse_70%_60%_at_74%_42%,hsl(var(--primary)/0.26),transparent_66%)] dark:hidden"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(ellipse_60%_55%_at_12%_88%,hsl(248_70%_58%/0.13),transparent_62%)] dark:hidden"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-background/80 dark:bg-background/70 lg:hidden"
      />
      {/* Clears the headline on the left, then lets go — on light it releases
          into the bloom rather than into a white field. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 hidden bg-gradient-to-r from-background/92 via-background/45 to-transparent dark:from-background/90 dark:via-background/52 dark:to-background/8 lg:block"
      />
      {/* Dark only. This panel is a right-anchored box, so its left edge is a
          straight vertical boundary — invisible against a dark hero, a seam
          across a light one. The light theme does not need it: the artwork is
          already faint enough not to crowd the terminal. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-[58%] bg-[radial-gradient(ellipse_at_center,hsl(var(--background)/0.08),hsl(var(--background)/0.44)_72%,transparent)] dark:lg:block"
      />
      <HeroKnowledgeParticles className="absolute inset-0 -z-10 h-full w-full opacity-65" />
      {/* Laptops are wide but short: the tall hero only kicks in when the
          viewport actually has the height for it, so a 13" MacBook still
          sees the CTA without scrolling. */}
      {/* The ligature and the terminal glitch on one shared rhythm, so the
          chromatic split and the tremor read as a single event. */}
      <GlitchPulse>
      <div className="mx-auto grid min-h-[70vh] max-w-6xl items-center gap-10 px-5 py-16 lg:min-h-[74vh] lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:[@media(min-height:940px)]:min-h-[82vh] xl:max-w-7xl [@media(min-height:940px)]:py-24 2xl:max-w-[90rem] [@media(min-width:1800px)]:max-w-[100rem]">
        <div className="flex flex-col items-start gap-6">
        <Reveal immediate>
          <Badge className="animate-badge-pulse">
            {tt.hero.badge} · {VERSION}
          </Badge>
        </Reveal>
        <Reveal immediate delay={60}>
          <h1 className="text-5xl font-bold tracking-tight md:text-7xl 2xl:text-8xl">
            <GlitchAe />
            ON <span className="text-primary">Learn</span>
          </h1>
        </Reveal>
        <Reveal immediate delay={120}>
          <p className="max-w-2xl text-2xl font-semibold leading-snug md:text-3xl 2xl:text-4xl">
            {tt.hero.subA} <span className="text-primary">{tt.hero.subB}</span> {tt.hero.subC}
          </p>
        </Reveal>
        <Reveal immediate delay={180}>
          <p className="max-w-2xl text-lg text-muted-foreground 2xl:text-xl">{tt.hero.lead}</p>
        </Reveal>
        <Reveal immediate delay={220}>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {tt.hero.meta}
          </p>
        </Reveal>
        <Reveal immediate delay={260}>
          <div className="flex flex-wrap items-center gap-3">
            <CopyCommandButton
              command={tt.invocation}
              label={tt.hero.cta}
              copiedLabel={tt.hero.ctaCopied}
              copiedAnnounce={tt.hero.copiedAnnounce}
              failedAnnounce={tt.hero.failedAnnounce}
            />
            <a href="#how" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
              {tt.hero.secondary}
              <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </Reveal>
        <Reveal immediate delay={300}>
          <p className="text-sm text-muted-foreground">{tt.hero.hint}</p>
        </Reveal>
        </div>
        <Reveal immediate delay={340}>
          <FakeTerminal title="aeon — orchestrator" />
        </Reveal>
      </div>
      </GlitchPulse>
    </section>
  );
}

/* ── Agent entry ────────────────────────────────────────────────────── */

function AgentEntry({ lang }: { lang: Lang }) {
  const tt = t(lang);

  return (
    <Section id="use" eyebrow={tt.agent.eyebrow} title={tt.agent.title} lead={tt.agent.lead} aura="right">
      <Reveal>
        <div className="rounded-xl border border-border bg-card/50 p-6">
          <CommandBlock
            command={tt.invocation}
            copyLabel={tt.agent.cmdCopy}
            copiedLabel={tt.agent.cmdCopied}
            copiedAnnounce={tt.hero.copiedAnnounce}
            failedAnnounce={tt.hero.failedAnnounce}
            hint={tt.agent.explain}
          />
          <p className="mt-4 text-sm text-muted-foreground">{tt.agent.cmdHint}</p>
          <p className="mt-4 text-sm text-muted-foreground">
            {tt.agent.notePre}{" "}
            <a href="/llms.txt" className="font-mono font-medium text-primary underline-offset-4 hover:underline">
              learn.rapold.io/llms.txt
            </a>{" "}
            {tt.agent.notePost}
          </p>
        </div>
      </Reveal>
      <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tt.agent.trust.map((item, i) => (
          <Reveal key={item.q} delay={i * 60}>
            <div className="h-full rounded-xl border border-border bg-card/50 p-5">
              <dt className="font-semibold">{item.q}</dt>
              <dd className="mt-2 text-sm text-muted-foreground">{item.a}</dd>
            </div>
          </Reveal>
        ))}
      </dl>
    </Section>
  );
}

/* ── How it works ───────────────────────────────────────────────────── */

function HowItWorks({ lang }: { lang: Lang }) {
  const tt = t(lang);

  return (
    <Section id="how" eyebrow={tt.how.eyebrow} title={tt.how.title} lead={tt.how.lead} aura="left">
      <Reveal>
        <JourneyGraph lang={lang} />
      </Reveal>
    </Section>
  );
}

/* ── A real run ─────────────────────────────────────────────────────── */

/**
 * An excerpt from an actual session, rebuilt as markup rather than pasted as
 * a screenshot: it stays sharp, themeable, translatable and selectable. The
 * contract comes first and the sessions after it, which is the whole claim
 * the rest of the page makes.
 */
function RealRun({ lang }: { lang: Lang }) {
  const tt = t(lang);

  return (
    <Section id="run" eyebrow={tt.run.eyebrow} title={tt.run.title} lead={tt.run.lead} aura="right-soft">
      <Reveal>
        <figure className="mx-auto max-w-3xl">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[0_0_60px_-24px_hsl(var(--primary)/0.5)]">
            <div className="flex items-center justify-between gap-4 border-b border-border/60 px-4 py-2.5">
              <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                <span aria-hidden="true" className="size-2 rounded-full bg-primary/50" />
                {tt.run.tab}
              </span>
              <span className="font-mono text-xs text-muted-foreground">{tt.run.thought}</span>
            </div>

            <div className="relative px-5 pb-8 pt-6 sm:px-7">
              <h3 className="text-lg font-bold sm:text-xl">{tt.run.docTitle}</h3>
              <p className="mt-5 font-semibold">{tt.run.contract}</p>

              <dl className="mt-3 space-y-2 text-sm">
                <div>
                  <dt className="inline font-semibold">{tt.run.goalLabel}: </dt>
                  <dd className="inline text-muted-foreground">{tt.run.goal}</dd>
                </div>
                <div>
                  <dt className="inline font-semibold">{tt.run.formatLabel}: </dt>
                  <dd className="inline text-muted-foreground">{tt.run.format}</dd>
                </div>
              </dl>

              <p className="mt-4 text-sm font-semibold">{tt.run.pathLabel}:</p>
              <ol className="mt-2 space-y-1 text-sm text-muted-foreground">
                {tt.run.path.map((step, i) => (
                  <li key={step} className="flex gap-3">
                    <span aria-hidden="true" className="w-5 shrink-0 text-right font-mono text-primary">
                      {i + 1}.
                    </span>
                    {step}
                  </li>
                ))}
              </ol>

              <p className="mt-6 border-t border-border/60 pt-5 font-bold">{tt.run.sessionOne}</p>

              {/* The transcript continues past the panel; the fade says so. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent"
              />
            </div>
          </div>
          <figcaption className="mx-auto mt-4 max-w-2xl text-center text-xs text-muted-foreground">
            {tt.run.caption}
          </figcaption>
        </figure>
      </Reveal>
    </Section>
  );
}

/* ── Principles ─────────────────────────────────────────────────────── */

function Principles({ lang }: { lang: Lang }) {
  const tt = t(lang);

  return (
    <Section id="why" eyebrow={tt.why.eyebrow} title={tt.why.title} lead={tt.why.lead} aura="right-soft">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PRINCIPLES.map((principle, i) => {
          const prose = tt.why.principles[principle.key];
          const Icon = principle.icon;
          return (
            <Reveal key={principle.key} delay={i * 60}>
              <div className="h-full rounded-xl border border-border bg-card/50 p-5">
                <Icon className="size-5 text-primary" aria-hidden="true" />
                <h3 className="mt-3 font-semibold">{prose.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{prose.body}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

/* ── Origin ─────────────────────────────────────────────────────────── */

function Origin({ lang }: { lang: Lang }) {
  const tt = t(lang);
  const stats: { value: string; key: keyof typeof tt.origin.stats }[] = [
    { value: String(CHARISMA.days), key: "days" },
    { value: String(CHARISMA.sources), key: "sources" },
    { value: "3", key: "preserved" },
  ];

  return (
    <Section id="origin" eyebrow={tt.origin.eyebrow} title={tt.origin.title} lead={tt.origin.lead} aura="left-soft">
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Reveal>
            <p className="max-w-xl text-muted-foreground">{tt.origin.para}</p>
          </Reveal>
          <Reveal delay={80}>
            <ol className="mt-6 flex flex-wrap items-center gap-y-2">
              {ORIGIN_CHAIN.map((key, i) => (
                <li key={key} className="flex items-center text-sm">
                  <span className="rounded-md border border-border bg-card px-2.5 py-1">
                    {tt.origin.chain[key]}
                  </span>
                  {i < ORIGIN_CHAIN.length - 1 ? (
                    <ArrowRight aria-hidden="true" className="mx-1.5 size-3.5 text-primary" />
                  ) : null}
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal delay={140}>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={CHARISMA.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "default" }))}
              >
                {tt.origin.ctaFixture}
                <ArrowUpRight aria-hidden="true" />
              </a>
              <a
                href={CHARISMA.retrospectiveHref}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                {tt.origin.ctaRetro}
              </a>
            </div>
          </Reveal>
        </div>
        <div className="lg:col-span-2">
          <dl className="grid gap-4">
            {stats.map((stat, i) => (
              <Reveal key={stat.key} delay={i * 60}>
                <div className="rounded-xl border border-border bg-card/50 p-5">
                  <dd className="text-3xl font-bold text-primary">{stat.value}</dd>
                  <dt className="mt-1 text-sm text-muted-foreground">{tt.origin.stats[stat.key]}</dt>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}

/* ── Library ────────────────────────────────────────────────────────── */

function Library({ lang }: { lang: Lang }) {
  const tt = t(lang);

  return (
    <Section id="library" eyebrow={tt.library.eyebrow} title={tt.library.title} lead={tt.library.lead} aura="floor">
      <div className="space-y-12">
        {PACKAGE_GROUPS.map((group) => (
          <div key={group.key}>
            <Reveal>
              <div className="relative mb-5 overflow-hidden rounded-xl">
                <GroupVisual group={group.key} />
                {/* The motif's size follows the panel's width, not the band's
                    height, so the band stays a slim chapter rule and simply
                    crops the artwork. */}
                <div className="flex items-center gap-4 px-4 py-6 sm:py-8 xl:py-10 2xl:py-12">
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
                    {tt.library.groups[group.key]}
                  </h3>
                  <span aria-hidden="true" className="h-px flex-1 bg-border" />
                  <span className="font-mono text-xs text-muted-foreground">{group.ids.length}</span>
                </div>
              </div>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {packagesIn(group.key).map((pkg, i) => {
                const prose = tt.library.packages[pkg.id];
                const Icon = pkg.icon;
                return (
                  <Reveal key={pkg.id} delay={i * 50} className="h-full">
                    <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/50">
                      {/* The artwork is the card's link target: it looks
                          clickable, so it is. The copy button stays outside
                          it — an anchor may not contain a button. */}
                      <Link
                        href={topicHref(lang, pkg.id)}
                        aria-label={prose.name}
                        className="block select-none"
                      >
                        <TopicVisual id={pkg.id}>
                          <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 px-5 pb-4">
                            <Icon
                              aria-hidden="true"
                              className="size-6 shrink-0 text-primary transition-[filter] duration-300 group-hover:[filter:drop-shadow(0_0_10px_currentColor)]"
                            />
                            <h3 className="font-semibold leading-tight">{prose.name}</h3>
                            <ArrowUpRight
                              aria-hidden="true"
                              className="ml-auto size-4 shrink-0 -translate-x-1 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                            />
                          </div>
                        </TopicVisual>
                      </Link>
                      <div className="flex flex-1 flex-col px-5 pb-5 pt-2">
                        <p className="flex-1 text-sm text-muted-foreground">{prose.blurb}</p>
                        <p className="mt-4 font-mono text-xs uppercase tracking-wide text-muted-foreground">
                          {prose.meta}
                        </p>
                        <div className="mt-3">
                          <CopyChip
                            text={prose.invocation}
                            label={tt.library.copy}
                            copiedLabel={tt.library.copied}
                            copiedAnnounce={tt.hero.copiedAnnounce}
                            failedAnnounce={tt.hero.failedAnnounce}
                          />
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <Reveal delay={200}>
        <p className="mt-8 text-sm text-muted-foreground">{tt.library.note}</p>
      </Reveal>
    </Section>
  );
}

/* ── Protocol ───────────────────────────────────────────────────────── */

function Protocol({ lang }: { lang: Lang }) {
  const tt = t(lang);
  const groups = [
    { key: "core" as const, href: treeUrl("protocol"), icon: ScrollText },
    { key: "learn" as const, href: treeUrl("products/learn"), icon: FlaskConical },
    { key: "schemas" as const, href: treeUrl("schemas"), icon: FileJson2 },
    { key: "evals" as const, href: treeUrl("evals/learn"), icon: ListChecks },
  ];

  return (
    <Section id="protocol" eyebrow={tt.protocol.eyebrow} title={tt.protocol.title} lead={tt.protocol.lead} aura="right">
      <div className="grid gap-4 sm:grid-cols-2">
        {groups.map((group, i) => {
          const prose = tt.protocol.groups[group.key];
          const Icon = group.icon;
          return (
            <Reveal key={group.key} delay={i * 60}>
              <a
                href={group.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full items-start gap-4 rounded-xl border border-border bg-card/50 p-5 transition-colors hover:border-primary/50"
              >
                <Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <h3 className="font-semibold">
                    {prose.title}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="ml-1 inline size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{prose.blurb}</p>
                </div>
              </a>
            </Reveal>
          );
        })}
      </div>
      <Reveal delay={240}>
        <p className="mt-6 font-mono text-xs text-muted-foreground">
          {tt.protocol.version}:{" "}
          <a
            href={`${REPO}/releases/tag/${VERSION}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline-offset-4 hover:underline"
          >
            {VERSION}
          </a>{" "}
          · <a href={blobUrl("LICENSE")} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Apache-2.0</a>
        </p>
      </Reveal>
    </Section>
  );
}

/* ── Audited by the sibling project ─────────────────────────────────── */

/**
 * Cross-link to auditor.rapold.io, carrying the actual audit scores rather
 * than a decorative badge — the sibling project's own rule is that evidence
 * beats assertion. Emerald, not violet: this strip points somewhere else.
 */
function AuditedStrip({ lang }: { lang: Lang }) {
  const tt = t(lang);

  return (
    <section className="border-b border-border/60 py-12">
      <div className="mx-auto max-w-6xl px-5 xl:max-w-7xl 2xl:max-w-[90rem] [@media(min-width:1800px)]:max-w-[100rem]">
        <Reveal>
          <a
            href="https://auditor.rapold.io"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block overflow-hidden rounded-xl border border-emerald-500/25 bg-emerald-500/[0.04] p-6 transition-colors hover:border-emerald-500/50"
          >
            {/* The sibling project's own hero artwork — its orchestrator core
                ringed by satellite modules — carried over as the teaser's
                backdrop so the link is recognisable before it is read. */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
              <Image
                src="/visuals/auditor/orchestrator-core.webp"
                alt=""
                fill
                sizes="(min-width: 1280px) 90vw, 100vw"
                className="object-cover object-right opacity-30 transition-opacity duration-500 group-hover:opacity-45 dark:opacity-40 dark:group-hover:opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
            </div>
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <AuditorMark className="mt-0.5 size-6 shrink-0 text-emerald-500 dark:text-emerald-400" />
                <div>
                  <p className="font-mono text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                    {tt.audited.eyebrow}
                  </p>
                  <p className="mt-2 max-w-2xl text-sm">
                    {tt.audited.claim}{" "}
                    <span className="font-mono text-emerald-600 underline-offset-4 group-hover:underline dark:text-emerald-400">
                      auditor.rapold.io
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="ml-1 inline size-3.5 text-emerald-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-emerald-400"
                    />
                  </p>
                </div>
              </div>
              {/* Wraps on narrow screens; only pinned against shrinking once
                  the row layout kicks in at lg. */}
              <dl className="flex flex-wrap gap-3 lg:shrink-0 lg:flex-nowrap">
                {tt.audited.scores.map((score) => (
                  <div
                    key={score.label}
                    className="rounded-lg border border-emerald-500/25 bg-background px-3 py-2 text-center"
                  >
                    <dd className="font-mono text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                      {score.value}
                    </dd>
                    <dt className="mt-0.5 max-w-[7rem] text-[10px] uppercase tracking-wide text-muted-foreground">
                      {score.label}
                    </dt>
                  </div>
                ))}
              </dl>
            </div>
            <p className="mt-4 border-t border-emerald-500/15 pt-4 text-xs text-muted-foreground">
              {tt.audited.note}
            </p>
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Call to action ─────────────────────────────────────────────────── */

function CallToAction({ lang }: { lang: Lang }) {
  const tt = t(lang);

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl xl:max-w-7xl 2xl:max-w-[90rem] [@media(min-width:1800px)]:max-w-[100rem] px-5">
        <Reveal>
          <div className="bg-grid relative overflow-hidden rounded-2xl border border-border p-10 text-center [mask-image:none] md:p-16">
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.12),transparent_70%)]"
            />
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
              {tt.cta.title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">{tt.cta.lead}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <CopyCommandButton
                command={tt.invocation}
                label={tt.cta.button}
                copiedLabel={tt.cta.buttonCopied}
                copiedAnnounce={tt.hero.copiedAnnounce}
                failedAnnounce={tt.hero.failedAnnounce}
              />
              <a
                href={REPO}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                {tt.cta.gh}
                <ArrowUpRight aria-hidden="true" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Built with ─────────────────────────────────────────────────────── */

/* ── Works with ─────────────────────────────────────────────────────── */

/**
 * The runtime is the reader's own agent, so the credible thing to show is
 * which agents that can be. Marks sit in the row's grey and take their brand
 * colour on hover, the same treatment the stack strip gets.
 *
 * Where an owner keeps its mark out of general circulation, the name is set
 * in type instead of drawn — naming a product is fair, reproducing a
 * restricted mark is not, and a strip that quietly did the latter would
 * undercut the very credibility it is here to build.
 */
function WorksWith({ lang }: { lang: Lang }) {
  const tt = t(lang);

  return (
    <section className="border-t border-border/60 py-14">
      <div className="mx-auto max-w-6xl px-5 xl:max-w-7xl 2xl:max-w-[90rem] [@media(min-width:1800px)]:max-w-[100rem]">
        <Reveal>
          <p className="text-center font-mono text-xs font-semibold uppercase tracking-widest text-primary">
            {tt.agents.eyebrow}
          </p>
          <h2 className="mt-3 text-center text-2xl font-bold tracking-tight md:text-3xl">
            {tt.agents.title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted-foreground">
            {tt.agents.lead}
          </p>
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-6">
            {AGENTS.map((agent) => {
              const hex = agent.brand ? BRANDS[agent.brand].hex : null;
              return (
                <li key={agent.name}>
                  <a
                    href={agent.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={hex ? ({ "--brand": hex } as React.CSSProperties) : undefined}
                    className="inline-flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-[var(--brand,hsl(var(--foreground)))]"
                  >
                    {agent.brand ? (
                      <BrandMark slug={agent.brand} className="size-6 shrink-0" />
                    ) : null}
                    <span className="text-base font-semibold tracking-tight">{agent.name}</span>
                  </a>
                </li>
              );
            })}
          </ul>
          <p className="mx-auto mt-8 max-w-xl text-center text-[11px] text-muted-foreground/70">
            {tt.agents.trademarks}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Built with ─────────────────────────────────────────────────────── */

function BuiltWith({ lang }: { lang: Lang }) {
  const tt = t(lang);

  return (
    <section className="border-t border-border/60 py-10">
      <div className="mx-auto max-w-6xl px-5 xl:max-w-7xl 2xl:max-w-[90rem] [@media(min-width:1800px)]:max-w-[100rem]">
        <Reveal>
          <p className="text-center font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {tt.stack.label}
          </p>
          <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-7 gap-y-5">
            {STACK.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  // The mark rests in the row's own grey and takes its brand
                  // colour on hover, so the strip reads as one line of type
                  // until you reach for something in it.
                  style={BRANDS[item.brand].hex ? ({ "--brand": BRANDS[item.brand].hex } as React.CSSProperties) : undefined}
                  className="group inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-[var(--brand,hsl(var(--foreground)))]"
                >
                  <BrandMark slug={item.brand} className="size-5 shrink-0" />
                  <span className="font-mono text-xs">{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-4 max-w-xl text-center text-xs text-muted-foreground">
            {tt.stack.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Page ───────────────────────────────────────────────────────────── */

export function Landing({ lang }: { lang: Lang }) {
  const tt = t(lang);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}#software`,
    name: "ÆON Learn",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any",
    description: DESCRIPTION,
    url: SITE_URL,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    license: "https://www.apache.org/licenses/LICENSE-2.0",
    codeRepository: REPO,
    author: { "@type": "Person", name: "Marcel Rapold" },
    publisher: { "@id": `${SITE_URL}#org` },
  };

  // Who publishes this and what the site is, stated once and referenced by id
  // from everything else. Without it a search engine has an application with
  // no publisher behind it, which is the weakest possible answer to the
  // question of who is doing the teaching.
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}#org`,
    name: "ÆON Learn",
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    founder: { "@type": "Person", name: "Marcel Rapold" },
    sameAs: [REPO, "https://www.linkedin.com/in/marcelrapold/", "https://auditor.rapold.io"],
  };

  const site = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}#website`,
    name: "ÆON Learn",
    url: lang === "de" ? `${SITE_URL}/de` : SITE_URL,
    inLanguage: lang === "de" ? "de-CH" : "en",
    publisher: { "@id": `${SITE_URL}#org` },
    license: "https://www.apache.org/licenses/LICENSE-2.0",
  };

  return (
    <div className="relative" lang={lang === "de" ? "de" : undefined}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        {tt.a11y.skip}
      </a>
      <SiteHeader lang={lang} nav={homeNav(lang)} langHref={lang === "de" ? "/" : "/de"} />
      <main id="main">
        <Hero lang={lang} />
        <AgentEntry lang={lang} />
        <WorksWith lang={lang} />
        <HowItWorks lang={lang} />
        <RealRun lang={lang} />
        <Principles lang={lang} />
        <Origin lang={lang} />
        <Library lang={lang} />
        <Protocol lang={lang} />
        <AuditedStrip lang={lang} />
        <CallToAction lang={lang} />
        <BuiltWith lang={lang} />
      </main>
      <SiteFooter lang={lang} />
      {[org, site, jsonLd].map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </div>
  );
}
