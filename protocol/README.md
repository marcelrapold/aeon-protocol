# ÆON Protocol — core specifications

Governs the product-independent behaviour every conforming ÆON agent shares, whatever model, vendor or product it runs on.

> [!NOTE]
> **Management summary.** The ÆON protocol defines how an AI agent turns an ambiguous human intention into a structured, researched, verifiable and progressively executed cognitive workflow. These seven documents are the product-independent core. Products such as [ÆON Learn](../products/learn/specification.md) build on them and add workflow-specific requirements.

The user's own agent is the runtime, the website is the invocation surface, and this repository is the specification. The core specs define the behaviour every conforming agent shares, regardless of vendor or product.

These are reference documents with explanatory passages where the reasoning is load-bearing. None of them is a tutorial. If you implement an agent, read them in the order given. If you build a product on the core, start at the [ÆON Learn product overview](../products/learn/README.md) and follow its links back here.

## Reading order

Read in order — each document assumes the ones before it.

| # | Specification | Defines | Requirement IDs |
|---|---|---|---|
| 1 | [core.md](core.md) | Vision, terminology, normative vs capability-dependent behaviour, design principles | `CORE-n` |
| 2 | [capabilities.md](capabilities.md) | Capability vocabulary, detection before reliance, graceful degradation | `CAP-n` |
| 3 | [orchestration.md](orchestration.md) | The workflow pipeline, anti-megaprompt architecture, phase ordering | `ORCH-n` |
| 4 | [research.md](research.md) | Research before generation, source tiers, evidence map | `RES-n` |
| 5 | [epistemics.md](epistemics.md) | Epistemic labels, counterpositions, calibration | `EPI-n` |
| 6 | [state.md](state.md) | Journey state machine, learner state, resumable degradation | `STA-n` |
| 7 | [interoperability.md](interoperability.md) | Model independence, invocation convention, bootstrap discovery, tag pinning | `INT-n` |

## What builds on this core

| Surface | Purpose |
|---|---|
| [ÆON Learn](../products/learn/README.md) | The first official workflow, instantiating the pipeline as a learning journey |
| [Machine-readable schemas](../schemas/) | JSON Schemas for the artefacts these specifications describe |
| [Behavioural evals](../evals/learn/) | Conformance tests that reference the requirement IDs directly |

## Versioning

These documents version together as **ÆON Protocol 0.3.0** under semantic versioning: breaking a strict requirement is a major bump, adding requirements is minor, editorial fixes are patch (see the [contribution guide](../CONTRIBUTING.md)). Requirement IDs are stable and never reused after removal, so evals and issues can reference them across versions. Agents fetch these files via URLs pinned to an immutable release tag, never from a moving branch — see [interoperability.md](interoperability.md).
