# Contributing

> [!NOTE]
> **Management summary.** The protocol is the product, so a contribution is almost always a change
> to text that an agent obeys. Specifications change by pull request, use RFC-style normative
> language, carry stable requirement identifiers and are versioned semantically. This guide tells
> you which path fits your change, which checks must pass before you open a pull request, and which
> rules end a review early. Keep changes small, evidence-backed and model-agnostic.

This guide is for anyone proposing a change to the specification, the deep-dive library, the
schemas, the evals or the invocation surface. You need no special access: fork the repository, open
a pull request, and expect a review that argues about wording, because wording is behaviour here.

## Contents

- [Ground rules](#ground-rules)
- [Ways to contribute](#ways-to-contribute)
- [Local checks](#local-checks)
- [Pull request workflow](#pull-request-workflow)
- [Writing conventions](#writing-conventions)
- [Versioning and releases](#versioning-and-releases)
- [Conduct and security](#conduct-and-security)

## Ground rules

1. **Model-agnostic or it does not merge.** No requirement may depend on the proprietary behaviour
   of one model vendor. Capability-dependent behaviour belongs behind capability negotiation
   ([`protocol/capabilities.md`](protocol/capabilities.md)).
2. **Normative language is load-bearing.** `MUST`, `MUST NOT`, `SHOULD`, `SHOULD NOT` and `MAY`
   follow RFC 2119 and RFC 8174 semantics. A sentence with a keyword is a requirement; give it a
   stable identifier such as `LEARN-D-2` so evals can reference it. Identifiers are never reused
   after removal.
3. **Research over opinion.** Changes to the research, epistemics or assessment specifications cite
   the evidence or the reasoning that motivates them.
4. **The Charisma fixture is frozen.** Files under `products/learn/examples/charisma/original/` stay
   byte-identical. Editorial notes belong in the fixture README or its source map, never inline.
5. **Schemas and specifications move together.** If a specification changes a field, the
   corresponding JSON Schema in [`schemas/`](schemas/) changes in the same pull request, and the
   site's fixture-validation tests stay green.

## Ways to contribute

Pick the row that matches your intent. Each issue form asks for exactly what the review needs.

| You want to | Start with | Then change |
|---|---|---|
| Add, change or remove a requirement | The [specification change form](.github/ISSUE_TEMPLATE/specification-change.yml) | [`protocol/`](protocol/) or [`products/learn/`](products/learn/), plus any schema and eval it touches |
| Propose a topic package | The [library package form](.github/ISSUE_TEMPLATE/library-package.yml) | A new directory under [`library/`](library/), starting with `manifest.yaml` |
| Report an agent that breaks a requirement | The [conformance report form](.github/ISSUE_TEMPLATE/conformance-report.yml) | Usually nothing — the report drives the fix |
| Improve an existing eval or add a case | An issue describing the behaviour gap | [`evals/learn/cases/`](evals/learn/cases/) and the rubric it scores against |
| Improve the invocation surface | An issue or a direct pull request | [`site/learn/`](site/learn/), following its own README |

Report a vulnerability privately instead of opening an issue — see [`SECURITY.md`](SECURITY.md).

## Local checks

Run the checks that match what you touched. Continuous integration runs the same ones.

```sh
# Every Markdown file, the same globs the docs workflow uses
npx markdownlint-cli2 "**/*.md" "!site/learn/node_modules/**"

# A fixture against its schema
npx ajv-cli validate --spec=draft2020 \
  -s schemas/curriculum.schema.json \
  -d products/learn/examples/charisma/curriculum.yaml

# The invocation surface, from site/learn/
npm ci && npm run lint && npm run typecheck && npm run test && npm run build
```

Check that every internal link you write resolves to a file that exists. A broken link in a
specification is a broken fetch for an agent.

## Pull request workflow

1. Fork or branch, and keep one concern per pull request.
2. Make the change together with everything it forces: the schema, the eval case, the bootstrap.
3. Record the change in [`CHANGELOG.md`](CHANGELOG.md) under `Unreleased`.
4. Run the local checks for the surfaces you touched.
5. Open the pull request and fill in the template. Name every requirement identifier you add,
   change or remove, and state the version impact.

Commit subjects are short, imperative and sentence-case, with an optional area prefix — for
example `Library: economic-psychology` or `Add Mermaid diagrams: journey flowchart in README`.

## Writing conventions

Specifications are read by agents and by people, so the prose follows one style.

- **Second person, present tense, active voice.** Say what the agent does, not what would be done.
- **Sentence-case headings**, one `H1` per document, no skipped heading levels.
- **No emojis anywhere**, including headings and tables. Use GitHub alerts such as `> [!NOTE]` and
  `> [!IMPORTANT]` for callouts.
- **Management summary first.** Every specification opens with a `> [!NOTE]` summary that a
  non-specialist can read.
- **ÆON keeps its ligature in prose**; slugs, directory names, URLs and identifiers stay ASCII, so
  the repository is `aeon-protocol` and a package is `austrian-economics`.
- **One term per concept.** The agent is the runtime, the website is the invocation surface, and
  this repository is the specification. Do not introduce synonyms for those three.
- **Language-tagged code fences**, two-space YAML indentation, no tabs.

## Versioning and releases

- Semantic versioning per component: `ÆON Protocol x.y.z` and `ÆON Learn x.y.z`.
- Breaking a `MUST` is a major bump, adding requirements is minor, and editorial fixes are patch.
- A release is an annotated Git tag. `node scripts/bump-version.mjs vX.Y.Z` re-pins the
  agent-facing URLs in `products/learn/bootstrap.md`, `site/learn/public/llms.txt` and
  `site/learn/lib/content.ts`, so agents always fetch from an immutable tag rather than a moving
  branch.
- Move the `Unreleased` entries of [`CHANGELOG.md`](CHANGELOG.md) under the new version heading in
  the release commit.

## Conduct and security

Participation follows the [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md). Vulnerabilities go to
<marcel@marcelrapold.com> under [`SECURITY.md`](SECURITY.md), never into a public issue.
