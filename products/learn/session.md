# ÆON Learn — session

Governs the delivery unit: the ten slots every session runs through, and what each slot must carry.

> [!NOTE]
> **Management summary.** A session is the delivery unit of a compiled curriculum module: one dominant idea, carried through ten fixed slots from hook to forward link. The boundary slot — what the evidence does NOT prove — is a mandatory epistemics surface, not an optional nicety. This specification refines LEARN-8 of [specification.md](specification.md). Requirement IDs: `LEARN-S-n`. Version: ÆON Learn 0.3.0.

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY are to be interpreted as described in RFC 2119 and RFC 8174.

This reference specifies one phase. For the requirement it refines and its place among the other phases, see the [ÆON Learn specification](specification.md).

## Contents

- [Position in the workflow](#position-in-the-workflow)
- [Canonical session anatomy](#canonical-session-anatomy)
- [Slot requirements](#slot-requirements)
- [One dominant idea](#one-dominant-idea)
- [Duration and delivery](#duration-and-delivery)
- [Related specifications](#related-specifications)

## Position in the workflow

A session executes exactly one module of the compiled curriculum ([curriculum.md](curriculum.md)) while the journey is in the `ACTIVE` state ([`../../protocol/state.md`](../../protocol/state.md)). The module contract — objective, core concepts, evidence, counterposition, example, exercise, reflection, retrieval question — is the input; the session is its pedagogical realisation. The session is authored once as a canonical semantic lesson and delivered through [renderers](renderers/README.md), never re-generated per format.

## Canonical session anatomy

**LEARN-S-1** — Every session MUST contain the following slots, in this order:

| Slot | Name | Content |
|---|---|---|
| A | Hook | Concrete problem, contradiction or scenario |
| B | Core concept | One dominant idea |
| C | Evidence | Research or primary-source grounding |
| D | Interpretation | What the evidence actually means |
| E | Boundary | What it does NOT prove |
| F | Concrete application | The idea applied in the learner's context |
| G | Exercise | Something the learner does today |
| H | Reflection | Normally three questions |
| I | Retrieval | Recall from previous modules |
| J | Forward link | Why the next module follows logically |

**LEARN-S-2** — The first session of a journey has no previous modules; its slot I MAY instead probe baseline knowledge established during discovery. Every later session MUST include genuine retrieval.

Slots are semantic, not typographic: a renderer may merge adjacent slots into flowing prose ([renderers/podcast.md](renderers/podcast.md)), but every slot's content MUST be identifiable in the canonical lesson.

## Slot requirements

**LEARN-S-3 (Hook)** — The hook MUST open with a concrete problem, contradiction or scenario the learner can recognise. It MUST NOT open with a definition, an agenda, or meta-commentary ("Welcome to session 3, today we will cover…"). A good hook makes the learner feel the gap the session closes; a weak hook merely announces the topic.

**LEARN-S-4 (Evidence)** — The evidence slot MUST ground the core concept in the research performed for this journey ([research.md](research.md)), citing tiered sources from the evidence map and carrying the epistemic labels of [`../../protocol/epistemics.md`](../../protocol/epistemics.md). When `web_research` was unavailable, the slot MUST say the grounding is pretrained knowledge and lower its confidence accordingly.

**LEARN-S-5 (Interpretation)** — Interpretation MUST be separated from evidence: first what was found, then what it means. The agent MUST NOT present its own inference as a finding; `ÆON inference` is a label, not a footnote.

**LEARN-S-6 (Boundary)** — The boundary slot is mandatory. Every session MUST state explicitly what the presented evidence does NOT prove — its scope limits, the counterposition from the module contract, or the popular overclaim the learner is likely to carry away. Sessions with strong evidence need this slot most: confidence without boundaries is exactly the false certainty the protocol exists to prevent.

**LEARN-S-7 (Application and exercise)** — The concrete application MUST use the learner's professional context and desired practical application from discovery. The exercise MUST be executable the same day, in the learner's real environment, without tools the learner does not have.

**LEARN-S-8 (Reflection)** — Reflection normally consists of three questions. They MUST target the learner's own behaviour, context or judgement — comprehension checking belongs to retrieval, not reflection.

**LEARN-S-9 (Retrieval)** — The retrieval slot MUST require an attempted recall of an earlier concept before the answer is shown, per [adaptation.md](adaptation.md). Re-summarising earlier sessions for the learner is not retrieval.

**LEARN-S-10 (Forward link)** — The forward link MUST explain why the next module follows from this one in the dependency structure of the knowledge map. It is a logical connection, not a teaser.

## One dominant idea

**LEARN-S-11** — A session MUST teach exactly one dominant idea (slot B). Supporting concepts MAY appear only in service of that idea. If a module's content cannot be honestly carried by one dominant idea, the module is mis-scoped and MUST be split during curriculum compilation or adaptation — never crammed into one session.

The [Charisma Sprint fixture](examples/charisma/) demonstrates the discipline: fourteen sessions, fourteen ideas, no session trying to be two.

## Duration and delivery

**LEARN-S-12** — Session length MUST respect the daily time budget agreed in the learning contract ([curriculum.md](curriculum.md)). Formats are derived per the [renderer specifications](renderers/README.md) and offered only within the verified capability profile.

**LEARN-S-13** — After delivering a session, the agent SHOULD collect the lightweight adaptation signals of [adaptation.md](adaptation.md) and MUST update journey progress in learner state ([`../../protocol/state.md`](../../protocol/state.md)).

## Related specifications

| Specification | Relation |
|---|---|
| [ÆON Learn specification](specification.md) | The umbrella requirement this phase refines (`LEARN-8`) |
| [Curriculum and learning contract](curriculum.md) | Supplies the module contract a session realises |
| [Renderers](renderers/README.md) | Derive podcast, presentation and article from the canonical lesson |
| [Adaptation and retrieval](adaptation.md) | Consumes the signals a session produces and fills slot I |
| [Protocol epistemics](../../protocol/epistemics.md) | Defines the labels and the boundary duty behind slot E |
| [Charisma Sprint sessions](examples/charisma/sessions/) | Fourteen worked sessions in this anatomy |
