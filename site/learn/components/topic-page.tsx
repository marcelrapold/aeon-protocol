import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { CopyChip } from "@/components/copy-command";
import { Reveal } from "@/components/reveal";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { TopicVisual } from "@/components/topic-visual";
import { buttonVariants } from "@/components/ui/button";
import { PACKAGE_GROUPS, PACKAGES, treeUrl, type PackageId } from "@/lib/content";
import { t, type Lang } from "@/lib/i18n";
import { packageDetail } from "@/lib/packages";
import { cn } from "@/lib/utils";

export function topicHref(lang: Lang, id: string): string {
  return lang === "de" ? `/de/themen/${id}` : `/topics/${id}`;
}

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/50 px-4 py-3">
      <p className="font-mono text-2xl font-semibold text-primary">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export function TopicPage({ lang, id }: { lang: Lang; id: PackageId }) {
  const tt = t(lang);
  const prose = tt.library.packages[id];
  const detail = packageDetail(id);
  const pkg = PACKAGES.find((p) => p.id === id);
  const group = PACKAGE_GROUPS.find((g) => g.ids.includes(id));
  const libraryHref = lang === "de" ? "/de#library" : "/#library";

  return (
    <div className="relative" lang={lang === "de" ? "de" : undefined}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        {tt.a11y.skip}
      </a>
      <SiteHeader lang={lang} nav={[]} langHref={topicHref(lang === "de" ? "en" : "de", id)} />

      <main id="main" className="mx-auto max-w-4xl px-5 py-12 md:py-16">
        <Reveal immediate>
          <Link
            href={libraryHref}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            {tt.topic.backToLibrary}
          </Link>
        </Reveal>

        <Reveal immediate delay={60}>
          <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
            <div className="group">
              <TopicVisual id={id} />
            </div>
          </div>
        </Reveal>

        <Reveal immediate delay={120}>
          <p className="mt-8 font-mono text-xs font-semibold uppercase tracking-widest text-primary">
            {group ? tt.library.groups[group.key] : tt.nav.library}
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">{prose.name}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{prose.blurb}</p>
        </Reveal>

        <Reveal immediate delay={180}>
          <div className="mt-8 rounded-xl border border-border bg-card/50 p-5">
            <p className="text-sm font-semibold">{tt.topic.startHere}</p>
            <code className="mt-3 block rounded-lg border border-border bg-background px-4 py-3 font-mono text-sm">
              {prose.invocation}
            </code>
            <div className="mt-3 sm:max-w-xs">
              <CopyChip
                text={prose.invocation}
                label={tt.library.copy}
                copiedLabel={tt.library.copied}
                copiedAnnounce={tt.hero.copiedAnnounce}
                failedAnnounce={tt.hero.failedAnnounce}
              />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{tt.topic.startNote}</p>
          </div>
        </Reveal>

        {detail ? (
          <>
            {detail.overview ? (
              <Reveal>
                <section className="mt-12">
                  <h2 className="text-xl font-semibold">{tt.topic.aboutHeading}</h2>
                  <p className="mt-3 whitespace-pre-line text-muted-foreground">{detail.overview}</p>
                </section>
              </Reveal>
            ) : null}

            <Reveal>
              <section className="mt-12">
                <h2 className="text-xl font-semibold">{tt.topic.insideHeading}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{tt.topic.insideLead}</p>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Stat value={detail.sourceCount} label={tt.topic.statSources} />
                  <Stat value={detail.conceptCount} label={tt.topic.statConcepts} />
                  <Stat value={detail.controversies.length} label={tt.topic.statControversies} />
                  <Stat value={detail.misconceptions.length} label={tt.topic.statMisconceptions} />
                </div>
                {detail.tierCounts.length ? (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {detail.tierCounts.map(({ tier, count }) => (
                      <li
                        key={tier}
                        className="rounded-full border border-border bg-secondary px-3 py-1 font-mono text-xs text-secondary-foreground"
                      >
                        {tt.topic.tierLabel} {tier}: {count}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <p className="mt-4 text-xs text-muted-foreground">{tt.topic.quoteNote}</p>
              </section>
            </Reveal>

            {detail.controversies.length ? (
              <Reveal>
                <section className="mt-12">
                  <h2 className="text-xl font-semibold">{tt.topic.controversiesHeading}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{tt.topic.controversiesLead}</p>
                  <ul className="mt-4 space-y-3">
                    {detail.controversies.slice(0, 5).map((c) => (
                      <li key={c.question} className="rounded-xl border border-border bg-card/50 p-4">
                        <p className="font-medium">{c.question}</p>
                        <p className="mt-1 font-mono text-xs text-muted-foreground">
                          {c.positions.length} {tt.topic.positionsLabel}
                          {c.status ? ` · ${c.status}` : ""}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              </Reveal>
            ) : null}

            {detail.misconceptions.length ? (
              <Reveal>
                <section className="mt-12">
                  <h2 className="text-xl font-semibold">{tt.topic.mythsHeading}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{tt.topic.mythsLead}</p>
                  <ul className="mt-4 space-y-3">
                    {detail.misconceptions.slice(0, 5).map((m) => (
                      <li key={m.claim} className="rounded-xl border border-border bg-card/50 p-4">
                        <p className="font-medium">“{m.claim}”</p>
                        {m.status ? (
                          <p className="mt-1 font-mono text-xs uppercase tracking-wide text-primary">
                            {m.status}
                          </p>
                        ) : null}
                        {m.correction ? (
                          <p className="mt-2 text-sm text-muted-foreground">{m.correction}</p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </section>
              </Reveal>
            ) : null}

            {detail.learningPaths.length || detail.domains.length ? (
              <Reveal>
                <section className="mt-12 grid gap-8 sm:grid-cols-2">
                  {detail.learningPaths.length ? (
                    <div>
                      <h2 className="text-xl font-semibold">{tt.topic.pathsHeading}</h2>
                      <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                        {detail.learningPaths.map((path) => (
                          <li key={path} className="flex gap-2">
                            <span aria-hidden="true" className="text-primary">
                              ›
                            </span>
                            {path}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {detail.domains.length ? (
                    <div>
                      <h2 className="text-xl font-semibold">{tt.topic.domainsHeading}</h2>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {detail.domains.map((domain) => (
                          <li
                            key={domain}
                            className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                          >
                            {domain}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </section>
              </Reveal>
            ) : null}

            {detail.relatedPackages.length ? (
              <Reveal>
                <section className="mt-12">
                  <h2 className="text-xl font-semibold">{tt.topic.relatedHeading}</h2>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {detail.relatedPackages
                      .filter((rel): rel is PackageId => PACKAGES.some((p) => p.id === rel))
                      .map((rel) => (
                        <li key={rel}>
                          <Link
                            href={topicHref(lang, rel)}
                            className="inline-flex rounded-full border border-border bg-card/60 px-3 py-1.5 text-sm transition-colors hover:border-primary/50"
                          >
                            {tt.library.packages[rel].name}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </section>
              </Reveal>
            ) : null}
          </>
        ) : null}

        <Reveal>
          <div className="mt-12 flex flex-wrap gap-3 border-t border-border/60 pt-8">
            <a
              href={pkg?.href ?? treeUrl(`library/${id}`)}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              {tt.topic.viewSource}
              <ArrowUpRight aria-hidden="true" />
            </a>
            <Link href={libraryHref} className={cn(buttonVariants({ variant: "outline" }))}>
              {tt.topic.allTopics}
            </Link>
          </div>
        </Reveal>
      </main>

      <SiteFooter lang={lang} />
    </div>
  );
}
