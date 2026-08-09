# ADR 0002 — Static llms.txt as the agent bootstrap

- **Status:** accepted
- **Date:** 2026-08-09

## Context

Agents pointed at `learn.rapold.io` need an obvious, machine-readable entry. The sibling project auditor.rapold.io proved a pattern: a plain static `public/llms.txt` that assigns the agent a role and points at specification files via GitHub raw URLs pinned to a release tag.

## Decision

- `site/learn/public/llms.txt` is the canonical agent bootstrap, served statically — no route handler, no rewrite.
- Its content mirrors `products/learn/bootstrap.md` (the normative source of truth).
- Specifications are fetched by agents from `raw.githubusercontent.com/marcelrapold/aeon-protocol/<tag>/…`, never from a moving branch. The website itself serves no markdown.
- `scripts/bump-version.mjs` re-pins all URL occurrences on release.

## Consequences

- Zero infrastructure; the site stays fully static.
- Version pinning makes agent behaviour reproducible per release.
- Two files (`bootstrap.md`, `llms.txt`) must stay in sync; the site's test suite asserts this.
