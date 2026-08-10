import { describe, expect, it } from "vitest";
import { PACKAGES } from "./content";
import type { Lang } from "./i18n";
import { DESC_MAX, DESC_MIN, TITLE_MAX, topicDescription, topicJsonLd, topicTitle } from "./seo";

const LANGS: Lang[] = ["en", "de"];
const CASES = LANGS.flatMap((lang) => PACKAGES.map((pkg) => ({ lang, id: pkg.id })));

/**
 * The exit criteria of the technical-SEO audit, kept as tests so a new package
 * cannot quietly reintroduce a truncated title or a thin description.
 */
describe("topic titles", () => {
  it.each(CASES)("$lang/$id fits a result listing", ({ lang, id }) => {
    const title = topicTitle(lang, id);
    expect(title.length).toBeLessThanOrEqual(TITLE_MAX);
    expect(title).toContain("ÆON Learn");
  });

  it("uses the room it has rather than the shortest form", () => {
    const short = CASES.filter(({ lang, id }) => topicTitle(lang, id).length < 45);
    expect(short).toEqual([]);
  });

  it("distinguishes a topic from its own locale twin", () => {
    for (const pkg of PACKAGES) {
      expect(topicTitle("de", pkg.id)).not.toBe(topicTitle("en", pkg.id));
    }
  });
});

describe("topic descriptions", () => {
  it.each(CASES)("$lang/$id lands in the readable band", ({ lang, id }) => {
    const description = topicDescription(lang, id);
    expect(description.length).toBeGreaterThanOrEqual(DESC_MIN);
    expect(description.length).toBeLessThanOrEqual(DESC_MAX);
  });

  it("never ends mid-word", () => {
    for (const { lang, id } of CASES) {
      expect(topicDescription(lang, id)).not.toMatch(/\s…$/);
    }
  });
});

describe("topic structured data", () => {
  it.each(CASES)("$lang/$id emits a resource and a trail", ({ lang, id }) => {
    const [resource, breadcrumb] = topicJsonLd(lang, id);

    expect(resource["@type"]).toBe("LearningResource");
    expect(resource.url).toMatch(/^https:\/\/learn\.rapold\.io\//);
    expect(resource.inLanguage).toBe(lang === "de" ? "de-CH" : "en");
    expect(String(resource.name).length).toBeGreaterThan(0);

    expect(breadcrumb["@type"]).toBe("BreadcrumbList");
    const trail = breadcrumb.itemListElement as { position: number; item: string }[];
    expect(trail.map((step) => step.position)).toEqual([1, 2, 3]);
    // The last step is the page itself, so the trail must end where it stands.
    expect(trail[2].item).toBe(resource.url);
  });

  it("serialises without losing anything", () => {
    for (const { lang, id } of CASES) {
      for (const block of topicJsonLd(lang, id)) {
        expect(() => JSON.parse(JSON.stringify(block))).not.toThrow();
      }
    }
  });
});
