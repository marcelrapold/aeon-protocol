import { PACKAGES } from "@/lib/content";
import { t } from "@/lib/i18n";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "ÆON Learn topic";
export const dynamicParams = false;

export function generateStaticParams() {
  return PACKAGES.map((pkg) => ({ slug: pkg.id }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const prose = t("en").library.packages[slug as keyof ReturnType<typeof t>["library"]["packages"]];
  return renderOgImage({
    title: prose?.name ?? "ÆON Learn",
    subtitle: prose?.invocation ?? "Teach me anything using learn.rapold.io",
  });
}
