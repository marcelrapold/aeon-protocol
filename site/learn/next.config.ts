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
};

export default nextConfig;
