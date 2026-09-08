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
 *
 * Reading and interpreting are separate on purpose. `readPackageFiles` is the
 * only part that touches the disk; `buildPackageDetail` is a pure function of
 * whatever came back, so the behaviour on a half-written, wrongly shaped or
 * empty package file is testable without staging a fake repository.
 */

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");

type Raw = Record<string, unknown>;

/** Anything a YAML document can be, narrowed to the only shape we can read. */
const asRecord = (value: unknown): Raw | null =>
  typeof value === "object" && value !== null && !Array.isArray(value) ? (value as Raw) : null;

/** Array-of-records, with non-record entries (nulls, scalars) dropped rather
 *  than dereferenced — a single `- ` line with nothing after it parses to
 *  null, and reading `.tier` off that would fail the whole build. */
const records = (value: unknown): Raw[] =>
  Array.isArray(value) ? value.filter((entry): entry is Raw => asRecord(entry) !== null) : [];

/** Whatever the file parsed to, or null when there is no such file. Narrowing
 *  is left to `buildPackageDetail`, so the pure half is total over any
 *  document YAML can produce rather than trusting this one to have filtered. */
function read(id: PackageId, file: string): unknown {
  const path = resolve(repoRoot, "library", id, `${file}.yaml`);
  if (!existsSync(path)) return null;
  return parse(readFileSync(path, "utf8"));
}

const strings = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];

const text = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;

/* `?: T | undefined` rather than `?: T`: under exactOptionalPropertyTypes the
   two differ, and these fields are genuinely built by handing an expression
   that may evaluate to undefined. Saying so is honest and keeps callers from
   having to reconstruct the object key by key. */
export type Controversy = { question: string; positions: string[]; status?: string | undefined };
export type Misconception = {
  claim: string;
  status?: string | undefined;
  correction?: string | undefined;
};
export type Lens = { name: string; note?: string | undefined };

export type PackageDetail = {
  id: PackageId;
  name: string;
  description?: string | undefined;
  overview?: string | undefined;
  currentState?: string | undefined;
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

/**
 * The four YAML documents a topic page reads, exactly as they parsed.
 *
 * Deliberately `unknown` rather than a record type: an empty file parses to
 * null, a file holding one line parses to a string, and a file that is one
 * top-level list parses to an array. Claiming any of those is a record is how
 * a build ends up dereferencing a string. Only the manifest is required —
 * a package that ships without a knowledge map still renders.
 */
export type PackageFiles = {
  manifest: unknown;
  sources: unknown;
  map: unknown;
  myths: unknown;
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

export function readPackageFiles(id: PackageId): PackageFiles {
  return {
    manifest: read(id, "manifest"),
    sources: read(id, "canonical-sources"),
    map: read(id, "knowledge-map"),
    myths: read(id, "common-misconceptions"),
  };
}

/** Pure: everything the topic page renders, derived from parsed YAML alone. */
export function buildPackageDetail(id: PackageId, files: PackageFiles): PackageDetail | null {
  const manifest = asRecord(files.manifest);
  const sources = asRecord(files.sources);
  const map = asRecord(files.map);
  const myths = asRecord(files.myths);
  if (!manifest) return null;

  const sourceEntries = records(sources?.sources);
  const tally = new Map<number, number>();
  for (const entry of sourceEntries) {
    const tier = Number(entry.tier);
    if (Number.isFinite(tier)) tally.set(tier, (tally.get(tier) ?? 0) + 1);
  }

  const controversies = records(map?.major_controversies)
    .map((entry) => ({
      question: pick(entry, ["question", "title", "name", "id"]) ?? "",
      positions: strings(entry.positions),
      status: pick(entry, ["status"]),
    }))
    .filter((c) => c.question);

  const misconceptions = records(myths?.misconceptions)
    .map((entry) => ({
      claim: pick(entry, ["claim", "title", "id"]) ?? "",
      status: pick(entry, ["status"]),
      correction: pick(entry, ["correction"]),
    }))
    .filter((m) => m.claim);

  const lenses = records(manifest.popular_lenses)
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
    conceptCount: Array.isArray(map?.core_concepts) ? map.core_concepts.length : 0,
    controversies,
    misconceptions,
  };
}

export function packageDetail(id: PackageId): PackageDetail | null {
  return buildPackageDetail(id, readPackageFiles(id));
}
