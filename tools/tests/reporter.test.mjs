import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildReport,
  error,
  formatHuman,
  formatJson,
  formatLocation,
  sortFindings,
  summariseCheck,
  warning,
} from "../lib/reporter.mjs";

/** @param {import("../lib/reporter.mjs").Finding[]} findings */
const report = (findings, stats = {}) =>
  buildReport([summariseCheck({ name: "demo", findings, stats }, 12)], 12);

describe("formatLocation", () => {
  it("prints as much of file:line:column as the check knows", () => {
    assert.equal(formatLocation(error("x", { file: "a.md", line: 3, column: 4 })), "a.md:3:4");
    assert.equal(formatLocation(error("x", { file: "a.md", line: 3 })), "a.md:3");
    assert.equal(formatLocation(error("x", { file: "a.md" })), "a.md");
    assert.equal(formatLocation(error("x")), "(repository)");
  });
});

describe("sortFindings", () => {
  it("orders by file, then line, then column", () => {
    const sorted = sortFindings([
      error("c", { file: "b.md", line: 1 }),
      error("b", { file: "a.md", line: 9 }),
      error("a", { file: "a.md", line: 2, column: 7 }),
    ]);
    assert.deepEqual(
      sorted.map((item) => item.message),
      ["a", "b", "c"],
    );
  });
});

describe("summariseCheck", () => {
  it("counts errors and warnings separately, and only errors fail", () => {
    const summary = summariseCheck({ name: "demo", findings: [warning("w"), error("e")] }, 1);
    assert.equal(summary.errorCount, 1);
    assert.equal(summary.warningCount, 1);
    assert.equal(summary.ok, false);
  });

  it("passes a check that produced only warnings", () => {
    const summary = summariseCheck({ name: "demo", findings: [warning("w")] }, 1);
    assert.equal(summary.ok, true);
  });
});

describe("formatHuman", () => {
  it("prints an ok line with the stats when nothing is wrong", () => {
    const text = formatHuman(report([], { files: 3 }));
    assert.match(text, /^demo: ok \(files: 3\)\n/);
    assert.match(text, /1 check, 0 errors, 0 warnings in 0\.01s\n$/);
  });

  it("prints location, message and fix for every finding", () => {
    const text = formatHuman(
      report([error("the target does not exist", { file: "a.md", line: 4, hint: "add it" })]),
    );
    assert.match(text, /demo: 1 error/);
    assert.match(text, /error a\.md:4/);
    assert.match(text, /the target does not exist/);
    assert.match(text, /fix: add it/);
  });

  it("prints nothing at all when quiet and everything passes", () => {
    assert.equal(formatHuman(report([]), { quiet: true }), "");
  });

  it("still prints failures when quiet", () => {
    const text = formatHuman(report([error("broken", { file: "a.md" })]), { quiet: true });
    assert.match(text, /broken/);
    assert.match(text, /1 error/);
  });
});

describe("formatJson", () => {
  it("round-trips into the documented shape", () => {
    const parsed = JSON.parse(formatJson(report([error("broken", { file: "a.md", line: 2 })])));
    assert.equal(parsed.ok, false);
    assert.deepEqual(parsed.summary, { checks: 1, errors: 1, warnings: 0 });
    assert.equal(parsed.checks[0].name, "demo");
    assert.deepEqual(parsed.checks[0].findings[0], {
      level: "error",
      message: "broken",
      file: "a.md",
      line: 2,
    });
  });
});
