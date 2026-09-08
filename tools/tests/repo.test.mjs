import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

import {
  IGNORED_DIRECTORIES,
  IGNORED_PREFIXES,
  REPO_ROOT,
  listDirectories,
  listFiles,
  pathKind,
  positionAt,
  toRepoPath,
} from "../lib/repo.mjs";

const FIXTURES = resolve(dirname(fileURLToPath(import.meta.url)), "..", "__fixtures__");
const CLEAN = resolve(FIXTURES, "clean-repo");

describe("positionAt", () => {
  const text = "one\ntwo\nthree\n";

  it("returns 1-based line and column", () => {
    assert.deepEqual(positionAt(text, 0), { line: 1, column: 1 });
    assert.deepEqual(positionAt(text, 4), { line: 2, column: 1 });
    assert.deepEqual(positionAt(text, 6), { line: 2, column: 3 });
  });

  it("clamps an offset past the end of the text", () => {
    assert.deepEqual(positionAt(text, 10_000), { line: 4, column: 1 });
  });
});

describe("listFiles", () => {
  it("returns sorted repository-relative POSIX paths", () => {
    const files = listFiles({ root: CLEAN, extensions: [".yaml"] });
    assert.deepEqual(files, [
      "evals/learn/cases/eval-01-example.yaml",
      "library/good/knowledge-map.yaml",
      "library/good/manifest.yaml",
    ]);
  });

  it("filters by extension", () => {
    assert.deepEqual(listFiles({ root: CLEAN, dir: "protocol" }), ["protocol/core.md"]);
    assert.deepEqual(listFiles({ root: CLEAN, dir: "protocol", extensions: [".yaml"] }), []);
  });

  it("returns nothing for a directory that does not exist", () => {
    assert.deepEqual(listFiles({ root: CLEAN, dir: "nowhere" }), []);
  });

  it("never walks into dependency or build directories", () => {
    assert.ok(IGNORED_DIRECTORIES.has("node_modules"));
    assert.ok(IGNORED_DIRECTORIES.has(".git"));
  });

  it("never reports on the validator's own deliberately broken fixtures", () => {
    assert.deepEqual(IGNORED_PREFIXES, ["tools/__fixtures__/"]);
    const files = listFiles({ root: REPO_ROOT, dir: "tools", extensions: [".yaml"] });
    assert.deepEqual(files, []);
  });
});

describe("listDirectories", () => {
  it("returns immediate subdirectories, sorted", () => {
    assert.deepEqual(listDirectories({ root: CLEAN, dir: "library" }), ["good"]);
  });
});

describe("pathKind", () => {
  it("distinguishes a file, a directory and nothing at all", () => {
    assert.equal(pathKind("library/good/manifest.yaml", CLEAN), "file");
    assert.equal(pathKind("library/good", CLEAN), "directory");
    assert.equal(pathKind("library/ghost", CLEAN), "missing");
  });
});

describe("toRepoPath", () => {
  it("makes a path relative to the root", () => {
    assert.equal(toRepoPath(resolve(CLEAN, "library", "good"), CLEAN), "library/good");
  });
});
