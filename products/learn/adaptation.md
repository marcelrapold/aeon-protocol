# ÆON Learn — adaptation

Governs how the journey responds to the learner: the seven signals, the retrieval duty, and the prerequisite structure that adaptation may never break.

> [!NOTE]
> **Management summary.** Adaptation reacts to seven lightweight learner signals by adjusting later modules — depth, pacing, examples — while the prerequisite structure of the curriculum remains inviolable. Retrieval and spaced repetition make the journey an act of remembering, not consumption: earlier concepts return, and recall is attempted before answers are shown. This specification refines LEARN-12 and LEARN-13 of [specification.md](specification.md). Requirement IDs: `LEARN-A-n`. Version: ÆON Learn 0.3.0.

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY are to be interpreted as described in RFC 2119 and RFC 8174.

Adaptation runs in the `ADAPTING` state of the journey state machine ([`../../protocol/state.md`](../../protocol/state.md)), in the `ASSESSING → ADAPTING → ACTIVE` cycle. This reference specifies one phase. For the requirements it refines and its place among the other phases, see the [ÆON Learn specification](specification.md).

## Contents

- [Adaptation signals](#adaptation-signals)
- [Responding to signals](#responding-to-signals)
- [Curriculum integrity invariant](#curriculum-integrity-invariant)
- [Retrieval](#retrieval)
- [Spaced repetition](#spaced-repetition)
- [State](#state)
- [Related specifications](#related-specifications)

## Adaptation signals

**LEARN-A-1** — The agent MUST recognise these seven signals:

```yaml
understood:        # concept landed; proceed
uncertain:         # concept partially landed; reinforce
interesting:       # learner wants more of this thread
too_easy:          # pace or depth below the learner
too_hard:          # pace or depth above the learner
needs_more_depth:  # correct level, insufficient detail
needs_example:     # abstraction without enough grounding
```

**LEARN-A-2** — Signals MUST be cheap to give. The agent SHOULD accept them explicitly (the learner says "too easy") and infer them implicitly (failed retrieval implies `uncertain`; unprompted follow-up questions imply `interesting`; a skipped exercise may imply `too_hard` or a time problem — ask, do not assume). The agent MUST NOT turn signal collection into a questionnaire after every session.

## Responding to signals

**LEARN-A-3** — Signals MUST adapt **later** modules. The agent SHOULD apply these typical responses:

| Signal | Response |
|---|---|
| `understood` | Proceed; schedule the concept for spaced retrieval |
| `uncertain` | Reinforce in the next session's retrieval slot; re-approach from a new angle if it persists |
| `interesting` | Deepen related modules; offer an optional detour that respects dependencies |
| `too_easy` | Compress upcoming modules; verify assumed mastery through retrieval before skipping content |
| `too_hard` | Slow pacing; split the next module; add grounding examples before abstraction |
| `needs_more_depth` | Raise research depth for affected modules; bring Tier 1–2 sources forward |
| `needs_example` | Add worked examples in the learner's professional context before the next abstraction |

**LEARN-A-4** — Repeated `uncertain` or `too_hard` on the same concept MUST update `weak_areas` in learner state and MAY trigger recompilation of the remaining curriculum ([curriculum.md](curriculum.md)). Recompilation re-runs sequencing from the knowledge map; it does not improvise.

## Curriculum integrity invariant

**LEARN-A-5** — Adaptation MUST NOT violate the prerequisite structure of the knowledge map ([knowledge-map.md](knowledge-map.md)). Modules may be compressed, expanded, split, reordered among independent siblings, or enriched — but no module may be delivered before its prerequisites are either taught or verified.

**LEARN-A-6** — `too_easy` does not waive prerequisites; it changes how they are cleared. The agent MUST verify claimed prior mastery through attempted retrieval before skipping a prerequisite module. Acceleration is earned by demonstrated recall, not granted by self-report.

This is the invariant that keeps adaptation from degenerating into improvisation: the learner steers depth and pace, the dependency graph steers order.

## Retrieval

**LEARN-A-7** — Later sessions MUST reintroduce concepts from earlier modules (session slot I, [session.md](session.md)). The agent MUST require an attempted recall before revealing the answer. Presenting the answer first — or accepting "yes, I remember" without an actual attempt — is not retrieval.

A retrieval prompt asks the learner to produce, apply or discriminate: "Explain X in one sentence", "Which principle from session 2 applies here, and why?", "What would X predict in this scenario?". Recognition-only prompts ("Do you recall X?") SHOULD be avoided.

**LEARN-A-8** — Retrieval outcomes MUST be treated as adaptation signals: a failed recall implies `uncertain` for that concept and reschedules it (LEARN-A-9); a fluent recall marks it strong and lengthens its interval.

## Spaced repetition

**LEARN-A-9** — The agent SHOULD space each concept's reappearances at increasing intervals — typically the next session, then several sessions later, then near the end of the journey. A failed recall resets the concept to a short interval. The final assessment ([assessment.md](assessment.md)) draws on the concepts with the weakest retrieval history.

ÆON Learn is not consumption-only. A journey in which nothing is ever asked back is a protocol violation in spirit even where no single MUST fails: retrieval is what converts exposure into knowledge.

## State

**LEARN-A-10** — Adaptation runs in the `ADAPTING` state and writes its conclusions to learner state ([`../../protocol/state.md`](../../protocol/state.md)): `difficulty`, `depth`, `weak_areas`, `strong_areas`, plus the retrieval schedule. Without persistent memory, the agent MUST carry this in the resumable state block it emits, so a future session can continue adapting instead of starting blind.

## Related specifications

| Specification | Relation |
|---|---|
| [ÆON Learn specification](specification.md) | The umbrella requirements this phase refines (`LEARN-12`, `LEARN-13`) |
| [Session](session.md) | Produces the signals and hosts the retrieval slot |
| [Knowledge mapping](knowledge-map.md) | Owns the prerequisite structure `LEARN-A-5` protects |
| [Curriculum and learning contract](curriculum.md) | Recompiles when signals demand it (`LEARN-A-4`) |
| [Assessment and completion](assessment.md) | Weights the final assessment by retrieval history |
| [Protocol state](../../protocol/state.md) | Defines the `ADAPTING` state and the learner-state fields written here |
