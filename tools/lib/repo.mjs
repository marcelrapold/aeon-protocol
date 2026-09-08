/**
 * Filesystem helpers shared by every check.
 *
 * Paths crossing module boundaries are always repository-relative and POSIX
 * separated (`library/bitcoin/manifest.yaml`), because that is what a reader
 * needs to see in a report and what a checker needs to compare against a link
 * target. Absolute paths exist only where the filesystem is touched.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, posix, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

/** Absolute path of the repository root. */
export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

/**
 * Repository-relative prefixes never reported on. The validator fixtures are
 * deliberately malformed — they exist to prove the checks bite — so the checks
 * must not walk into them when the root is the repository itself.
 */
export const IGNORED_PREFIXES = ["tools/__fixtures__/"];

/** Directory names never walked, whatever the root. */
export const IGNORED_DIRECTORIES = new Set([
  ".git",
  ".next",
  ".vercel",
  "node_modules",
  "out",
]);

/**
 * @param {string} absolutePath
 * @param {string} root
 * @returns {string} repository-relative POSIX path
 */
export function toRepoPath(absolutePath, root = REPO_ROOT) {
  return relative(root, absolutePath).split(sep).join(posix.sep);
}

/**
 * @param {string} root
 * @param {string} repoPath
 * @returns {string} absolute path
 */
export function toAbsolutePath(repoPath, root = REPO_ROOT) {
  return resolve(root, repoPath.split(posix.sep).join(sep));
}

/**
 * Walk a directory tree, depth first, in stable alphabetical order.
 *
 * @param {object} options
 * @param {string} [options.root] repository root
 * @param {string} [options.dir] subdirectory to walk, repository-relative
 * @param {string[]} [options.extensions] file extensions to keep, with the dot
 * @returns {string[]} repository-relative POSIX paths, sorted
 */
export function listFiles({ root = REPO_ROOT, dir = ".", extensions } = {}) {
  const start = toAbsolutePath(dir, root);
  /** @type {string[]} */
  const found = [];
  if (!existsSync(start)) return found;

  /** @param {string} current */
  const walk = (current) => {
    const entries = readdirSync(current, { withFileTypes: true }).sort((a, b) =>
      a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
    );
    for (const entry of entries) {
      if (IGNORED_DIRECTORIES.has(entry.name)) continue;
      const child = join(current, entry.name);
      if (entry.isDirectory()) {
        walk(child);
      } else if (entry.isFile()) {
        if (extensions && !extensions.some((ext) => entry.name.endsWith(ext))) continue;
        found.push(toRepoPath(child, root));
      }
    }
  };

  walk(start);
  return found
    .filter((repoPath) => !IGNORED_PREFIXES.some((prefix) => repoPath.startsWith(prefix)))
    .sort();
}

/**
 * @param {object} options
 * @param {string} [options.root]
 * @param {string} options.dir repository-relative directory
 * @returns {string[]} immediate subdirectory names, sorted
 */
export function listDirectories({ root = REPO_ROOT, dir }) {
  const start = toAbsolutePath(dir, root);
  if (!existsSync(start)) return [];
  return readdirSync(start, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !IGNORED_DIRECTORIES.has(entry.name))
    .map((entry) => entry.name)
    .sort();
}

/**
 * @param {string} repoPath
 * @param {string} [root]
 * @returns {string} file contents, UTF-8
 */
export function readText(repoPath, root = REPO_ROOT) {
  return readFileSync(toAbsolutePath(repoPath, root), "utf8");
}

/**
 * @param {string} repoPath
 * @param {string} [root]
 * @returns {"file"|"directory"|"missing"}
 */
export function pathKind(repoPath, root = REPO_ROOT) {
  const absolute = toAbsolutePath(repoPath, root);
  if (!existsSync(absolute)) return "missing";
  return statSync(absolute).isDirectory() ? "directory" : "file";
}

/**
 * Translate a character offset into a 1-based line and column.
 *
 * @param {string} text
 * @param {number} offset
 * @returns {{ line: number, column: number }}
 */
export function positionAt(text, offset) {
  const clamped = Math.max(0, Math.min(offset, text.length));
  let line = 1;
  let lastBreak = -1;
  for (let index = 0; index < clamped; index += 1) {
    if (text[index] === "\n") {
      line += 1;
      lastBreak = index;
    }
  }
  return { line, column: clamped - lastBreak };
}
