import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy — AEON Learn",
  description: "Privacy policy of learn.rapold.io — no accounts, no tracking cookies, no learner database.",
  alternates: {
    canonical: "/privacy",
    languages: { en: "/privacy", de: "/de/datenschutz", "x-default": "/privacy" },
  },
  robots: { index: false },
};

export default function PrivacyPage() {
  return <LegalPage lang="en" doc="privacy" langHref="/de/datenschutz" />;
}
