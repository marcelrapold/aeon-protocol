# AEON Protocol — core

> [!NOTE]
> **Management summary.** AEON is an open, model-agnostic protocol for agent-orchestrated cognitive workflows. It does not primarily provide content: it defines how an AI agent transforms an ambiguous human intention into a structured, researched, verifiable and progressively executed workflow. This document fixes the vision, the terminology, and the load-bearing distinction between normative and capability-dependent behaviour. Version: AEON Protocol 0.1.0.

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY are to be interpreted as described in RFC 2119 and RFC 8174.

## Contents

- [Vision](#vision)
- [Terminology](#terminology)
- [Normative vs capability-dependent behaviour](#normative-vs-capability-dependent-behaviour)
- [Design principles](#design-principles)
- [Sibling specifications](#sibling-specifications)

## Vision

The website is not the intelligence. The website is the protocol entry point. The agent remains the execution environment — AEON specifies how that execution must occur.

The first official workflow is [AEON Learn](../products/learn/specification.md). Its canonical invocation:

```text
Teach me Austrian Economics using learn.rapold.io
```

The same invocation principle works conceptually with ChatGPT, Claude, Gemini, future general-purpose agents, local agents capable of web retrieval, and agent frameworks implementing the protocol. What varies between runtimes is capability, never the normative workflow.

**CORE-1** — AEON MUST NOT depend on proprietary behaviour of one specific model vendor. Model independence is specified in [interoperability.md](interoperability.md).

**CORE-2** — AEON specifications define behaviour, not fixed prose. Illustrative wording in any AEON document MUST NOT be treated as required output text; requirements bind what the agent does, not the sentences it says.

## Terminology

- **Agent** — the user's own AI agent: the *runtime*. AEON ships no runtime of its own; the agent executes the protocol with whatever capabilities it actually has.
- **Website** — the *invocation surface* (for AEON Learn: `learn.rapold.io`): the protocol entry point that serves the agent bootstrap. It hosts no accounts, no backend, no content API.
- **Repository** — the *specification*: the normative, versioned, release-tagged definition of behaviour. This repository is that specification.
- **Workflow** — a named cognitive workflow specified as an AEON product (first: AEON Learn).
- **Capability** — a runtime ability (web research, scheduling, audio generation, …) that exists for protocol purposes only once verified ([capabilities.md](capabilities.md)).
- **Phase** — one ordered step of a workflow pipeline, with an explicit state and an artefact it produces ([orchestration.md](orchestration.md), [state.md](state.md)).

## Normative vs capability-dependent behaviour

**CORE-3** — Every AEON workflow specification and every conforming agent MUST distinguish **normative behaviour** (what every conforming agent does, on every runtime) from **capability-dependent behaviour** (what an agent offers only after verifying the capability).

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

[capabilities.md](capabilities.md) · [orchestration.md](orchestration.md) · [research.md](research.md) · [epistemics.md](epistemics.md) · [state.md](state.md) · [interoperability.md](interoperability.md). The first product built on this core is [AEON Learn](../products/learn/specification.md).
