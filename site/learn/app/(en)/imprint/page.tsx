import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Imprint — ÆON Learn",
  description: "Imprint of learn.rapold.io.",
  alternates: {
    canonical: "/imprint",
    languages: { en: "/imprint", de: "/de/impressum", "x-default": "/imprint" },
  },
  robots: { index: false },
};

export default function ImprintPage() {
  return <LegalPage lang="en" doc="imprint" langHref="/de/impressum" />;
}
