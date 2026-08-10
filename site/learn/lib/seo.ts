// Relative rather than aliased: these are runtime imports, and the test
// runner resolves this module without Next's path mapping.
import type { PackageId } from "./content";
import { t, type Lang } from "./i18n";
import { packageDetail } from "./packages";
import { SITE_URL } from "./site";

/**
 * Search-result metadata for the topic pages, composed rather than written.
 *
 * A result listing renders roughly sixty characters of a title and a hundred
 * and sixty of a description. Thirty packages × two locales is sixty of each,
 * and hand-writing them means they drift the moment a package gains a source.
 * So both are built from what the package actually contains: the variant is
 * chosen by how much room is left, and the counts come from the manifests, so
 * the text cannot claim more than the library holds.
 *
 * Enforced by lib/seo.test.ts — the audit criterion is a test, not a habit.
 */

export const TITLE_MAX = 60;
export const DESC_MIN = 140;
export const DESC_MAX = 160;

const BRAND = "ÆON Learn";

/** The longest candidate that still fits, so no room goes unused. */
function longestFitting(candidates: string[], limit: number): string | null {
  const fitting = candidates.filter((c) => c.length <= limit);
  if (!fitting.length) return null;
  return fitting.reduce((best, c) => (c.length > best.length ? c : best));
}

/** Cut on a word boundary — a description ending mid-word reads as broken. */
function clamp(text: string, limit: number): string {
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit - 1);
  const boundary = cut.lastIndexOf(" ");
  return `${(boundary > limit * 0.6 ? cut.slice(0, boundary) : cut).replace(/[,;:—-]$/, "")}…`;
}

export function topicTitle(lang: Lang, id: PackageId): string {
  const name = t(lang).library.packages[id].name;
  const detail = packageDetail(id);
  const sources = detail?.sourceCount ?? 0;
  const debates = detail?.controversies.length ?? 0;

  const candidates =
    lang === "de"
      ? [
          `${name} | ${BRAND}`,
          `${name} lernen | ${BRAND}`,
          sources ? `${name} lernen — ${sources} Quellen | ${BRAND}` : "",
          sources ? `${name} lernen — ${sources} kuratierte Quellen | ${BRAND}` : "",
          sources && debates
            ? `${name} lernen — ${sources} Quellen, ${debates} Kontroversen | ${BRAND}`
            : "",
        ]
      : [
          `${name} | ${BRAND}`,
          `Learn ${name} | ${BRAND}`,
          sources ? `Learn ${name} — ${sources} sources | ${BRAND}` : "",
          sources ? `Learn ${name} — ${sources} curated sources | ${BRAND}` : "",
          sources && debates
            ? `Learn ${name} — ${sources} sources, ${debates} debates | ${BRAND}`
            : "",
        ];

  // The bare name always fits somewhere, so the fallback is the shortest form
  // rather than a truncation.
  return longestFitting(candidates.filter(Boolean), TITLE_MAX) ?? `${name} | ${BRAND}`;
}

export function topicDescription(lang: Lang, id: PackageId): string {
  const blurb = t(lang).library.packages[id].blurb.trim();
  const detail = packageDetail(id);
  const sources = detail?.sourceCount ?? 0;
  const concepts = detail?.conceptCount ?? 0;
  const debates = detail?.controversies.length ?? 0;
  const myths = detail?.misconceptions.length ?? 0;

  if (blurb.length >= DESC_MAX) return clamp(blurb, DESC_MAX);

  // Progressively more of the package's own inventory, so a short blurb still
  // reaches a useful length without anyone inventing filler for it.
  const tails =
    lang === "de"
      ? [
          sources ? ` ${sources} kuratierte Quellen.` : "",
          sources && concepts ? ` ${sources} kuratierte Quellen, ${concepts} Konzepte.` : "",
          sources && concepts && debates
            ? ` ${sources} kuratierte Quellen, ${concepts} Konzepte, ${debates} Kontroversen.`
            : "",
          sources && concepts && debates && myths
            ? ` ${sources} kuratierte Quellen, ${concepts} Konzepte, ${debates} Kontroversen, ${myths} korrigierte Mythen.`
            : "",
        ]
      : [
          sources ? ` ${sources} curated sources.` : "",
          sources && concepts ? ` ${sources} curated sources, ${concepts} concepts.` : "",
          sources && concepts && debates
            ? ` ${sources} curated sources, ${concepts} concepts, ${debates} open debates.`
            : "",
          sources && concepts && debates && myths
            ? ` ${sources} curated sources, ${concepts} concepts, ${debates} open debates, ${myths} corrected myths.`
            : "",
        ];

  const full = tails.filter(Boolean).map((tail) => blurb + tail);
  return longestFitting(full, DESC_MAX) ?? blurb;
}

/** Canonical absolute URL for a topic, per locale. Internal: the only
 *  caller is topicJsonLd below. */
function topicUrl(lang: Lang, id: PackageId): string {
  return lang === "de" ? `${SITE_URL}/de/themen/${id}` : `${SITE_URL}/topics/${id}`;
}

/**
 * Structured data for a topic page: what the thing is, and where it sits.
 *
 * LearningResource rather than Article — the page is not a piece of writing
 * about the subject, it is the entry to a curriculum package, and saying so
 * accurately matters more than picking the type with the richer result card.
 * BreadcrumbList because the path is three deep and the trail is otherwise
 * only implied by a back link.
 */
type JsonLd = Record<string, unknown>;

export function topicJsonLd(lang: Lang, id: PackageId): [JsonLd, JsonLd] {
  const tt = t(lang);
  const detail = packageDetail(id);
  const url = topicUrl(lang, id);
  const home = lang === "de" ? `${SITE_URL}/de` : SITE_URL;

  const learningResource: JsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "@id": `${url}#resource`,
    name: tt.library.packages[id].name,
    description: topicDescription(lang, id),
    url,
    inLanguage: lang === "de" ? "de-CH" : "en",
    learningResourceType: "Curriculum package",
    isAccessibleForFree: true,
    license: "https://www.apache.org/licenses/LICENSE-2.0",
    isPartOf: { "@type": "Collection", name: `${BRAND} Library`, url: `${home}#library` },
    provider: { "@type": "Organization", name: BRAND, url: SITE_URL },
  };

  // Only claim what the manifest actually carries.
  if (detail?.learningPaths.length) learningResource.teaches = detail.learningPaths;
  if (detail?.domains.length) learningResource.about = detail.domains;
  if (detail?.prerequisites.length) {
    learningResource.competencyRequired = detail.prerequisites;
  }

  const breadcrumb: JsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: BRAND, item: home },
      { "@type": "ListItem", position: 2, name: tt.nav.library, item: `${home}#library` },
      { "@type": "ListItem", position: 3, name: tt.library.packages[id].name, item: url },
    ],
  };

  return [learningResource, breadcrumb];
}
