import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { DATA_DIRECTORIES, mapDataFile } from "../lib/schema-map.mjs";

describe("mapDataFile", () => {
  it("maps a package manifest to the topic-package schema", () => {
    const mapping = mapDataFile("library/bitcoin/manifest.yaml");
    assert.equal(mapping.kind, "schema");
    assert.equal(mapping.schema, "topic-package.schema.json");
  });

  it("maps a compiled curriculum to the curriculum schema", () => {
    assert.equal(
      mapDataFile("products/learn/examples/charisma/curriculum.yaml").schema,
      "curriculum.schema.json",
    );
  });

  it("maps an eval case to the eval-case schema and its context to the capability schema", () => {
    const mapping = mapDataFile("evals/learn/cases/eval-01-discovery-first.yaml");
    assert.equal(mapping.schema, "eval-case.schema.json");
    assert.deepEqual(mapping.subdocuments, [
      { pointer: ["simulated_context"], schema: "capability.schema.json" },
    ]);
  });

  it("maps the shapes that have no data yet", () => {
    assert.equal(mapDataFile("anywhere/lesson.yaml").schema, "lesson.schema.json");
    assert.equal(mapDataFile("anywhere/lesson-03.yaml").schema, "lesson.schema.json");
    assert.equal(mapDataFile("anywhere/learner-state.yaml").schema, "learner.schema.json");
    assert.equal(mapDataFile("anywhere/capability-profile.yaml").schema, "capability.schema.json");
  });

  it("skips the topic-package companion files, with a reason", () => {
    for (const name of [
      "canonical-sources.yaml",
      "knowledge-map.yaml",
      "common-misconceptions.yaml",
      "advanced-paths.yaml",
    ]) {
      const mapping = mapDataFile(`library/bitcoin/${name}`);
      assert.equal(mapping.kind, "skip", name);
      assert.match(mapping.reason ?? "", /prose/);
    }
  });

  it("does not send a curriculum template to the curriculum schema", () => {
    const mapping = mapDataFile("library/charisma/curriculum-template.yaml");
    assert.equal(mapping.kind, "skip");
    assert.match(mapping.reason ?? "", /no subject and no language|carries no subject/);
  });

  it("reports an unrecognised data file rather than skipping it", () => {
    assert.equal(mapDataFile("library/bitcoin/something-new.yaml").kind, "unknown");
  });

  it("matches on the whole file name, not a suffix of it", () => {
    assert.equal(mapDataFile("library/bitcoin/draft-manifest.yaml").kind, "unknown");
  });

  it("names the directories that hold repository data", () => {
    assert.deepEqual(DATA_DIRECTORIES, ["library", "products/learn/examples", "evals/learn/cases"]);
  });
});
