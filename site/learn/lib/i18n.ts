import type { OriginChainKey, PackageId, PrincipleKey, StepKey } from "@/lib/content";

export type Lang = "en" | "de";

type SectionIntro = { eyebrow: string; title: string; lead: string };

type Dict = {
  nav: { how: string; why: string; origin: string; library: string; protocol: string };
  a11y: {
    skip: string;
    themeLight: string;
    themeDark: string;
    navOpen: string;
    navClose: string;
    langSwitch: string;
  };
  hero: {
    badge: string;
    title: string;
    subA: string;
    subB: string;
    subC: string;
    lead: string;
    meta: string;
    cta: string;
    ctaCopied: string;
    copiedAnnounce: string;
    failedAnnounce: string;
    secondary: string;
    hint: string;
  };
  agent: SectionIntro & {
    explain: string;
    cmdCopy: string;
    cmdCopied: string;
    cmdHint: string;
    notePre: string;
    notePost: string;
    trust: { q: string; a: string }[];
  };
  how: SectionIntro & {
    input: string;
    inputCaption: string;
    output: string;
    outputCaption: string;
    steps: Record<StepKey, { title: string; body: string }>;
    tiers: string[];
    gate: string;
    statesLabel: string;
  };
  why: SectionIntro & {
    principles: Record<PrincipleKey, { title: string; body: string }>;
  };
  origin: SectionIntro & {
    para: string;
    chain: Record<OriginChainKey, string>;
    stats: { days: string; sources: string; preserved: string };
    ctaFixture: string;
    ctaRetro: string;
  };
  library: SectionIntro & {
    note: string;
    packages: Record<PackageId, { name: string; blurb: string; meta: string }>;
  };
  protocol: SectionIntro & {
    groups: {
      core: { title: string; blurb: string };
      learn: { title: string; blurb: string };
      schemas: { title: string; blurb: string };
      evals: { title: string; blurb: string };
    };
    version: string;
  };
  cta: { title: string; lead: string; button: string; buttonCopied: string; gh: string };
  footer: { tagline: string; imprint: string; privacy: string; github: string; license: string };
  notFound: { title: string; body: string; back: string };
};

export const ui: Record<Lang, Dict> = {
  en: {
    nav: {
      how: "How it works",
      why: "Why ÆON",
      origin: "Origin",
      library: "Library",
      protocol: "Protocol",
    },
    a11y: {
      skip: "Skip to content",
      themeLight: "Switch to light theme",
      themeDark: "Switch to dark theme",
      navOpen: "Open navigation",
      navClose: "Close navigation",
      langSwitch: "Diese Seite auf Deutsch",
    },
    hero: {
      badge: "Open protocol",
      title: "ÆON Learn",
      subA: "Any subject.",
      subB: "Deeply researched.",
      subC: "Built around you.",
      lead: "One sentence to your AI agent compiles a researched, adaptive learning journey — discovery first, research before curriculum, sessions that make knowledge stick.",
      meta: "no account · no platform · your agent is the runtime",
      cta: "Copy the invocation",
      ctaCopied: "Copied",
      copiedAnnounce: "Invocation copied to clipboard",
      failedAnnounce: "Copying failed — select and copy the sentence manually",
      secondary: "See how it works",
      hint: "Copies a template — swap in any subject you want to learn.",
    },
    agent: {
      eyebrow: "Run it",
      title: "Point your AI agent at learn.rapold.io",
      lead: "No install — works with any agent that can fetch a URL. Tell it what to teach you using learn.rapold.io: it fetches the ÆON Learn bootstrap, asks what you already know and want, researches the subject, and compiles your personal curriculum before the first lesson.",
      explain: "Copy it, swap in your subject, paste it to your agent.",
      cmdCopy: "Copy",
      cmdCopied: "Copied",
      cmdHint: "It then asks: your current knowledge, your goal, daily time, duration and formats — then researches, compiles and presents the learning contract.",
      notePre: "AI agents: fetch",
      notePost: "and act as the ÆON Learn orchestrator (discovery first, then research, then teach).",
      trust: [
        {
          q: "Do I need an account?",
          a: "No. There is no account, no backend and no tracking of learners — your agent runs the whole journey.",
        },
        {
          q: "Which AI agent works?",
          a: "Any capable one — ChatGPT, Claude, Gemini or a local agent. ÆON detects capabilities and degrades gracefully instead of pretending.",
        },
        {
          q: "What does it cost?",
          a: "Just your agent's tokens. The protocol, specs and topic packages are free and Apache-2.0 licensed.",
        },
        {
          q: "Where does the content come from?",
          a: "Your agent researches it — tiered sources, primary evidence first, with honest labels for contested claims. Not from a course catalogue.",
        },
      ],
    },
    how: {
      eyebrow: "The method",
      title: "Five phases, every time",
      lead: "ÆON Learn never dumps chapters. It discovers, researches and structures before it teaches — and it adapts without breaking the path.",
      input: "Teach me Austrian Economics using learn.rapold.io",
      inputCaption: "You type — one sentence, any capable agent.",
      output: "A researched, adaptive learning journey.",
      outputCaption: "You get — sessions with evidence, exercises and retrieval.",
      steps: {
        discover: {
          title: "Discover",
          body: "The agent asks what you already know, what you want to achieve, how much time you have and how deep you want to go. No lesson before this.",
        },
        research: {
          title: "Research",
          body: "It builds an evidence map from tiered sources — primary evidence first, popular explanation last. Without web access it says so and lowers its confidence.",
        },
        structure: {
          title: "Structure",
          body: "Concepts, prerequisites, controversies and misconceptions become a knowledge map; modules follow dependencies, not chapter conventions.",
        },
        learn: {
          title: "Learn",
          body: "You approve a learning contract, then sessions run: hook, one core concept, evidence, its limits, application, exercise, reflection.",
        },
        adapt: {
          title: "Adapt",
          body: "Too easy, too hard, needs depth? Later modules adjust — the prerequisite structure never breaks. Earlier concepts return as retrieval.",
        },
      },
      tiers: ["Tier 1 · primary", "Tier 2 · synthesis", "Tier 3 · expert", "Tier 4 · popular"],
      gate: "learning contract — you approve before teaching starts",
      statesLabel: "Explicit journey state",
    },
    why: {
      eyebrow: "Why it is different",
      title: "Most AI tutoring is generation. This is discipline.",
      lead: "ÆON specifies behaviour, not prose: what an agent must do, verify and disclose before it may call itself a teacher.",
      principles: {
        research: {
          title: "Research over generation",
          body: "A curriculum is compiled from an evidence map, not expanded from pretrained memory. Sources are tiered; primary evidence outranks readability.",
        },
        epistemics: {
          title: "Calibrated honesty",
          body: "Claims carry labels from established finding to ÆON inference. Contested subjects must include serious counterpositions — no false certainty.",
        },
        contract: {
          title: "Contract before content",
          body: "Capability detection, discovery and an approved learning contract come first. An agent that cannot schedule says so — it never pretends.",
        },
        retrieval: {
          title: "Retrieval over rereading",
          body: "Sessions end with exercises and reflection; later sessions demand recall before showing answers. Completion means you can reason with the material.",
        },
      },
    },
    origin: {
      eyebrow: "Proof, not claims",
      title: "Born from a real learning sprint",
      lead: "ÆON Learn generalises a real 14-day journey — the Charisma Sprint — preserved in the repository substantively unchanged as the canonical reference fixture.",
      para: "An Instagram ad sparked curiosity; research replaced the ad's promises with evidence. Fourteen daily sessions, twenty-six anchored sources, daily drills and three reflection questions each — the pattern ÆON Learn now specifies for any subject. The retrospective documents honestly what worked and what the protocol improves.",
      chain: {
        stimulus: "Raw stimulus",
        curiosity: "User curiosity",
        decomposition: "Topic decomposition",
        research: "Research",
        sequencing: "Daily sequencing",
        explanation: "Podcast-native explanation",
        evidence: "Evidence",
        transfer: "Behavioural transfer",
        reflection: "Reflection",
        immersion: "Progressive immersion",
      },
      stats: {
        days: "daily sessions, preserved verbatim",
        sources: "anchored sources, tiered in the source map",
        preserved: "original documents, byte-identical",
      },
      ctaFixture: "Browse the fixture",
      ctaRetro: "Read the retrospective",
    },
    library: {
      eyebrow: "The library",
      title: "Topic packages — accelerators, never limits",
      lead: "Curated epistemic scaffolding for known subjects: canonical sources, knowledge maps, misconceptions. Any subject outside the library works too — the agent researches it dynamically.",
      note: "Packages provide curated sources and maps, not fixed prose lessons.",
      packages: {
        charisma: {
          name: "Charisma",
          blurb: "The origin case as a full package: sources S1–S26, knowledge map, misconceptions, 14-day curriculum template and advanced paths.",
          meta: "full package · 6 files",
        },
        "austrian-economics": {
          name: "Austrian economics",
          blurb: "Canonical texts from Menger to Hayek, a dependency-ordered knowledge map — controversies and mainstream critiques included.",
          meta: "curated manifest · sources · map",
        },
        bitcoin: {
          name: "Bitcoin",
          blurb: "Whitepaper, Core documentation, selected BIPs and primary historical material across five learning paths.",
          meta: "curated manifest · sources",
        },
      },
    },
    protocol: {
      eyebrow: "The protocol",
      title: "Open, versioned, machine-readable",
      lead: "Everything an agent needs is public: normative specifications, JSON schemas and behavioural evals. Apache-2.0, semantic versioning, release-tag pinning.",
      groups: {
        core: {
          title: "Protocol core",
          blurb: "Seven normative specs: capabilities, orchestration, research, epistemics, state, interoperability.",
        },
        learn: {
          title: "ÆON Learn",
          blurb: "The complete workflow specification with stable requirement IDs — from discovery to assessment.",
        },
        schemas: {
          title: "Schemas",
          blurb: "Machine-readable contracts for capability profiles, learner state, curricula, lessons and topic packages.",
        },
        evals: {
          title: "Evals",
          blurb: "Six behavioural compliance tests — discovery-first, graceful degradation, epistemic honesty and more.",
        },
      },
      version: "current release",
    },
    cta: {
      title: "See what your agent builds when it has to research first",
      lead: "Free, open, Apache-2.0. Pick any subject — the obscure ones are the best test.",
      button: "Copy the invocation",
      buttonCopied: "Copied",
      gh: "Read the protocol on GitHub",
    },
    footer: {
      tagline: "The website is the invocation surface. The repository is the specification. Your agent is the runtime.",
      imprint: "Imprint",
      privacy: "Privacy",
      github: "GitHub",
      license: "Apache-2.0",
    },
    notFound: {
      title: "Page not found",
      body: "This page does not exist. The protocol lives on the home page and on GitHub.",
      back: "Back to start",
    },
  },

  de: {
    nav: {
      how: "So funktioniert es",
      why: "Warum ÆON",
      origin: "Ursprung",
      library: "Bibliothek",
      protocol: "Protokoll",
    },
    a11y: {
      skip: "Zum Inhalt springen",
      themeLight: "Zum hellen Design wechseln",
      themeDark: "Zum dunklen Design wechseln",
      navOpen: "Navigation öffnen",
      navClose: "Navigation schliessen",
      langSwitch: "This page in English",
    },
    hero: {
      badge: "Offenes Protokoll",
      title: "ÆON Learn",
      subA: "Jedes Thema.",
      subB: "Tief recherchiert.",
      subC: "Um dich gebaut.",
      lead: "Ein Satz an deinen KI-Agenten kompiliert eine recherchierte, adaptive Lernreise — erst Discovery, dann Recherche, dann Sessions, die Wissen verankern.",
      meta: "kein Konto · keine Plattform · dein Agent ist die Runtime",
      cta: "Invocation kopieren",
      ctaCopied: "Kopiert",
      copiedAnnounce: "Invocation in die Zwischenablage kopiert",
      failedAnnounce: "Kopieren fehlgeschlagen — markiere und kopiere den Satz manuell",
      secondary: "So funktioniert es",
      hint: "Kopiert eine Vorlage — setze ein beliebiges Thema ein.",
    },
    agent: {
      eyebrow: "Los geht es",
      title: "Zeig deinem KI-Agenten learn.rapold.io",
      lead: "Keine Installation — funktioniert mit jedem Agenten, der URLs abrufen kann. Sag ihm, was er dir mit learn.rapold.io beibringen soll: Er holt den ÆON-Learn-Bootstrap, fragt nach Vorwissen und Ziel, recherchiert das Thema und kompiliert dein persönliches Curriculum vor der ersten Lektion.",
      explain: "Kopieren, Thema einsetzen, an deinen Agenten schicken.",
      cmdCopy: "Kopieren",
      cmdCopied: "Kopiert",
      cmdHint: "Danach fragt er: Vorwissen, Ziel, Zeit pro Tag, Dauer und Formate — dann recherchiert er, kompiliert und präsentiert den Lernvertrag.",
      notePre: "KI-Agenten: Hole",
      notePost: "und agiere als ÆON-Learn-Orchestrator (erst Discovery, dann Recherche, dann Lehren).",
      trust: [
        {
          q: "Brauche ich ein Konto?",
          a: "Nein. Kein Konto, kein Backend, kein Lerner-Tracking — dein Agent führt die ganze Reise aus.",
        },
        {
          q: "Welcher KI-Agent funktioniert?",
          a: "Jeder fähige — ChatGPT, Claude, Gemini oder ein lokaler Agent. ÆON erkennt Fähigkeiten und degradiert ehrlich statt zu bluffen.",
        },
        {
          q: "Was kostet es?",
          a: "Nur die Tokens deines Agenten. Protokoll, Specs und Themenpakete sind frei und Apache-2.0-lizenziert.",
        },
        {
          q: "Woher kommt der Inhalt?",
          a: "Dein Agent recherchiert ihn — abgestufte Quellen, Primärevidenz zuerst, ehrliche Labels für umstrittene Aussagen. Nicht aus einem Kurskatalog.",
        },
      ],
    },
    how: {
      eyebrow: "Die Methode",
      title: "Fünf Phasen, jedes Mal",
      lead: "ÆON Learn wirft keine Kapitel aus. Es entdeckt, recherchiert und strukturiert, bevor es lehrt — und passt sich an, ohne den Pfad zu brechen.",
      input: "Teach me Austrian Economics using learn.rapold.io",
      inputCaption: "Du tippst — ein Satz, jeder fähige Agent.",
      output: "Eine recherchierte, adaptive Lernreise.",
      outputCaption: "Du bekommst — Sessions mit Evidenz, Übungen und Retrieval.",
      steps: {
        discover: {
          title: "Discover",
          body: "Der Agent fragt, was du schon weisst, was du erreichen willst, wie viel Zeit du hast und wie tief es gehen soll. Keine Lektion davor.",
        },
        research: {
          title: "Research",
          body: "Er baut eine Evidenzkarte aus abgestuften Quellen — Primärevidenz zuerst, populäre Erklärung zuletzt. Ohne Webzugriff sagt er es und senkt seine Konfidenz.",
        },
        structure: {
          title: "Structure",
          body: "Konzepte, Voraussetzungen, Kontroversen und Missverständnisse werden zur Wissenskarte; Module folgen Abhängigkeiten, nicht Kapitelkonventionen.",
        },
        learn: {
          title: "Learn",
          body: "Du genehmigst einen Lernvertrag, dann laufen Sessions: Hook, ein Kernkonzept, Evidenz, ihre Grenzen, Anwendung, Übung, Reflexion.",
        },
        adapt: {
          title: "Adapt",
          body: "Zu leicht, zu schwer, mehr Tiefe? Spätere Module passen sich an — die Abhängigkeitsstruktur bricht nie. Frühere Konzepte kehren als Retrieval zurück.",
        },
      },
      tiers: ["Tier 1 · primär", "Tier 2 · Synthese", "Tier 3 · Experten", "Tier 4 · populär"],
      gate: "Lernvertrag — du genehmigst, bevor das Lehren beginnt",
      statesLabel: "Expliziter Journey-Status",
    },
    why: {
      eyebrow: "Warum es anders ist",
      title: "Die meisten KI-Tutorials sind Generierung. Das hier ist Disziplin.",
      lead: "ÆON spezifiziert Verhalten, nicht Prosa: was ein Agent tun, prüfen und offenlegen muss, bevor er sich Lehrer nennen darf.",
      principles: {
        research: {
          title: "Recherche vor Generierung",
          body: "Ein Curriculum wird aus einer Evidenzkarte kompiliert, nicht aus Trainingswissen expandiert. Quellen sind abgestuft; Primärevidenz schlägt Lesbarkeit.",
        },
        epistemics: {
          title: "Kalibrierte Ehrlichkeit",
          body: "Aussagen tragen Labels von Established finding bis ÆON inference. Umstrittene Themen brauchen ernsthafte Gegenpositionen — keine falsche Sicherheit.",
        },
        contract: {
          title: "Vertrag vor Inhalt",
          body: "Erst Fähigkeitserkennung, Discovery und ein genehmigter Lernvertrag. Ein Agent ohne Scheduling sagt es — er tut nie so als ob.",
        },
        retrieval: {
          title: "Abruf statt Wiederlesen",
          body: "Sessions enden mit Übung und Reflexion; spätere Sessions verlangen Abruf, bevor Antworten erscheinen. Abschluss heisst: Du kannst mit dem Stoff argumentieren.",
        },
      },
    },
    origin: {
      eyebrow: "Beweis statt Behauptung",
      title: "Entstanden aus einem echten Lern-Sprint",
      lead: "ÆON Learn verallgemeinert eine echte 14-Tage-Reise — den Charisma Sprint — im Repository substanziell unverändert erhalten als kanonische Referenz.",
      para: "Eine Instagram-Werbung weckte Neugier; Recherche ersetzte die Versprechen der Werbung durch Evidenz. Vierzehn tägliche Sessions, sechsundzwanzig verankerte Quellen, tägliche Drills und je drei Reflexionsfragen — das Muster, das ÆON Learn jetzt für jedes Thema spezifiziert. Die Retrospektive dokumentiert ehrlich, was funktionierte und was das Protokoll verbessert.",
      chain: {
        stimulus: "Roher Impuls",
        curiosity: "Neugier",
        decomposition: "Themenzerlegung",
        research: "Recherche",
        sequencing: "Tages-Sequenzierung",
        explanation: "Podcast-native Erklärung",
        evidence: "Evidenz",
        transfer: "Verhaltenstransfer",
        reflection: "Reflexion",
        immersion: "Progressive Vertiefung",
      },
      stats: {
        days: "tägliche Sessions, wortgetreu erhalten",
        sources: "verankerte Quellen, im Source-Map abgestuft",
        preserved: "Originaldokumente, byte-identisch",
      },
      ctaFixture: "Fixture ansehen",
      ctaRetro: "Retrospektive lesen",
    },
    library: {
      eyebrow: "Die Bibliothek",
      title: "Themenpakete — Beschleuniger, nie Begrenzung",
      lead: "Kuratiertes epistemisches Gerüst für bekannte Themen: kanonische Quellen, Wissenskarten, Missverständnisse. Jedes Thema ausserhalb der Bibliothek funktioniert auch — der Agent recherchiert es dynamisch.",
      note: "Pakete liefern kuratierte Quellen und Karten, keine fixen Prosa-Lektionen.",
      packages: {
        charisma: {
          name: "Charisma",
          blurb: "Der Ursprungsfall als volles Paket: Quellen S1–S26, Wissenskarte, Missverständnisse, 14-Tage-Curriculum-Vorlage und Vertiefungspfade.",
          meta: "volles Paket · 6 Dateien",
        },
        "austrian-economics": {
          name: "Austrian Economics",
          blurb: "Kanonische Texte von Menger bis Hayek, eine abhängigkeitsgeordnete Wissenskarte — Kontroversen und Mainstream-Kritik inklusive.",
          meta: "kuratiertes Manifest · Quellen · Karte",
        },
        bitcoin: {
          name: "Bitcoin",
          blurb: "Whitepaper, Core-Dokumentation, ausgewählte BIPs und historisches Primärmaterial über fünf Lernpfade.",
          meta: "kuratiertes Manifest · Quellen",
        },
      },
    },
    protocol: {
      eyebrow: "Das Protokoll",
      title: "Offen, versioniert, maschinenlesbar",
      lead: "Alles, was ein Agent braucht, ist öffentlich: normative Spezifikationen, JSON-Schemas und Verhaltens-Evals. Apache-2.0, semantische Versionierung, Release-Tag-Pinning.",
      groups: {
        core: {
          title: "Protokoll-Kern",
          blurb: "Sieben normative Specs: Capabilities, Orchestrierung, Recherche, Epistemik, Status, Interoperabilität.",
        },
        learn: {
          title: "ÆON Learn",
          blurb: "Die vollständige Workflow-Spezifikation mit stabilen Requirement-IDs — von Discovery bis Assessment.",
        },
        schemas: {
          title: "Schemas",
          blurb: "Maschinenlesbare Verträge für Fähigkeitsprofile, Lernerstatus, Curricula, Lektionen und Themenpakete.",
        },
        evals: {
          title: "Evals",
          blurb: "Sechs Verhaltens-Compliance-Tests — Discovery-first, ehrliche Degradation, epistemische Redlichkeit und mehr.",
        },
      },
      version: "aktuelles Release",
    },
    cta: {
      title: "Sieh, was dein Agent baut, wenn er zuerst recherchieren muss",
      lead: "Frei, offen, Apache-2.0. Wähle irgendein Thema — die obskuren sind der beste Test.",
      button: "Invocation kopieren",
      buttonCopied: "Kopiert",
      gh: "Protokoll auf GitHub lesen",
    },
    footer: {
      tagline: "Die Website ist die Invocation-Oberfläche. Das Repository ist die Spezifikation. Dein Agent ist die Runtime.",
      imprint: "Impressum",
      privacy: "Datenschutz",
      github: "GitHub",
      license: "Apache-2.0",
    },
    notFound: {
      title: "Seite nicht gefunden",
      body: "Diese Seite existiert nicht. Das Protokoll lebt auf der Startseite und auf GitHub.",
      back: "Zurück zum Start",
    },
  },
};

export function t(lang: Lang): Dict {
  return ui[lang];
}
