/**
 * The auditor mark (a shield-check), reproduced from the sibling project's
 * own brand constants at auditor/web/lib/brand.ts so the two stay identical.
 * Rendered in auditor's emerald rather than this site's violet: the strip it
 * appears in points at a different product, and the colour says so.
 */
const SHIELD_PATH =
  "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z";
const SHIELD_CHECK_PATH = "m9 12 2 2 4-4";

export function AuditorMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={SHIELD_PATH} />
      <path d={SHIELD_CHECK_PATH} />
    </svg>
  );
}
