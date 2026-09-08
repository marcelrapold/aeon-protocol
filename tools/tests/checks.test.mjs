import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

import * as links from "../lib/checks/links.mjs";
import * as refs from "../lib/checks/refs.mjs";
import * as requirements from "../lib/checks/requirements.mjs";
import * as schemas from "../lib/checks/schemas.mjs";
import * as yaml from "../lib/checks/yaml.mjs";

const FIXTURES = resolve(dirname(fileURLToPath(import.meta.url)), "..", "__fixtures__");
const CLEAN = resolve(FIXTURES, "clean-repo");
const BROKEN = resolve(FIXTURES, "broken-repo");

/**
 * @param {{ run: (context: { root: string }) => import("../lib/reporter.mjs").CheckResult }} check
 * @param {string} root
 * @returns {import("../lib/reporter.mjs").Finding[]}
 */
const findingsOf = (check, root) => check.run({ root }).findings;

/**
 * @param {import("../lib/reporter.mjs").Finding[]} findings
 * @param {RegExp} pattern
 * @param {string} [file]
 */
function assertReports(findings, pattern, file) {
  const matched = findings.filter(
    (item) => pattern.test(item.message) && (file === undefined || item.file === file),
  );
  assert.ok(
    matched.length > 0,
    `expected a finding matching ${pattern}${file ? ` in ${file}` : ""}, got:\n${findings
      .map((item) => `  ${item.level} ${item.file ?? "-"}: ${item.message}`)
      .join("\n")}`,
  );
  return matched[0];
}

describe("every check passes on a repository that is in order", () => {
  for (const check of [schemas, links, refs, yaml, requirements]) {
    it(`${check.run({ root: CLEAN }).name} reports nothing`, () => {
      const findings = findingsOf(check, CLEAN);
      assert.deepEqual(findings, [], JSON.stringify(findings, null, 2));
    });
  }
});

describe("schemas", () => {
  const findings = findingsOf(schemas, BROKEN);

  it("reports a data file that violates its schema, at the offending line", () => {
    const found = assertReports(findings, /must be integer/, "library/undeclared/manifest.yaml");
    assert.equal(found.line, 3);
  });

  it("reports a schema that is not a valid JSON Schema 2020-12 document", () => {
    assertReports(findings, /meta-schema/, "schemas/invalid.schema.json");
  });

  it("reports a schema that declares the wrong draft, and says so before it fails to compile", () => {
    assertReports(findings, /declares \$schema .*draft-07/, "schemas/wrong-draft.schema.json");
    assertReports(findings, /cannot be meta-validated/, "schemas/wrong-draft.schema.json");
  });

  it("reports a schema the README does not document", () => {
    assertReports(findings, /undocumented\.schema\.json exists/, "schemas/README.md");
  });

  it("reports a schema the README promises but that is missing", () => {
    assertReports(findings, /promised\.schema\.json, which does not exist/, "schemas/README.md");
  });

  it("reports a data file no mapping covers, rather than skipping it", () => {
    assertReports(findings, /no schema mapping/, "library/undeclared/unknown-shape.yaml");
  });
});

describe("schema error messages", () => {
  it("turns a JSON Pointer into a path of keys and indices", () => {
    assert.deepEqual(schemas.pointerToPath(""), []);
    assert.deepEqual(schemas.pointerToPath("/modules/2/id"), ["modules", 2, "id"]);
    assert.deepEqual(schemas.pointerToPath("/a~1b/c~0d"), ["a/b", "c~d"]);
  });

  it("names the property in a required or additionalProperties error", () => {
    assert.equal(
      schemas.describeError(
        /** @type {any} */ ({ keyword: "required", instancePath: "", params: { missingProperty: "id" } }),
      ),
      'the document is missing the required property "id"',
    );
    assert.equal(
      schemas.describeError(
        /** @type {any} */ ({
          keyword: "additionalProperties",
          instancePath: "/modules/0",
          params: { additionalProperty: "typo" },
        }),
      ),
      '/modules/0 has an unexpected property "typo"',
    );
  });

  it("reads the documented schema names out of the schemas README", () => {
    const documented = schemas.documentedSchemas(
      "| [lesson.schema.json](lesson.schema.json) | x |\n[other](../elsewhere/a.schema.json)\n[no](README.md)\n",
    );
    assert.deepEqual([...documented].sort(), ["a.schema.json", "lesson.schema.json"]);
  });
});

describe("links", () => {
  const findings = findingsOf(links, BROKEN);

  it("reports a link to a file that does not exist", () => {
    const found = assertReports(findings, /"nowhere\.md" does not exist/, "library/README.md");
    assert.equal(found.line, 12);
  });

  it("reports an anchor with no matching heading", () => {
    assertReports(findings, /anchor "#no-such-heading"/, "library/README.md");
  });

  it("never reports an external URL", () => {
    assert.ok(links.isExternal("https://example.test/a"));
    assert.ok(links.isExternal("mailto:someone@example.test"));
    assert.ok(links.isExternal("//example.test/a"));
    assert.ok(!links.isExternal("../protocol/core.md"));
    assert.ok(!links.isExternal("#anchor"));
  });

  it("splits a target into path and fragment", () => {
    assert.deepEqual(links.splitTarget("a.md#b"), { path: "a.md", fragment: "b" });
    assert.deepEqual(links.splitTarget("#b"), { path: "", fragment: "b" });
    assert.deepEqual(links.splitTarget("a.md"), { path: "a.md", fragment: "" });
  });
});

describe("refs", () => {
  const findings = findingsOf(refs, BROKEN);

  it("reports a package directory the catalogue omits", () => {
    assertReports(findings, /library\/undeclared\/ is not listed/, "library/README.md");
  });

  it("reports a catalogue entry with no directory behind it", () => {
    assertReports(findings, /catalogue lists "ghost\/"/, "library/README.md");
  });

  it("reports a manifest id that disagrees with its directory", () => {
    assertReports(findings, /manifest id is "mismatched"/, "library/undeclared/manifest.yaml");
  });

  it("reports a related package that does not exist", () => {
    assertReports(findings, /related_packages\[0\] names "ghost"/, "library/good/manifest.yaml");
  });

  it("reports a companion file whose package field points elsewhere", () => {
    assertReports(findings, /package is "elsewhere"/, "library/good/knowledge-map.yaml");
  });

  it("reports a missing visual per theme", () => {
    assertReports(findings, /has no dark visual/);
    assertReports(findings, /has no light visual/);
  });

  it("warns about a visual with no package behind it", () => {
    const found = assertReports(findings, /no package library\/stray\//);
    assert.equal(found.level, "warning");
  });

  it("reads the catalogue section only", () => {
    const entries = refs.catalogueEntries([
      "## Package catalogue",
      "[`inside/`](inside/)",
      "## Something else",
      "[`outside/`](outside/)",
    ]);
    assert.deepEqual([...entries.keys()], ["inside"]);
  });
});

describe("yaml", () => {
  const findings = findingsOf(yaml, BROKEN);

  it("reports a duplicate mapping key", () => {
    const found = assertReports(
      findings,
      /duplicate mapping key/,
      "library/undeclared/common-misconceptions.yaml",
    );
    assert.equal(found.line, 3);
  });

  it("reports trailing whitespace, with the column it starts at", () => {
    const found = assertReports(
      findings,
      /trailing whitespace/,
      "library/undeclared/common-misconceptions.yaml",
    );
    assert.equal(found.line, 4);
    assert.equal(found.column, 16);
  });

  it("reports a missing final newline", () => {
    assertReports(
      findings,
      /does not end with a newline/,
      "library/undeclared/common-misconceptions.yaml",
    );
  });

  it("reports a tab and odd indentation", () => {
    assertReports(findings, /tab character/, "library/undeclared/advanced-paths.yaml");
    assertReports(findings, /indented 3 spaces/, "library/undeclared/advanced-paths.yaml");
  });

  it("exempts block scalar content from the two-space rule", () => {
    const lines = ["overview: >-", "  folded text", "   continued oddly", "next: 1"];
    assert.deepEqual([...yaml.blockScalarLines(lines)].sort((a, b) => a - b), [2, 3]);
  });
});

describe("requirements", () => {
  const findings = findingsOf(requirements, BROKEN);

  it("reports an identifier defined twice, naming both sites", () => {
    const found = assertReports(findings, /CORE-1 is defined 2 times/, "protocol/core.md");
    assert.match(found.message, /products\/learn\/specification\.md:3/);
  });

  it("reports an eval that scores an identifier no specification defines", () => {
    assertReports(findings, /LEARN-9 is scored here/, "evals/learn/cases/eval-01-example.yaml");
  });

  it("does not treat standards names as requirement identifiers", () => {
    for (const token of ["RFC-2119", "UTF-8", "BCP-47"]) {
      assert.ok(requirements.NOT_REQUIREMENTS.has(token), token);
    }
  });

  it("matches the identifier shape the repository uses", () => {
    const matched = "LEARN-D-2, LIB-1 and REN-POD-5 but not BIP32 or ISO 8601".match(
      requirements.IDENTIFIER,
    );
    assert.deepEqual(matched, ["LEARN-D-2", "LIB-1", "REN-POD-5"]);
  });
});
