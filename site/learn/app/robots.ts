import type { MetadataRoute } from "next";
import { SITE_HOST, SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    // The `host` directive takes a hostname. Emitting the full origin here
    // wrote `Host: https://learn.rapold.io`, which is not a value any crawler
    // that reads the directive accepts, so the line said nothing at all.
    host: SITE_HOST,
  };
}
