/**
 * Check: cross-reference integrity of the deep-dive library.
 *
 * Four invariants, each of which has a visible consequence when it breaks: a
 * package missing from the catalogue is invisible to a reader, a dangling
 * `related_packages` entry sends an agent to a directory that is not there, a
 * missing visual leaves a hole on the invocation surface, and an id that
 * disagrees with its directory name breaks the `library/<id>/` convention every
 * other document relies on.
 */

import { posix } from "node:path";
import { parseDocument } from "yaml";

import { extractLinks, maskCode, splitLines } from "../markdown.mjs";
import { error, warning } from "../reporter.mjs";
import { listDirectories, listFiles, pathKind, positionAt, readText } from "../repo.mjs";

const LIBRARY_README = "library/README.md";
const CATALOGUE_HEADING = /^ {0,3}##\s+Package catalogue\s*$/;
const VISUALS = "site/learn/public/visuals/topics";
const COMPANION_FILES = [
  "canonical-sources.yaml",
  "knowledge-map.yaml",
  "common-misconceptions.yaml",
  "curriculum-template.yaml",
  "advanced-paths.yaml",
];

/**
 * Package directories linked from the "Package catalogue" section.
 *
 * @param {string[]} maskedLines
 * @returns {Map<string, number>} package name to the line that links it
 */
export function catalogueEntries(maskedLines) {
  let start = -1;
  let end = maskedLines.length;
  for (let index = 0; index < maskedLines.length; index += 1) {
    if (start === -1) {
      if (CATALOGUE_HEADING.test(maskedLines[index])) start = index;
      continue;
    }
    if (/^ {0,3}##\s/.test(maskedLines[index])) {
      end = index;
      break;
    }
  }
  /** @type {Map<string, number>} */
  const entries = new Map();
  if (start === -1) return entries;

  for (const link of extractLinks(maskedLines.slice(start, end))) {
    const match = link.target.match(/^([a-z0-9][a-z0-9-]*)\/$/);
    if (!match) continue;
    if (!entries.has(match[1])) entries.set(match[1], start + link.line);
  }
  return entries;
}

/**
 * @param {import("yaml").Document} doc
 * @param {string} text
 * @param {(string|number)[]} path
 * @returns {number | undefined}
 */
function lineOf(doc, text, path) {
  const node = /** @type {{ range?: [number, number, number] }} */ (doc.getIn(path, true));
  return node?.range ? positionAt(text, node.range[0]).line : undefined;
}

/**
 * @param {{ root?: string }} [context]
 * @returns {import("../reporter.mjs").CheckResult}
 */
export function run({ root } = {}) {
  /** @type {import("../reporter.mjs").Finding[]} */
  const findings = [];
  const packages = listDirectories({ root, dir: "library" });
  const known = new Set(packages);

  if (pathKind(LIBRARY_README, root) !== "file") {
    findings.push(error(`${LIBRARY_README} is missing`, { file: LIBRARY_README }));
    return { name: "refs", findings, stats: { "packages checked": packages.length } };
  }

  const readmeText = readText(LIBRARY_README, root);
  const catalogue = catalogueEntries(maskCode(splitLines(readmeText)));

  for (const name of packages) {
    if (!catalogue.has(name)) {
      findings.push(
        error(`library/${name}/ is not listed in the package catalogue`, {
          file: LIBRARY_README,
          hint: `add a catalogue row linking [\`${name}/\`](${name}/)`,
        }),
      );
    }
  }
  for (const [name, line] of catalogue) {
    if (!known.has(name)) {
      findings.push(
        error(`the catalogue lists "${name}/", which is not a directory under library/`, {
          file: LIBRARY_README,
          line,
          hint: "remove the row, or add the package it promises",
        }),
      );
    }
  }

  for (const name of packages) {
    const manifestPath = `library/${name}/manifest.yaml`;
    if (pathKind(manifestPath, root) !== "file") {
      findings.push(
        error(`library/${name}/ has no manifest.yaml`, {
          file: manifestPath,
          hint: "every package in the catalogue carries a manifest (library/README.md)",
        }),
      );
      continue;
    }

    const text = readText(manifestPath, root);
    const doc = parseDocument(text, { uniqueKeys: false });
    if (doc.errors.length > 0) continue;
    const data = /** @type {Record<string, unknown>} */ (doc.toJS() ?? {});

    if (data.id !== name) {
      findings.push(
        error(`manifest id is "${String(data.id)}" but the directory is "${name}"`, {
          file: manifestPath,
          line: lineOf(doc, text, ["id"]),
          hint: "the id and the directory name are the same string (library/<id>/)",
        }),
      );
    }

    for (const field of ["related_packages", "prerequisites"]) {
      const value = data[field];
      if (!Array.isArray(value)) continue;
      value.forEach((entry, index) => {
        if (typeof entry !== "string") return;
        if (known.has(entry)) return;
        findings.push(
          error(`${field}[${index}] names "${entry}", which is not a package under library/`, {
            file: manifestPath,
            line: lineOf(doc, text, [field, index]),
            hint: "reference an existing package directory, or drop the entry",
          }),
        );
      });
    }

    for (const companion of COMPANION_FILES) {
      const companionPath = `library/${name}/${companion}`;
      if (pathKind(companionPath, root) !== "file") continue;
      const companionText = readText(companionPath, root);
      const companionDoc = parseDocument(companionText, { uniqueKeys: false });
      if (companionDoc.errors.length > 0) continue;
      const companionData = /** @type {Record<string, unknown>} */ (companionDoc.toJS() ?? {});
      if (companionData.package !== undefined && companionData.package !== name) {
        findings.push(
          error(
            `package is "${String(companionData.package)}" but the file sits in library/${name}/`,
            {
              file: companionPath,
              line: lineOf(companionDoc, companionText, ["package"]),
              hint: `set package: ${name}`,
            },
          ),
        );
      }
    }

    for (const theme of ["light", "dark"]) {
      const visual = posix.join(VISUALS, theme, `${name}.webp`);
      if (pathKind(visual, root) !== "file") {
        findings.push(
          error(`library/${name}/ has no ${theme} visual`, {
            file: visual,
            hint: `add ${visual} so the invocation surface can render the topic in both themes`,
          }),
        );
      }
    }
  }

  for (const theme of ["light", "dark"]) {
    for (const visual of listFiles({ root, dir: posix.join(VISUALS, theme), extensions: [".webp"] })) {
      const slug = posix.basename(visual, ".webp");
      if (known.has(slug)) continue;
      findings.push(
        warning(`no package library/${slug}/ matches this ${theme} visual`, {
          file: visual,
          hint: "remove the orphan visual, or add the package it belongs to",
        }),
      );
    }
  }

  return {
    name: "refs",
    findings,
    stats: {
      "packages checked": packages.length,
      "catalogue entries": catalogue.size,
    },
  };
}
