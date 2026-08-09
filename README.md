# AEON Protocol

> [!NOTE]
> **Management summary.** AEON is an open, model-agnostic protocol for agent-orchestrated cognitive workflows. It defines how an AI agent turns an ambiguous human intention into a structured, researched, verifiable and progressively executed workflow. The first official workflow is **AEON Learn**: paste one sentence into any capable AI agent and it compiles a researched, adaptive learning journey for any subject. The website is the invocation surface, this repository is the specification, and the user's own agent is the runtime.

An open protocol for agent-orchestrated cognitive workflows.

AEON defines how AI agents transform human intent into structured, researched and progressively executed workflows.

## AEON Learn

Turn any subject into a researched, adaptive learning journey.

```text
Teach me Austrian Economics using learn.rapold.io
```

Paste that sentence into your AI agent.

No account.
No proprietary agent.
No course catalogue required.

Your agent executes the protocol: it detects its own capabilities, discovers what you already know and what you want, researches the subject, builds a knowledge map, compiles a personalised curriculum, presents a learning contract — and only then starts teaching, one session at a time.

## Contents

- [How it works](#how-it-works)
- [Repository layout](#repository-layout)
- [Design principles](#design-principles)
- [The Charisma Sprint — origin case](#the-charisma-sprint--origin-case)
- [Versioning](#versioning)
- [Contributing](#contributing)
- [License](#license)

## How it works

```text
User
  → Agent
    → learn.rapold.io          (invocation surface)
      → AEON bootstrap          (protocol recognition)
        → Capability detection  (what can this runtime actually do?)
          → Learner discovery   (what does this human already know and want?)
            → Deep research     (tiered sources, evidence map)
              → Knowledge map   (concepts, dependencies, controversies)
                → Curriculum    (compiled, not improvised)
                  → Contract    (the learner approves the path)
                    → Sessions  (progressive, adaptive, with retrieval)
```

The website is not the intelligence. It is the protocol entry point. Agents fetch [`learn.rapold.io/llms.txt`](https://learn.rapold.io/llms.txt), which points at the normative specifications in this repository, pinned to a release tag.

## Repository layout

```text
aeon-protocol/
├── protocol/            # AEON core — normative, product-independent specifications
│   ├── core.md          # vision, terminology, fundamental principles
│   ├── capabilities.md  # capability negotiation and graceful degradation
│   ├── orchestration.md # the workflow pipeline
│   ├── research.md      # source tiering, research before generation
│   ├── epistemics.md    # evidence labels, counterpositions, calibration
│   ├── state.md         # state machine and learner state
│   └── interoperability.md  # model independence, invocation, bootstrap discovery
│
├── products/learn/      # AEON Learn — the first official workflow
│   ├── bootstrap.md     # the agent entry contract (served as llms.txt)
│   ├── specification.md # complete normative specification
│   ├── discovery.md · research.md · knowledge-map.md · curriculum.md
│   ├── session.md · adaptation.md · assessment.md
│   ├── renderers/       # podcast, presentation, article
│   └── examples/charisma/   # the canonical reference fixture (origin case)
│
├── library/             # optional curated topic packages (accelerators, never limits)
├── schemas/             # machine-readable JSON Schemas
├── evals/learn/         # behavioural compliance tests
├── site/learn/          # learn.rapold.io — minimal static invocation surface
└── docs/decisions/      # architecture decision records
```

## Design principles

```text
Research   > generation
Understanding > completion
Retrieval  > rereading
Application > passive consumption
Epistemic calibration > false certainty
Adaptation > fixed curriculum
Protocol   > platform lock-in
```

AEON Learn MUST NOT depend on proprietary behaviour of one specific model vendor. It distinguishes normative behaviour (what every conforming agent does) from capability-dependent behaviour (what an agent may offer if — and only if — it has verified the capability). Graceful degradation is a first-class requirement: an agent without scheduling says so and preserves learning state for on-demand continuation; it never pretends.

## The Charisma Sprint — origin case

AEON Learn generalises a real learning journey. The [Charisma Sprint](products/learn/examples/charisma/) — 14 research-grounded daily sessions, from raw stimulus to behavioural transfer — is preserved in this repository substantively unchanged as the canonical reference fixture, together with its [curriculum](products/learn/examples/charisma/curriculum.yaml), [source map](products/learn/examples/charisma/source-map.md) and a [retrospective](products/learn/examples/charisma/retrospective.md) that documents what the sprint proved and what the protocol improves.

## Versioning

Semantic versioning per component: `AEON Protocol 0.1.0`, `AEON Learn 0.1.0`. Normative requirements use RFC-style keywords (`MUST`, `MUST NOT`, `SHOULD`, `SHOULD NOT`, `MAY`) and carry stable requirement identifiers so evals can reference them. Agents fetch specifications via URLs pinned to a release tag, never from a moving branch.

## Contributing

Specifications change by pull request. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[Apache-2.0](LICENSE) — permissive adoption plus an explicit patent grant.
