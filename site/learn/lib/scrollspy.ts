/** A section's vertical position relative to the viewport. */
export type SectionRect = { id: string; top: number; bottom: number };

/**
 * Which section owns the reading line — the horizontal line just below the
 * sticky header. The answer is the last section in document order whose top
 * has passed that line, which is the one you are reading. Above the first
 * section (the hero) nothing is current, so the navigation stays neutral
 * until a section actually takes over.
 *
 * Pure on purpose: the browser wiring around it is a scroll listener, but the
 * decision is testable without a viewport.
 */
export function activeSection(sections: SectionRect[], line: number): string | null {
  let current: string | null = null;
  for (const section of sections) {
    if (section.top <= line) current = section.id;
  }
  return current;
}
