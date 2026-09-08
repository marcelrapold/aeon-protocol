# ÆON Learn — specification

Governs conformance for the whole ÆON Learn workflow: the umbrella requirements `LEARN-1` to `LEARN-16` and the phase specifications they delegate to.

> [!NOTE]
> **Management summary.** ÆON Learn is the first official ÆON workflow: it turns "teach me X" into a researched, dependency-ordered, adaptive learning journey executed by the user's own agent. This document is the normative umbrella: it defines conformance, assigns stable requirement IDs, and delegates detail to the phase specifications. Version: ÆON Learn 0.3.0.

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY are to be interpreted as described in RFC 2119 and RFC 8174.

This is the reference you check an implementation against. Start here, then follow each requirement into the phase specification that details it. For the compressed operational form an agent reads at runtime, see [bootstrap.md](bootstrap.md).

## Contents

- [Scope](#scope)
- [Conformance](#conformance)
- [Core requirements](#core-requirements)
- [Phase specifications](#phase-specifications)
- [Definition of done](#definition-of-done)
- [Degradation paths](#degradation-paths)
- [Non-goals](#non-goals)
- [Related specifications](#related-specifications)

## Scope

ÆON Learn specifies the behaviour of an AI agent that a user has pointed at `learn.rapold.io` with a teaching request. It builds on the [ÆON protocol core](../../protocol/README.md): capability negotiation, research discipline, epistemics, state and interoperability apply in full.

The canonical invocation is:

```text
Teach me Austrian Economics using learn.rapold.io
```

**LEARN-15** — ÆON Learn MUST work for any subject. The agent MUST NOT refuse, defer or abbreviate a journey because the subject has no predefined [topic package](../../library/); packages accelerate known subjects and MUST NOT limit ÆON Learn to them ([`../../library/README.md`](../../library/README.md), LIB-1). The observable test: the same normative behaviour appears for a subject with a package and for one without (see the [outside-library eval](../../evals/learn/cases/eval-02-outside-library.yaml) and the topic-independence smoke prompts of the [eval runbook](../../evals/learn/README.md)).

## Conformance

An agent conforms to ÆON Learn when it satisfies every MUST in this document and in the phase specifications it references. Behavioural conformance is testable via the [ÆON Learn evals](../../evals/learn/).

**LEARN-16** — Where the agent departs from a SHOULD of this specification or of a phase specification, it MUST be able to name the departure and its reason when asked. A silent departure from a SHOULD is scored as non-conformance, because it is indistinguishable from one.

Requirement IDs are stable: evals and issues reference them (`LEARN-3`, `LEARN-D-2`, …). IDs are never reused after removal, and existing IDs are never renumbered — so identifier order does not always follow document order.

## Core requirements

**LEARN-1** — On invocation, the agent MUST recognise the protocol, tell the user ÆON Learn is active, and respond in the user's language.

**LEARN-2** — The agent MUST establish its capability profile (per [`../../protocol/capabilities.md`](../../protocol/capabilities.md)) before offering or relying on any capability-dependent behaviour. It MUST NOT claim unverified capabilities.

**LEARN-3** — The agent MUST complete learner discovery ([`discovery.md`](discovery.md)) before compiling a curriculum. Generating "Lesson 1" directly from the invocation is a protocol violation.

**LEARN-4** — When `web_research` is available, the agent MUST research the subject ([`research.md`](research.md)) before curriculum compilation. It MUST NOT merely expand pretrained knowledge into a course. When `web_research` is unavailable, it MUST disclose the limitation and reduce confidence claims accordingly.

**LEARN-5** — The agent MUST construct a knowledge map ([`knowledge-map.md`](knowledge-map.md)) and sequence modules by dependency structure, not by arbitrary thematic grouping.

**LEARN-6** — The agent MUST compile a personalised curriculum ([`curriculum.md`](curriculum.md)) whose modules each carry the full module contract (id, title, learning objective, prerequisites, core concepts, evidence, counterposition, example, exercise, reflection, retrieval question, estimated duration).

**LEARN-7** — The agent MUST present a learning contract ([`curriculum.md`](curriculum.md)) and obtain the learner's approval before teaching. Recurring delivery MAY be offered separately, and only when scheduling is genuinely available.

**LEARN-8** — Sessions MUST follow the canonical session anatomy ([`session.md`](session.md)).

**LEARN-9** — The agent MUST maintain the explicit journey state machine ([`../../protocol/state.md`](../../protocol/state.md)) and preserve learner state for continuation, degrading gracefully when persistence is unavailable.

**LEARN-10** — The agent MUST apply the epistemic labels of [`../../protocol/epistemics.md`](../../protocol/epistemics.md) and include serious counterpositions for contested subjects.

**LEARN-11** — The agent MUST derive all output formats from one canonical semantic lesson ([`renderers/`](renderers/README.md)). Independently generated, potentially inconsistent format variants are a protocol violation.

**LEARN-12** — Later sessions SHOULD reintroduce earlier concepts and require attempted recall before revealing answers ([`adaptation.md`](adaptation.md)).

**LEARN-13** — Adaptation MUST NOT violate prerequisite structure ([`adaptation.md`](adaptation.md)).

**LEARN-14** — Completion SHOULD deliver synthesis, concept map, key principles, remaining uncertainties, assessment, an applied challenge, a recommended next path and a source map ([`assessment.md`](assessment.md)).

## Phase specifications

| Phase | Specification | ID prefix |
|---|---|---|
| Learner discovery | [discovery.md](discovery.md) | `LEARN-D` |
| Subject research | [research.md](research.md) | `LEARN-R` |
| Knowledge mapping | [knowledge-map.md](knowledge-map.md) | `LEARN-K` |
| Curriculum + contract | [curriculum.md](curriculum.md) | `LEARN-C` |
| Session execution | [session.md](session.md) | `LEARN-S` |
| Adaptation + retrieval | [adaptation.md](adaptation.md) | `LEARN-A` |
| Assessment + completion | [assessment.md](assessment.md) | `LEARN-AS` |
| Renderers | [renderers/](renderers/) | `REN` |

The agent entry contract — the compressed operational form of this specification — is [bootstrap.md](bootstrap.md), served at `https://learn.rapold.io/llms.txt`.

## Definition of done

A clean session with a capable agent — no prior ÆON context, on any runtime — and the canonical invocation results in:

1. ÆON protocol recognition (LEARN-1)
2. Capability detection (LEARN-2)
3. Learner discovery (LEARN-3)
4. Actual research (LEARN-4)
5. Evidence map (LEARN-4)
6. Knowledge map (LEARN-5)
7. Personalised curriculum (LEARN-6)
8. Learning contract (LEARN-7)
9. Session 1 in canonical anatomy (LEARN-8)
10. Practical exercise (LEARN-8)
11. Reflection (LEARN-8)
12. Progression mechanism (LEARN-9)
13. Graceful recurring-delivery behaviour (LEARN-2, LEARN-7)
14. Source transparency (LEARN-10)
15. No dependency on one vendor ([`../../protocol/interoperability.md`](../../protocol/interoperability.md))

The same result MUST be reproducible for a completely unrelated subject (LEARN-15).

## Degradation paths

A conforming agent has a defined answer for every condition below. This table is a navigation aid: the requirement column is normative, the eval column names the case that scores it.

| Condition | What the agent does | Requirement | Eval |
|---|---|---|---|
| No `web_research` | Discloses before the contract, labels recall as recall, fabricates nothing, still teaches | LEARN-4, [LEARN-R-8](research.md), [LEARN-R-11](research.md) | [eval-06](../../evals/learn/cases/eval-06-no-web-access.yaml) |
| Research capability returns mid-journey | Offers to re-run research and upgrade the evidence | [LEARN-R-10](research.md) | [eval-06](../../evals/learn/cases/eval-06-no-web-access.yaml) |
| Only weak evidence exists | Says so before the contract, teaches what the evidence supports, labels the weakness | [LEARN-R-12](research.md) | — |
| No topic package for the subject | Researches from scratch; behaviour is unchanged | LEARN-15, [LEARN-R-9](research.md) | [eval-02](../../evals/learn/cases/eval-02-outside-library.yaml) |
| Contested subject | Researches counterpositions and carries them into curriculum and sessions | LEARN-10, [LEARN-R-4](research.md), [LEARN-S-6](session.md) | [eval-05](../../evals/learn/cases/eval-05-contested-subject.yaml) |
| No `scheduled_tasks` | Says so, makes no recurring-delivery offer, preserves state for on-demand continuation | LEARN-7, [LEARN-C-10](curriculum.md) | [eval-03](../../evals/learn/cases/eval-03-no-scheduling.yaml) |
| No `persistent_memory` | Says so and emits a resumable state block | LEARN-9, [`../../protocol/state.md`](../../protocol/state.md) STA-6, STA-7 | [eval-03](../../evals/learn/cases/eval-03-no-scheduling.yaml) |
| No renderer capability | Offers the closest honest degradation — script as text, deck as outline | [REN-3](renderers/README.md) | — |
| Learner already knows the fundamentals | Moves the entry point past them, verifies by retrieval rather than trust | [LEARN-K-5](knowledge-map.md), [LEARN-A-6](adaptation.md) | [eval-04](../../evals/learn/cases/eval-04-known-fundamentals.yaml) |
| Learner rejects the contract | Recompiles and re-presents, or ends the journey explicitly — never starts teaching | [LEARN-C-8](curriculum.md), [LEARN-C-9](curriculum.md), [`../../protocol/orchestration.md`](../../protocol/orchestration.md) ORCH-9 | — |
| Learner pauses, goes silent or abandons | Stops delivering, records the journey as paused or abandoned, hands over resumable state | [LEARN-A-12](adaptation.md) | — |
| Ambiguous subject | Asks for disambiguation instead of guessing | [LEARN-D-2](discovery.md) | — |

## Non-goals

V1 deliberately excludes: user accounts, proprietary backends, payment, course marketplaces, complex UI, LMS features, progress dashboards, native audio hosting, mobile apps, vector databases and any central learner database. V1 proves the protocol.

## Related specifications

| Specification | Relation |
|---|---|
| [ÆON protocol core](../../protocol/README.md) | The product-independent requirements this umbrella inherits |
| [Orchestration](../../protocol/orchestration.md) | The phase pipeline the core requirements order |
| [Capabilities](../../protocol/capabilities.md) | The capability vocabulary behind `LEARN-2` |
| [Research](../../protocol/research.md) | The source tiers and evidence map behind `LEARN-4` |
| [Epistemics](../../protocol/epistemics.md) | The six labels and counterposition duty behind `LEARN-10` |
| [State](../../protocol/state.md) | The journey state machine behind `LEARN-9` |
| [Interoperability](../../protocol/interoperability.md) | Model independence and bootstrap discovery |
| [Topic package library](../../library/) | The accelerators `LEARN-15` forbids from becoming limits (`LIB-1`) |
| [Charisma Sprint fixture](examples/charisma/) | The worked journey this specification generalises, with the gaps it did not yet close recorded in its [retrospective](examples/charisma/retrospective.md) |
