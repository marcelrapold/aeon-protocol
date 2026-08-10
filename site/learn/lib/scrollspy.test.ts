import { describe, expect, it } from "vitest";
import { activeSection, type SectionRect } from "./scrollspy";

const LINE = 96;

/** The landing page's sections, as they sit while the hero fills the screen. */
const atTop: SectionRect[] = [
  { id: "use", top: 900, bottom: 1800 },
  { id: "how", top: 1800, bottom: 3200 },
  { id: "why", top: 3200, bottom: 4000 },
];

describe("which section owns the reading line", () => {
  it("marks nothing while the hero is still on screen", () => {
    expect(activeSection(atTop, LINE)).toBeNull();
  });

  it("marks a section once its top passes the line", () => {
    const scrolled: SectionRect[] = [
      { id: "use", top: 40, bottom: 940 },
      { id: "how", top: 940, bottom: 2340 },
    ];
    expect(activeSection(scrolled, LINE)).toBe("use");
  });

  it("hands over to the next section, never back to an earlier one", () => {
    const deeper: SectionRect[] = [
      { id: "use", top: -900, bottom: 0 },
      { id: "how", top: 0, bottom: 1400 },
      { id: "why", top: 1400, bottom: 2200 },
    ];
    expect(activeSection(deeper, LINE)).toBe("how");
  });

  it("keeps the last section current at the foot of the page", () => {
    const bottom: SectionRect[] = [
      { id: "library", top: -2000, bottom: -1200 },
      { id: "protocol", top: -1200, bottom: -400 },
    ];
    expect(activeSection(bottom, LINE)).toBe("protocol");
  });

  it("respects document order rather than proximity to the line", () => {
    const overlapping: SectionRect[] = [
      { id: "first", top: 10, bottom: 2000 },
      { id: "second", top: 90, bottom: 3000 },
    ];
    expect(activeSection(overlapping, LINE)).toBe("second");
  });

  it("returns null for an empty page", () => {
    expect(activeSection([], LINE)).toBeNull();
  });
});
