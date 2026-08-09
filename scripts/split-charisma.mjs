#!/usr/bin/env node
/**
 * Derives the session fixtures from the preserved Charisma Deep-Dive source.
 *
 *   node scripts/split-charisma.mjs
 *
 * Reads  products/learn/examples/charisma/original/AEON_Charisma_Sprint_Deep_Dive_14_Tage.md
 * Writes products/learn/examples/charisma/sessions/NN-<slug>.md  (14 files, verbatim slices)
 *        products/learn/examples/charisma/integration.md          (the "Abschluss" section)
 *
 * Guarantees:
 *   - sessions are verbatim character slices of the source (nothing rewritten),
 *     verified by re-concatenation against the sliced source region
 *   - the day count and every day title are asserted against the expected map
 *   - the source file's missing trailing newline is preserved as-is in the
 *     original and normalised (single trailing \n) only in derived files
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fixture = resolve(root, "products/learn/examples/charisma");
const source = resolve(fixture, "original/AEON_Charisma_Sprint_Deep_Dive_14_Tage.md");

/** Day number -> [slug, expected verbatim title]. Slugs follow the actual
 *  source material 1:1; the departure from MASTER_REQUIREMENTS §20 is
 *  documented in ../source-map.md. */
const DAYS = {
  1: ["first-impressions", "First Impression Hacks"],
  2: ["voice-and-trust", "Build Trust with Your Voice"],
  3: ["confidence", "Confidence Wins"],
  4: ["speaking-up", "Speak Up in Any Room"],
  5: ["storytelling", "Storytelling Secrets"],
  6: ["body-language", "Body Language"],
  7: ["reading-people", "Read People Like a Pro"],
  8: ["tough-feedback", "Give Tough Feedback Fast"],
  9: ["difficult-people", "Handle Difficult People Smartly"],
  10: ["saying-no", "Say No and Be Likable"],
  11: ["interrupting", "Interrupt Smoothly"],
  12: ["defusing-conflict", "Defuse Any Conflict"],
  13: ["listening", "Listen Like a Leader"],
  14: ["small-talk", "Small Talk Magic"],
};

const text = readFileSync(source, "utf8");

// Top-level (H1) heading offsets. The source uses "# Tag N: Title" per day.
const h1 = [...text.matchAll(/^# .+$/gm)].map((m) => ({ index: m.index, line: m[0] }));
const sectionEnd = (i) => (i + 1 < h1.length ? h1[i + 1].index : text.length);

const dayHeadings = h1
  .map((h, i) => ({ ...h, end: sectionEnd(i) }))
  .filter((h) => /^# Tag \d+:/.test(h.line));

if (dayHeadings.length !== 14) {
  throw new Error(`expected 14 day sections, found ${dayHeadings.length}`);
}

mkdirSync(resolve(fixture, "sessions"), { recursive: true });

let reassembled = "";
for (const h of dayHeadings) {
  const m = h.line.match(/^# Tag (\d+): (.+)$/);
  const day = Number(m[1]);
  const title = m[2].trim();
  const [slug, expected] = DAYS[day] ?? [];
  if (!slug) throw new Error(`unexpected day number ${day}`);
  if (title !== expected) {
    throw new Error(`day ${day}: title "${title}" does not match expected "${expected}"`);
  }
  const body = text.slice(h.index, h.end);
  reassembled += body;
  const file = `${String(day).padStart(2, "0")}-${slug}.md`;
  writeFileSync(resolve(fixture, "sessions", file), body.replace(/\s*$/, "\n"));
  console.log(`wrote sessions/${file} (${body.length} chars)`);
}

// Verbatim-slice invariant: the concatenated slices must equal the source
// region from the first day heading to the end of day 14.
const region = text.slice(dayHeadings[0].index, dayHeadings[13].end);
if (reassembled !== region) {
  throw new Error("verbatim invariant violated: reassembled sessions differ from source region");
}

// Integration section ("Abschluss") -> integration.md
const abschluss = h1.findIndex((h) => h.line.startsWith("# Abschluss"));
if (abschluss === -1) throw new Error("Abschluss section not found");
const abschlussBody = text.slice(h1[abschluss].index, sectionEnd(abschluss));
writeFileSync(resolve(fixture, "integration.md"), abschlussBody.replace(/\s*$/, "\n"));
console.log(`wrote integration.md (${abschlussBody.length} chars)`);

console.log("ok: all invariants hold");
