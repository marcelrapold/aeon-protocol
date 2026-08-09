# ADR 0003 — Requirements bundle stays out of the repository

- **Status:** accepted
- **Date:** 2026-08-09

## Context

The project started from a local requirements bundle (`aeon-protocol-requirements-bundle/`) containing the master requirements, a work order, a proposed scaffold and the raw Charisma reference assets, including two PPTX decks and a screenshot of the third-party Instagram advertisement that triggered the original sprint.

## Decision

The bundle directory is excluded via `.gitignore` and never published.

- Normative content lives in `protocol/` and `products/` — the specifications supersede the requirements prose.
- The three Charisma markdown sources are preserved byte-identical under `products/learn/examples/charisma/original/`.
- The PPTX decks and the advertisement screenshot remain local. The screenshot shows third-party ad creative; publishing it would raise copyright questions without adding specification value. Its provenance role is documented in the fixture's `source-map.md` instead.

## Consequences

- Clean public history from the first commit.
- The published fixture documents everything the excluded binaries would have shown, in text form.
