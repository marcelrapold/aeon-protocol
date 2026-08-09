import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { DESCRIPTION, SITE_URL, TITLE } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

// Mono is used for eyebrows, badges and the invocation line — never the LCP
// element — so it stays off the critical preload path.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

/** Locale-agnostic metadata shared by both root layouts. */
export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "ÆON Learn",
  authors: [{ name: "Marcel Rapold", url: "https://www.linkedin.com/in/marcelrapold/" }],
  keywords: [
    "ÆON",
    "ÆON Learn",
    // ASCII spelling kept for findability — nobody types Æ into a search box.
    "AEON Learn",
    "open protocol",
    "AI agent",
    "learning",
    "curriculum",
    "research",
    "llms.txt",
  ],
  twitter: {
    // Deliberately no title/description here: Next derives them per route.
    card: "summary_large_image",
  },
};

/**
 * Shared <html> shell. Each locale route group renders this with its own
 * `lang`, so /de serves lang="de" and / serves lang="en".
 */
export function RootShell({ lang, children }: { lang: "en" | "de"; children: React.ReactNode }) {
  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
