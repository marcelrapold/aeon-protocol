# ÆON Learn — knowledge mapping

> [!NOTE]
> **Management summary.** Before any lesson exists, the agent structures the researched subject into an internal knowledge graph across twelve dimensions — concepts and their dependencies, mental models, controversies, misconceptions, applications, failure modes and open questions. Modules are then sequenced along the dependency structure, never by thematic convenience. This specification refines LEARN-5 of [specification.md](specification.md). Requirement IDs: `LEARN-K-n`. Version: ÆON Learn 0.1.0.

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY are to be interpreted as described in RFC 2119 and RFC 8174.

Mapping is the `MAPPING` state of the journey state machine ([`../../protocol/state.md`](../../protocol/state.md)), between research and curriculum compilation. Its input is the evidence map ([research.md](research.md)) and the learner model ([discovery.md](discovery.md)); its output is the graph the curriculum compiler consumes ([curriculum.md](curriculum.md)).

## Contents

- [The twelve mapping dimensions](#the-twelve-mapping-dimensions)
- [Knowledge graph](#knowledge-graph)
- [Dependency-driven sequencing](#dependency-driven-sequencing)
- [Learner entry point and scope](#learner-entry-point-and-scope)

## The twelve mapping dimensions

**LEARN-K-1** — Before constructing lessons, the agent MUST identify:

```text
Core concepts                     what must be understood
Prerequisites                     what must be known before entry
Dependencies                      which concept requires which
Mental models                     the thinking tools the subject runs on
Key people / schools / theories   who shaped it and how the camps divide
Historical context                how the subject got here
Current state                     where it stands today
Major controversies               where serious experts disagree
Common misconceptions             what learners typically get wrong
Practical applications            where the material transfers
Failure modes                     how applying it goes wrong
Open questions                    what nobody has settled
```

## Knowledge graph

**LEARN-K-2** — The result MUST be an explicit graph: concepts as nodes, prerequisite relations as directed edges. The dependency graph MUST be acyclic; apparent mutual dependencies are resolved by splitting or merging concepts, not ignored.

**LEARN-K-3** — Concepts MUST trace to the evidence map: each node references the claims that ground it. Controversy nodes MUST carry the researched counterpositions (LEARN-R-4). Misconceptions MUST be attached to the concepts they distort, so the session that teaches a concept can address its misconception ([session.md](session.md)).

The serialisation is internal; the following content is normative:

```yaml
knowledge_map:
  subject:
  concepts:
    - id:
      name:
      depends_on: []          # concept ids — directed prerequisite edges
      evidence: []            # claim ids from the evidence map
      mental_models: []
      misconceptions: []
      controversy: []         # counterposition claim ids, empty if uncontested
  assumed_known: []           # concept ids pruned per LEARN-K-5
  out_of_scope: []            # concept ids recorded per LEARN-K-6
```

## Dependency-driven sequencing

**LEARN-K-4** — Module sequence MUST follow the dependency structure of the graph — a topological order. Thematic grouping is acceptable only where it does not violate a dependency. The test: no concept is taught before every concept it depends on has been taught earlier or is assumed known per LEARN-K-5. Arbitrary chapter lists ("14 things about X") are a protocol violation (LEARN-5).

## Learner entry point and scope

**LEARN-K-5** — `current_knowledge` from the learner model marks concepts as assumed known and moves the entry point past them; a learner who knows the fundamentals MUST NOT be routed through them again (Eval 04). Assumed-known concepts SHOULD be verified through early retrieval rather than trusted blindly ([adaptation.md](adaptation.md)); a failed retrieval reinstates the concept into the sequence.

**LEARN-K-6** — The graph SHOULD be sized to `program_duration` and `daily_time_budget`. Concepts that do not fit MUST be recorded as out of scope rather than silently dropped — they feed the recommended next learning path at completion (LEARN-14, [assessment.md](assessment.md)).
