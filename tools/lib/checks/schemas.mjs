/**
 * Check: every data file validates against the schema its name implies, and
 * every schema is itself a valid JSON Schema 2020-12 document.
 *
 * Nothing in the repository validated YAML against `schemas/` before this
 * check existed, so a manifest could gain a typo'd key and no build would
 * notice. Errors are reported at the line of the offending node, which the YAML
 * document model can tell us, rather than at the JSON Pointer alone.
 */

import { readFileSync } from "node:fs";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { parseDocument } from "yaml";

import { extractLinks, maskCode, splitLines } from "../markdown.mjs";
import { error } from "../reporter.mjs";
import { listFiles, pathKind, positionAt, readText, toAbsolutePath } from "../repo.mjs";
import { DATA_DIRECTORIES, mapDataFile } from "../schema-map.mjs";

const META_SCHEMA_ID = "https://json-schema.org/draft/2020-12/schema";
const SCHEMA_README = "schemas/README.md";

/**
 * The schema files `schemas/README.md` links to. The README is the register of
 * what exists, so a schema it does not name is a schema nobody knows about.
 *
 * @param {string} readmeText
 * @returns {Set<string>}
 */
export function documentedSchemas(readmeText) {
  /** @type {Set<string>} */
  const documented = new Set();
  for (const link of extractLinks(maskCode(splitLines(readmeText)))) {
    const name = link.target.split("/").pop() ?? "";
    if (name.endsWith(".schema.json")) documented.add(name);
  }
  return documented;
}

/**
 * Turn one Ajv error into a sentence a reader can act on without opening Ajv.
 *
 * @param {import("ajv").ErrorObject} issue
 * @returns {string}
 */
export function describeError(issue) {
  const where = issue.instancePath === "" ? "the document" : issue.instancePath;
  switch (issue.keyword) {
    case "required":
      return `${where} is missing the required property "${issue.params.missingProperty}"`;
    case "additionalProperties":
      return `${where} has an unexpected property "${issue.params.additionalProperty}"`;
    case "enum":
      return `${where} ${issue.message} (${JSON.stringify(issue.params.allowedValues)})`;
    default:
      return `${where} ${issue.message}`;
  }
}

/**
 * @param {string} instancePath a JSON Pointer
 * @returns {(string|number)[]}
 */
export function pointerToPath(instancePath) {
  if (instancePath === "") return [];
  return instancePath
    .slice(1)
    .split("/")
    .map((segment) => segment.replace(/~1/g, "/").replace(/~0/g, "~"))
    .map((segment) => (/^\d+$/.test(segment) ? Number(segment) : segment));
}

/**
 * Locate the YAML node an Ajv error points at, walking up to the nearest
 * ancestor that still exists in the document.
 *
 * @param {import("yaml").Document} doc
 * @param {string} text
 * @param {(string|number)[]} path
 * @returns {{ line: number, column: number } | undefined}
 */
function locate(doc, text, path) {
  for (let depth = path.length; depth >= 0; depth -= 1) {
    const node = depth === 0 ? doc.contents : doc.getIn(path.slice(0, depth), true);
    const range = /** @type {{ range?: [number, number, number] }} */ (node)?.range;
    if (range) return positionAt(text, range[0]);
  }
  return undefined;
}

/**
 * @param {{ root?: string }} [context]
 * @returns {import("../reporter.mjs").CheckResult}
 */
export function run({ root } = {}) {
  /** @type {import("../reporter.mjs").Finding[]} */
  const findings = [];
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);

  const schemaFiles = listFiles({ root, dir: "schemas", extensions: [".json"] });
  /**
   * Schemas that compiled, by file name — the ones data can be validated against.
   * @type {Map<string, object>}
   */
  const schemas = new Map();
  /** Every `*.schema.json` present, whether or not it compiled. */
  const onDisk = new Set(
    schemaFiles
      .map((repoPath) => repoPath.split("/").pop() ?? repoPath)
      .filter((name) => name.endsWith(".schema.json")),
  );

  for (const repoPath of schemaFiles) {
    const name = repoPath.split("/").pop() ?? repoPath;
    let schema;
    try {
      schema = JSON.parse(readFileSync(toAbsolutePath(repoPath, root), "utf8"));
    } catch (cause) {
      findings.push(
        error(`schema is not valid JSON: ${/** @type {Error} */ (cause).message}`, {
          file: repoPath,
        }),
      );
      continue;
    }

    if (schema.$schema !== META_SCHEMA_ID) {
      findings.push(
        error(`declares $schema "${schema.$schema ?? "(none)"}" instead of ${META_SCHEMA_ID}`, {
          file: repoPath,
          hint: `set "$schema": "${META_SCHEMA_ID}" so the draft is unambiguous`,
        }),
      );
    }
    if (typeof schema.$id !== "string") {
      findings.push(
        error("declares no $id", {
          file: repoPath,
          hint: "give the schema a stable $id so other schemas can $ref it",
        }),
      );
    }

    let metaValid = false;
    try {
      metaValid = Boolean(ajv.validateSchema(schema));
    } catch (cause) {
      findings.push(
        error(
          `cannot be meta-validated: ${/** @type {Error} */ (cause).message}`,
          { file: repoPath, hint: `declare "$schema": "${META_SCHEMA_ID}"` },
        ),
      );
      continue;
    }
    if (!metaValid) {
      for (const issue of ajv.errors ?? []) {
        findings.push(
          error(`does not satisfy the JSON Schema 2020-12 meta-schema: ${describeError(issue)}`, {
            file: repoPath,
          }),
        );
      }
      continue;
    }

    try {
      ajv.addSchema(schema, schema.$id ?? repoPath);
      schemas.set(name, schema);
    } catch (cause) {
      findings.push(
        error(`does not compile: ${/** @type {Error} */ (cause).message}`, { file: repoPath }),
      );
    }
  }

  if (pathKind(SCHEMA_README, root) === "file") {
    const documented = documentedSchemas(readText(SCHEMA_README, root));
    for (const name of onDisk) {
      if (documented.has(name)) continue;
      findings.push(
        error(`schemas/${name} exists but ${SCHEMA_README} does not document it`, {
          file: SCHEMA_README,
          hint: "add it to the schema table, or delete the schema",
        }),
      );
    }
    for (const name of documented) {
      if (onDisk.has(name)) continue;
      findings.push(
        error(`${SCHEMA_README} documents schemas/${name}, which does not exist`, {
          file: SCHEMA_README,
          hint: "add the schema, or remove the row that promises it",
        }),
      );
    }
  }

  /**
   * @param {string} name
   * @returns {import("ajv").ValidateFunction | undefined}
   */
  const validatorFor = (name) => {
    const schema = schemas.get(name);
    if (!schema) return undefined;
    return ajv.getSchema(/** @type {{ $id: string }} */ (schema).$id);
  };

  /** @type {string[]} */
  const dataFiles = [];
  for (const dir of DATA_DIRECTORIES) {
    dataFiles.push(...listFiles({ root, dir, extensions: [".yaml", ".yml"] }));
  }

  let validated = 0;
  let skipped = 0;

  for (const repoPath of dataFiles) {
    const mapping = mapDataFile(repoPath);
    if (mapping.kind === "unknown") {
      findings.push(
        error("no schema mapping covers this data file", {
          file: repoPath,
          hint: "add a rule to tools/lib/schema-map.mjs, either naming its schema or recording why it has none",
        }),
      );
      continue;
    }

    const text = readText(repoPath, root);
    const doc = parseDocument(text, { uniqueKeys: false });
    if (doc.errors.length > 0) {
      const detail = doc.errors[0].message
        .split("\n")[0]
        .replace(/ at line \d+, column \d+:?$/, "");
      findings.push(
        error(`cannot be validated because it does not parse: ${detail}`, {
          file: repoPath,
          line: positionAt(text, doc.errors[0].pos[0]).line,
          hint: "run `npm run validate:yaml` for the parse error in context",
        }),
      );
      continue;
    }
    const data = doc.toJS();

    /** @type {{ schema: string, path: (string|number)[], value: unknown }[]} */
    const targets = [];
    if (mapping.kind === "schema" && mapping.schema) {
      targets.push({ schema: mapping.schema, path: [], value: data });
    } else {
      skipped += 1;
    }
    for (const rule of mapping.subdocuments) {
      const value = rule.pointer.reduce(
        (current, key) =>
          current && typeof current === "object" ? /** @type {any} */ (current)[key] : undefined,
        /** @type {unknown} */ (data),
      );
      if (value === undefined) continue;
      targets.push({ schema: rule.schema, path: rule.pointer, value });
    }

    for (const target of targets) {
      const validate = validatorFor(target.schema);
      if (!validate) {
        findings.push(
          error(
            onDisk.has(target.schema)
              ? `cannot be validated: schemas/${target.schema} did not compile`
              : `cannot be validated: schemas/${target.schema} does not exist`,
            {
              file: repoPath,
              hint: `add schemas/${target.schema}, or change the rule in tools/lib/schema-map.mjs that points at it`,
            },
          ),
        );
        continue;
      }
      validated += 1;
      if (validate(target.value)) continue;
      const scope = target.path.length === 0 ? "" : `${target.path.join(".")}: `;
      for (const issue of validate.errors ?? []) {
        const position = locate(doc, text, [...target.path, ...pointerToPath(issue.instancePath)]);
        findings.push(
          error(`${scope}${describeError(issue)} (schemas/${target.schema})`, {
            file: repoPath,
            line: position?.line,
            column: position?.column,
          }),
        );
      }
    }
  }

  return {
    name: "schemas",
    findings,
    stats: {
      "schemas meta-validated": schemas.size,
      "documents validated": validated,
      "documents without a schema": skipped,
    },
  };
}
