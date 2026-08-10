import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
import type { PackageId } from "@/lib/content";

/**
 * Reads a library package straight from the repository at build time, so the
 * topic pages state what the package actually contains rather than a
 * hand-maintained copy that would drift. Server-only: every caller is a
 * statically generated page.
 */

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");

type Raw = Record<string, unknown>;

function read(id: PackageId, file: string): Raw | null {
  const path = resolve(repoRoot, "library", id, `${file}.yaml`);
  if (!existsSync(path)) return null;
  return parse(readFileSync(path, "utf8")) as Raw;
}

const strings = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];

const text = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;

export type Controversy = { question: string; positions: string[]; status?: string };
export type Misconception = { claim: string; status?: string; correction?: string };
export type Lens = { name: string; note?: string };

export type PackageDetail = {
  id: PackageId;
  name: string;
  description?: string;
  overview?: string;
  currentState?: string;
  domains: string[];
  learningPaths: string[];
  prerequisites: string[];
  relatedPackages: string[];
  lenses: Lens[];
  sourceCount: number;
  tierCounts: { tier: number; count: number }[];
  conceptCount: number;
  controversies: Controversy[];
  misconceptions: Misconception[];
};

/** Entries carry their prose under different keys across packages; take the
 *  first that reads like a sentence rather than assuming one shape. */
function pick(entry: Raw, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = text(entry[key]);
    if (value) return value;
  }
  return undefined;
}

export function packageDetail(id: PackageId): PackageDetail | null {
  const manifest = read(id, "manifest");
  if (!manifest) return null;

  const sources = read(id, "canonical-sources");
  const map = read(id, "knowledge-map");
  const myths = read(id, "common-misconceptions");

  const sourceEntries = Array.isArray(sources?.sources) ? (sources.sources as Raw[]) : [];
  const tally = new Map<number, number>();
  for (const entry of sourceEntries) {
    const tier = Number(entry.tier);
    if (Number.isFinite(tier)) tally.set(tier, (tally.get(tier) ?? 0) + 1);
  }

  const controversies = (Array.isArray(map?.major_controversies) ? (map.major_controversies as Raw[]) : [])
    .map((entry) => ({
      question: pick(entry, ["question", "title", "name", "id"]) ?? "",
      positions: strings(entry.positions),
      status: pick(entry, ["status"]),
    }))
    .filter((c) => c.question);

  const misconceptions = (Array.isArray(myths?.misconceptions) ? (myths.misconceptions as Raw[]) : [])
    .map((entry) => ({
      claim: pick(entry, ["claim", "title", "id"]) ?? "",
      status: pick(entry, ["status"]),
      correction: pick(entry, ["correction"]),
    }))
    .filter((m) => m.claim);

  const lenses = (Array.isArray(manifest.popular_lenses) ? (manifest.popular_lenses as Raw[]) : [])
    .map((entry) => ({ name: pick(entry, ["name"]) ?? "", note: pick(entry, ["note", "role"]) }))
    .filter((l) => l.name);

  return {
    id,
    name: text(manifest.name) ?? id,
    description: text(manifest.description),
    overview: text(map?.overview),
    currentState: text(map?.current_state),
    domains: strings(manifest.domains),
    learningPaths: strings(manifest.learning_paths),
    prerequisites: strings(manifest.prerequisites),
    relatedPackages: strings(manifest.related_packages),
    lenses,
    sourceCount: sourceEntries.length,
    tierCounts: [...tally.entries()].sort((a, b) => a[0] - b[0]).map(([tier, count]) => ({ tier, count })),
    conceptCount: Array.isArray(map?.core_concepts) ? (map.core_concepts as unknown[]).length : 0,
    controversies,
    misconceptions,
  };
}
