# AEON Learn — assessment

> [!NOTE]
> **Management summary.** Assessment answers one question: can the learner now reason with the material? Not "did they finish". Completion delivers an eight-part package — synthesis, concept map, key principles, remaining uncertainties, assessment, applied challenge, recommended next learning path, source map — that closes the journey with the same epistemic honesty it was taught with. Requirement prefix: `LEARN-AS`. Version: AEON Learn 0.1.0.

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY are to be interpreted as described in RFC 2119 and RFC 8174.

## Contents

- [The governing question](#the-governing-question)
- [Assessment style](#assessment-style)
- [Completion package](#completion-package)
- [State](#state)

## The governing question

**LEARN-AS-1** — All assessment MUST be designed against the question: **Can the learner now reason with the material?** Completion of sessions, time spent, or ability to recognise terminology are not evidence of understanding. Reasoning is: the learner can explain concepts in their own words, apply them to unseen cases, predict consequences, and identify where they do not apply.

## Assessment style

**LEARN-AS-2** — Assessment tasks MUST be reasoning tasks — transfer to a new scenario, explanation to an imagined novice, prediction, critique of a flawed argument — drawn from the journey's actual knowledge map. Recognition-style quizzing (multiple choice against verbatim phrasing) SHOULD NOT be the primary instrument.

**LEARN-AS-3** — As in retrieval (`adaptation.md`), the learner MUST attempt an answer before the agent evaluates or reveals one. Assessment SHOULD weight the concepts with the weakest retrieval history, because those are the claims about mastery most in need of testing.

**LEARN-AS-4** — Assessment results MUST be reported honestly, mapped to concepts ("solid on X, shaky on the boundary between Y and Z"), not as a flattering aggregate score. Weaknesses found here feed `weak_areas` and the recommended next path.

Assessment is not a single terminal event: the `ASSESSING` state MAY be entered mid-journey after major curriculum blocks. The completion package below is its final, mandatory-in-substance form.

## Completion package

**LEARN-AS-5** — At the end of a learning journey the agent SHOULD deliver all eight parts:

| Part | Content |
|---|---|
| Synthesis | The journey's dominant ideas connected into one coherent account — how the concepts relate, not a list of session recaps |
| Concept map | The knowledge map as the learner now holds it: concepts, dependencies, and where the learner's grasp is strong or weak |
| Key principles | The small set of transferable principles the learner should still be able to state a year from now |
| Remaining uncertainties | What stays contested in the field, what the evidence never settled, and what the learner personally has not yet mastered — labelled per `../../protocol/epistemics.md` |
| Assessment | The reasoning-task evaluation of LEARN-AS-2 to LEARN-AS-4, with honest results |
| Applied challenge | One substantial task in the learner's real context, applying the material where there is no clean answer to look up |
| Recommended next learning path | Adjacent subjects from the knowledge map, weighted by the learner's `interesting` signals and remaining weak areas |
| Source map | The tiered sources actually used (`research.md`), what each grounded, and where the agent relied on pretrained knowledge instead of research |

**LEARN-AS-6** — Completion MUST surface remaining uncertainties — the epistemics surface symmetrical to the session boundary slot (`session.md`). A completion MUST NOT claim the subject is now fully understood, by the field or by the learner.

**LEARN-AS-7** — The applied challenge MUST NOT be answerable by restating course content. Its purpose is transfer under real constraints; the agent SHOULD offer to review the learner's attempt in a later session.

**LEARN-AS-8** — The source map MUST distinguish researched grounding from pretrained knowledge, and MUST reflect the journey's actual evidence map — it is an audit trail, not a bibliography for decoration.

## State

**LEARN-AS-9** — Delivering the completion package transitions the journey to `COMPLETED` (`../../protocol/state.md`). Final learner state — including `strong_areas`, `weak_areas` and the recommended next path — MUST be preserved or emitted for continuation, so the next journey can build on this one.
