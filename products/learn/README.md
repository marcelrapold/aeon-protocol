# AEON Learn

> [!NOTE]
> **Management summary.** AEON Learn is the first official AEON workflow: it turns "teach me X" into a researched, dependency-ordered, adaptive learning journey executed by the user's own agent. This directory is the complete product — the agent entry contract, the normative umbrella specification, one specification per phase, the format renderers and the canonical reference fixture. There is no backend and no content API; a capable agent plus these files is the product.

The canonical invocation:

```text
Teach me Austrian Economics using learn.rapold.io
```

AEON Learn builds on the AEON protocol core ([`../../protocol/`](../../protocol/)): capability negotiation, research discipline, epistemics, state and interoperability apply in full. Any subject works — predefined topic packages ([`../../library/`](../../library/)) accelerate known subjects but never limit the protocol.

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
- **Machine-readable contracts** live in [`../../schemas/`](../../schemas/); behavioural conformance tests in [`../../evals/learn/`](../../evals/learn/).
