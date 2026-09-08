/**
 * Check: the registry of normative requirement identifiers.
 *
 * Requirements carry stable identifiers such as `LEARN-D-2` so that evals can
 * reference them and so that a removed identifier is never reused
 * (CONTRIBUTING.md). Two failures matter: the same identifier defined twice,
 * which makes "the requirement" ambiguous, and an eval that scores an
 * identifier no specification defines, which makes the eval unfalsifiable.
 */

import { maskCode, splitLines } from "../markdown.mjs";
import { error, warning } from "../reporter.mjs";
import { listFiles, pathKind, readText } from "../repo.mjs";

/** Where requirements are defined. */
export const SPECIFICATION_SOURCES = ["protocol", "products/learn", "library/README.md"];

/** Where requirements are referenced and must already exist. */
export const REFERENCE_SOURCES = ["evals"];

/** The shape of an identifier: an area, an optional sub-area, and a number. */
export const IDENTIFIER = /\b[A-Z]{2,6}(?:-[A-Z]{1,3})?-\d{1,3}\b/g;

/**
 * A definition is a bold identifier opening a line, optionally labelled:
 * `**LEARN-S-4 (Evidence)** — ...`.
 */
const DEFINITION = /^\*\*([A-Z]{2,6}(?:-[A-Z]{1,3})?-\d{1,3})(?: \([^)]*\))?\*\*/;

/**
 * Identifier-shaped tokens that name standards rather than requirements.
 */
export const NOT_REQUIREMENTS = new Set([
  "BCP-47",
  "ISO-639",
  "RFC-2119",
  "RFC-8174",
  "UTF-8",
  "UTF-16",
]);

/**
 * @param {string} repoPath
 * @param {string | undefined} root
 * @returns {string[]}
 */
function markdownUnder(repoPath, root) {
  if (!repoPath.endsWith(".md")) return listFiles({ root, dir: repoPath, extensions: [".md"] });
  return pathKind(repoPath, root) === "file" ? [repoPath] : [];
}

/**
 * @param {{ root?: string }} [context]
 * @returns {import("../reporter.mjs").CheckResult}
 */
export function run({ root } = {}) {
  /** @type {import("../reporter.mjs").Finding[]} */
  const findings = [];

  /** @type {Map<string, { file: string, line: number }[]>} */
  const registry = new Map();
  /** @type {Set<string>} */
  const mentioned = new Set();

  for (const source of SPECIFICATION_SOURCES) {
    for (const file of markdownUnder(source, root)) {
      const lines = maskCode(splitLines(readText(file, root)));
      lines.forEach((line, index) => {
        for (const token of line.match(IDENTIFIER) ?? []) {
          if (!NOT_REQUIREMENTS.has(token)) mentioned.add(token);
        }
        const definition = line.match(DEFINITION);
        if (!definition) return;
        const entries = registry.get(definition[1]) ?? [];
        entries.push({ file, line: index + 1 });
        registry.set(definition[1], entries);
      });
    }
  }

  for (const [identifier, sites] of [...registry].sort()) {
    if (sites.length === 1) continue;
    const elsewhere = sites
      .slice(1)
      .map((site) => `${site.file}:${site.line}`)
      .join(", ");
    findings.push(
      error(`${identifier} is defined ${sites.length} times (also at ${elsewhere})`, {
        file: sites[0].file,
        line: sites[0].line,
        hint: "one identifier names one requirement; give the other occurrence a new identifier or make it a reference",
      }),
    );
  }

  for (const identifier of [...mentioned].sort()) {
    if (registry.has(identifier)) continue;
    findings.push(
      warning(`${identifier} is referenced but never defined`, {
        file: SPECIFICATION_SOURCES[0],
        hint: "define it as `**ID** — ...` at the start of a line, or correct the reference",
      }),
    );
  }

  let referenced = 0;
  for (const source of REFERENCE_SOURCES) {
    const files = listFiles({ root, dir: source, extensions: [".md", ".yaml", ".yml"] });
    for (const file of files) {
      const raw = readText(file, root);
      const lines = file.endsWith(".md") ? maskCode(splitLines(raw)) : splitLines(raw);
      lines.forEach((line, index) => {
        /** @type {Set<string>} */
        const seenOnLine = new Set();
        for (const token of line.match(IDENTIFIER) ?? []) {
          if (NOT_REQUIREMENTS.has(token) || seenOnLine.has(token)) continue;
          seenOnLine.add(token);
          referenced += 1;
          if (registry.has(token)) continue;
          findings.push(
            error(`${token} is scored here but no specification defines it`, {
              file,
              line: index + 1,
              column: line.indexOf(token) + 1,
              hint: "an eval may only reference an identifier that protocol/, products/learn/ or library/README.md defines",
            }),
          );
        }
      });
    }
  }

  return {
    name: "requirements",
    findings,
    stats: {
      "requirements defined": registry.size,
      "references from evals": referenced,
    },
  };
}
