import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopicPage } from "@/components/topic-page";
import { PACKAGES, type PackageId } from "@/lib/content";
import { t } from "@/lib/i18n";

export const dynamicParams = false;

export function generateStaticParams() {
  return PACKAGES.map((pkg) => ({ slug: pkg.id }));
}

function find(slug: string): PackageId | null {
  return PACKAGES.find((p) => p.id === slug)?.id ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const id = find(slug);
  if (!id) return {};
  const prose = t("en").library.packages[id];
  return {
    title: `${prose.name} — ÆON Learn`,
    description: prose.blurb,
    alternates: {
      canonical: `/topics/${id}`,
      languages: { en: `/topics/${id}`, de: `/de/themen/${id}`, "x-default": `/topics/${id}` },
    },
    openGraph: { type: "article", url: `/topics/${id}`, locale: "en_US", siteName: "ÆON Learn" },
  };
}

export default async function Topic({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const id = find(slug);
  if (!id) notFound();
  return <TopicPage lang="en" id={id} />;
}
