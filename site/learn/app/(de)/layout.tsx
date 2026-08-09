import type { Metadata } from "next";
import { baseMetadata, RootShell, viewport } from "../shell";

export { viewport };

export const metadata: Metadata = {
  ...baseMetadata,
  title: "ÆON Learn — jedes Thema, tief recherchiert, um dich gebaut",
  description:
    "Mach aus jedem Thema eine recherchierte, adaptive Lernreise. Ein Satz an deinen KI-Agenten — das offene ÆON-Protokoll erledigt den Rest. Kein Konto.",
  alternates: {
    canonical: "/de",
    languages: { en: "/", de: "/de", "x-default": "/" },
  },
  openGraph: {
    type: "website",
    url: "/de",
    locale: "de_CH",
    siteName: "ÆON Learn",
  },
};

export default function DeLayout({ children }: { children: React.ReactNode }) {
  return <RootShell lang="de">{children}</RootShell>;
}
