# ÆON Learn

Turns "teach me X" into a researched, dependency-ordered, adaptive learning journey that the user's own agent executes.

> [!NOTE]
> **Management summary.** ÆON Learn is the first official ÆON workflow: it turns "teach me X" into a researched, dependency-ordered, adaptive learning journey executed by the user's own agent. This directory is the complete product — the agent entry contract, the normative umbrella specification, one specification per phase, the format renderers and the canonical reference fixture. There is no backend and no content API; a capable agent plus these files is the product.

The canonical invocation:

```text
Teach me Austrian Economics using learn.rapold.io
```

ÆON Learn builds on the [ÆON protocol core](../../protocol/README.md): capability negotiation, research discipline, epistemics, state and interoperability apply in full. Any subject works — predefined [topic packages](../../library/) accelerate known subjects but never limit the protocol.

This directory holds reference documents. Each phase specification states normative requirements with stable identifiers and explains the reasoning where it is load-bearing; none of them is a tutorial. The worked, end-to-end illustration is the [Charisma Sprint fixture](examples/charisma/).

## Directory map

| Path | Content | ID prefix |
|---|---|---|
| [bootstrap.md](bootstrap.md) | Agent entry contract — the compressed operational form, served at `learn.rapold.io/llms.txt` | — |
| [specification.md](specification.md) | Normative umbrella: conformance, core requirements, definition of done | `LEARN` |
| [discovery.md](discovery.md) | Learner discovery — the eleven-dimension learner model | `LEARN-D` |
| [research.md](research.md) | Subject research — the evidence map | `LEARN-R` |
| [knowledge-map.md](knowledge-map.md) | Knowledge mapping — the dependency graph | `LEARN-K` |
| [curriculum.md](curriculum.md) | Curriculum compiler and learning contract | `LEARN-C` |
| [session.md](session.md) | Canonical session anatomy | `LEARN-S` |
| [adaptation.md](adaptation.md) | Adaptation and retrieval | `LEARN-A` |
| [assessment.md](assessment.md) | Assessment and completion | `LEARN-AS` |
| [renderers/](renderers/) | Podcast, presentation and article renderers | `REN` |
| [examples/charisma/](examples/charisma/) | The Charisma Sprint — canonical reference fixture and origin case | — |

## Reading order

- **Agents** execute [bootstrap.md](bootstrap.md) and fetch phase specifications on demand via release-tag-pinned URLs.
- **Implementers and reviewers** start with [specification.md](specification.md), which assigns the umbrella requirements `LEARN-1…14`, then read the phase specifications it delegates to.
- **Schema and eval authors** work from the [machine-readable schemas](../../schemas/) and the [behavioural conformance tests](../../evals/learn/), both of which reference the requirement identifiers directly.

## Related specifications

| Surface | Relation |
|---|---|
| [ÆON protocol core](../../protocol/README.md) | The product-independent requirements ÆON Learn inherits in full |
| [Orchestration](../../protocol/orchestration.md) | The phase pipeline this product instantiates |
| [State](../../protocol/state.md) | The journey state machine every phase specification refers to |
| [Topic package library](../../library/) | Optional accelerators for known subjects |
