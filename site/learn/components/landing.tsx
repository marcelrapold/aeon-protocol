import { ArrowRight, ArrowUpRight, FileJson2, FlaskConical, ListChecks, ScrollText } from "lucide-react";
import { CommandBlock, CopyChip, CopyCommandButton } from "@/components/copy-command";
import { FakeTerminal } from "@/components/fake-terminal";
import { JourneyGraph } from "@/components/journey-graph";
import { Reveal } from "@/components/reveal";
import { SiteFooter, SiteHeader, homeNav } from "@/components/site-chrome";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  blobUrl,
  CHARISMA,
  ORIGIN_CHAIN,
  PACKAGES,
  PRINCIPLES,
  REPO,
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
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
            {eyebrow}
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
          {lead ? <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{lead}</p> : null}
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
      <div
        aria-hidden="true"
        className="bg-grid absolute inset-0 -z-20 [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]"
      />
      <div
        aria-hidden="true"
        className="animate-aurora absolute -top-40 left-1/2 -z-10 h-[34rem] w-[52rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
      />
      <div className="mx-auto grid min-h-[70vh] max-w-6xl items-center gap-12 px-5 py-24 lg:min-h-[82vh] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col items-start gap-6">
        <Reveal immediate>
          <Badge className="animate-badge-pulse">
            {tt.hero.badge} · {VERSION}
          </Badge>
        </Reveal>
        <Reveal immediate delay={60}>
          <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
            <span className="aeon-chroma">Æ</span>ON <span className="text-primary">Learn</span>
          </h1>
        </Reveal>
        <Reveal immediate delay={120}>
          <p className="max-w-2xl text-2xl font-semibold leading-snug md:text-3xl">
            {tt.hero.subA} <span className="text-primary">{tt.hero.subB}</span> {tt.hero.subC}
          </p>
        </Reveal>
        <Reveal immediate delay={180}>
          <p className="max-w-2xl text-lg text-muted-foreground">{tt.hero.lead}</p>
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
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {PACKAGES.map((pkg, i) => {
          const prose = tt.library.packages[pkg.id];
          const Icon = pkg.icon;
          return (
            <Reveal key={pkg.id} delay={i * 60} className="h-full">
              <div className="group flex h-full flex-col rounded-xl border border-border bg-card/50 p-5 transition-colors hover:border-primary/50">
                <div className="flex items-center justify-between">
                  <Icon className="size-5 text-primary" aria-hidden="true" />
                  <a
                    href={pkg.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${prose.name} — ${tt.library.ghLabel}`}
                    className="text-muted-foreground opacity-60 transition-opacity hover:text-foreground group-hover:opacity-100"
                  >
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </a>
                </div>
                <h3 className="mt-3 font-semibold">{prose.name}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{prose.blurb}</p>
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
            </Reveal>
          );
        })}
      </div>
      <Reveal delay={200}>
        <p className="mt-6 text-sm text-muted-foreground">{tt.library.note}</p>
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

/* ── Call to action ─────────────────────────────────────────────────── */

function CallToAction({ lang }: { lang: Lang }) {
  const tt = t(lang);

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
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
        <HowItWorks lang={lang} />
        <Principles lang={lang} />
        <Origin lang={lang} />
        <Library lang={lang} />
        <Protocol lang={lang} />
        <CallToAction lang={lang} />
      </main>
      <SiteFooter lang={lang} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
