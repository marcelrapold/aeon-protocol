/**
 * Check: every relative Markdown link, image and reference definition resolves
 * to something that exists, and every `#fragment` resolves to a heading.
 *
 * A broken link in a specification is a broken fetch for an agent, so this is a
 * correctness check rather than a tidiness one. External URLs are out of scope:
 * this check never touches the network.
 */

import { posix } from "node:path";

import { collectAnchors, extractLinks, maskCode, splitLines } from "../markdown.mjs";
import { error } from "../reporter.mjs";
import { listFiles, pathKind, readText } from "../repo.mjs";

/** Anything with a URI scheme, a protocol-relative URL, or a bare fragment-free scheme. */
const EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

/**
 * @param {string} target
 * @returns {boolean}
 */
export function isExternal(target) {
  return EXTERNAL.test(target);
}

/**
 * Split a link target into its path and fragment.
 *
 * @param {string} target
 * @returns {{ path: string, fragment: string }}
 */
export function splitTarget(target) {
  const hash = target.indexOf("#");
  if (hash === -1) return { path: target, fragment: "" };
  return { path: target.slice(0, hash), fragment: target.slice(hash + 1) };
}

/**
 * @param {string} value
 * @returns {string}
 */
function decode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * @param {{ root?: string }} [context]
 * @returns {import("../reporter.mjs").CheckResult}
 */
export function run({ root } = {}) {
  /** @type {import("../reporter.mjs").Finding[]} */
  const findings = [];
  const markdownFiles = listFiles({ root, extensions: [".md"] });

  /** @type {Map<string, Set<string>>} */
  const anchorCache = new Map();
  /**
   * @param {string} repoPath
   * @returns {Set<string>}
   */
  const anchorsOf = (repoPath) => {
    const cached = anchorCache.get(repoPath);
    if (cached) return cached;
    const anchors = collectAnchors(maskCode(splitLines(readText(repoPath, root))));
    anchorCache.set(repoPath, anchors);
    return anchors;
  };

  let checked = 0;

  for (const repoPath of markdownFiles) {
    const lines = maskCode(splitLines(readText(repoPath, root)));
    const directory = posix.dirname(repoPath);

    for (const link of extractLinks(lines)) {
      if (isExternal(link.target)) continue;
      const { path: rawPath, fragment } = splitTarget(link.target);
      const targetPath = decode(rawPath);
      const at = { file: repoPath, line: link.line, column: link.column };
      checked += 1;

      /** @type {string | undefined} */
      let resolved;
      if (targetPath === "") {
        resolved = repoPath;
      } else if (targetPath.startsWith("/")) {
        findings.push(
          error(
            `link target "${link.target}" starts with "/", which GitHub resolves against the site root rather than the repository`,
            { ...at, hint: "use a path relative to this file" },
          ),
        );
        continue;
      } else {
        resolved = posix.normalize(posix.join(directory, targetPath));
        if (resolved.startsWith("..")) {
          findings.push(
            error(`link target "${link.target}" escapes the repository`, {
              ...at,
              hint: "point at a file inside the repository",
            }),
          );
          continue;
        }
        resolved = resolved.replace(/\/$/, "");
        const kind = pathKind(resolved, root);
        if (kind === "missing") {
          findings.push(
            error(`link target "${link.target}" does not exist (looked for ${resolved})`, {
              ...at,
              hint: "fix the path, or add the file the link promises",
            }),
          );
          continue;
        }
        if (kind === "directory") {
          const readme = posix.join(resolved, "README.md");
          resolved = pathKind(readme, root) === "file" ? readme : resolved;
        }
      }

      if (fragment === "") continue;
      if (!resolved.endsWith(".md")) continue;

      const decodedFragment = decode(fragment);
      const anchors = anchorsOf(resolved);
      if (anchors.has(decodedFragment)) continue;
      const where = resolved === repoPath ? "this document" : resolved;
      findings.push(
        error(`anchor "#${decodedFragment}" has no matching heading in ${where}`, {
          ...at,
          hint: "GitHub slugs a heading by lowercasing it, dropping punctuation and joining words with hyphens",
        }),
      );
    }
  }

  return {
    name: "links",
    findings,
    stats: { "documents scanned": markdownFiles.length, "relative links checked": checked },
  };
}
