# Architecture decision records

The decisions that shaped this repository, each with the context that forced it and the consequences it carries.

> [!NOTE]
> **Management summary.** An architecture decision record (ADR) captures one significant, hard-to-reverse choice: why it was needed, what was decided, and what the project now lives with. This directory holds the ADRs for the ÆON Protocol repository. They explain choices the specifications themselves cannot: the licence, how agents reach the specifications, and what deliberately stays out of the public history. Read an ADR when you want to know why something is the way it is; read [the protocol core](../../protocol/README.md) when you want to know what conforming agents must do.

This document is reference. Each ADR it lists is explanation.

## Index

| ADR | Decision | Status | Date | Governs |
|---|---|---|---|---|
| [0001](0001-apache-2-license.md) | Apache-2.0 for the whole repository | Accepted | 2026-08-09 | [LICENSE](../../LICENSE), every published file |
| [0002](0002-llms-txt-bootstrap.md) | A static `llms.txt` is the agent bootstrap | Accepted | 2026-08-09 | [bootstrap.md](../../products/learn/bootstrap.md), [the website](../../site/learn/README.md), release pinning |
| [0003](0003-requirements-bundle-excluded.md) | The requirements bundle stays unpublished | Accepted | 2026-08-09 | The Charisma fixture and its [source map](../../products/learn/examples/charisma/source-map.md) |

## Record format

Each record is one Markdown file named `NNNN-short-slug.md` and follows the same four parts:

1. **Title** — `ADR NNNN — the decision in one line`, in sentence case.
2. **Metadata** — status and date, plus the artefacts the decision governs.
3. **Context** — the forces that made a decision necessary, without the answer.
4. **Decision and consequences** — what the project now does, and what it must live with.

Statuses are `proposed`, `accepted`, `superseded by ADR NNNN` or `deprecated`. Records are append-only: to reverse a decision, add a new record and mark the old one superseded rather than editing history.

## Add a record

1. Copy the structure of an existing record and take the next free number.
2. Write the context before the decision, so the reasoning survives even if the decision changes.
3. Name the consequences you dislike as well as the ones you want; an ADR without a cost is usually not a decision.
4. Link the record from this document's index table, and from any document the decision constrains.
5. Open a pull request per [the contribution guide](../../CONTRIBUTING.md).
