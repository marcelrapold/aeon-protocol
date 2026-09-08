// @vitest-environment jsdom
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Landing } from "@/components/landing";
import { LegalPage } from "@/components/legal-page";
import { TopicPage } from "@/components/topic-page";
import { buttonVariants } from "@/components/ui/button";
import { PACKAGES } from "@/lib/content";
import { t, type Lang } from "@/lib/i18n";

/**
 * What the static HTML has to be true of, on every page this site emits.
 *
 * The pages are server components, so they render to their final markup with
 * nothing but react-dom/server — no browser, no framework harness. That makes
 * the structural accessibility properties (one h1, no skipped heading level,
 * every navigation landmark named, every image with an alt attribute) cheap
 * enough to assert on the real pages rather than on a stand-in.
 */

const LANGS: Lang[] = ["en", "de"];

function parse(markup: string): HTMLElement {
  const host = document.createElement("div");
  host.innerHTML = markup;
  return host;
}

const landing = (lang: Lang) => parse(renderToStaticMarkup(<Landing lang={lang} />));
const topic = (lang: Lang) => parse(renderToStaticMarkup(<TopicPage lang={lang} id="bitcoin" />));
const legal = (lang: Lang) =>
  parse(renderToStaticMarkup(<LegalPage lang={lang} doc="privacy" langHref="/privacy" />));

const PAGES = LANGS.flatMap((lang) => [
  { name: `landing/${lang}`, lang, dom: landing(lang) },
  { name: `topic/${lang}`, lang, dom: topic(lang) },
  { name: `legal/${lang}`, lang, dom: legal(lang) },
]);

describe.each(PAGES)("$name", ({ lang, dom }) => {
  it("has exactly one h1", () => {
    expect(dom.querySelectorAll("h1")).toHaveLength(1);
  });

  it("never skips a heading level", () => {
    const levels = [...dom.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) =>
      Number(h.tagName.slice(1)),
    );
    expect(levels[0]).toBe(1);
    for (let i = 1; i < levels.length; i += 1) {
      // Going back up is always fine; going down may only ever be by one.
      expect(Number(levels[i]) - Number(levels[i - 1])).toBeLessThanOrEqual(1);
    }
  });

  it("gives every heading text", () => {
    for (const heading of dom.querySelectorAll("h1,h2,h3,h4,h5,h6")) {
      expect(heading.textContent.trim().length).toBeGreaterThan(0);
    }
  });

  it("names every navigation landmark, distinctly", () => {
    const names = [...dom.querySelectorAll("nav")].map((n) => n.getAttribute("aria-label"));
    expect(names.every((n) => n && n.length > 0)).toBe(true);
    expect(new Set(names).size).toBe(names.length);
  });

  it("names the landmarks in the page's own language", () => {
    // A German page announcing "Main" and "Footer" reads those words out in
    // German phonetics; the accessible name belongs in the locale.
    const tt = t(lang);
    const names = [...dom.querySelectorAll("nav")].map((n) => n.getAttribute("aria-label"));
    for (const name of names) {
      expect([tt.a11y.navMain, tt.a11y.navSections, tt.a11y.navFooter]).toContain(name);
    }
  });

  it("gives every image an alt attribute", () => {
    for (const img of dom.querySelectorAll("img")) {
      expect(img.hasAttribute("alt"), img.getAttribute("src") ?? "img").toBe(true);
    }
  });

  it("opens every new tab safely", () => {
    for (const anchor of dom.querySelectorAll<HTMLAnchorElement>('a[target="_blank"]')) {
      expect(anchor.getAttribute("rel") ?? "").toContain("noopener");
    }
  });

  it("gives every link an accessible name", () => {
    for (const anchor of dom.querySelectorAll("a")) {
      const name = anchor.getAttribute("aria-label") ?? anchor.textContent;
      expect(name.trim().length, anchor.getAttribute("href") ?? "link").toBeGreaterThan(0);
    }
  });

  it("gives every button an accessible name", () => {
    for (const button of dom.querySelectorAll("button")) {
      const name = button.getAttribute("aria-label") ?? button.textContent;
      expect(name.trim().length).toBeGreaterThan(0);
    }
  });

  it("offers a skip link that points at the main landmark", () => {
    const skip = dom.querySelector<HTMLAnchorElement>('a[href="#main"]');
    expect(skip).not.toBeNull();
    expect(skip?.textContent).toBe(t(lang).a11y.skip);
    expect(dom.querySelector("main#main")).not.toBeNull();
  });
});

describe("locale wiring", () => {
  it("renders the landing in the locale it was asked for", () => {
    expect(landing("en").textContent).toContain(t("en").hero.lead);
    expect(landing("en").textContent).not.toContain(t("de").hero.lead);
    expect(landing("de").textContent).toContain(t("de").hero.lead);
    expect(landing("de").textContent).not.toContain(t("en").hero.lead);
  });

  it("points the language switch at the other locale's twin of this page", () => {
    const href = (dom: HTMLElement) =>
      dom.querySelector<HTMLAnchorElement>("header a[aria-label]:not([href^='http'])")?.getAttribute("href");
    expect(href(landing("en"))).toBe("/de");
    expect(href(landing("de"))).toBe("/");
    expect(href(topic("en"))).toBe("/de/themen/bitcoin");
    expect(href(topic("de"))).toBe("/topics/bitcoin");
  });

  it("marks the English package quotations on the German topic page", () => {
    // The library packages are written in English throughout — the page says
    // so — so on /de they are a run of another language and must say which
    // (WCAG 3.1.2). On /en there is nothing to mark.
    expect(topic("de").querySelectorAll('[lang="en"]').length).toBeGreaterThan(0);
    expect(topic("en").querySelectorAll("[lang]")).toHaveLength(0);
  });
});

describe("the library section", () => {
  it("nests every card heading under its group heading", () => {
    const dom = landing("en");
    const library = dom.querySelector("#library");
    expect(library).not.toBeNull();
    // One h3 per group, one h4 per package: a card title is not a sibling of
    // the chapter rule it sits beneath.
    expect(library?.querySelectorAll("h3")).toHaveLength(5);
    expect(library?.querySelectorAll("h4")).toHaveLength(PACKAGES.length);
  });

  it("links every package to its own topic page", () => {
    const dom = landing("de");
    for (const pkg of PACKAGES) {
      expect(dom.querySelector(`a[href="/de/themen/${pkg.id}"]`), pkg.id).not.toBeNull();
    }
  });
});

describe("the theme switch", () => {
  it("carries a correct name for both themes, before any JavaScript runs", () => {
    // The name used to come from next-themes' resolvedTheme, which is unknown
    // until it mounts — so the server sent "switch to dark theme" while the
    // dark default was already in force.
    const dom = landing("en");
    const toggle = [...dom.querySelectorAll("button")].find((b) =>
      b.textContent.includes(t("en").a11y.themeDark),
    );
    expect(toggle).toBeDefined();
    const names = [...(toggle?.querySelectorAll("span") ?? [])];
    expect(names.map((n) => n.textContent)).toEqual([
      t("en").a11y.themeLight,
      t("en").a11y.themeDark,
    ]);
    // Exactly one is in the accessibility tree per theme: `hidden` is
    // display:none, so the other is absent rather than merely invisible.
    expect(names[0]?.className).toContain("hidden");
    expect(names[0]?.className).toContain("dark:inline");
    expect(names[1]?.className).toContain("dark:hidden");
    expect(names.every((n) => n.className.includes("sr-only"))).toBe(true);
  });

  it("names itself in the page's own language", () => {
    expect(landing("de").textContent).toContain(t("de").a11y.themeDark);
    expect(landing("de").textContent).not.toContain(t("en").a11y.themeDark);
  });
});

describe("the shared button classes", () => {
  it("never removes the site's focus ring", () => {
    // `focus-visible:outline-none` lived in this string. Being a utility it
    // beat the `a:focus-visible, button:focus-visible` rule in globals.css,
    // so the hero CTA, all thirty copy chips and the invocation block's copy
    // button had no visible focus at all (WCAG 2.4.7).
    for (const variant of ["default", "outline"] as const) {
      for (const size of ["default", "sm", "lg"] as const) {
        expect(buttonVariants({ variant, size })).not.toContain("outline-none");
      }
    }
  });
});
