import type { Metadata } from "next";
import { baseMetadata, RootShell, viewport } from "../shell";

export { viewport };

export const metadata: Metadata = {
  ...baseMetadata,
  alternates: {
    canonical: "/",
    languages: { en: "/", de: "/de", "x-default": "/" },
  },
  openGraph: {
    type: "website",
    url: "/",
    locale: "en_US",
    siteName: "AEON Learn",
  },
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return <RootShell lang="en">{children}</RootShell>;
}
