import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020";
import addFormats from "ajv-formats";
import { parse } from "yaml";
import { describe, expect, it } from "vitest";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..", "..");

function loadSchema(name: string) {
  return JSON.parse(readFileSync(resolve(repoRoot, "schemas", name), "utf8"));
}

function loadYaml(path: string) {
  return parse(readFileSync(resolve(repoRoot, path), "utf8"));
}

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);

describe("YAML fixtures validate against their schemas", () => {
  it("charisma curriculum.yaml conforms to curriculum.schema.json", () => {
    const validate = ajv.compile(loadSchema("curriculum.schema.json"));
    const data = loadYaml("products/learn/examples/charisma/curriculum.yaml");
    const valid = validate(data);
    expect(validate.errors ?? []).toEqual([]);
    expect(valid).toBe(true);
  });

  // Compiled once: a schema $id may only be registered once per Ajv instance.
  const validatePackage = ajv.compile(loadSchema("topic-package.schema.json"));

  it.each(["charisma", "austrian-economics", "bitcoin"])(
    "library/%s/manifest.yaml conforms to topic-package.schema.json",
    (pkg) => {
      const data = loadYaml(`library/${pkg}/manifest.yaml`);
      const valid = validatePackage(data);
      expect(validatePackage.errors ?? []).toEqual([]);
      expect(valid).toBe(true);
    },
  );

  it("all five schemas compile as draft 2020-12", () => {
    for (const name of [
      "capability.schema.json",
      "learner.schema.json",
      "curriculum.schema.json",
      "lesson.schema.json",
      "topic-package.schema.json",
    ]) {
      const schemaAjv = new Ajv2020({ allErrors: true, strict: false });
      addFormats(schemaAjv);
      expect(() => schemaAjv.compile(loadSchema(name)), name).not.toThrow();
    }
  });
});
