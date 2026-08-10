import type { MetadataRoute } from "next";
import { PACKAGES } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // One entry per topic per locale, derived from the catalogue so a new
  // package cannot be added without appearing here.
  const topics: MetadataRoute.Sitemap = PACKAGES.flatMap((pkg) => [
    {
      url: `${SITE_URL}/topics/${pkg.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/de/themen/${pkg.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ]);

  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/de`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    ...topics,
    { url: `${SITE_URL}/imprint`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/de/impressum`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/de/datenschutz`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
