import { existsSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  LEARN_SPECS,
  PACKAGE_GROUPS,
  PACKAGES,
  PROTOCOL_SPECS,
  SCHEMA_FILES,
  VERSION,
} from "./content";
import { DESCRIPTION, SITE_URL } from "./site";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..", "..");

describe("site constants", () => {
  it("SITE_URL is an absolute https URL", () => {
    expect(SITE_URL).toMatch(/^https:\/\//);
  });

  it("DESCRIPTION stays SERP-safe", () => {
    expect(DESCRIPTION.length).toBeLessThanOrEqual(170);
  });

  it("VERSION is a release tag", () => {
    expect(VERSION).toMatch(/^v\d+\.\d+\.\d+$/);
  });
});

describe("referenced spec files exist in the repository", () => {
  it.each([...PROTOCOL_SPECS, ...LEARN_SPECS, ...SCHEMA_FILES])("%s", (path) => {
    expect(existsSync(resolve(repoRoot, path))).toBe(true);
  });
});

describe("every package and group has artwork in both themes", () => {
  const visuals = resolve(here, "..", "public", "visuals");

  it.each(PACKAGES.map((p) => p.id))("topic motif for %s", (id) => {
    for (const theme of ["light", "dark"]) {
      expect(existsSync(resolve(visuals, "topics", theme, `${id}.webp`)), `${theme}/${id}`).toBe(
        true,
      );
    }
  });

  it.each(PACKAGE_GROUPS.map((g) => g.key))("group banner for %s", (key) => {
    for (const theme of ["light", "dark"]) {
      expect(existsSync(resolve(visuals, "blocks", theme, `${key}.webp`)), `${theme}/${key}`).toBe(
        true,
      );
    }
  });
});

describe("charisma fixture is complete", () => {
  const fixture = resolve(repoRoot, "products/learn/examples/charisma");

  it("has 14 session files", () => {
    const sessions = readdirSync(resolve(fixture, "sessions")).filter((f) => f.endsWith(".md"));
    expect(sessions).toHaveLength(14);
  });

  it.each([
    "README.md",
    "curriculum.yaml",
    "source-map.md",
    "retrospective.md",
    "integration.md",
    "original/AEON_Charisma_Sprint_Deep_Dive_14_Tage.md",
    "original/AEON_Charisma_Sprint_Podcast_Scripts.md",
    "original/AEON_Charisma_Podcast_Manuskripte_14_Tage.md",
  ])("%s exists", (file) => {
    expect(existsSync(resolve(fixture, file))).toBe(true);
  });
});
