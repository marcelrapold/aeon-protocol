import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopicPage } from "@/components/topic-page";
import { PACKAGES, type PackageId } from "@/lib/content";
import { topicDescription, topicTitle } from "@/lib/seo";

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
  return {
    title: topicTitle("de", id),
    description: topicDescription("de", id),
    alternates: {
      canonical: `/de/themen/${id}`,
      languages: { en: `/topics/${id}`, de: `/de/themen/${id}`, "x-default": `/topics/${id}` },
    },
    openGraph: { type: "article", url: `/de/themen/${id}`, locale: "de_CH", siteName: "ÆON Learn" },
  };
}

export default async function Thema({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const id = find(slug);
  if (!id) notFound();
  return <TopicPage lang="de" id={id} />;
}
