# ADR 0002 — Static llms.txt as the agent bootstrap

Why agents enter the protocol through one static text file, and fetch every specification from an immutable tag.

- **Status:** accepted
- **Date:** 2026-08-09
- **Governs:** [bootstrap.md](../../products/learn/bootstrap.md), [`site/learn/public/llms.txt`](../../site/learn/public/llms.txt), and the release pinning in [`scripts/bump-version.mjs`](../../scripts/bump-version.mjs)

## Context

Agents pointed at `learn.rapold.io` need an obvious, machine-readable entry point. The sibling project auditor.rapold.io proved a pattern: a plain static `public/llms.txt` that assigns the agent a role and points at specification files via GitHub raw URLs pinned to a release tag.

The alternative — serving the specifications from the website — would make agent behaviour depend on whatever the site happened to serve at the moment of invocation, which is exactly what a versioned protocol must avoid.

## Decision

- `site/learn/public/llms.txt` is the canonical agent bootstrap, served statically. No route handler, no rewrite.
- Its content mirrors [bootstrap.md](../../products/learn/bootstrap.md), which remains the normative source of truth.
- Agents fetch specifications from `raw.githubusercontent.com/marcelrapold/aeon-protocol/<tag>/…`, never from a moving branch. The website serves no Markdown at all.
- `scripts/bump-version.mjs` re-pins the release tag on release, in exactly three files: `products/learn/bootstrap.md`, `site/learn/public/llms.txt` and `site/learn/lib/content.ts`. Any new file that carries a pinned URL must be added to that list.

## Consequences

- Zero infrastructure: the site stays fully static and needs no backend.
- Version pinning makes agent behaviour reproducible per release.
- Two files must stay in sync. `site/learn/lib/llms-sync.test.ts` asserts that both list the same raw specification URLs, that every URL carries the current tag, and that the bootstrap still names all ten capability keys.
- A file that gains a pinned URL without being added to the bump script drifts silently at the next release. Keeping the list current is a release-time obligation, described in [the site project README](../../site/learn/README.md).
