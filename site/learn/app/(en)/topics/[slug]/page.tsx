import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopicPage } from "@/components/topic-page";
import { findPackageId, PACKAGES } from "@/lib/content";
import { topicDescription, topicTitle } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return PACKAGES.map((pkg) => ({ slug: pkg.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const id = findPackageId(slug);
  if (!id) return {};
  return {
    title: topicTitle("en", id),
    description: topicDescription("en", id),
    alternates: {
      canonical: `/topics/${id}`,
      languages: { en: `/topics/${id}`, de: `/de/themen/${id}`, "x-default": `/topics/${id}` },
    },
    openGraph: { type: "article", url: `/topics/${id}`, locale: "en_US", siteName: "ÆON Learn" },
  };
}

export default async function Topic({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const id = findPackageId(slug);
  if (!id) notFound();
  return <TopicPage lang="en" id={id} />;
}
