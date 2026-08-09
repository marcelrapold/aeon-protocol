# ADR 0001 — Apache-2.0 license

Why the whole repository, specifications included, ships under Apache-2.0.

- **Status:** accepted
- **Date:** 2026-08-09
- **Governs:** [LICENSE](../../LICENSE) and every published file in this repository

## Context

The protocol only matters if other people and vendors adopt it. Adoption needs a permissive licence, and a protocol additionally benefits from patent safety for implementers: anyone who builds a conforming runtime should not have to weigh patent exposure before starting.

## Decision

Apache-2.0 applies to the whole repository — specifications, schemas, fixtures and website alike. The website project declares the same licence in its `package.json`, so a copy of the site carries the licence with it.

The obvious alternative, MIT, is shorter and more familiar but grants no patent rights and defines no attribution mechanism for derived works. For a specification that vendors are meant to implement, the patent grant is the deciding difference.

## Consequences

- Commercial implementations are allowed without further permission.
- The explicit patent grant protects implementers.
- Attribution survives in derived works via the NOTICE mechanism. This repository ships no `NOTICE` file today; adding one later is a compatible change.
- Contributions arrive under the same terms by default, per section 5 of the licence, so [the contribution guide](../../CONTRIBUTING.md) needs no separate contributor agreement.
