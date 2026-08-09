/**
 * Brand mark: a dependency-ordered learning path — four nodes, rising.
 * Shared by apple-icon.tsx and og.tsx. app/icon.svg duplicates these values by
 * hand (a static SVG cannot import a TS constant); keep them in sync on change.
 */
export const MARK_VIEWBOX = "0 0 32 32";

/** Polyline through the four knowledge nodes. */
export const MARK_PATH = "M6 24 L13 15 L19 19 L26 7";

/** Node centers along the path, drawn as filled circles (r=2). */
export const MARK_NODES: ReadonlyArray<readonly [number, number]> = [
  [6, 24],
  [13, 15],
  [19, 19],
  [26, 7],
];

/** Brand accent used on generated imagery (indigo-500-ish). */
export const BRAND_HEX = "#6d5ef0";
