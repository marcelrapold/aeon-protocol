import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

import { CHECKS, main, runChecks } from "../validate.mjs";

const FIXTURES = resolve(dirname(fileURLToPath(import.meta.url)), "..", "__fixtures__");
const CLEAN = resolve(FIXTURES, "clean-repo");
const BROKEN = resolve(FIXTURES, "broken-repo");

/** A writable stream stand-in that keeps what was written. */
function sink() {
  /** @type {string[]} */
  const chunks = [];
  return {
    /** @param {string} text */
    write(text) {
      chunks.push(text);
      return true;
    },
    get text() {
      return chunks.join("");
    },
  };
}

/**
 * @param {string[]} argv
 * @param {string} root
 */
function invoke(argv, root) {
  const out = sink();
  const err = sink();
  const code = main(argv, {
    out: /** @type {NodeJS.WritableStream} */ (/** @type {unknown} */ (out)),
    err: /** @type {NodeJS.WritableStream} */ (/** @type {unknown} */ (err)),
    root,
  });
  return { code, out: out.text, err: err.text };
}

describe("the check registry", () => {
  it("exposes exactly the five documented checks, in a stable order", () => {
    assert.deepEqual(
      CHECKS.map((check) => check.name),
      ["schemas", "links", "refs", "yaml", "requirements"],
    );
  });

  it("gives every check a description for --help", () => {
    for (const check of CHECKS) assert.ok(check.description.length > 10, check.name);
  });
});

describe("runChecks", () => {
  it("runs every check when none is named", () => {
    assert.equal(runChecks([], { root: CLEAN }).checks.length, CHECKS.length);
  });

  it("runs only the checks that were named", () => {
    const report = runChecks(["yaml"], { root: BROKEN });
    assert.deepEqual(
      report.checks.map((check) => check.name),
      ["yaml"],
    );
  });

  it("turns a check that throws into a failing finding rather than a crash", () => {
    CHECKS.push({
      name: "explodes",
      description: "a check that throws, for this test only",
      run: () => {
        throw new Error("boom");
      },
    });
    try {
      const report = runChecks(["explodes"], { root: CLEAN });
      assert.equal(report.ok, false);
      assert.match(report.checks[0].findings[0].message, /the check itself failed: Error: boom/);
    } finally {
      CHECKS.pop();
    }
  });

  it("reports on a root with nothing in it instead of throwing", () => {
    const report = runChecks([], { root: resolve(FIXTURES, "does-not-exist") });
    assert.equal(report.checks.length, CHECKS.length);
    for (const check of report.checks) {
      for (const item of check.findings) {
        assert.doesNotMatch(item.message, /the check itself failed/, check.name);
      }
    }
  });
});

describe("main", () => {
  it("exits 0 and says so when everything passes", () => {
    const { code, out } = invoke([], CLEAN);
    assert.equal(code, 0);
    assert.match(out, /0 errors/);
  });

  it("exits 1 when a check fails", () => {
    assert.equal(invoke([], BROKEN).code, 1);
  });

  it("prints nothing on success with --quiet", () => {
    const { code, out } = invoke(["--quiet"], CLEAN);
    assert.equal(code, 0);
    assert.equal(out, "");
  });

  it("still prints failures with --quiet", () => {
    const { code, out } = invoke(["--quiet"], BROKEN);
    assert.equal(code, 1);
    assert.match(out, /error/);
  });

  it("writes a JSON report to stdout with --json", () => {
    const { code, out } = invoke(["yaml", "--json"], BROKEN);
    assert.equal(code, 1);
    const parsed = JSON.parse(out);
    assert.equal(parsed.ok, false);
    assert.equal(parsed.checks[0].name, "yaml");
    assert.ok(parsed.checks[0].findings.length > 0);
    assert.ok(parsed.summary.errors > 0);
  });

  it("runs a single named check", () => {
    const { out } = invoke(["requirements"], CLEAN);
    assert.match(out, /^requirements: ok/);
  });

  it("rejects an unknown check name on stderr and exits 1", () => {
    const { code, err, out } = invoke(["nosuchcheck"], CLEAN);
    assert.equal(code, 1);
    assert.equal(out, "");
    assert.match(err, /Unknown check: nosuchcheck/);
  });

  it("rejects an unknown flag and exits 1", () => {
    const { code, err } = invoke(["--nope"], CLEAN);
    assert.equal(code, 1);
    assert.match(err, /nope/);
  });

  it("prints usage for --help and exits 0", () => {
    const { code, out } = invoke(["--help"], CLEAN);
    assert.equal(code, 0);
    assert.match(out, /Usage: node tools\/validate\.mjs/);
    for (const check of CHECKS) assert.match(out, new RegExp(check.name));
  });
});
