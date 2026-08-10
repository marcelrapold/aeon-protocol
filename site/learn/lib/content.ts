import {
  Activity,
  Atom,
  Blocks,
  BookOpenCheck,
  Boxes,
  Brain,
  CalendarCheck,
  Coins,
  Cpu,
  Dices,
  Dumbbell,
  FileCheck2,
  Fingerprint,
  FlaskConical,
  Flower2,
  GraduationCap,
  Handshake,
  HeartHandshake,
  KeyRound,
  Landmark,
  LineChart,
  Magnet,
  MessageCircleQuestion,
  Microscope,
  MoonStar,
  Mountain,
  Network,
  Orbit,
  Pill,
  Radio,
  Repeat2,
  Salad,
  Scale,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Timer,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { BrandSlug } from "@/components/brand-marks";

/**
 * Language-neutral facts and structure. All prose lives in i18n.ts keyed by
 * the stable identifiers defined here — reordering this file can never
 * mistranslate a card.
 */

export const REPO = "https://github.com/marcelrapold/aeon-protocol";

/** Release tag agents fetch specs from. Re-pinned by scripts/bump-version.mjs. */
export const VERSION = "v0.3.0";

/**
 * The date the content behind that tag shipped, in ISO form.
 *
 * The sitemap needs a truthful `lastmod`, and build time is not one: a redeploy
 * that changes nothing would still tell every crawler that all sixty-two pages
 * are new. A lastmod that cries wolf is worse than none, because a search
 * engine that catches it lying stops reading it at all. Releases are when the
 * specs and the library actually move, so that is the granularity claimed here.
 * scripts/bump-version.mjs stamps this alongside the tag.
 */
export const RELEASED = "2026-08-10";

/* RAW, INVOCATION and LLMS_PATH stood here and nothing read them. The raw-URL
   base belongs to the agent contract and is written out in public/llms.txt and
   products/learn/bootstrap.md, which the bump script pins; the invocation is
   per-locale prose and lives in lib/i18n.ts. Keeping unread copies of both
   invited them to drift out of step with the versions that matter. */

/** Human-facing GitHub blob URL for a repo path. */
export function blobUrl(path: string): string {
  return `${REPO}/blob/main/${path}`;
}

export function treeUrl(path: string): string {
  return `${REPO}/tree/main/${path}`;
}

/* ── How it works — the five learner-facing steps (§32) ─────────────── */

export type StepKey = "discover" | "research" | "structure" | "learn" | "adapt";

export type Step = { n: string; key: StepKey; icon: LucideIcon };

export const STEPS: Step[] = [
  { n: "1", key: "discover", icon: MessageCircleQuestion },
  { n: "2", key: "research", icon: Microscope },
  { n: "3", key: "structure", icon: Network },
  { n: "4", key: "learn", icon: GraduationCap },
  { n: "5", key: "adapt", icon: SlidersHorizontal },
];

/* ── Principles — why it is different (§39 distilled) ───────────────── */

export type PrincipleKey = "research" | "epistemics" | "contract" | "retrieval";

export type Principle = { key: PrincipleKey; icon: LucideIcon };

export const PRINCIPLES: Principle[] = [
  { key: "research", icon: FlaskConical },
  { key: "epistemics", icon: Scale },
  { key: "contract", icon: FileCheck2 },
  { key: "retrieval", icon: Repeat2 },
];

/* ── Deep-dive library packages ─────────────────────────────────────── */

export type PackageId =
  | "charisma"
  | "austrian-economics"
  | "bitcoin"
  | "personality-psychology"
  | "mindfulness-meditation"
  | "first-principles-thinking"
  | "game-theory"
  | "monetary-history"
  | "cryptography"
  | "systems-thinking"
  | "stoicism"
  | "negotiation"
  | "sleep-science"
  | "habit-formation"
  | "economic-psychology"
  | "simulation-hypothesis"
  | "business-cycles"
  | "intermittent-fasting"
  | "creatine"
  | "law-of-attraction"
  | "inner-child-work"
  | "investing-and-markets"
  | "energy-economics"
  | "information-theory"
  | "distributed-systems"
  | "large-language-models"
  | "quantum-computing"
  | "software-architecture"
  | "strength-training"
  | "nutrition-fundamentals";

export type LibraryPackage = { id: PackageId; icon: LucideIcon; href: string };

const pkg = (id: PackageId, icon: LucideIcon): LibraryPackage => ({
  id,
  icon,
  href: treeUrl(`library/${id}`),
});

export const PACKAGES: LibraryPackage[] = [
  pkg("charisma", Sparkles),
  pkg("austrian-economics", Coins),
  pkg("bitcoin", BookOpenCheck),
  pkg("personality-psychology", Fingerprint),
  pkg("mindfulness-meditation", Flower2),
  pkg("first-principles-thinking", Atom),
  pkg("game-theory", Dices),
  pkg("monetary-history", Landmark),
  pkg("cryptography", KeyRound),
  pkg("systems-thinking", Workflow),
  pkg("stoicism", Mountain),
  pkg("negotiation", Handshake),
  pkg("sleep-science", MoonStar),
  pkg("habit-formation", CalendarCheck),
  pkg("economic-psychology", Brain),
  pkg("simulation-hypothesis", Boxes),
  pkg("business-cycles", Activity),
  pkg("intermittent-fasting", Timer),
  pkg("creatine", Pill),
  pkg("law-of-attraction", Magnet),
  pkg("inner-child-work", HeartHandshake),
  pkg("investing-and-markets", LineChart),
  pkg("energy-economics", Zap),
  pkg("information-theory", Radio),
  pkg("distributed-systems", Share2),
  pkg("large-language-models", Cpu),
  pkg("quantum-computing", Orbit),
  pkg("software-architecture", Blocks),
  pkg("strength-training", Dumbbell),
  pkg("nutrition-fundamentals", Salad),
];

/**
 * Library packages grouped by field. Every PackageId must appear in exactly
 * one group — asserted by lib/i18n.test.ts, so a new package cannot silently
 * vanish from the page.
 */
export type PackageGroupKey = "economy" | "thinking" | "technology" | "people" | "body";

export const PACKAGE_GROUPS: { key: PackageGroupKey; ids: PackageId[] }[] = [
  {
    key: "economy",
    ids: [
      "austrian-economics",
      "business-cycles",
      "monetary-history",
      "economic-psychology",
      "investing-and-markets",
      "energy-economics",
    ],
  },
  {
    key: "thinking",
    ids: [
      "first-principles-thinking",
      "game-theory",
      "systems-thinking",
      "information-theory",
      "simulation-hypothesis",
      "law-of-attraction",
    ],
  },
  {
    key: "technology",
    ids: [
      "bitcoin",
      "cryptography",
      "distributed-systems",
      "software-architecture",
      "large-language-models",
      "quantum-computing",
    ],
  },
  {
    key: "people",
    ids: [
      "charisma",
      "negotiation",
      "personality-psychology",
      "stoicism",
      "mindfulness-meditation",
      "inner-child-work",
    ],
  },
  {
    key: "body",
    ids: [
      "sleep-science",
      "nutrition-fundamentals",
      "strength-training",
      "habit-formation",
      "intermittent-fasting",
      "creatine",
    ],
  },
];

/** Lookup so a group can render full package records without re-deriving. */
export function packagesIn(key: PackageGroupKey): LibraryPackage[] {
  const group = PACKAGE_GROUPS.find((g) => g.key === key);
  if (!group) return [];
  return group.ids
    .map((id) => PACKAGES.find((p) => p.id === id))
    .filter((p): p is LibraryPackage => Boolean(p));
}

/* ── Specification files (existence is asserted by lib/content.test.ts) ── */

export const PROTOCOL_SPECS = [
  "protocol/core.md",
  "protocol/capabilities.md",
  "protocol/orchestration.md",
  "protocol/research.md",
  "protocol/epistemics.md",
  "protocol/state.md",
  "protocol/interoperability.md",
] as const;

export const LEARN_SPECS = [
  "products/learn/bootstrap.md",
  "products/learn/specification.md",
  "products/learn/discovery.md",
  "products/learn/research.md",
  "products/learn/knowledge-map.md",
  "products/learn/curriculum.md",
  "products/learn/session.md",
  "products/learn/adaptation.md",
  "products/learn/assessment.md",
] as const;

export const SCHEMA_FILES = [
  "schemas/capability.schema.json",
  "schemas/learner.schema.json",
  "schemas/curriculum.schema.json",
  "schemas/lesson.schema.json",
  "schemas/topic-package.schema.json",
] as const;

/**
 * What the invocation surface is actually built from. Honest and complete:
 * the list stops where the stack stops, and the absence of a database, a
 * backend and an AI vendor is itself part of the protocol's claim.
 */
export const STACK: { name: string; href: string; brand: BrandSlug }[] = [
  { name: "Next.js", href: "https://nextjs.org", brand: "nextdotjs" },
  { name: "React", href: "https://react.dev", brand: "react" },
  { name: "TypeScript", href: "https://www.typescriptlang.org", brand: "typescript" },
  { name: "Tailwind CSS", href: "https://tailwindcss.com", brand: "tailwindcss" },
  { name: "Vitest", href: "https://vitest.dev", brand: "vitest" },
  { name: "Ajv", href: "https://ajv.js.org", brand: "ajv" },
  { name: "JSON Schema", href: "https://json-schema.org", brand: "json" },
  { name: "Vercel", href: "https://vercel.com", brand: "vercel" },
];

/**
 * Agents the protocol is meant to be invoked from. Examples, not a
 * compatibility matrix: the contract is capability negotiation, so anything
 * that can read a page and search the web can run it, and anything that
 * cannot degrades gracefully instead of failing.
 *
 * Every entry carries its mark. `brand` stays nullable because a future
 * addition may arrive before its outline does, and a name set in type beats
 * an outline drawn from memory.
 */
export const AGENTS: { name: string; href: string; brand: BrandSlug | null }[] = [
  { name: "ChatGPT", href: "https://chatgpt.com", brand: "openai" },
  { name: "Claude", href: "https://claude.ai", brand: "claude" },
  { name: "Gemini", href: "https://gemini.google.com", brand: "googlegemini" },
  { name: "Copilot", href: "https://github.com/features/copilot", brand: "githubcopilot" },
  { name: "Perplexity", href: "https://www.perplexity.ai", brand: "perplexity" },
  { name: "Mistral", href: "https://chat.mistral.ai", brand: "mistralai" },
  { name: "DeepSeek", href: "https://chat.deepseek.com", brand: "deepseek" },
];

/* ── The Charisma origin fixture ────────────────────────────────────── */

export const CHARISMA = {
  days: 14,
  sources: 26,
  href: treeUrl("products/learn/examples/charisma"),
  retrospectiveHref: blobUrl("products/learn/examples/charisma/retrospective.md"),
  sourceMapHref: blobUrl("products/learn/examples/charisma/source-map.md"),
} as const;

/** The origin chain (§21) — stable keys, prose in i18n. */
export const ORIGIN_CHAIN = [
  "stimulus",
  "curiosity",
  "decomposition",
  "research",
  "sequencing",
  "explanation",
  "evidence",
  "transfer",
  "reflection",
  "immersion",
] as const;

export type OriginChainKey = (typeof ORIGIN_CHAIN)[number];

/* The state machine used to live here, described as "displayed in the method
   section". It was not — the journey graph replaced it and nothing has read
   this list since. The states themselves are normative and live where they
   belong, in protocol/state.md. */
