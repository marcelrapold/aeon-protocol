import { describe, expect, it } from "vitest";
import { ORIGIN_CHAIN, PACKAGE_GROUPS, PACKAGES, PRINCIPLES, STEPS } from "./content";
import { t, ui } from "./i18n";

/**
 * Reduces a translation tree to its key paths, order-independent. Arrays
 * collapse to one representative element so the shape is locked, not the
 * length (lengths asserted separately where they matter).
 */
function keyShape(value: unknown, prefix = ""): string[] {
  if (Array.isArray(value)) {
    return value.length ? keyShape(value[0], `${prefix}[]`) : [`${prefix}[]`];
  }
  if (value !== null && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .flatMap(([k, v]) => keyShape(v, prefix ? `${prefix}.${k}` : k))
      .sort();
  }
  return [prefix];
}

describe("i18n dictionaries", () => {
  it("en and de have identical shape", () => {
    expect(keyShape(ui.de)).toEqual(keyShape(ui.en));
  });

  it("trust card counts match across locales", () => {
    expect(ui.de.agent.trust).toHaveLength(ui.en.agent.trust.length);
  });

  it("tier chip counts match across locales", () => {
    expect(ui.de.how.tiers).toHaveLength(ui.en.how.tiers.length);
  });
});

describe("library grouping", () => {
  const grouped = PACKAGE_GROUPS.flatMap((g) => g.ids);

  it("places every package in exactly one group", () => {
    expect([...grouped].sort()).toEqual(PACKAGES.map((p) => p.id).sort());
  });

  it("has no duplicate package across groups", () => {
    expect(new Set(grouped).size).toBe(grouped.length);
  });

  it("labels every group in both locales", () => {
    for (const lang of ["en", "de"] as const) {
      for (const group of PACKAGE_GROUPS) {
        expect(t(lang).library.groups[group.key].length).toBeGreaterThan(0);
      }
    }
  });
});

describe("content keys are fully covered by both locales", () => {
  for (const lang of ["en", "de"] as const) {
    const tt = t(lang);

    it(`${lang}: every step key has prose`, () => {
      for (const step of STEPS) {
        expect(tt.how.steps[step.key].title.length).toBeGreaterThan(0);
        expect(tt.how.steps[step.key].body.length).toBeGreaterThan(0);
      }
    });

    it(`${lang}: every principle key has prose`, () => {
      for (const principle of PRINCIPLES) {
        expect(tt.why.principles[principle.key].title.length).toBeGreaterThan(0);
      }
    });

    it(`${lang}: every package has prose`, () => {
      for (const pkg of PACKAGES) {
        expect(tt.library.packages[pkg.id].name.length).toBeGreaterThan(0);
        expect(tt.library.packages[pkg.id].blurb.length).toBeGreaterThan(0);
      }
    });

    it(`${lang}: every origin chain key has a label`, () => {
      for (const key of ORIGIN_CHAIN) {
        expect(tt.origin.chain[key].length).toBeGreaterThan(0);
      }
    });
  }
});
