import type { MetadataRoute } from "next";
import { PACKAGES } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

/**
 * Every indexable URL, and only those. The four legal pages carry `noindex`,
 * so listing them here would ask a crawler to index what their own headers
 * tell it not to — a sitemap is a statement of intent, and two contradicting
 * statements are worse than one.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // The locale pairing, stated once. Repeating it in the sitemap as well as in
  // each page's head is redundant on purpose: a crawler that samples the
  // sitemap without fetching every page still learns the pairs.
  const pair = (en: string, de: string) => ({
    languages: { en: `${SITE_URL}${en}`, de: `${SITE_URL}${de}`, "x-default": `${SITE_URL}${en}` },
  });

  // One entry per topic per locale, derived from the catalogue so a new
  // package cannot be added without appearing here.
  const topics: MetadataRoute.Sitemap = PACKAGES.flatMap((pkg) => [
    {
      url: `${SITE_URL}/topics/${pkg.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: pair(`/topics/${pkg.id}`, `/de/themen/${pkg.id}`),
    },
    {
      url: `${SITE_URL}/de/themen/${pkg.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: pair(`/topics/${pkg.id}`, `/de/themen/${pkg.id}`),
    },
  ]);

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: pair("/", "/de"),
    },
    {
      url: `${SITE_URL}/de`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: pair("/", "/de"),
    },
    ...topics,
  ];
}
