# ADR 0003 — Requirements bundle stays out of the repository

Why the original requirements bundle stays local, and what the published fixture carries in its place.

- **Status:** accepted
- **Date:** 2026-08-09
- **Governs:** the Charisma fixture in [`products/learn/examples/charisma/`](../../products/learn/examples/charisma/README.md) and the exclusion rule in [`.gitignore`](../../.gitignore)

## Context

The project started from a local requirements bundle (`aeon-protocol-requirements-bundle/`) containing the master requirements, a work order, a proposed scaffold and the raw Charisma reference assets — including two PowerPoint decks and a screenshot of the third-party Instagram advertisement that triggered the original sprint.

Publishing the bundle would mean publishing superseded prose next to the specifications that replaced it, plus third-party ad creative whose copyright status is not the project's to resolve.

## Decision

The bundle directory is excluded via `.gitignore` and never published.

- Normative content lives in `protocol/` and `products/`; the specifications supersede the requirements prose.
- The three Charisma Markdown sources are preserved byte-identical under [`products/learn/examples/charisma/original/`](../../products/learn/examples/charisma/original/).
- The two PowerPoint decks and the advertisement screenshot remain local. The screenshot shows third-party ad creative, and publishing it would raise copyright questions without adding specification value. Its provenance role is documented in the fixture's [source map](../../products/learn/examples/charisma/source-map.md) instead.

## Consequences

- The public history is clean from the first commit.
- The published fixture documents in text everything the excluded binaries would have shown, including why the sprint runs for exactly fourteen days.
- Where the bundle's proposed session list conflicts with the preserved material, the preserved material wins and the conflict is documented rather than silently resolved — see the deviation section of the [source map](../../products/learn/examples/charisma/source-map.md).
- Anyone auditing provenance must take the fixture's word for the excluded assets. That cost is accepted; the alternative is republishing someone else's advertisement.
