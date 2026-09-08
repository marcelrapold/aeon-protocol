import { PACKAGES } from "@/lib/content";
import { ogContentType, ogSize, renderOgImage, topicOgCopy } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "ÆON Learn topic";
export const dynamicParams = false;

export function generateStaticParams() {
  return PACKAGES.map((pkg) => ({ slug: pkg.id }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return renderOgImage(topicOgCopy("en", slug));
}
