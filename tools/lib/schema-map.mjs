/**
 * Which schema validates which data file.
 *
 * The repository names data files by convention, so the mapping is a list of
 * rules over the repository-relative path. Three outcomes exist and all three
 * are deliberate:
 *
 * - `schema` — the whole document is validated against that schema.
 * - `skip` — the file has a documented shape that no schema in `schemas/`
 *   describes. `schemas/README.md` defines exactly five schemas; the topic
 *   package companion files (`knowledge-map.yaml` and friends) and the eval
 *   cases are prose-specified, so validating them would mean inventing a
 *   contract. They are listed by name rather than ignored by default.
 * - `unknown` — a data file the mapping has never seen. That is reported as an
 *   error: a new kind of data file must either get a schema or be added here,
 *   never silently pass unvalidated.
 *
 * Sub-document rules cover the case where part of a file is a shape a schema
 * does describe: an eval case's `simulated_context` is a capability profile.
 */

/**
 * @typedef {object} SubdocumentRule
 * @property {string[]} pointer path of keys into the parsed document
 * @property {string} schema schema file name under `schemas/`
 *
 * @typedef {object} Mapping
 * @property {"schema"|"skip"|"unknown"} kind
 * @property {string} [schema] schema file name under `schemas/`
 * @property {string} [reason] why a skipped file is skipped
 * @property {SubdocumentRule[]} subdocuments
 */

/** Directories whose YAML files are repository data, in the order they are reported. */
export const DATA_DIRECTORIES = ["library", "products/learn/examples", "evals/learn/cases"];

/**
 * @type {{ test: RegExp, schema?: string, reason?: string, subdocuments?: SubdocumentRule[] }[]}
 */
const RULES = [
  { test: /(^|\/)manifest\.yaml$/, schema: "topic-package.schema.json" },
  { test: /(^|\/)curriculum\.yaml$/, schema: "curriculum.schema.json" },
  { test: /(^|\/)lesson(-[a-z0-9-]+)?\.yaml$/, schema: "lesson.schema.json" },
  { test: /(^|\/)learner(-state)?\.yaml$/, schema: "learner.schema.json" },
  { test: /(^|\/)capability(-profile)?\.yaml$/, schema: "capability.schema.json" },
  {
    // The whole case has a schema; its `simulated_context` is additionally a
    // capability profile, which schemas/README.md maps explicitly.
    test: /^evals\/learn\/cases\/eval-[a-z0-9-]+\.yaml$/,
    schema: "eval-case.schema.json",
    subdocuments: [{ pointer: ["simulated_context"], schema: "capability.schema.json" }],
  },
  {
    test: /(^|\/)canonical-sources\.yaml$/,
    reason: "topic package companion file, specified in prose by library/README.md",
  },
  {
    test: /(^|\/)knowledge-map\.yaml$/,
    reason: "topic package companion file, specified in prose by library/README.md",
  },
  {
    test: /(^|\/)common-misconceptions\.yaml$/,
    reason: "topic package companion file, specified in prose by library/README.md",
  },
  {
    test: /(^|\/)curriculum-template\.yaml$/,
    reason:
      "a sequencing skeleton keyed by package, not a compiled curriculum: it carries no subject or language, so curriculum.schema.json does not apply",
  },
  {
    test: /(^|\/)advanced-paths\.yaml$/,
    reason: "topic package companion file, specified in prose by library/README.md",
  },
];

/**
 * @param {string} repoPath repository-relative POSIX path of a data file
 * @returns {Mapping}
 */
export function mapDataFile(repoPath) {
  for (const rule of RULES) {
    if (!rule.test.test(repoPath)) continue;
    if (rule.schema) {
      return { kind: "schema", schema: rule.schema, subdocuments: rule.subdocuments ?? [] };
    }
    return { kind: "skip", reason: rule.reason, subdocuments: rule.subdocuments ?? [] };
  }
  return { kind: "unknown", subdocuments: [] };
}
