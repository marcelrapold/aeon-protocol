#!/usr/bin/env node
/**
 * Re-pins the release tag in every file that carries raw-content URLs or a
 * version constant, so agents always fetch specs from an immutable tag.
 *
 *   node scripts/bump-version.mjs v0.2.0
 *
 * Pinned locations (keep this list in sync when adding new pin sites):
 *   - products/learn/bootstrap.md          (raw.githubusercontent.com URLs)
 *   - site/learn/public/llms.txt           (raw.githubusercontent.com URLs)
 *   - site/learn/lib/content.ts            (export const VERSION)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const next = process.argv[2];

if (!/^v\d+\.\d+\.\d+$/.test(next ?? "")) {
  console.error("Usage: node scripts/bump-version.mjs vX.Y.Z");
  process.exit(1);
}

const TAG_RE = /v\d+\.\d+\.\d+/g;
const PINNED = [
  "products/learn/bootstrap.md",
  "site/learn/public/llms.txt",
  "site/learn/lib/content.ts",
];

for (const rel of PINNED) {
  const path = resolve(root, rel);
  const before = readFileSync(path, "utf8");
  const after = before.replace(TAG_RE, next);
  if (before === after) {
    console.warn(`warn: no tag occurrences found in ${rel}`);
    continue;
  }
  writeFileSync(path, after);
  console.log(`pinned ${rel} -> ${next}`);
}
