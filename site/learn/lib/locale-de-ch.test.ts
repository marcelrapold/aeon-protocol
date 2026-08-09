import { describe, expect, it } from "vitest";
import { legal } from "./legal";
import { ui } from "./i18n";

/** Collect every string leaf of a translation tree. */
function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value !== null && typeof value === "object") {
    return Object.values(value as Record<string, unknown>).flatMap(strings);
  }
  return [];
}

const deStrings = [...strings(ui.de), ...strings(legal("de"))];

describe("de-CH locale guard", () => {
  it("uses Swiss orthography — no sharp s", () => {
    for (const s of deStrings) {
      expect(s, `found "ß" in: ${s}`).not.toMatch(/ß/);
    }
  });

  it("German low-9 quotes close with the correct glyph", () => {
    for (const s of deStrings) {
      const opens = (s.match(/„/g) ?? []).length;
      const closes = (s.match(/“/g) ?? []).length;
      expect(opens, `unbalanced German quotes in: ${s}`).toBe(closes);
    }
  });

  it("avoids common Denglish calques", () => {
    const denylist = [/gemappt/i, /dedupliz/i, /gemergt/i, /gebumpt/i];
    for (const s of deStrings) {
      for (const pattern of denylist) {
        expect(s, `Denglish "${pattern}" in: ${s}`).not.toMatch(pattern);
      }
    }
  });
});
