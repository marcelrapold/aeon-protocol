import { PACKAGES } from "@/lib/content";
import { t } from "@/lib/i18n";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "ÆON Learn Thema";
export const dynamicParams = false;

export function generateStaticParams() {
  return PACKAGES.map((pkg) => ({ slug: pkg.id }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const prose = t("de").library.packages[slug as keyof ReturnType<typeof t>["library"]["packages"]];
  return renderOgImage({
    title: prose?.name ?? "ÆON Learn",
    subtitle: prose?.invocation ?? "Bring mir etwas bei mit learn.rapold.io",
  });
}
