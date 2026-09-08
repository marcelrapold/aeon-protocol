# ADR 0005 — Specifications are Markdown, data shapes are JSON Schema

Why the normative text is prose in Markdown while the structures it describes are validated by
JSON Schema, and why neither format tries to do the other's job.

- **Status:** accepted
- **Date:** 2026-09-08
- **Governs:** [`protocol/`](../../protocol/README.md),
  [`products/learn/`](../../products/learn/README.md), [`schemas/`](../../schemas/README.md), and
  the validation toolchain in [`tools/`](../../tools/)

This record documents a decision the repository has followed since its first public release. It is
written down now because the division of labour between the two formats is easy to get wrong when
adding a requirement.

## Context

The specification has two kinds of reader. A person reads it to understand and to argue about it. A
capable agent reads it, at fetch time, as the instructions it is about to follow — which is what
makes the choice of format a design decision rather than a preference.

That rules out the usual machine-readable options. A formal specification language would be
precise, but an agent fetching it would have to interpret a notation instead of reading
instructions, and a contributor would have to learn one before proposing a wording change. A
rendered documentation site would read well for people and badly for agents, which need a stable
raw URL rather than a page.

But prose alone is not enough either. The workflow exchanges structures — a capability profile, a
learner state, a compiled curriculum, a delivered lesson, a topic-package manifest, an eval case —
and "the curriculum has modules with prerequisites" is a sentence that cannot be checked. Thirty
library packages and a growing fixture set cannot be kept consistent by reading.

## Decision

Markdown carries the normative requirements; JSON Schema carries the data shapes; each is
authoritative for its own half.

- Every requirement is a sentence in a Markdown file, with an RFC 2119 keyword and a stable
  identifier such as `LEARN-D-2`. Markdown is plain text, so an agent fetching a raw URL gets the
  requirement itself rather than a rendering of it, and a diff of a specification change is legible
  to a reviewer.
- Every structure the runtime exchanges or persists has a JSON Schema (draft 2020-12) in
  [`schemas/`](../../schemas/README.md), so fixtures, evals and tooling can be checked mechanically
  instead of by reading.
- The prose stays normative where the two overlap. The schemas are deliberately looser, because
  in-flight and partially compiled state must still validate; a schema is a structural floor, not a
  restatement of the requirements.
- Consequently a schema never invents a rule. If a schema constrains something the prose does not
  require, the prose is missing a requirement or the schema is wrong.

This is the same separation `CORE-2` already makes inside the prose: requirements bind what the
agent does, not the sentences it says. Extending that, the schemas bind the shape of what it
produces, not the meaning of it.

## Consequences

- Contributing needs no tooling: a text editor and the house style are enough to propose a
  requirement, which keeps the barrier low for the reviewers who matter most, the ones who argue
  about wording.
- Two artefacts must move together. A specification that changes a field and leaves its schema
  behind is the most likely way this repository goes wrong, so it is
  [ground rule 5](../../CONTRIBUTING.md#ground-rules) and a pull-request checklist item rather than
  a convention.
- Markdown cannot enforce anything by itself, so the enforcement lives outside the format: the
  validation toolchain in [`tools/`](../../tools/) checks identifiers, links and cross-references,
  and [`.markdownlint.jsonc`](../../.markdownlint.jsonc) checks structure. Those checks are part of
  the specification's integrity, not developer convenience.
- Requirements remain natural-language, so they can be ambiguous in a way a formal notation could
  not be. The countermeasure is behavioural: every requirement must be observable in a transcript,
  and the [eval cases](../../evals/learn/README.md) are where an ambiguous sentence is found out.
- Nothing generates one artefact from the other. That duplication is accepted: a generated
  specification would read like generated text, and an agent reads this one.
