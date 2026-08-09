# Charisma Sprint — retrospective

> [!NOTE]
> **Management summary.** What the sprint proved, what it lacked, and how each gap became part of the protocol. This is the meta-level record; the learner-facing integration protocol (weekly maintenance, the 10 rules, the master drill) lives in [integration.md](integration.md).

The Charisma Sprint worked end to end before AEON Learn existed. This retrospective measures it against the protocol it motivated: eight practices worth generalising, seven gaps the protocol closes.

## What worked

1. **Strong single-topic focus per session.** Each day carries exactly one Kernthese; no session mixes topics. This became the "one dominant idea" of the canonical session anatomy ([session.md](../../session.md)).
2. **Research grounding.** 26 anchored sources; every day names its Quellenanker before any content. Lessons were translations of evidence into drills, not expansions of pretrained plausibility.
3. **Distinction between evidence and mythology.** The material debunks the myths of its own genre — the 93-percent claim, lie-detector body language, confidence as a feeling — with sources attached (catalogued in [source-map.md](source-map.md)).
4. **Examples before abstraction.** Every operator arrives as a speakable sentence in a concrete situation before it is named as a principle.
5. **Immediate daily exercise.** Every day ends in a Tagesübung executable the same day, plus a real-world mission — behaviour change, not reading comprehension.
6. **Three reflection questions.** A fixed count, held across all 14 days; the constraint forces selection instead of a questionnaire.
7. **Conversational podcast format.** Manuscripts written for read-aloud delivery: no citation clutter, no tables, no visual-only references — the pattern the podcast renderer specifies ([renderers/podcast.md](../../renderers/podcast.md)).
8. **Progressive depth.** From self-signal control (days 1–6) through social perception (day 7) into high-friction communication (days 8–12) and finally meta-skills and integration (days 13–14), each day building on vocabulary the previous days installed.

## What can improve

1. **Explicit knowledge graph before content creation.** The day sequence follows an advertisement's lesson index, not a dependency analysis; the ordering works, but by editorial instinct rather than by construction. The protocol requires the map first ([knowledge-map.md](../../knowledge-map.md)).
2. **Stronger spaced repetition.** Only day 14 explicitly retrieves earlier material; days 1–13 never require recall of previous concepts. The canonical session anatomy makes retrieval a per-session step ([adaptation.md](../../adaptation.md), [session.md](../../session.md)).
3. **Explicit source tiering.** The Quellenbasis mixes primary papers, meta-analyses and practitioner sites without tier labels, and a second, unreconciled Research Stack exists beside it. The protocol demands one tiered evidence map ([research.md](../../research.md)); the tiering in [source-map.md](source-map.md) is retroactive.
4. **Curriculum completeness checks.** The 14-day scope was set by an ad's visible lesson titles — the fifteenth was hidden behind a button — not by coverage analysis of the subject. Compilation now includes completeness checks ([curriculum.md](../../curriculum.md)).
5. **Knowledge assessment.** The reflection questions ask, but nothing verifies; the sprint never tests whether the learner can reason with the material. Assessment is now a phase of its own ([assessment.md](../../assessment.md)).
6. **Better learning state persistence.** Progress lived in the delivery conversation with no resumable state; an interrupted sprint had no defined way to continue. The protocol defines an explicit state machine and resumable learner state ([protocol/state.md](../../../../protocol/state.md)).
7. **Automated capability negotiation.** The format assumed a read-aloud capability («Vorlesefunktion») instead of detecting it; a runtime without text-to-speech had no defined fallback. Capability negotiation with graceful degradation is now a precondition of every journey ([protocol/capabilities.md](../../../../protocol/capabilities.md)).

## Closing

AEON Learn is the generalisation of these lessons. Everything under "what worked" became normative session anatomy and research discipline; every item under "what can improve" became a phase specification. The sprint is preserved unchanged so the protocol's origin — and the distance travelled from it — stays auditable.
