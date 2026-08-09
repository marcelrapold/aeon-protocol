import { join } from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Monorepo file-tracing root = the repo root (two levels up from site/learn).
  // Vercel's monorepo builder resolves the Next.js output against the repo root,
  // so the tracing root must match it.
  outputFileTracingRoot: join(__dirname, "..", ".."),

  images: {
    // Negotiate AVIF first, fall back to WebP; optimized variants are immutable.
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
  },

  // Browser-language detection, evaluated in Vercel's routing layer (no
  // function, the site stays fully static). An explicit choice via the
  // language toggle sets the `lang-pref` cookie and always wins; without it,
  // browsers whose primary Accept-Language is German land on /de. Crawlers
  // send no Accept-Language and keep getting EN at / (hreflang covers SEO).
  async redirects() {
    return [
      {
        source: "/",
        destination: "/de",
        permanent: false,
        has: [{ type: "cookie", key: "lang-pref", value: "de" }],
      },
      {
        source: "/",
        destination: "/de",
        permanent: false,
        has: [{ type: "header", key: "accept-language", value: "de.*" }],
        missing: [{ type: "cookie", key: "lang-pref" }],
      },
    ];
  },
};

export default nextConfig;
