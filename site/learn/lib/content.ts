import {
  BookOpenCheck,
  Coins,
  FileCheck2,
  FlaskConical,
  GraduationCap,
  MessageCircleQuestion,
  Microscope,
  Network,
  Repeat2,
  Scale,
  SlidersHorizontal,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

/**
 * Language-neutral facts and structure. All prose lives in i18n.ts keyed by
 * the stable identifiers defined here — reordering this file can never
 * mistranslate a card.
 */

export const REPO = "https://github.com/marcelrapold/aeon-protocol";

/** Release tag agents fetch specs from. Re-pinned by scripts/bump-version.mjs. */
export const VERSION = "v0.1.0";

export const RAW = `https://raw.githubusercontent.com/marcelrapold/aeon-protocol/${VERSION}`;

/** The canonical invocation — the sentence users paste into their agent. */
export const INVOCATION = "Teach me Austrian Economics using learn.rapold.io";

export const LLMS_PATH = "/llms.txt";

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

export type PackageId = "charisma" | "austrian-economics" | "bitcoin";

export type LibraryPackage = { id: PackageId; icon: LucideIcon; href: string };

export const PACKAGES: LibraryPackage[] = [
  { id: "charisma", icon: Sparkles, href: treeUrl("library/charisma") },
  { id: "austrian-economics", icon: Coins, href: treeUrl("library/austrian-economics") },
  { id: "bitcoin", icon: BookOpenCheck, href: treeUrl("library/bitcoin") },
];

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

/* ── State machine (displayed in the method section) ────────────────── */

export const STATES = [
  "UNINITIALIZED",
  "DISCOVERY",
  "RESEARCHING",
  "MAPPING",
  "CURRICULUM_READY",
  "ACTIVE",
  "ASSESSING",
  "ADAPTING",
  "COMPLETED",
] as const;
