/**
 * Check: YAML parses, and follows the repository's writing conventions.
 *
 * The house style is two-space indentation and no tabs (CONTRIBUTING.md). The
 * rest is hygiene that silently corrupts data or diffs: a duplicate mapping key
 * throws away one of the two values without any parser complaining by default,
 * a missing final newline makes every later change a two-line diff, and a
 * carriage return makes a file behave differently on different machines.
 */

import { parseDocument } from "yaml";

import { error } from "../reporter.mjs";
import { listFiles, positionAt, readText } from "../repo.mjs";

/** A line whose value is a block scalar header, for example `overview: >-`. */
const BLOCK_SCALAR_HEADER = /(?:^|\s)[|>][0-9]*[+-]?\s*(?:#.*)?$/;

/**
 * Line numbers (1-based) whose content belongs to a block scalar, where YAML
 * itself decides the indentation and the two-space rule does not apply.
 *
 * @param {string[]} lines
 * @returns {Set<number>}
 */
export function blockScalarLines(lines) {
  /** @type {Set<number>} */
  const inside = new Set();
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.trim() === "" || !BLOCK_SCALAR_HEADER.test(line)) continue;
    const headerIndent = line.length - line.trimStart().length;
    for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
      const candidate = lines[cursor];
      if (candidate.trim() === "") {
        inside.add(cursor + 1);
        continue;
      }
      const indent = candidate.length - candidate.trimStart().length;
      if (indent <= headerIndent) break;
      inside.add(cursor + 1);
    }
  }
  return inside;
}

/**
 * @param {{ root?: string }} [context]
 * @returns {import("../reporter.mjs").CheckResult}
 */
export function run({ root } = {}) {
  /** @type {import("../reporter.mjs").Finding[]} */
  const findings = [];
  const files = listFiles({ root, extensions: [".yaml", ".yml"] });

  for (const file of files) {
    const text = readText(file, root);

    if (text.includes("\r")) {
      const line = positionAt(text.replace(/\r/g, "\n"), text.indexOf("\r")).line;
      findings.push(
        error("contains a carriage return", {
          file,
          line,
          hint: "save the file with Unix line endings",
        }),
      );
    }

    if (text.length > 0) {
      if (!text.endsWith("\n")) {
        findings.push(
          error("does not end with a newline", {
            file,
            line: text.split("\n").length,
            hint: "end the file with exactly one newline",
          }),
        );
      } else if (text.endsWith("\n\n")) {
        findings.push(
          error("ends with a blank line", {
            file,
            line: text.split("\n").length - 1,
            hint: "end the file with exactly one newline",
          }),
        );
      }
    }

    const lines = text.replace(/\r\n?/g, "\n").split("\n");
    if (lines.at(-1) === "") lines.pop();
    const blockScalar = blockScalarLines(lines);

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const tab = line.indexOf("\t");
      if (tab !== -1) {
        findings.push(
          error("contains a tab character", {
            file,
            line: lineNumber,
            column: tab + 1,
            hint: "indent with two spaces (CONTRIBUTING.md)",
          }),
        );
      }
      if (/[ \t]$/.test(line)) {
        findings.push(
          error("has trailing whitespace", {
            file,
            line: lineNumber,
            column: line.trimEnd().length + 1,
            hint: "strip the spaces at the end of the line",
          }),
        );
      }
      if (line.trim() === "" || blockScalar.has(lineNumber)) return;
      const leading = /** @type {RegExpMatchArray} */ (line.match(/^[ \t]*/))[0];
      if (leading.includes("\t")) return; // already reported as a tab
      const indent = leading.length;
      if (indent % 2 !== 0) {
        findings.push(
          error(`is indented ${indent} space${indent === 1 ? "" : "s"}, which is not a multiple of two`, {
            file,
            line: lineNumber,
            column: 1,
            hint: "the repository indents YAML two spaces per level (CONTRIBUTING.md)",
          }),
        );
      }
    });

    const doc = parseDocument(text, { uniqueKeys: true });
    for (const issue of [...doc.errors, ...doc.warnings]) {
      const position = positionAt(text, issue.pos[0]);
      const message = issue.message.split("\n")[0].replace(/ at line \d+, column \d+:?$/, "");
      findings.push(
        error(
          issue.code === "DUPLICATE_KEY"
            ? `duplicate mapping key: ${message}`
            : `does not parse: ${message}`,
          {
            file,
            line: position.line,
            column: position.column,
            hint:
              issue.code === "DUPLICATE_KEY"
                ? "a repeated key silently discards one of the two values; rename or merge them"
                : undefined,
          },
        ),
      );
    }
  }

  return { name: "yaml", findings, stats: { "files checked": files.length } };
}
