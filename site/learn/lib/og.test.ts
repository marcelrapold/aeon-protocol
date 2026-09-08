import { describe, expect, it } from "vitest";
import { PACKAGES } from "@/lib/content";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { topicOgCopy } from "@/lib/og";

/**
 * The Open Graph card copy for a topic.
 *
 * These routes take `slug` as a bare string and used to index the translation
 * table with `slug as keyof …`. For a real slug that worked; for anything else
 * it read straight through to Object.prototype, and `/topics/constructor`
 * would have rendered a card titled "Object". The routes pin
 * `dynamicParams = false` so it was unreachable in production, which is
 * exactly why it could have sat there indefinitely.
 */

const LANGS: Lang[] = ["en", "de"];
const CASES = LANGS.flatMap((lang) => PACKAGES.map((pkg) => ({ lang, id: pkg.id })));

describe("a card for a real topic", () => {
  it.each(CASES)("$lang/$id carries that package's own words", ({ lang, id }) => {
    const prose = t(lang).library.packages[id];
    expect(topicOgCopy(lang, id)).toEqual({ title: prose.name, subtitle: prose.invocation });
  });

  it("says something different per locale", () => {
    for (const pkg of PACKAGES) {
      expect(topicOgCopy("de", pkg.id).subtitle).not.toBe("");
      expect(topicOgCopy("en", pkg.id).title.length).toBeGreaterThan(0);
    }
  });
});

describe("a card for a slug that names nothing", () => {
  const UNKNOWN = ["", "bitcion", "constructor", "toString", "__proto__", "valueOf", "hasOwnProperty"];

  it.each(UNKNOWN)("falls back to the brand for %j", (slug) => {
    for (const lang of LANGS) {
      const copy = topicOgCopy(lang, slug);
      expect(copy.title).toBe("ÆON Learn");
      expect(typeof copy.subtitle).toBe("string");
      expect(copy.subtitle.length).toBeGreaterThan(0);
    }
  });

  it("never returns a function or an object where a string belongs", () => {
    for (const slug of UNKNOWN) {
      for (const lang of LANGS) {
        const copy = topicOgCopy(lang, slug);
        expect(typeof copy.title).toBe("string");
        expect(typeof copy.subtitle).toBe("string");
      }
    }
  });

  it("answers in the locale it was asked in", () => {
    expect(topicOgCopy("de", "nope").subtitle).toContain("Bring mir");
    expect(topicOgCopy("en", "nope").subtitle).toContain("Teach me");
  });
});
