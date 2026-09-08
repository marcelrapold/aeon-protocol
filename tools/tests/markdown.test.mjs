import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  collectAnchors,
  extractHeadings,
  extractLinks,
  maskCode,
  maskInlineCode,
  splitLines,
  stripTitle,
} from "../lib/markdown.mjs";

/** @param {string} text */
const mask = (text) => maskCode(splitLines(text));

describe("maskCode", () => {
  it("blanks fenced blocks and keeps the line count", () => {
    const masked = mask("before\n```sh\n[a](missing.md)\n```\nafter\n");
    assert.deepEqual(masked, ["before", "", "", "", "after", ""]);
  });

  it("does not close a fence with a shorter run of backticks", () => {
    const masked = mask("````\n```\n[a](missing.md)\n````\nafter\n");
    assert.equal(masked[2], "");
    assert.equal(masked[4], "after");
  });

  it("blanks tilde fences too", () => {
    assert.deepEqual(mask("~~~\n[a](missing.md)\n~~~\n"), ["", "", "", ""]);
  });

  it("blanks HTML comments across lines", () => {
    const masked = mask("a <!-- [x](missing.md)\nstill hidden --> b\n");
    assert.equal(masked[0].trim(), "a");
    assert.equal(masked[1].trim(), "b");
  });
});

describe("maskInlineCode", () => {
  it("replaces a code span with spaces, preserving columns", () => {
    const masked = maskInlineCode("run `npm run validate` now");
    assert.equal(masked, `run ${" ".repeat("`npm run validate`".length)} now`);
  });

  it("matches delimiters of equal length only", () => {
    assert.equal(maskInlineCode("``a ` b`` c"), `${" ".repeat("``a ` b``".length)} c`);
  });

  it("leaves an unterminated backtick alone", () => {
    assert.equal(maskInlineCode("a ` b"), "a ` b");
  });
});

describe("extractHeadings", () => {
  it("reads ATX headings with their level and line", () => {
    const headings = extractHeadings(mask("# One\n\n### Three\n"));
    assert.deepEqual(headings, [
      { line: 1, level: 1, raw: "One" },
      { line: 3, level: 3, raw: "Three" },
    ]);
  });

  it("reads setext headings", () => {
    assert.deepEqual(extractHeadings(mask("Title\n=====\n")), [{ line: 1, level: 1, raw: "Title" }]);
  });

  it("does not mistake a thematic break for a setext underline", () => {
    assert.deepEqual(extractHeadings(mask("paragraph\n\n---\n\n## Real\n")), [
      { line: 5, level: 2, raw: "Real" },
    ]);
  });

  it("ignores headings inside fenced code", () => {
    assert.deepEqual(extractHeadings(mask("```\n# Not a heading\n```\n")), []);
  });

  it("requires a space after the hash run", () => {
    assert.deepEqual(extractHeadings(mask("#hashtag\n")), []);
  });
});

describe("collectAnchors", () => {
  it("collects heading slugs and explicit HTML ids", () => {
    const anchors = collectAnchors(mask('# Overview\n\n<a id="manual"></a>\n\n## Overview\n'));
    assert.deepEqual([...anchors].sort(), ["manual", "overview", "overview-1"]);
  });
});

describe("extractLinks", () => {
  it("finds inline links and images with their position", () => {
    const links = extractLinks(mask("see [text](a.md) and ![alt](b.png)\n"));
    assert.deepEqual(
      links.map((link) => [link.kind, link.target, link.line]),
      [
        ["link", "a.md", 1],
        ["image", "b.png", 1],
      ],
    );
    assert.equal(links[0].column, "see [text](".length + 1);
  });

  it("finds reference definitions", () => {
    const links = extractLinks(mask("[label]: ../target.md\n"));
    assert.deepEqual(links, [{ line: 1, column: 10, target: "../target.md", kind: "definition" }]);
  });

  it("finds href and src attributes on raw HTML", () => {
    const links = extractLinks(mask('<img src="visuals/a.webp" alt="a">\n'));
    assert.deepEqual(
      links.map((link) => [link.kind, link.target]),
      [["html", "visuals/a.webp"]],
    );
  });

  it("ignores links inside code", () => {
    assert.deepEqual(extractLinks(mask("`[a](missing.md)`\n")), []);
    assert.deepEqual(extractLinks(mask("```\n[a](missing.md)\n```\n")), []);
  });

  it("ignores an empty target", () => {
    assert.deepEqual(extractLinks(mask("[a]()\n")), []);
  });

  it("survives brackets inside the link text", () => {
    const links = extractLinks(mask("[the [!NOTE] callout](a.md)\n"));
    assert.deepEqual(
      links.map((link) => link.target),
      ["a.md"],
    );
  });
});

describe("stripTitle", () => {
  it("removes a quoted title", () => {
    assert.equal(stripTitle('a.md "The title"'), "a.md");
    assert.equal(stripTitle("a.md 'The title'"), "a.md");
  });

  it("removes angle brackets", () => {
    assert.equal(stripTitle("<a file.md>"), "a file.md");
  });
});
