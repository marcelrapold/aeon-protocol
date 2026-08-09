# Changelog

> [!NOTE]
> **Management summary.** This file records every notable change to the ÆON specification, the
> deep-dive library and the invocation surface. The format follows
> [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project follows
> [semantic versioning](https://semver.org/spec/v2.0.0.html): breaking a `MUST` is a major bump,
> adding requirements is minor, editorial fixes are patch. Every released version is an annotated
> Git tag that agents pin their fetches to.

## [Unreleased]

## [0.3.0] - 2026-08-09

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

[Unreleased]: https://github.com/marcelrapold/aeon-protocol/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/marcelrapold/aeon-protocol/compare/v0.1.2...v0.2.0
[0.1.2]: https://github.com/marcelrapold/aeon-protocol/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/marcelrapold/aeon-protocol/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/marcelrapold/aeon-protocol/releases/tag/v0.1.0
