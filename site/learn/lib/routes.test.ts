import { describe, expect, it, vi } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { topicHref } from "@/components/topic-page";
import { findPackageId, PACKAGES, RELEASED } from "@/lib/content";
import { SITE_HOST, SITE_URL } from "@/lib/site";

/**
 * The static output's contract with crawlers and with itself.
 *
 * Nothing here renders a page: these are the URLs the build promises exist,
 * the pairs it promises are translations of each other, and the mapping from
 * a URL segment back to a package. All three are the sort of thing that stays
 * wrong for months because nothing visibly breaks.
 */

const EN = (id: string) => `${SITE_URL}/topics/${id}`;
const DE = (id: string) => `${SITE_URL}/de/themen/${id}`;

describe("slug resolution", () => {
  it.each(PACKAGES.map((p) => p.id))("resolves %s", (id) => {
    expect(findPackageId(id)).toBe(id);
  });

  it("rejects a slug that names no package", () => {
    for (const slug of ["", "bitcion", "Bitcoin", "topics", "bitcoin/", "../bitcoin"]) {
      expect(findPackageId(slug)).toBeNull();
    }
  });

  it("rejects inherited object keys", () => {
    // The Open Graph routes used to index the translation table with an
    // unchecked `slug as keyof …`. For "constructor" that read
    // Object.prototype.constructor and produced a card titled "Object";
    // for "toString" it produced a function where a string was expected.
    for (const slug of ["constructor", "toString", "__proto__", "hasOwnProperty", "valueOf"]) {
      expect(findPackageId(slug)).toBeNull();
    }
  });
});

describe("topic hrefs", () => {
  it.each(PACKAGES.map((p) => p.id))("%s has one path per locale", (id) => {
    expect(topicHref("en", id)).toBe(`/topics/${id}`);
    expect(topicHref("de", id)).toBe(`/de/themen/${id}`);
  });

  it("keeps the slug identical across locales, so the switch never 404s", () => {
    for (const pkg of PACKAGES) {
      const de = topicHref("de", pkg.id);
      expect(findPackageId(de.slice("/de/themen/".length))).toBe(pkg.id);
    }
  });
});

describe("sitemap", () => {
  const entries = sitemap();
  const urls = entries.map((e) => e.url);

  it("lists both homes and every topic in both locales, and nothing else", () => {
    expect(new Set(urls)).toEqual(
      new Set([
        `${SITE_URL}/`,
        `${SITE_URL}/de`,
        ...PACKAGES.flatMap((p) => [EN(p.id), DE(p.id)]),
      ]),
    );
    expect(urls).toHaveLength(new Set(urls).size);
  });

  it("omits the noindex legal pages", () => {
    for (const path of ["/imprint", "/privacy", "/de/impressum", "/de/datenschutz"]) {
      expect(urls).not.toContain(`${SITE_URL}${path}`);
    }
  });

  it("emits absolute https URLs with no doubled slash", () => {
    for (const url of urls) {
      expect(url).toMatch(/^https:\/\//);
      expect(url.slice("https://".length)).not.toContain("//");
    }
  });

  it("dates every entry from the release, not the build clock", () => {
    for (const entry of entries) {
      expect(entry.lastModified).toEqual(new Date(RELEASED));
    }
  });

  it("pairs every entry with its twin, and points x-default at English", () => {
    for (const entry of entries) {
      const languages = entry.alternates?.languages;
      expect(languages).toBeDefined();
      expect(languages?.["x-default"]).toBe(languages?.en);
      // A pairing that does not include the page stating it is not a pairing.
      expect([languages?.en, languages?.de]).toContain(entry.url);
    }
  });

  it("makes the pairing symmetric", () => {
    const byUrl = new Map(entries.map((e) => [e.url, e.alternates?.languages]));
    for (const [url, languages] of byUrl) {
      expect(languages).toBeDefined();
      const { en, de } = languages ?? {};
      const twin = en === url ? de : en;
      expect(typeof twin).toBe("string");
      expect(byUrl.get(String(twin))).toEqual(languages);
    }
  });
});

describe("robots", () => {
  const r = robots();

  it("points at the sitemap this build emits", () => {
    expect(r.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });

  it("gives `host` a hostname rather than an origin", () => {
    // `Host: https://learn.rapold.io` is not a value the directive accepts,
    // so the line used to say nothing at all.
    expect(r.host).toBe(SITE_HOST);
    expect(r.host).not.toMatch(/^https?:/);
    expect(r.host).not.toContain("/");
  });

  it("allows the whole site", () => {
    expect(r.rules).toEqual({ userAgent: "*", allow: "/" });
  });
});

describe("the site origin", () => {
  it("has no trailing slash, whatever the environment supplies", async () => {
    for (const supplied of [
      "https://preview.example.com/",
      "https://preview.example.com///",
      "https://preview.example.com",
    ]) {
      vi.stubEnv("NEXT_PUBLIC_APP_URL", supplied);
      vi.resetModules();
      const site = await import("@/lib/site");
      expect(site.SITE_URL).toBe("https://preview.example.com");
      expect(site.SITE_HOST).toBe("preview.example.com");
      vi.unstubAllEnvs();
      vi.resetModules();
    }
  });
});
