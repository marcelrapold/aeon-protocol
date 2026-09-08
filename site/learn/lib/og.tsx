import { ImageResponse } from "next/og";
import { BRAND_HEX, MARK_NODES, MARK_PATH, MARK_VIEWBOX } from "@/lib/brand";
import { findPackageId } from "@/lib/content";
import { t, type Lang } from "@/lib/i18n";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/** Fallback card copy, used when a slug names no package. */
const OG_FALLBACK = {
  en: { title: "ÆON Learn", subtitle: "Teach me anything using learn.rapold.io" },
  de: { title: "ÆON Learn", subtitle: "Bring mir etwas bei mit learn.rapold.io" },
} as const;

/**
 * What a topic's Open Graph card should say, for any slug at all.
 *
 * Pulled out of the route files so the unknown-slug path is exercised by a
 * test rather than trusted. The routes pin `dynamicParams = false`, so an
 * unknown slug should never reach them — but "should never" is exactly the
 * condition worth having a defined answer for, and a branded fallback card
 * beats a build that throws on a package renamed in one place and not the
 * other.
 */
export function topicOgCopy(lang: Lang, slug: string): { title: string; subtitle: string } {
  const id = findPackageId(slug);
  if (!id) return { ...OG_FALLBACK[lang] };
  const prose = t(lang).library.packages[id];
  return { title: prose.name, subtitle: prose.invocation };
}

/**
 * Shared OG-card renderer. Uses the system sans stack (no font loading) to
 * keep generation cheap; every opengraph-image.tsx passes its own strings.
 */
export function renderOgImage({ title, subtitle }: { title: string; subtitle: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          backgroundColor: "#0a0a0a",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="56" height="56" viewBox={MARK_VIEWBOX}>
            <rect width="32" height="32" rx="8" fill={BRAND_HEX} />
            <path
              d={MARK_PATH}
              stroke="#ffffff"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {MARK_NODES.map(([cx, cy]) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2" fill="#ffffff" />
            ))}
          </svg>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 600, color: BRAND_HEX }}>
            ÆON Learn
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>
            {title}
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#a3a3a3", lineHeight: 1.4 }}>
            {subtitle}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#737373" }}>learn.rapold.io</div>
      </div>
    ),
    ogSize,
  );
}
