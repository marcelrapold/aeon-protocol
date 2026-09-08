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
| [0004](0004-no-runtime.md) | The protocol ships no runtime | Accepted | 2026-09-08 | The whole repository: [the protocol core](../../protocol/README.md), the non-goals of [ÆON Learn](../../products/learn/specification.md), [the invocation surface](../../site/learn/README.md) |
| [0005](0005-markdown-plus-json-schema.md) | Markdown for requirements, JSON Schema for data shapes | Accepted | 2026-09-08 | [protocol/](../../protocol/README.md), [products/learn/](../../products/learn/README.md), [schemas/](../../schemas/README.md), [tools/](../../tools/) |

## Record format

Each record is one Markdown file named `NNNN-short-slug.md`, and [`template.md`](template.md) is the copy-and-fill version of it. Every record has the same five parts:

1. **Title and subtitle** — `ADR NNNN — the decision in one line` in sentence case, followed by one sentence saying what the record settles.
2. **Metadata** — status and date as a bullet list, plus the artefacts the decision governs.
3. **Context** — the forces that made a decision necessary, without the answer.
4. **Decision** — what the project now does, and the alternative it rejected.
5. **Consequences** — what the project gains, and what it has to live with.

Statuses are `proposed`, `accepted`, `superseded by ADR NNNN` or `deprecated`. Records are append-only: to reverse a decision, add a new record and mark the old one superseded rather than editing history. `template.md` is not a record and carries no number, so it does not appear in the index.

A record may be written after the fact, for a decision the repository has visibly already made. Say so in the record rather than back-dating it: the date is when the reasoning was written down, and the decision it describes must be recoverable from the repository, never reconstructed from memory.

## Add a record

1. Copy [`template.md`](template.md) to `NNNN-short-slug.md` and take the next free number.
2. Write the context before the decision, so the reasoning survives even if the decision changes.
3. Name the alternative you rejected and the property that decided against it. A record with no rejected alternative is a description, not a decision.
4. Name the consequences you dislike as well as the ones you want; an ADR without a cost is usually not a decision.
5. Link the record from this document's index table, and from any document the decision constrains.
6. Open a pull request per [the contribution guide](../../CONTRIBUTING.md).
