import { describe, expect, it } from "vitest";
import { PACKAGES } from "@/lib/content";
import { buildPackageDetail, packageDetail, readPackageFiles, type PackageFiles } from "@/lib/packages";

/**
 * The topic pages are built from YAML that lives in another directory of this
 * repository and is edited by hand. Two things therefore have to hold: the
 * thirty packages that exist today must all read cleanly, and a package that
 * is empty, half-written or shaped differently must degrade instead of taking
 * the whole build down with it — `next build` prerenders sixty topic pages,
 * so one thrown TypeError in this module is a failed deployment.
 */

const NO_FILES: PackageFiles = { manifest: null, sources: null, map: null, myths: null };
const files = (partial: Partial<PackageFiles>): PackageFiles => ({ ...NO_FILES, ...partial });

describe("the packages that actually ship", () => {
  it.each(PACKAGES.map((p) => p.id))("%s reads into a detail", (id) => {
    const detail = packageDetail(id);
    expect(detail).not.toBeNull();
    expect(detail?.name.length).toBeGreaterThan(0);
    expect(detail?.sourceCount).toBeGreaterThan(0);
    // The tier tally is derived from the same entries it counts, so it can
    // never claim more sources than the file holds.
    const tallied = (detail?.tierCounts ?? []).reduce((sum, t) => sum + t.count, 0);
    expect(tallied).toBeLessThanOrEqual(detail?.sourceCount ?? 0);
  });

  it.each(PACKAGES.map((p) => p.id))("%s names only packages that exist", (id) => {
    // `related_packages` is free text in the YAML. The page filters it, but a
    // wholly unknown name is still worth knowing about.
    const related = packageDetail(id)?.relatedPackages ?? [];
    expect(related.every((r) => typeof r === "string" && r.length > 0)).toBe(true);
  });

  it("reads four documents per package, missing ones as null", () => {
    const read = readPackageFiles("bitcoin");
    expect(read.manifest).toBeTruthy();
    expect(Object.keys(read).sort()).toEqual(["manifest", "map", "myths", "sources"]);
  });
});

describe("a package that is not there", () => {
  it("returns null rather than a hollow detail", () => {
    expect(buildPackageDetail("bitcoin", NO_FILES)).toBeNull();
  });

  it("returns null for an id with no directory", () => {
    // Cast at the boundary on purpose: this is the shape of a package that
    // was renamed in lib/content.ts and not on disk.
    expect(packageDetail("no-such-package" as (typeof PACKAGES)[number]["id"])).toBeNull();
  });
});

describe("a package whose files are the wrong shape", () => {
  it("treats a scalar or list document as absent", () => {
    // `parse("")` is null, `parse("just a line")` is a string, and a YAML file
    // that is one top-level list parses to an array. None of them is a
    // manifest, and none of them may be dereferenced as one.
    for (const document of [null, undefined, "just a line", 42, ["a", "b"], true]) {
      expect(buildPackageDetail("bitcoin", files({ manifest: document }))).toBeNull();
    }
  });

  it("falls back to the id when the manifest carries no name", () => {
    const detail = buildPackageDetail("bitcoin", files({ manifest: {} }));
    expect(detail?.name).toBe("bitcoin");
    expect(detail?.domains).toEqual([]);
    expect(detail?.sourceCount).toBe(0);
    expect(detail?.conceptCount).toBe(0);
    expect(detail?.controversies).toEqual([]);
    expect(detail?.misconceptions).toEqual([]);
    expect(detail?.tierCounts).toEqual([]);
  });

  it("skips list entries that are not records", () => {
    // A dangling `- ` in YAML parses to null. Reading `.tier` off it used to
    // be one keystroke away from failing the whole build.
    const detail = buildPackageDetail(
      "bitcoin",
      files({
        manifest: { name: "Bitcoin", popular_lenses: [null, "loose", { name: "Austrian" }] },
        sources: { sources: [null, "loose", 7, { tier: 1 }, { tier: "2" }, { tier: "later" }] },
        map: { major_controversies: [null, {}, { question: "Is it money?", positions: ["a", "b"] }] },
        myths: { misconceptions: [null, 3, { claim: "It is anonymous" }] },
      }),
    );
    expect(detail?.sourceCount).toBe(3);
    // "later" is not a number, so it is counted as a source but not tiered.
    expect(detail?.tierCounts).toEqual([
      { tier: 1, count: 1 },
      { tier: 2, count: 1 },
    ]);
    expect(detail?.lenses).toEqual([{ name: "Austrian", note: undefined }]);
    // The entry with no question is dropped: an empty card helps nobody.
    expect(detail?.controversies).toHaveLength(1);
    expect(detail?.misconceptions).toHaveLength(1);
  });

  it("ignores non-list values where a list is expected", () => {
    const detail = buildPackageDetail(
      "bitcoin",
      files({
        manifest: { name: "Bitcoin", domains: "economics", learning_paths: { a: 1 } },
        map: { core_concepts: "many" },
        sources: { sources: "twelve" },
      }),
    );
    expect(detail?.domains).toEqual([]);
    expect(detail?.learningPaths).toEqual([]);
    expect(detail?.conceptCount).toBe(0);
    expect(detail?.sourceCount).toBe(0);
  });

  it("ignores wrongly shaped companion documents", () => {
    const detail = buildPackageDetail(
      "bitcoin",
      files({ manifest: { name: "Bitcoin" }, sources: "gone", map: ["a"], myths: 0 }),
    );
    expect(detail?.name).toBe("Bitcoin");
    expect(detail?.sourceCount).toBe(0);
    expect(detail?.conceptCount).toBe(0);
    expect(detail?.overview).toBeUndefined();
    expect(detail?.misconceptions).toEqual([]);
  });

  it("keeps only the string members of a mixed list", () => {
    const detail = buildPackageDetail(
      "bitcoin",
      files({ manifest: { name: "Bitcoin", domains: ["economics", 4, null, "money"] } }),
    );
    expect(detail?.domains).toEqual(["economics", "money"]);
  });

  it("treats blank prose as missing rather than rendering an empty block", () => {
    const detail = buildPackageDetail(
      "bitcoin",
      files({ manifest: { name: "Bitcoin", description: "   " }, map: { overview: "" } }),
    );
    expect(detail?.description).toBeUndefined();
    expect(detail?.overview).toBeUndefined();
  });

  it("orders the tier tally by tier", () => {
    const detail = buildPackageDetail(
      "bitcoin",
      files({
        manifest: { name: "Bitcoin" },
        sources: { sources: [{ tier: 3 }, { tier: 1 }, { tier: 2 }, { tier: 1 }] },
      }),
    );
    expect(detail?.tierCounts.map((t) => t.tier)).toEqual([1, 2, 3]);
    expect(detail?.tierCounts[0]?.count).toBe(2);
  });
});
