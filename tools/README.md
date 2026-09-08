# Validation toolchain

The checks continuous integration runs against this repository, and how to run one yourself.

> [!NOTE]
> **Management summary.** One command validates the whole specification: `npm run validate`. It
> runs five independent checks — data against the JSON Schemas, every internal link and heading
> anchor, the cross-references of the deep-dive library, YAML style and hygiene, and the registry of
> normative requirement identifiers. Each check names the file, the line where it can know one, and
> what is wrong, so you can fix a failure without reading the validator. The toolchain depends on
> three pinned packages and nothing else; it never touches the network.

This document is a how-to, except for [What each check enforces](#what-each-check-enforces), which
is reference.

## Contents

- [Run it](#run-it)
- [What each check enforces](#what-each-check-enforces)
- [Reading a failure](#reading-a-failure)
- [Machine-readable output](#machine-readable-output)
- [Layout](#layout)
- [Extending a check](#extending-a-check)

## Run it

Install once, from the repository root:

```sh
npm ci
```

Then run everything, or one check at a time:

```sh
npm run validate               # every check
npm run validate:schemas       # one check
npm run validate:links
npm run validate:refs
npm run validate:yaml
npm run validate:requirements
```

The scripts wrap one entry point, which takes any number of check names:

```sh
node tools/validate.mjs                    # every check
node tools/validate.mjs links refs         # two of them
node tools/validate.mjs --json             # a machine-readable report on stdout
node tools/validate.mjs --quiet            # failures only; silence on success
node tools/validate.mjs --help             # the checks and the flags
```

The exit code is `0` when every selected check passes and `1` otherwise, including when the command
line itself is wrong. Nothing is written outside stdout and stderr, and no check makes a network
request, so a run is safe to repeat and safe to run offline.

Run the unit tests with `npm test`.

## What each check enforces

### `schemas`

Every data file under `library/`, `products/learn/examples/` and `evals/learn/cases/` is validated
against the schema its file name implies, using Ajv in draft 2020-12 mode with `ajv-formats`
loaded. Each schema in `schemas/` is additionally validated against the JSON Schema 2020-12
meta-schema and compiled, and `schemas/README.md` is cross-checked against the directory: a schema
the README does not document, or a schema the README promises but that is not there, is an error.

The mapping lives in [`lib/schema-map.mjs`](lib/schema-map.mjs) and has three outcomes. A file the
mapping recognises is validated. A file with a documented shape that no schema describes — the
topic-package companion files, and `curriculum-template.yaml`, which is a sequencing skeleton rather
than a compiled curriculum — is skipped by name, with the reason recorded next to the rule. A file
the mapping has never seen is an error, so a new kind of data file cannot slip through unvalidated.
Where part of a file has a schema of its own, a sub-document rule covers it: an eval case's
`simulated_context` is validated against `capability.schema.json` as well.

Why it matters: the schemas are the machine-checkable part of the prose specification. Until this
check existed, nothing in continuous integration compared the two.

### `links`

Every relative link, image, reference definition and raw HTML `href` or `src` in every `**/*.md`
resolves to a file or directory that exists, and every `#fragment` resolves to a heading that
exists. Fragments are matched against GitHub's slug rules: the rendered heading text, lowercased,
stripped of punctuation, spaces turned into hyphens, repeats numbered `-1`, `-2`. A link into a
directory is resolved through that directory's `README.md`, as GitHub does. Code — fenced blocks,
inline spans, HTML comments — is masked first, so an example link is never mistaken for a real one.
External URLs are ignored; this check never opens a socket.

Why it matters: a broken link in a specification is a broken fetch for an agent that is following
it at runtime.

### `refs`

Cross-reference integrity of the deep-dive library, in four parts:

- every directory under `library/` appears in the package catalogue of `library/README.md`, and
  every catalogue entry has a directory behind it;
- every `related_packages` and `prerequisites` entry in a manifest names a package that exists;
- every package carries a light and a dark visual at
  `site/learn/public/visuals/topics/{light,dark}/<id>.webp`, and a visual with no package behind it
  is reported as a warning;
- a package `id` equals its directory name, and each companion file's `package` field agrees.

Why it matters: these are exactly the invariants `schemas/README.md` lists as beyond what a
single-document schema can check.

### `yaml`

Every `.yaml` and `.yml` file in the repository parses, and follows the house style: two-space
indentation, no tabs, no trailing whitespace, exactly one closing newline, no carriage returns, and
no duplicate mapping keys. Lines inside a block scalar are exempt from the indentation rule, because
YAML and not the house style owns their indentation.

Why it matters: a duplicate mapping key silently discards one of the two values and no parser
complains by default, and the remaining rules keep diffs about content rather than whitespace.

### `requirements`

A registry is built of every normative requirement identifier defined in `protocol/**`,
`products/learn/**` and `library/README.md` — the `**LEARN-D-2** — …` form, with or without a
parenthesised label. An identifier defined twice is an error, because one identifier names one
requirement. Every identifier referenced from `evals/**` must exist in the registry, because an
eval that scores an undefined requirement cannot be failed honestly. An identifier mentioned in a
specification but never defined is reported as a warning.

Why it matters: `CONTRIBUTING.md` makes identifiers stable and never reused, and the evals reference
them by name.

## Reading a failure

Every finding prints as a location, a sentence, and — where there is one — a fix:

```text
schemas: 1 error (schemas meta-validated: 6, documents validated: 55)
  error library/example/manifest.yaml:12:3
        /learning_paths must NOT have fewer than 1 items (schemas/topic-package.schema.json)
        fix: add at least one learning path
```

Warnings are printed the same way but do not change the exit code. A check that throws is reported
as a failing finding rather than taking the run down with it, so one broken check never hides the
other four.

## Machine-readable output

`--json` writes one object to stdout and nothing else:

```json
{
  "ok": false,
  "durationMs": 612.4,
  "checks": [
    {
      "name": "yaml",
      "stats": { "files checked": 147 },
      "findings": [
        { "level": "error", "message": "has trailing whitespace", "file": "library/x/manifest.yaml", "line": 4, "column": 16, "hint": "strip the spaces at the end of the line" }
      ],
      "errorCount": 1,
      "warningCount": 0,
      "ok": false,
      "durationMs": 480.2
    }
  ],
  "summary": { "checks": 1, "errors": 1, "warnings": 0 }
}
```

## Layout

| Path | Holds |
|---|---|
| [`validate.mjs`](validate.mjs) | The command line: argument parsing, the check registry, the exit code |
| [`lib/reporter.mjs`](lib/reporter.mjs) | The finding shape, and both output formats |
| [`lib/repo.mjs`](lib/repo.mjs) | Walking the repository, reading files, offset-to-line arithmetic |
| [`lib/markdown.mjs`](lib/markdown.mjs) | Masking code, and reading headings and links out of Markdown |
| [`lib/slug.mjs`](lib/slug.mjs) | GitHub's heading-anchor rules |
| [`lib/schema-map.mjs`](lib/schema-map.mjs) | Which schema validates which data file |
| [`lib/checks/`](lib/checks/) | One file per check, each exporting `run(context)` |
| [`tests/`](tests/) | `node:test` unit tests |
| [`__fixtures__/`](__fixtures__/) | Two miniature repositories: one in order, one broken on purpose |

`__fixtures__/broken-repo/` breaks every rule the checks enforce, and `__fixtures__/clean-repo/`
breaks none, so the tests prove both that a check fires and that it does not fire spuriously. Both
are excluded from the checks when the root is this repository — see `IGNORED_PREFIXES` in
[`lib/repo.mjs`](lib/repo.mjs).

## Extending a check

A check is a module exporting `run(context)` that returns
`{ name, findings, stats }`; `context.root` is the repository root, which the tests point at a
fixture. Build findings with `error()` and `warning()` from
[`lib/reporter.mjs`](lib/reporter.mjs), give each one a `file` and a `line` wherever the position is
knowable, and write the message so a reader can act on it without opening the validator. Register
the check in `CHECKS` in [`validate.mjs`](validate.mjs), add an `npm` script for it, cover its
failure path against `__fixtures__/broken-repo/`, and confirm `__fixtures__/clean-repo/` stays
silent.
