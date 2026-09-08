# Changelog

> [!NOTE]
> **Management summary.** This file records every notable change to the ÆON specification, the
> deep-dive library and the invocation surface. The format follows
> [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project follows
> [semantic versioning](https://semver.org/spec/v2.0.0.html): breaking a `MUST` is a major bump,
> adding requirements is minor, editorial fixes are patch. Every released version is an annotated
> Git tag that agents pin their fetches to.

## [Unreleased]

A repository-quality sweep. The specification content is unchanged in intent; what changes is that
the repository now checks its own claims mechanically, states its threat model, and gives a
contributor one command that reproduces the gate continuous integration runs.

<!-- TODO(orchestrator): before tagging, replace each "TODO" marker below with the specifics from
     the sibling changes, and delete any bullet whose work did not land. Do not invent a version
     number or a release date here; the release commit adds the heading and the comparison link. -->

### Added

- A validation toolchain in `tools/`, driven by npm scripts from the repository root:
  `npm run validate` runs the whole specification gate, and one check each for the JSON Schemas,
  YAML house style, relative links and heading fragments, library cross-references, and the
  registry of requirement identifiers. `npm test` unit-tests the validators themselves, so a
  passing check is a check that works.
  <!-- TODO(orchestrator): name any check the toolchain gained after this entry was written. -->
- Continuous integration for the specification, not only for the website: the specification gate
  reports every check as its own status on the two supported Node versions; the documentation
  workflow adds house-style checks for encoding, line endings, trailing whitespace, tabs and
  emojis; a security workflow scans the full history for secrets, lints the workflows and rejects
  any action that is not pinned to a commit digest; and static analysis covers the invocation
  surface, the only executable code this repository ships.
- A JSON Schema for eval cases, so a behavioural case is checked for shape and identifier syntax
  the same way a curriculum or a manifest is.
  <!-- TODO(orchestrator): confirm the schema count stated in schemas/README.md and README.md match. -->
- An `.editorconfig` that matches what `.gitattributes` and the house-style checks already enforce:
  UTF-8, LF, a final newline, no trailing whitespace and two-space indentation, with the frozen
  Charisma fixture exempt.
- `scripts/README.md`, documenting the release procedure, every pin site the version bump touches,
  and why the fixture splitter is kept.
- A `--check` mode for both scripts: `bump-version.mjs --check` proves that every agent-facing URL,
  version banner and version constant names the same tag, and `split-charisma.mjs --check` proves
  the derived Charisma sessions are still exact slices of the preserved source. Neither writes
  anything.
- Two architecture decision records for decisions the repository had already made without
  recording them: [ADR 0004](docs/decisions/0004-no-runtime.md) on shipping no runtime, and
  [ADR 0005](docs/decisions/0005-markdown-plus-json-schema.md) on Markdown for requirements and
  JSON Schema for data shapes. `docs/decisions/template.md` makes the record format copyable.
- A repository quality gates section in the README, and a security threat model, a prompt-injection
  section and a safe-harbour statement in `SECURITY.md`.
  <!-- TODO(orchestrator): add anything the site or evals gained that a reader would look for here. -->

### Changed

- `scripts/bump-version.mjs` is now release-safe. It counts every pin site before substituting,
  verifies afterwards that no stale tag or banner survived, and writes nothing at all unless every
  file passes, so a partly re-pinned release can no longer be tagged.
- `CONTRIBUTING.md` is rewritten around the npm gate: how to set up a clean clone, what each check
  enforces, how to read a failing check, and a worked specification change from issue form to
  merged pull request.
- The pull-request template requires the requirement identifiers touched, the version impact, the
  observable behaviour change, and pasted output from the local gate rather than a ticked box.
- The issue forms ask for what review actually needs: how an eval would score a proposed
  requirement and which alternatives were rejected; whether a library proposal is a new package or
  a change to an existing one, and what it overlaps; and how many fresh sessions reproduced a
  conformance violation. The conformance form asks for the eval case id rather than offering a
  hard-coded list that goes stale every time a case is added.
- **`RES-8` binds unconditionally.** It required an internal evidence map "for every sufficiently
  substantial subject", a qualifier no eval could falsify: an agent could waive the map by
  assertion. The map is now required for every journey, and how much it holds scales with the
  subject instead. **This changes what a `MUST` demands, so the release that carries it is a major
  one.** An agent that relied on the qualifier to skip the map no longer conforms.
- `ORCH-3` no longer contradicts itself. It required each phase to consume the artefact of the
  phase before it, which the first phase cannot do; it now applies to every phase after the first,
  and the pipeline states that the invocation is the input to phase 1 rather than a phase.
- `STA-8` cited `INT-6` where it meant `INT-8`. The document's own reference table and the learner
  schema both already said `INT-8`.
- Twenty-eight requirement identifiers were added across the protocol and ÆON Learn, all additive.
  They cover behaviour that was previously specified nowhere: what conformance to the core means
  and how a product layers on it, a capability that cannot be determined or that disappears
  mid-workflow, rejection at the contract gate where silence is not approval, a recalled citation
  presented as retrieved, an unreadable resumable state block, a failed bootstrap fetch, weak
  evidence, a missing research capability, and a learner who pauses or abandons. Several others
  were normative in wording but anonymous, and now carry identifiers evals can reference.
- `REN-POD-1` no longer contradicts the repository's own worked example. It asked for 750 to 1,200
  words per podcast script where the Charisma manuscripts run 227 to 387 German words. Duration is
  now the target and the word count a language-dependent indication.
- The bootstrap lists all eight completion parts `LEARN-14` requires. It listed six, so an agent
  running on the bootstrap alone — which `INT-6` explicitly supports — silently omitted the
  assessment and the recommended next learning path.
- The core no longer names model vendors as runtimes the protocol works with. Named runtimes are
  test baselines under `INT-2`, never dependencies.
- The JSON Schemas describe the requirements they enforce. All declare draft 2020-12, every
  property says what it is for and names the requirement behind it, and constraints the
  specifications already implied are now checked: a lesson's ten slots are all required and
  non-empty, because an empty boundary defeats `LEARN-S-6`; a curriculum module requires evidence,
  counterposition and example; package identifiers, learning paths and related packages match the
  library's slug pattern; person lenses have a real shape with a tier enumeration; and the learner
  profile's eleven discovery dimensions are named and typed rather than an untyped object. Every
  instance in the repository still validates, and eleven deliberately invalid documents are
  rejected.
- Every schema `$id` points at the host agents actually fetch from. They pointed at
  `learn.rapold.io`, which by [ADR 0002](docs/decisions/0002-llms-txt-bootstrap.md) serves no
  specification files. The path deliberately does not pin a tag: a pinned `$id` would rename every
  schema at each release and add a fourth pin site the version bump does not know about.
- Eighteen curated list items across ten library packages are visible again. Unquoted prose
  containing a colon and a space — `- decision hygiene: the reserve clause and the archer model` —
  was parsed as a single-key mapping rather than a string, and the invocation surface filters list
  entries by `typeof v === "string"`, so every one of those lines was dropped from the rendered
  topic page with no error and no warning. All eighteen are now quoted, byte-identical in text.
- One concept has one name across the library. `tier_reason`, `tier_note` and `tier_rationale` each
  meant, verbatim from their own file headers, "one line stating why the entry sits in that tier";
  587 keys across eleven packages now use `tier_rationale`, the name the library README documents.
- Three catalogue statements matched the data for the first time: not every technology package
  carries the alignment note the README claimed; `software-architecture` is not "mostly tier 3" but
  tied, eighteen entries at tier 3 against eighteen at tier 1; and the manifest anatomy omitted
  `description`, which twenty-seven manifests carry and the site renders.
- TODO(orchestrator): the invocation surface was hardened.
  <!-- Name what changed for a visitor or for an agent: security headers, dependency updates,
       accessibility, and anything affecting /llms.txt. -->
- TODO(orchestrator): the eval suite was expanded.
  <!-- Name the new cases and the requirements they score. -->

### Fixed

- README drift against the repository as it now is: the directory map lists the validation
  toolchain, the component table no longer undercounts the JSON Schemas or the eval cases, the
  supporting-directory paragraph matches what is actually there, and a malformed line break in the
  architecture diagram no longer risks rendering as literal text.
- `CONTRIBUTING.md` no longer tells contributors to lint with globs that differ from the ones
  continuous integration uses, which made a locally clean tree fail in CI and the reverse.
- `bump-version.mjs` no longer leaves the version banner in the bootstrap and in `llms.txt` reading
  the previous release. It matched only `vX.Y.Z` occurrences, so the bare `ÆON Learn x.y.z ·
  ÆON Protocol x.y.z` line silently kept the old version at every release.
- The changelog's `Unreleased` comparison link pointed at `v0.2.0`, and `0.3.0` had no comparison
  link at all.
- `.gitignore` covers the repository-root `node_modules/` that the validation toolchain installs,
  along with audit, coverage and packaging artefacts; `.gitattributes` marks both lockfiles as
  generated so they stay out of diffs.

### Security

- `SECURITY.md` now states the threat model explicitly — the text an agent obeys, the path from an
  invocation to that text, and the invocation surface — and covers prompt injection as a first-class
  risk: injection through merged repository content, through a cited source an agent fetches during
  research, and through learner input that impersonates the protocol. It records what the project
  does about each and what an implementer must do, and adds a safe-harbour statement for good-faith
  research.

## [0.3.0] — 2026-08-09

### Added

- Sixteen further deep-dive library packages, taking the library to thirty packages presented in
  five groups: economy and money, thinking and evidence, technology and cryptography, people and
  mind, and body and habits.
- Repository health files: this changelog, a security policy, issue forms for a specification
  change, a library package proposal and a conformance report, plus a pull-request template.
- Localised invocation examples and per-package copy prompts on the invocation surface.

### Changed

- The README follows the documented head-matter order: value proposition, badge row, management
  summary, architecture diagram and table of contents, followed by a component overview and a
  Diátaxis documentation map.
- The code of conduct names a direct reporting address instead of pointing at the repository
  profile.
- The invocation surface gains a knowledge-constellation hero canvas, a visible ligature glitch and
  dedicated wide-display and laptop layout tiers.
- Every specification declares version 0.3.0, so a component version now matches the release tag
  agents pin their fetches to.

### Fixed

- The documentation workflow no longer lints the byte-preserved Charisma fixture, which
  `CONTRIBUTING.md` freezes and which therefore could never be linted into compliance.
- Documentation corrections found by auditing the repository against the
  [documentation standard](https://github.com/marcelrapold/auditor/blob/main/DOCUMENTATION-STANDARD.md):
  the schema workflow does not guard schema-only changes, the version-bump script pins three files
  rather than every URL occurrence, the invocation surface serves six routes rather than two, and
  the library manifest field list matches the schema.

## [0.2.0] — 2026-08-09

### Added

- Eleven further library packages, growing the deep-dive library from three to fourteen: the
  person-lens subjects `personality-psychology`, `mindfulness-meditation` and
  `first-principles-thinking`, plus `game-theory`, `monetary-history`, `cryptography`,
  `systems-thinking`, `stoicism`, `negotiation`, `sleep-science` and `habit-formation`. Every
  package ships tier-classified real sources, a dependency-ordered knowledge map and
  evidence-backed misconception debunks.
- The person-lens pattern, documented in `library/README.md`: a lens is framing, not authority, and
  the person's popular work is tiered honestly.
- Mermaid diagrams: the journey flowchart in the README and the state diagram in
  `protocol/state.md`.
- A journey graph in the method section of the invocation surface.

### Changed

- Agent-facing raw URLs re-pinned to `v0.2.0` in `products/learn/bootstrap.md`,
  `site/learn/public/llms.txt` and `site/learn/lib/content.ts`.
- The invocation surface hero gained an orchestrator terminal, and the violet hue now carries
  through the whole page; the journey section uses a two-column layout on large screens.

## [0.1.2] — 2026-08-09

### Added

- Browser-language detection on the invocation surface: `/` redirects to `/de` for German-first
  browsers, and an explicit toggle choice always wins over detection.

### Changed

- The agent bootstrap defaults to the user's conversation language instead of the language of the
  invocation sentence.
- Agent-facing raw URLs re-pinned to `v0.1.2`.

### Fixed

- Step-number overlap in the method section of the invocation surface.

## [0.1.1] — 2026-08-09

### Added

- Git-integrated automatic deployment documented in `site/learn/README.md`.

### Changed

- Brand spelling: `AEON` becomes `ÆON` throughout the prose. Slugs, URLs and the byte-preserved
  fixture originals stay ASCII and unchanged.
- Agent-facing raw URLs re-pinned to `v0.1.1`.

## [0.1.0] — 2026-08-09

Initial public release of ÆON Protocol 0.1.0 and ÆON Learn 0.1.0.

### Added

- The seven normative protocol core specifications: `core`, `capabilities`, `orchestration`,
  `research`, `epistemics`, `state` and `interoperability`, each carrying stable requirement
  identifiers.
- ÆON Learn: the agent bootstrap contract, the umbrella specification with requirements
  `LEARN-1`…`LEARN-14`, seven phase specifications, and the podcast, presentation and article
  renderers.
- The Charisma Sprint origin fixture: fourteen daily sessions, the compiled curriculum, the source
  map, a retrospective and the byte-preserved original documents.
- Three deep-dive library packages: `austrian-economics`, `bitcoin` and `charisma`.
- Five JSON Schemas (draft 2020-12) for capability profiles, learner state, curricula, lessons and
  topic-package manifests.
- Six behavioural eval cases plus the protocol-compliance scoring rubric.
- The invocation surface at `learn.rapold.io`: a static Next.js site in English and Swiss German
  that serves the agent bootstrap at `/llms.txt`.
- Repository foundations: the Apache-2.0 license, contribution guide, code of conduct, three
  architecture decision records, and the docs and site continuous-integration workflows.

[Unreleased]: https://github.com/marcelrapold/aeon-protocol/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/marcelrapold/aeon-protocol/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/marcelrapold/aeon-protocol/compare/v0.1.2...v0.2.0
[0.1.2]: https://github.com/marcelrapold/aeon-protocol/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/marcelrapold/aeon-protocol/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/marcelrapold/aeon-protocol/releases/tag/v0.1.0
