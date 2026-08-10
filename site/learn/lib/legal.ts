import type { Lang } from "@/lib/i18n";

export const LEGAL_OPERATOR = "Marcel Rapold";
export const LEGAL_EMAIL = "marcel@marcelrapold.com";
export const LEGAL_LINKEDIN = "https://www.linkedin.com/in/marcelrapold/";
export const LEGAL_UPDATED = { en: "August 2026", de: "August 2026" } as const;

export type LegalSection = {
  heading: string;
  body: string[];
  links?: { label: string; href: string }[];
};

export type LegalDoc = {
  title: string;
  updatedLabel: string;
  intro: string;
  sections: LegalSection[];
};

export function legal(lang: Lang): { privacy: LegalDoc; imprint: LegalDoc } {
  if (lang === "de") {
    return {
      imprint: {
        title: "Impressum",
        updatedLabel: `Stand: ${LEGAL_UPDATED.de}`,
        intro: "Verantwortlich für diese Website:",
        sections: [
          {
            heading: "Betreiber",
            body: [LEGAL_OPERATOR, `E-Mail: ${LEGAL_EMAIL}`],
            links: [{ label: "LinkedIn-Profil", href: LEGAL_LINKEDIN }],
          },
          {
            heading: "Projekt",
            body: [
              "ÆON Protocol ist ein offenes, Apache-2.0-lizenziertes Spezifikationsprojekt. Der Quellcode dieser Website und alle Spezifikationen sind öffentlich auf GitHub einsehbar.",
            ],
            links: [
              { label: "github.com/marcelrapold/aeon-protocol", href: "https://github.com/marcelrapold/aeon-protocol" },
            ],
          },
          {
            heading: "Haftung",
            body: [
              "Die Inhalte wurden mit Sorgfalt erstellt. Für Inhalte externer Links wird keine Verantwortung übernommen; dafür sind ausschliesslich deren Betreiber zuständig. Lernreisen werden vom KI-Agenten der Nutzerin oder des Nutzers ausgeführt; diese Website liefert keine Inhalte aus und speichert keine Lernerdaten.",
            ],
          },
        ],
      },
      privacy: {
        title: "Datenschutz",
        updatedLabel: `Stand: ${LEGAL_UPDATED.de}`,
        intro:
          "Diese Website ist bewusst datensparsam: kein Konto, keine Cookies zur Nachverfolgung, keine Lernerdatenbank.",
        sections: [
          {
            heading: "Hosting",
            body: [
              "Die Website wird bei Vercel Inc. gehostet. Beim Abruf verarbeitet Vercel technisch notwendige Verbindungsdaten (z. B. IP-Adresse) zur Auslieferung der Seite.",
            ],
            links: [{ label: "Vercel Privacy Policy", href: "https://vercel.com/legal/privacy-policy" }],
          },
          {
            heading: "Analytik",
            body: [
              "Vercel Analytics erfasst aggregierte, anonymisierte Seitenaufrufe ohne Cookies und ohne geräteübergreifendes Tracking.",
              "Vercel Speed Insights misst zusätzlich die Ladeleistung echter Aufrufe (Core Web Vitals). Dabei fallen Zeitmesswerte, der Seitenpfad sowie Browser- und Gerätetyp an — ebenfalls ohne Cookies und ohne Wiedererkennung über Besuche hinweg.",
            ],
          },
          {
            heading: "Lerndaten",
            body: [
              "ÆON Learn läuft im KI-Agenten der Nutzerin oder des Nutzers. Diese Website empfängt, speichert und verarbeitet keine Lerninhalte, Gespräche oder Profile.",
            ],
          },
          {
            heading: "Kontakt",
            body: [`Fragen zum Datenschutz: ${LEGAL_EMAIL}`],
          },
        ],
      },
    };
  }

  return {
    imprint: {
      title: "Imprint",
      updatedLabel: `Last updated: ${LEGAL_UPDATED.en}`,
      intro: "Responsible for this website:",
      sections: [
        {
          heading: "Operator",
          body: [LEGAL_OPERATOR, `Email: ${LEGAL_EMAIL}`],
          links: [{ label: "LinkedIn profile", href: LEGAL_LINKEDIN }],
        },
        {
          heading: "Project",
          body: [
            "ÆON Protocol is an open, Apache-2.0-licensed specification project. The source of this website and all specifications are public on GitHub.",
          ],
          links: [
            { label: "github.com/marcelrapold/aeon-protocol", href: "https://github.com/marcelrapold/aeon-protocol" },
          ],
        },
        {
          heading: "Liability",
          body: [
            "Content is provided with care. No responsibility is taken for external links; their operators remain solely responsible. Learning journeys are executed by the user's own AI agent; this website serves no lesson content and stores no learner data.",
          ],
        },
      ],
    },
    privacy: {
      title: "Privacy",
      updatedLabel: `Last updated: ${LEGAL_UPDATED.en}`,
      intro: "This website is deliberately data-minimal: no accounts, no tracking cookies, no learner database.",
      sections: [
        {
          heading: "Hosting",
          body: [
            "The website is hosted by Vercel Inc. On access, Vercel processes technically necessary connection data (e.g. IP address) to deliver the page.",
          ],
          links: [{ label: "Vercel Privacy Policy", href: "https://vercel.com/legal/privacy-policy" }],
        },
        {
          heading: "Analytics",
          body: [
            "Vercel Analytics collects aggregated, anonymised page views without cookies and without cross-device tracking.",
            "Vercel Speed Insights additionally measures loading performance on real visits (Core Web Vitals). It records timing values, the page path and the browser and device type — likewise without cookies and without recognising a visitor across visits.",
          ],
        },
        {
          heading: "Learning data",
          body: [
            "ÆON Learn runs inside the user's own AI agent. This website receives, stores and processes no learning content, conversations or profiles.",
          ],
        },
        {
          heading: "Contact",
          body: [`Privacy questions: ${LEGAL_EMAIL}`],
        },
      ],
    },
  };
}
