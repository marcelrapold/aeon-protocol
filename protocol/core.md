# ÆON Protocol — core

Governs the vision, the shared vocabulary and the distinction between normative and capability-dependent behaviour that every other ÆON specification builds on.

> [!NOTE]
> **Management summary.** ÆON is an open, model-agnostic protocol for agent-orchestrated cognitive workflows. It does not primarily provide content: it defines how an AI agent transforms an ambiguous human intention into a structured, researched, verifiable and progressively executed workflow. This document fixes the vision, the terminology, and the load-bearing distinction between normative and capability-dependent behaviour. Version: ÆON Protocol 0.3.0.

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY are to be interpreted as described in RFC 2119 and RFC 8174.

Read this reference first: every sibling specification uses the terminology defined here, and every product specification inherits `CORE-1` to `CORE-5`. If you implement an agent, you satisfy these requirements before you satisfy any workflow-specific ones.

## Contents

- [Vision](#vision)
- [Terminology](#terminology)
- [Normative vs capability-dependent behaviour](#normative-vs-capability-dependent-behaviour)
- [Design principles](#design-principles)
- [Sibling specifications](#sibling-specifications)

## Vision

The website is not the intelligence. The website is the protocol entry point. The agent remains the execution environment — ÆON specifies how that execution must occur.

The first official workflow is [ÆON Learn](../products/learn/specification.md). Its canonical invocation:

```text
Teach me Austrian Economics using learn.rapold.io
```

The same invocation principle works conceptually with ChatGPT, Claude, Gemini, future general-purpose agents, local agents capable of web retrieval, and agent frameworks implementing the protocol. What varies between runtimes is capability, never the normative workflow.

**CORE-1** — ÆON MUST NOT depend on proprietary behaviour of one specific model vendor. Model independence is specified in [interoperability.md](interoperability.md).

**CORE-2** — ÆON specifications define behaviour, not fixed prose. Illustrative wording in any ÆON document MUST NOT be treated as required output text; requirements bind what the agent does, not the sentences it says.

## Terminology

- **Agent** — the user's own AI agent: the *runtime*. ÆON ships no runtime of its own; the agent executes the protocol with whatever capabilities it actually has.
- **Website** — the *invocation surface* (for ÆON Learn: `learn.rapold.io`): the protocol entry point that serves the agent bootstrap. It hosts no accounts, no backend, no content API.
- **Repository** — the *specification*: the normative, versioned, release-tagged definition of behaviour. This repository is that specification.
- **Workflow** — a named cognitive workflow specified as an ÆON product (first: ÆON Learn).
- **Capability** — a runtime ability (web research, scheduling, audio generation, …) that exists for protocol purposes only once verified ([capabilities.md](capabilities.md)).
- **Phase** — one ordered step of a workflow pipeline, with an explicit state and an artefact it produces ([orchestration.md](orchestration.md), [state.md](state.md)).

## Normative vs capability-dependent behaviour

**CORE-3** — Every ÆON workflow specification and every conforming agent MUST distinguish **normative behaviour** (what every conforming agent does, on every runtime) from **capability-dependent behaviour** (what an agent offers only after verifying the capability).

Normative example:

```text
Before constructing a curriculum, identify the learner's
existing knowledge, objective, available time and desired depth.
```

Capability-dependent examples: browse the web, schedule recurring sessions, generate audio, generate presentations, create files, persist memory, send notifications, retrieve previous conversations.

**CORE-4** — An agent MUST detect capabilities before relying on them and MUST NOT hallucinate unavailable capabilities. Detection mechanics and degradation duties are specified in [capabilities.md](capabilities.md).

## Design principles

The protocol's priority ladder, verbatim:

```text
Research > generation
Understanding > completion
Retrieval > rereading
Application > passive consumption
Epistemic calibration > false certainty
Adaptation > fixed curriculum
Protocol > platform lock-in
```

**CORE-5** — When requirements, implementation choices or adaptations conflict, agents and specification authors SHOULD resolve the conflict toward the left-hand side of each line.

## Sibling specifications

| Specification | Read it for |
|---|---|
| [capabilities.md](capabilities.md) | The ten capability keys, detection duty and graceful degradation (`CORE-4`) |
| [orchestration.md](orchestration.md) | The phase pipeline and its artefacts (`Phase`) |
| [research.md](research.md) | Research before generation, the four source tiers, the evidence map |
| [epistemics.md](epistemics.md) | The six epistemic labels, counterpositions and calibration |
| [state.md](state.md) | The journey state machine and the learner-state model |
| [interoperability.md](interoperability.md) | Model independence, invocation, bootstrap discovery and tag pinning (`CORE-1`) |

The first product built on this core is [ÆON Learn](../products/learn/specification.md); its directory overview is the [ÆON Learn product overview](../products/learn/README.md).
