# Contributing

> [!NOTE]
> **Management summary.** The protocol is the product, so a contribution is almost always a change
> to text that an agent obeys. Specifications change by pull request, use RFC-style normative
> language, carry stable requirement identifiers and are versioned semantically. This guide tells
> you how to set up a clean clone, which path fits your change, which gate you run before you open
> a pull request, how to read a failing check, and which rules end a review early. Keep changes
> small, evidence-backed and model-agnostic.

This guide is for anyone proposing a change to the specification, the deep-dive library, the
schemas, the evals or the invocation surface. You need no special access: fork the repository, open
a pull request, and expect a review that argues about wording, because wording is behaviour here.

## Contents

- [Ground rules](#ground-rules)
- [Ways to contribute](#ways-to-contribute)
- [Set up a clean clone](#set-up-a-clean-clone)
- [Local checks](#local-checks)
- [When a check fails](#when-a-check-fails)
- [Pull request workflow](#pull-request-workflow)
- [A specification change end to end](#a-specification-change-end-to-end)
- [Writing conventions](#writing-conventions)
- [Versioning and releases](#versioning-and-releases)
- [Conduct and security](#conduct-and-security)

## Ground rules

These are policy. A pull request that breaks one is closed rather than revised.

1. **Model-agnostic or it does not merge.** No requirement may depend on the proprietary behaviour
   of one model vendor. Capability-dependent behaviour belongs behind capability negotiation
   ([`protocol/capabilities.md`](protocol/capabilities.md)), where an agent first verifies the
   capability and degrades honestly when it is missing.
2. **Normative language is load-bearing.** `MUST`, `MUST NOT`, `SHOULD`, `SHOULD NOT` and `MAY`
   follow RFC 2119 and RFC 8174 semantics. A sentence with a keyword is a requirement; give it a
   stable identifier such as `LEARN-D-2` so evals can reference it. Identifiers are never reused
   after removal, and a requirement without an identifier cannot be tested, so it does not merge.
3. **Research over opinion.** Changes to the research, epistemics or assessment specifications cite
   the evidence or the reasoning that motivates them. A citation must be real, reachable and say
   what you claim it says; an invented or unchecked source ends the review immediately.
4. **The Charisma fixture is frozen.** Files under `products/learn/examples/charisma/original/`
   stay byte-identical, and `.gitattributes` disables line-ending conversion for them so they stay
   that way on every platform. Editorial notes belong in the fixture README or its source map,
   never inline. The derived sessions and `integration.md` are generated, not hand-edited — see
   [`scripts/README.md`](scripts/README.md).
5. **Schemas and specifications move together.** If a specification changes a field, the
   corresponding JSON Schema in [`schemas/`](schemas/) changes in the same pull request, and the
   fixtures that validate against it are updated in the same pull request too.
6. **Nothing in the repository may contradict the bootstrap.** The agent entry contract
   [`products/learn/bootstrap.md`](products/learn/bootstrap.md) and its served copy at
   `site/learn/public/llms.txt` are what an agent reads first. If your change makes them wrong,
   your change includes the fix.

## Ways to contribute

Pick the row that matches your intent. Each issue form asks for exactly what the review needs.

| You want to | Start with | Then change |
|---|---|---|
| Add, change or remove a requirement | The [specification change form](.github/ISSUE_TEMPLATE/specification-change.yml) | [`protocol/`](protocol/) or [`products/learn/`](products/learn/), plus any schema and eval it touches |
| Propose a topic package | The [library package form](.github/ISSUE_TEMPLATE/library-package.yml) | A new directory under [`library/`](library/), starting with `manifest.yaml` |
| Report an agent that breaks a requirement | The [conformance report form](.github/ISSUE_TEMPLATE/conformance-report.yml) | Usually nothing — the report drives the fix |
| Improve an existing eval or add a case | An issue describing the behaviour gap | [`evals/learn/cases/`](evals/learn/cases/) and the rubric it scores against |
| Improve the invocation surface | An issue or a direct pull request | [`site/learn/`](site/learn/), following its own README |
| Record why a choice was made | An issue, or the record itself | [`docs/decisions/`](docs/decisions/), following the format that directory documents |

Report a vulnerability privately instead of opening an issue — see [`SECURITY.md`](SECURITY.md).

## Set up a clean clone

You need [Node.js](https://nodejs.org) 22 or newer and Git. Nothing else: there is no runtime to
build and no service to run.

```sh
git clone https://github.com/marcelrapold/aeon-protocol.git
cd aeon-protocol

# The validation toolchain that the root npm scripts drive
npm ci

# Only if you touch the invocation surface
npm ci --prefix site/learn
```

The repository holds two independent npm projects. The root project is the validation toolchain in
[`tools/`](tools/); it never ships and has no build step. The project in `site/learn/` is the
invocation surface, with its own lockfile and its own Node version in `site/learn/.nvmrc`. Install
the second one only when you change the site.

## Local checks

Run the same gate continuous integration runs, so a red pipeline is a surprise rather than a habit.

```sh
# Everything the specification gate covers
npm run validate

# Markdown style, using the same globs the documentation workflow uses
npx markdownlint-cli2 "**/*.md" "!**/node_modules/**" \
  "!products/learn/examples/charisma/original/**" \
  "!products/learn/examples/charisma/sessions/**" \
  "!products/learn/examples/charisma/integration.md"

# Only if you changed site/learn/
npm run lint --prefix site/learn
npm run typecheck --prefix site/learn
npm run test --prefix site/learn
npm run build --prefix site/learn
```

`npm run validate` runs every check in the table below in one pass. Run a single check by name
while you iterate; run the whole gate before you open the pull request.

| Command | What it enforces |
|---|---|
| `npm run validate` | Every check below, in one pass. This is the gate. |
| `npm run validate:schemas` | The JSON Schemas in [`schemas/`](schemas/) are themselves valid draft 2020-12, and every fixture and example instance validates against the schema it claims to follow. |
| `npm run validate:yaml` | Every YAML file parses and follows the house style: two-space indentation, no tabs, no duplicate mapping keys, LF endings and a final newline. A file that does not parse is invisible to every later check, and a duplicate key silently discards one of the two values. |
| `npm run validate:links` | Every relative Markdown link, image and reference definition resolves to something that exists, and every `#fragment` resolves to a real heading. A broken link in a specification is a failed fetch for an agent, not a cosmetic flaw. External URLs are never fetched. |
| `npm run validate:refs` | Cross-reference integrity of the deep-dive library: every package appears in the catalogue, every `related_packages` entry names a directory that exists, every referenced visual is present, and a package id matches its directory name. |
| `npm run validate:requirements` | The registry of normative requirement identifiers: no identifier is defined twice, so "the requirement" is never ambiguous, and no eval scores an identifier that no specification defines, so no eval is unfalsifiable. |
| `npm test` | The validation toolchain's own unit tests, so a check that passes is a check that works. |
| `npx markdownlint-cli2 …` | Markdown structure against [`.markdownlint.jsonc`](.markdownlint.jsonc): heading levels, list style, fenced-code languages, no bare URLs. The byte-preserved Charisma fixture is excluded because rule 4 forbids editing it into compliance. |

Continuous integration runs the specification gate, the Markdown lint and the invocation-surface
checks on every pull request. It runs nothing you cannot run locally, and it adds no check the
table above does not name.

## When a check fails

Read the failure as a claim about the repository, not about your patch. The claim is usually true.

- **A schema failure** names the instance path and the constraint. Decide which side is wrong: the
  fixture, or the schema that no longer describes the specification. If the specification changed,
  the schema changes with it in this pull request — that is ground rule 5, showing up as a red
  check.
- **A YAML failure** is almost always indentation or a tab. Two spaces per level, never a tab.
- **A link failure** prints the file, the link and the target that does not exist. Fix the link, or
  add the file the link promised. Never delete the link to silence the check: something you wrote
  depended on that document existing.
- **A reference failure** points at the library: a package missing from the catalogue in
  `library/README.md`, a `related_packages` entry naming a directory that is not there, a missing
  visual, or a package id that disagrees with its directory name. Adding a package means adding its
  catalogue row in the same pull request.
- **A requirements failure** means either a duplicate identifier or an eval scoring an identifier
  no specification defines. If you renamed an identifier, you broke every eval that scores it —
  identifiers are stable for exactly this reason, so prefer adding a new one to renaming an old
  one, and take the next free number in that family.
- **A Markdown lint failure** names the rule, for example `MD040/fenced-code-language`. The rule
  identifier is searchable, and the repository's exceptions are listed with their reasons in
  [`.markdownlint.jsonc`](.markdownlint.jsonc). Add an exception only if the rule is wrong for the
  whole repository, and say why in the same commit.
- **A site failure** is an ordinary TypeScript, ESLint, Vitest or Next.js failure. Reproduce it
  with the matching `--prefix site/learn` command above before you change anything.

If a check fails on a file you did not touch, say so in the pull request rather than fixing it
silently in the same change: an unexpected failure is a finding, and it deserves its own commit.

## Pull request workflow

1. Fork or branch, and keep one concern per pull request.
2. Make the change together with everything it forces: the schema, the eval case, the bootstrap.
3. Record the change in [`CHANGELOG.md`](CHANGELOG.md) under `Unreleased`.
4. Run the local checks above and keep the output — the pull request template asks for it.
5. Open the pull request and fill in the template. Name every requirement identifier you add,
   change or remove, and state the version impact.

Commit subjects are short, imperative and sentence-case, with an optional area prefix — for
example `Library: economic-psychology` or `Add Mermaid diagrams: journey flowchart in README`.

Reviews argue about wording, because wording is behaviour. Expect questions about whether a
`SHOULD` is really a `MUST`, whether a requirement can be observed in a transcript, and whether an
agent without your favourite capability can still satisfy it.

## A specification change end to end

A worked example of the path the review expects, using a change to the discovery phase.

1. **Open the specification change form.** State the change, name the surface
   (`products/learn/`), list the identifiers you touch, and pick the change type. The form is the
   design review; disagreement is cheaper here than in a diff.
2. **Write the requirement.** One sentence, one RFC 2119 keyword, one stable identifier, in
   [`products/learn/discovery.md`](products/learn/discovery.md). Describe behaviour an observer can
   see in a transcript. If you cannot say how you would score it, it is not yet a requirement.
3. **Follow it through the umbrella specification.** If
   [`products/learn/specification.md`](products/learn/specification.md) summarises the phase, the
   summary changes with it.
4. **Follow it into the data.** If the requirement adds or renames a field, change the JSON Schema
   in [`schemas/`](schemas/) and every fixture that validates against it, in this same pull
   request.
5. **Follow it into the bootstrap.** If the requirement changes what an agent does in the first
   minutes, [`products/learn/bootstrap.md`](products/learn/bootstrap.md) and
   `site/learn/public/llms.txt` change together, and stay mirror images of each other.
6. **Make it testable.** Add or amend a case in [`evals/learn/cases/`](evals/learn/cases/) and the
   line in [`evals/learn/protocol-compliance.md`](evals/learn/protocol-compliance.md) that scores
   it against your identifier. A requirement no eval can fail is decoration.
7. **Record it.** Add an entry to [`CHANGELOG.md`](CHANGELOG.md) under `Unreleased`, in the
   `Added`, `Changed`, `Fixed` or `Removed` group that fits, written so a reader can act on it.
8. **Run the gate.** `npm run validate`, the Markdown lint, and the site checks if the site moved.
9. **Open the pull request**, paste the check output, and state the version impact: breaking a
   `MUST` is major, adding requirements is minor, editorial fixes are patch.

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
- **Language-tagged code fences**, two-space YAML indentation, no tabs. The repository ships an
  [`.editorconfig`](.editorconfig) that sets this for editors that read one.

## Versioning and releases

- Semantic versioning per component: `ÆON Protocol x.y.z` and `ÆON Learn x.y.z`.
- Breaking a `MUST` is a major bump, adding requirements is minor, and editorial fixes are patch.
- A release is an annotated Git tag. `node scripts/bump-version.mjs vX.Y.Z` re-pins the
  agent-facing URLs and version banners in `products/learn/bootstrap.md`,
  `site/learn/public/llms.txt` and `site/learn/lib/content.ts`, so agents always fetch from an
  immutable tag rather than a moving branch. The script fails loudly rather than pinning a subset;
  see [`scripts/README.md`](scripts/README.md).
- A new file that carries a pinned URL or a version banner is added to that script in the same pull
  request that introduces it, or it drifts silently at the next release.
- Move the `Unreleased` entries of [`CHANGELOG.md`](CHANGELOG.md) under the new version heading in
  the release commit.

## Conduct and security

Participation follows the [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md). Vulnerabilities go to
<marcel@marcelrapold.com> under [`SECURITY.md`](SECURITY.md), never into a public issue. That
includes prompt-injection paths: specification or library text that an agent fetches and obeys is
an attack surface, and it is reported privately like any other.
