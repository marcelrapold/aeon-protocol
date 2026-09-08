#!/usr/bin/env node
/**
 * Re-pins the release tag in every file that carries an agent-facing raw URL,
 * a version banner or a version constant, so agents always fetch the
 * specifications from an immutable tag.
 *
 *   node scripts/bump-version.mjs v0.4.0     # re-pin and stamp the release date
 *   node scripts/bump-version.mjs --check    # verify every pin site, write nothing
 *
 * Every pin site below is declared with the minimum number of occurrences it
 * must contain. The script counts before it replaces and verifies after it
 * replaces, and it exits non-zero on the first discrepancy. A release that
 * pins only some of the URLs is worse than a release that fails: the agent
 * would fetch a mixture of two specification versions and never say so.
 *
 * Adding a file that carries a pinned URL or a version banner without adding
 * it here makes it drift silently at the next release. CONTRIBUTING.md makes
 * that a release-time obligation; ADR 0002 explains why.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** A tag as it appears in a raw URL or a version constant: v1.2.3 */
const TAG = String.raw`v\d+\.\d+\.\d+`;
/** A bare version as it appears in a banner: 1.2.3 */
const BARE = String.raw`\d+\.\d+\.\d+`;

/**
 * Pin sites. `min` is the smallest number of occurrences the file may carry:
 * a file that suddenly carries fewer has lost a pin, which is the failure this
 * script exists to catch.
 */
const PINNED = [
  {
    file: "products/learn/bootstrap.md",
    pins: [
      {
        label: "raw specification URLs",
        pattern: `(raw\\.githubusercontent\\.com/marcelrapold/aeon-protocol/)${TAG}`,
        replace: (tag) => `$1${tag}`,
        min: 17,
      },
      {
        label: "version banner",
        pattern: `(ÆON Learn )${BARE}( · ÆON Protocol )${BARE}`,
        replace: (tag) => `$1${tag.slice(1)}$2${tag.slice(1)}`,
        min: 1,
      },
    ],
  },
  {
    file: "site/learn/public/llms.txt",
    pins: [
      {
        label: "raw specification URLs",
        pattern: `(raw\\.githubusercontent\\.com/marcelrapold/aeon-protocol/)${TAG}`,
        replace: (tag) => `$1${tag}`,
        min: 17,
      },
      {
        label: "version banner",
        pattern: `(ÆON Learn )${BARE}( · ÆON Protocol )${BARE}`,
        replace: (tag) => `$1${tag.slice(1)}$2${tag.slice(1)}`,
        min: 1,
      },
    ],
  },
  {
    file: "site/learn/lib/content.ts",
    pins: [
      {
        label: "VERSION constant",
        pattern: `(export const VERSION = ")${TAG}(")`,
        replace: (tag) => `$1${tag}$2`,
        min: 1,
      },
    ],
  },
];

/** Stamped alongside the tag: the sitemap's lastmod must not outlive the release. */
const RELEASED = {
  file: "site/learn/lib/content.ts",
  pattern: String.raw`(export const RELEASED = ")\d{4}-\d{2}-\d{2}(")`,
  label: "RELEASED constant",
};

const failures = [];
const notes = [];

function fail(message) {
  if (!failures.includes(message)) failures.push(message);
}

function read(rel) {
  try {
    return readFileSync(resolve(root, rel), "utf8");
  } catch (error) {
    fail(`${rel}: cannot be read (${error.code ?? error.message}). Pin sites must exist.`);
    return null;
  }
}

function usage() {
  console.error("Usage: node scripts/bump-version.mjs vX.Y.Z");
  console.error("       node scripts/bump-version.mjs --check");
  process.exit(2);
}

const arg = process.argv[2];
const checkOnly = arg === "--check";

if (!checkOnly && !new RegExp(`^${TAG}$`).test(arg ?? "")) usage();
if (process.argv.length > 3) usage();

/**
 * In --check mode the target tag is whatever the site already declares, so the
 * check answers one question: does every pin site agree with it?
 */
let next = arg;
if (checkOnly) {
  const content = read(RELEASED.file);
  const declared = content?.match(new RegExp(`export const VERSION = "(${TAG})"`));
  if (!declared) {
    console.error(`error: cannot read the VERSION constant from ${RELEASED.file}`);
    process.exit(1);
  }
  next = declared[1];
  console.log(`checking every pin site against ${next}`);
}

const writes = new Map();

for (const { file, pins } of PINNED) {
  const before = read(file);
  if (before === null) continue;

  let after = before;
  for (const pin of pins) {
    const found = (before.match(new RegExp(pin.pattern, "g")) ?? []).length;
    if (found < pin.min) {
      fail(
        `${file}: found ${found} occurrence(s) of ${pin.label}, expected at least ${pin.min}. ` +
          `The pin site moved or was renamed — fix the pattern in scripts/bump-version.mjs.`,
      );
      continue;
    }
    after = after.replace(new RegExp(pin.pattern, "g"), pin.replace(next));
    notes.push(`${file}: ${found} × ${pin.label}`);
  }

  // Post-condition: no stale tag and no stale banner may survive anywhere in the file.
  const staleTag = [...after.matchAll(new RegExp(TAG, "g"))]
    .map((m) => m[0])
    .filter((tag) => tag !== next);
  if (staleTag.length > 0) {
    fail(`${file}: ${staleTag.length} tag(s) still read ${[...new Set(staleTag)].join(", ")} after re-pinning.`);
  }
  const staleBanner = [...after.matchAll(new RegExp(`ÆON (?:Learn|Protocol) (${BARE})`, "g"))]
    .map((m) => m[1])
    .filter((version) => version !== next.slice(1));
  if (staleBanner.length > 0) {
    fail(`${file}: version banner still reads ${[...new Set(staleBanner)].join(", ")} after re-pinning.`);
  }

  if (after !== before) writes.set(file, after);
}

// The sitemap's lastmod claims the release date, so it has to move with the
// tag. Stamped here rather than left to a human, because a date that someone
// has to remember to update becomes a lie the first time they forget.
const releasedSource = writes.get(RELEASED.file) ?? read(RELEASED.file);
const releasedRe = new RegExp(RELEASED.pattern);
const today = new Date().toISOString().slice(0, 10);
if (releasedSource !== null) {
  if (!releasedRe.test(releasedSource)) {
    fail(`${RELEASED.file}: ${RELEASED.label} not found. The sitemap's lastmod would keep a stale date.`);
  } else if (!checkOnly) {
    writes.set(RELEASED.file, releasedSource.replace(releasedRe, `$1${today}$2`));
  }
}

// Nothing is written until every pin site has been verified. A half-re-pinned
// working tree is the failure mode this script exists to prevent: it would tag
// a release whose agents fetch two specification versions at once.
if (failures.length > 0) {
  console.error("");
  for (const message of failures) console.error(`error: ${message}`);
  console.error(
    checkOnly
      ? `\n${failures.length} problem(s) found. No file was written.`
      : `\n${failures.length} problem(s) found. Nothing was written — fix the pin sites and run again.`,
  );
  process.exit(1);
}

if (!checkOnly) {
  for (const [file, content] of writes) {
    writeFileSync(resolve(root, file), content);
    console.log(`wrote ${file}`);
  }
  if (writes.size === 0) console.log(`nothing to write: every pin site already reads ${next}`);
}

console.log(`\nverified ${notes.length} pin group(s):`);
for (const note of notes) console.log(`  ${note}`);
if (!checkOnly) console.log(`  ${RELEASED.file}: ${RELEASED.label} stamped ${today}`);
console.log(checkOnly ? `all pin sites agree with ${next}` : `all pin sites now read ${next}`);
