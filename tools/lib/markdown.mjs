/**
 * A small, deliberately incomplete Markdown reader.
 *
 * It answers two questions the link checker asks: which headings does this
 * document define, and which targets does it point at? Everything else about
 * the document is ignored. Code — fenced blocks, inline spans, HTML comments —
 * is masked before either question is asked, so a link written inside an
 * example never counts as a link.
 */

import { createSlugger } from "./slug.mjs";

/**
 * @param {string} text
 * @returns {string[]} lines, without their terminators
 */
export function splitLines(text) {
  return text.replace(/\r\n?/g, "\n").split("\n");
}

/**
 * Blank out fenced code blocks and HTML comments, and replace inline code spans
 * with spaces. Line count and column positions are preserved so that reported
 * positions still match the file on disk.
 *
 * @param {string[]} lines
 * @returns {string[]} masked lines
 */
export function maskCode(lines) {
  /** @type {string[]} */
  const masked = [];
  /** @type {{ char: string, length: number } | null} */
  let fence = null;
  let inComment = false;

  for (const line of lines) {
    if (fence) {
      const closing = line.match(/^ {0,3}(`{3,}|~{3,})\s*$/);
      if (closing && closing[1][0] === fence.char && closing[1].length >= fence.length) {
        fence = null;
      }
      masked.push("");
      continue;
    }

    const opening = line.match(/^ {0,3}(`{3,}|~{3,})/);
    if (opening) {
      fence = { char: opening[1][0], length: opening[1].length };
      masked.push("");
      continue;
    }

    let working = line;
    if (inComment) {
      const end = working.indexOf("-->");
      if (end === -1) {
        masked.push("");
        continue;
      }
      working = " ".repeat(end + 3) + working.slice(end + 3);
      inComment = false;
    }
    const commentStart = working.indexOf("<!--");
    if (commentStart !== -1) {
      const end = working.indexOf("-->", commentStart);
      if (end === -1) {
        inComment = true;
        working = working.slice(0, commentStart) + " ".repeat(working.length - commentStart);
      } else {
        working =
          working.slice(0, commentStart) +
          " ".repeat(end + 3 - commentStart) +
          working.slice(end + 3);
      }
    }

    masked.push(maskInlineCode(working));
  }

  return masked;
}

/**
 * @param {string} line
 * @returns {string} the line with every code span replaced by spaces
 */
export function maskInlineCode(line) {
  const characters = [...line];
  let index = 0;
  while (index < characters.length) {
    if (characters[index] !== "`") {
      index += 1;
      continue;
    }
    let openLength = 0;
    while (characters[index + openLength] === "`") openLength += 1;
    let cursor = index + openLength;
    let closeStart = -1;
    while (cursor < characters.length) {
      if (characters[cursor] === "`") {
        let closeLength = 0;
        while (characters[cursor + closeLength] === "`") closeLength += 1;
        if (closeLength === openLength) {
          closeStart = cursor;
          break;
        }
        cursor += closeLength;
        continue;
      }
      cursor += 1;
    }
    if (closeStart === -1) {
      index += openLength;
      continue;
    }
    for (let blank = index; blank < closeStart + openLength; blank += 1) {
      characters[blank] = " ";
    }
    index = closeStart + openLength;
  }
  return characters.join("");
}

const LIST_OR_BLOCK_START = /^ {0,3}([-*+>|=]|#{1,6}\s|\d+[.)]\s)/;

/**
 * @typedef {object} Heading
 * @property {number} line 1-based line of the heading text
 * @property {number} level 1 to 6
 * @property {string} raw heading source without the leading `#` run
 */

/**
 * @param {string[]} maskedLines
 * @returns {Heading[]}
 */
export function extractHeadings(maskedLines) {
  /** @type {Heading[]} */
  const headings = [];
  for (let index = 0; index < maskedLines.length; index += 1) {
    const line = maskedLines[index];
    const atx = line.match(/^ {0,3}(#{1,6})(?:\s+(.*))?$/);
    if (atx) {
      headings.push({ line: index + 1, level: atx[1].length, raw: (atx[2] ?? "").trim() });
      continue;
    }
    const underline = maskedLines[index + 1]?.match(/^ {0,3}(=+|-+)\s*$/);
    if (underline && line.trim() !== "" && !LIST_OR_BLOCK_START.test(line)) {
      headings.push({ line: index + 1, level: underline[1][0] === "=" ? 1 : 2, raw: line.trim() });
    }
  }
  return headings;
}

/**
 * Every fragment this document can be linked to: one slug per heading, plus any
 * explicit `id` or `name` attribute on raw HTML.
 *
 * @param {string[]} maskedLines
 * @returns {Set<string>}
 */
export function collectAnchors(maskedLines) {
  const slugger = createSlugger();
  /** @type {Set<string>} */
  const anchors = new Set();
  for (const heading of extractHeadings(maskedLines)) {
    anchors.add(slugger(heading.raw));
  }
  for (const line of maskedLines) {
    for (const match of line.matchAll(/\s(?:id|name)\s*=\s*"([^"]+)"/g)) {
      anchors.add(match[1]);
    }
  }
  return anchors;
}

/**
 * @typedef {object} MarkdownLink
 * @property {number} line 1-based
 * @property {number} column 1-based, at the start of the target
 * @property {string} target raw target, title and angle brackets removed
 * @property {"link"|"image"|"definition"|"html"} kind
 */

const INLINE_LINK = /(!?)\[(?:[^[\]]|\[[^\]]*\])*\]\(([^()]*)\)/g;
const DEFINITION = /^ {0,3}\[([^\]]+)\]:\s*(\S+)/;
const HTML_ATTRIBUTE = /<(?:a|img|source|video|iframe)\b[^>]*?\s(?:href|src)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;

/**
 * @param {string[]} maskedLines
 * @returns {MarkdownLink[]}
 */
export function extractLinks(maskedLines) {
  /** @type {MarkdownLink[]} */
  const links = [];
  for (let index = 0; index < maskedLines.length; index += 1) {
    const line = maskedLines[index];

    for (const match of line.matchAll(INLINE_LINK)) {
      const rawTarget = match[2];
      const target = stripTitle(rawTarget);
      if (target === "") continue;
      const offset = match.index + match[0].length - rawTarget.length - 1;
      links.push({
        line: index + 1,
        column: offset + 1,
        target,
        kind: match[1] === "!" ? "image" : "link",
      });
    }

    const definition = line.match(DEFINITION);
    if (definition) {
      links.push({
        line: index + 1,
        column: line.indexOf(definition[2]) + 1,
        target: stripTitle(definition[2]),
        kind: "definition",
      });
    }

    for (const match of line.matchAll(HTML_ATTRIBUTE)) {
      const target = match[1] ?? match[2] ?? "";
      if (target === "") continue;
      links.push({
        line: index + 1,
        column: match.index + 1,
        target,
        kind: "html",
      });
    }
  }
  return links;
}

/**
 * Strip an optional link title and the optional angle brackets around a target.
 *
 * @param {string} rawTarget
 * @returns {string}
 */
export function stripTitle(rawTarget) {
  let target = rawTarget.trim();
  target = target.replace(/\s+(?:"[^"]*"|'[^']*')\s*$/, "");
  target = target.trim();
  if (target.startsWith("<") && target.endsWith(">")) target = target.slice(1, -1);
  return target.trim();
}
