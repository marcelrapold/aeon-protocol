import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Datenschutz — ÆON Learn",
  description: "Datenschutzerklärung von learn.rapold.io — kein Konto, keine Tracking-Cookies, keine Lernerdatenbank.",
  alternates: {
    canonical: "/de/datenschutz",
    languages: { en: "/privacy", de: "/de/datenschutz", "x-default": "/privacy" },
  },
  robots: { index: false },
};

export default function DatenschutzPage() {
  return <LegalPage lang="de" doc="privacy" langHref="/privacy" />;
}
