import Link from "next/link";
import { GlitchAe } from "@/components/glitch-ae";
import { AeonMark, GitHubMark } from "@/components/icons";
import { LangToggle } from "@/components/lang-toggle";
import { MobileNav } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { REPO } from "@/lib/content";
import { t, type Lang } from "@/lib/i18n";

export type NavItem = { href: string; label: string };

export function homeNav(lang: Lang): NavItem[] {
  const tt = t(lang);
  return [
    { href: "#how", label: tt.nav.how },
    { href: "#why", label: tt.nav.why },
    { href: "#origin", label: tt.nav.origin },
    { href: "#library", label: tt.nav.library },
    { href: "#protocol", label: tt.nav.protocol },
  ];
}

export function SiteHeader({
  lang,
  nav,
  langHref,
}: {
  lang: Lang;
  nav: NavItem[];
  langHref: string;
}) {
  const tt = t(lang);
  const home = lang === "de" ? "/de" : "/";

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      {/* Violet hairline — the hero's hue, echoed as the page frame. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
      />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Link href={home} className="flex items-center gap-2.5 font-semibold">
          <AeonMark className="size-7" />
          <span>
            <GlitchAe />
            ON <span className="text-primary">Learn</span>
          </span>
        </Link>
        {nav.length > 0 ? (
          <nav className="hidden md:block" aria-label="Main">
            <ul className="flex items-center gap-6">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
        <div className="flex items-center gap-2">
          <a
            href={REPO}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-background hover:bg-secondary"
          >
            <GitHubMark className="size-4" />
          </a>
          <LangToggle
            target={lang === "de" ? "en" : "de"}
            href={langHref}
            ariaLabel={tt.a11y.langSwitch}
          />
          <ThemeToggle labelLight={tt.a11y.themeLight} labelDark={tt.a11y.themeDark} />
          <MobileNav label={tt.a11y.navOpen} closeLabel={tt.a11y.navClose} items={nav} />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter({ lang }: { lang: Lang }) {
  const tt = t(lang);
  const base = lang === "de" ? "/de" : "";
  const imprintHref = lang === "de" ? "/de/impressum" : "/imprint";
  const privacyHref = lang === "de" ? "/de/datenschutz" : "/privacy";

  return (
    <footer className="relative border-t border-border/60">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      />
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-2.5">
          <AeonMark className="mt-0.5 size-6 shrink-0" />
          <p className="max-w-md text-sm text-muted-foreground">{tt.footer.tagline}</p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <li>
              <Link href={base === "" ? "/" : base} className="text-muted-foreground hover:text-foreground">
                ÆON Learn
              </Link>
            </li>
            <li>
              <a
                href={REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                {tt.footer.github}
              </a>
            </li>
            <li>
              <a
                href={`${REPO}/blob/main/LICENSE`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                {tt.footer.license}
              </a>
            </li>
            <li>
              <Link href={imprintHref} className="text-muted-foreground hover:text-foreground">
                {tt.footer.imprint}
              </Link>
            </li>
            <li>
              <Link href={privacyHref} className="text-muted-foreground hover:text-foreground">
                {tt.footer.privacy}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
