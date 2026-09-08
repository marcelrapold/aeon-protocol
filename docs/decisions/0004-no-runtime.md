# ADR 0004 — The protocol ships no runtime

Why this repository specifies agent behaviour instead of shipping software that performs it.

- **Status:** accepted
- **Date:** 2026-09-08
- **Governs:** the whole repository — [`protocol/`](../../protocol/README.md),
  [`products/learn/`](../../products/learn/README.md), the non-goals in the
  [ÆON Learn specification](../../products/learn/specification.md), and the static
  [invocation surface](../../site/learn/README.md)

This record documents a decision the repository has followed since its first public release. It is
written down now because the reasoning was implicit in the specifications rather than recorded.

## Context

An orchestrated learning workflow needs a runtime: something has to ask the discovery questions,
research the subject, compile the curriculum and deliver the sessions. There were two ways to
supply one.

The first is to build it: a hosted service that holds accounts, calls a model vendor's API, stores
learner state, and serves lessons. That is the shape most learning products take, and it makes the
behaviour easy to guarantee, because the project controls the code.

The second is to specify it and let the user's own agent be the runtime. Every capable agent
already has the primitives the workflow needs — conversation, web research, file generation, and in
some cases memory and scheduling. What they lack is agreement about what to do with them.

Two forces pushed hard toward the second. Model independence is a founding requirement (`CORE-1`,
`INT-1`), and a hosted runtime picks a vendor by construction: whichever model the backend calls
becomes the behaviour, and the vendor-neutral contract becomes marketing. And a hosted runtime
would hold learner data — what someone does not know, what they are trying to become — which is
the most sensitive material this project could possibly touch, and which it has no need to see.

## Decision

ÆON ships no runtime. The user's own agent is the runtime, and this repository is the
specification it follows.

- [`protocol/core.md`](../../protocol/core.md) defines the agent as the runtime and states that
  ÆON ships none of its own.
- The invocation surface serves an entry contract and nothing else: no accounts, no backend, no
  content API. `INT-9` forbids requiring a plugin, an account or a vendor integration to invoke a
  workflow.
- The [non-goals](../../products/learn/specification.md) exclude accounts, proprietary backends,
  learning-management features, progress dashboards and any central learner database — not as a
  scope cut to be revisited when there is time, but as the consequence of this decision.
- Conformance is therefore behavioural: it is observed in a transcript and scored against
  requirement identifiers ([`evals/learn/`](../../evals/learn/README.md)), because there is no
  implementation to test.

The rejected alternative is the hosted runtime. It buys control over behaviour at the cost of the
two properties the protocol exists to have: independence from any one model vendor, and holding
none of the learner's data.

## Consequences

- Nothing the project runs can leak a learner's data, because the project never receives any.
  Learner state lives in the user's session, which is why
  [`protocol/state.md`](../../protocol/state.md) specifies it as portable rather than hosted.
- Adoption costs nothing: anyone with an agent can run the protocol today, and any vendor can
  implement it without permission.
- The project cannot guarantee behaviour. It can only specify it, test it against several runtimes
  (`INT-2`) and report non-conformance. An agent that ignores a `MUST` is a conformance failure,
  not a bug the project can fix in code.
- Quality varies with the runtime. A capable agent produces a much better journey than a weak one,
  and the specification's answer is graceful degradation and honest disclosure rather than a
  guaranteed floor.
- The specification text becomes the security surface, because it is the only thing the project
  ships that changes what an agent does. [`SECURITY.md`](../../SECURITY.md) is written around that
  rather than around a server.
- There is no telemetry, so the project learns about failures only when someone files a conformance
  report. The [conformance report form](../../.github/ISSUE_TEMPLATE/conformance-report.yml) exists
  because it is the only feedback channel there is.
