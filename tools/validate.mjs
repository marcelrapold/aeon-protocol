#!/usr/bin/env node
/**
 * Repository validator.
 *
 *   node tools/validate.mjs [check...] [--json] [--quiet]
 *
 * With no check named, every check runs. Exit code is 0 when nothing failed and
 * 1 otherwise, including when the command line itself is wrong, so a caller
 * only ever has to test one condition.
 */

import { parseArgs } from "node:util";

import * as links from "./lib/checks/links.mjs";
import * as refs from "./lib/checks/refs.mjs";
import * as requirements from "./lib/checks/requirements.mjs";
import * as schemas from "./lib/checks/schemas.mjs";
import * as yaml from "./lib/checks/yaml.mjs";
import { buildReport, error, formatHuman, formatJson, summariseCheck } from "./lib/reporter.mjs";
import { REPO_ROOT } from "./lib/repo.mjs";

/**
 * @typedef {object} Check
 * @property {string} name
 * @property {string} description
 * @property {(context: { root?: string }) => import("./lib/reporter.mjs").CheckResult} run
 */

/** @type {Check[]} */
export const CHECKS = [
  {
    name: "schemas",
    description: "validate data files against schemas/, and the schemas against JSON Schema 2020-12",
    run: schemas.run,
  },
  {
    name: "links",
    description: "resolve every relative Markdown link, image and heading anchor",
    run: links.run,
  },
  {
    name: "refs",
    description: "cross-reference integrity of the deep-dive library",
    run: refs.run,
  },
  { name: "yaml", description: "YAML parses and follows the house style", run: yaml.run },
  {
    name: "requirements",
    description: "the requirement identifier registry, and what the evals reference",
    run: requirements.run,
  },
];

const USAGE = `Usage: node tools/validate.mjs [check...] [options]

Checks:
${CHECKS.map((check) => `  ${check.name.padEnd(13)}${check.description}`).join("\n")}

Options:
  --json    write the report to stdout as JSON instead of text
  --quiet   print failures only; print nothing when everything passes
  --help    print this message

Exit code: 0 when every selected check passes, 1 otherwise.
`;

/**
 * @param {string[]} names check names, empty for all
 * @param {{ root?: string }} [context]
 * @returns {import("./lib/reporter.mjs").Report}
 */
export function runChecks(names, context = {}) {
  const selected = names.length === 0 ? CHECKS : CHECKS.filter((check) => names.includes(check.name));
  const startedAt = performance.now();
  const reports = selected.map((check) => {
    const checkStartedAt = performance.now();
    try {
      return summariseCheck(check.run(context), performance.now() - checkStartedAt);
    } catch (cause) {
      const detail = cause instanceof Error ? (cause.stack ?? cause.message) : String(cause);
      return summariseCheck(
        { name: check.name, findings: [error(`the check itself failed: ${detail}`)] },
        performance.now() - checkStartedAt,
      );
    }
  });
  return buildReport(reports, performance.now() - startedAt);
}

/**
 * @param {string[]} argv
 * @param {{ out?: NodeJS.WritableStream, err?: NodeJS.WritableStream, root?: string }} [io]
 * @returns {number} exit code
 */
export function main(argv, { out = process.stdout, err = process.stderr, root = REPO_ROOT } = {}) {
  /** @type {ReturnType<typeof parseArgs>} */
  let parsed;
  try {
    parsed = parseArgs({
      args: argv,
      allowPositionals: true,
      options: {
        json: { type: "boolean", default: false },
        quiet: { type: "boolean", default: false },
        help: { type: "boolean", default: false },
      },
    });
  } catch (cause) {
    err.write(`${/** @type {Error} */ (cause).message}\n\n${USAGE}`);
    return 1;
  }

  if (parsed.values.help) {
    out.write(USAGE);
    return 0;
  }

  const names = /** @type {string[]} */ (parsed.positionals);
  const unknown = names.filter((name) => !CHECKS.some((check) => check.name === name));
  if (unknown.length > 0) {
    err.write(`Unknown check: ${unknown.join(", ")}\n\n${USAGE}`);
    return 1;
  }

  const report = runChecks(names, { root });
  out.write(
    parsed.values.json
      ? formatJson(report)
      : formatHuman(report, { quiet: Boolean(parsed.values.quiet) }),
  );
  return report.ok ? 0 : 1;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exitCode = main(process.argv.slice(2));
}
