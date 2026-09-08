import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createSlugger, renderInline, slugFromHeading, slugify } from "../lib/slug.mjs";

describe("slugify", () => {
  it("lowercases and joins words with hyphens", () => {
    assert.equal(slugify("Package anatomy"), "package-anatomy");
  });

  it("drops punctuation but keeps hyphens and underscores", () => {
    assert.equal(slugify("Origin case: the Charisma Sprint"), "origin-case-the-charisma-sprint");
    assert.equal(slugify("Model-independent, by design."), "model-independent-by-design");
    assert.equal(slugify("snake_case stays"), "snake_case-stays");
  });

  it("keeps non-ASCII letters, which GitHub also keeps", () => {
    assert.equal(slugify("ÆON Learn"), "æon-learn");
    assert.equal(slugify("Schrödinger"), "schrödinger");
  });

  it("turns each space into its own hyphen", () => {
    assert.equal(slugify("two  spaces"), "two--spaces");
  });

  it("drops symbols entirely, as GitHub does", () => {
    assert.equal(slugify("C++ and C#"), "c-and-c");
    assert.equal(slugify("100% of the time"), "100-of-the-time");
    assert.equal(slugify("Evidence & interpretation"), "evidence--interpretation");
  });

  it("trims before slugging, so no leading or trailing hyphen appears", () => {
    assert.equal(slugify("  Contents  "), "contents");
  });

  it("returns an empty slug for a heading of pure punctuation", () => {
    assert.equal(slugify("---"), "---");
    assert.equal(slugify("!!!"), "");
  });
});

describe("renderInline", () => {
  it("keeps link text and discards the target", () => {
    assert.equal(renderInline("See [the library](../library/README.md)"), "See the library");
  });

  it("keeps image alt text", () => {
    assert.equal(renderInline("![A diagram](diagram.png) follows"), "A diagram follows");
  });

  it("keeps the content of code spans", () => {
    assert.equal(renderInline("The `manifest.yaml` file"), "The manifest.yaml file");
  });

  it("removes emphasis markers but not intraword underscores", () => {
    assert.equal(renderInline("**Bold** and *italic*"), "Bold and italic");
    assert.equal(renderInline("_emphasis_ here"), "emphasis here");
    assert.equal(renderInline("keep snake_case_words"), "keep snake_case_words");
  });

  it("removes raw HTML tags and the closing ATX run", () => {
    assert.equal(renderInline("Title <br/> break ###"), "Title  break");
  });
});

describe("slugFromHeading", () => {
  it("slugs the rendered text, not the source", () => {
    assert.equal(slugFromHeading("The [deep-dive library](../library/)"), "the-deep-dive-library");
    assert.equal(slugFromHeading("Validate `curriculum.yaml` locally"), "validate-curriculumyaml-locally");
  });
});

describe("createSlugger", () => {
  it("numbers repeats from one, the way GitHub does", () => {
    const slug = createSlugger();
    assert.equal(slug("Overview"), "overview");
    assert.equal(slug("Overview"), "overview-1");
    assert.equal(slug("Overview"), "overview-2");
    assert.equal(slug("Other"), "other");
  });

  it("treats headings that render the same as the same heading", () => {
    const slug = createSlugger();
    assert.equal(slug("**Contents**"), "contents");
    assert.equal(slug("Contents"), "contents-1");
  });

  it("keeps a counter per slug, not per document", () => {
    const slug = createSlugger();
    assert.equal(slug("A"), "a");
    assert.equal(slug("B"), "b");
    assert.equal(slug("A"), "a-1");
    assert.equal(slug("B"), "b-1");
  });
});
