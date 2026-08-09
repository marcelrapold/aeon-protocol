import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { legal } from "@/lib/legal";
import { t, type Lang } from "@/lib/i18n";

export function LegalPage({
  lang,
  doc,
  langHref,
}: {
  lang: Lang;
  doc: "privacy" | "imprint";
  langHref: string;
}) {
  const tt = t(lang);
  const content = legal(lang)[doc];

  return (
    <div className="relative" lang={lang === "de" ? "de" : undefined}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        {tt.a11y.skip}
      </a>
      <SiteHeader lang={lang} nav={[]} langHref={langHref} />
      <main id="main" className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="text-3xl font-bold tracking-tight">{content.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{content.updatedLabel}</p>
        <p className="mt-6 text-muted-foreground">{content.intro}</p>
        {content.sections.map((section) => (
          <section key={section.heading} className="mt-8">
            <h2 className="text-xl font-semibold">{section.heading}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph} className="mt-3 text-muted-foreground">
                {paragraph}
              </p>
            ))}
            {section.links ? (
              <ul className="mt-3 space-y-1">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}
