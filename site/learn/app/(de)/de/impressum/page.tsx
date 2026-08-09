import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Impressum — ÆON Learn",
  description: "Impressum von learn.rapold.io.",
  alternates: {
    canonical: "/de/impressum",
    languages: { en: "/imprint", de: "/de/impressum", "x-default": "/imprint" },
  },
  robots: { index: false },
};

export default function ImpressumPage() {
  return <LegalPage lang="de" doc="imprint" langHref="/imprint" />;
}
