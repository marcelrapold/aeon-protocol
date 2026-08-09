# AEON Learn — learner discovery

> [!NOTE]
> **Management summary.** Discovery turns the invocation into a learner model: eleven dimensions covering what is being learned, by whom, for what purpose and under which constraints. The agent asks for unknown dimensions in one compact block, reuses context it reliably knows, and only then moves on to research. This specification refines LEARN-3 of [specification.md](specification.md). Requirement IDs: `LEARN-D-n`. Version: AEON Learn 0.1.0.

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY are to be interpreted as described in RFC 2119 and RFC 8174.

Discovery is the `DISCOVERY` state of the journey state machine ([`../../protocol/state.md`](../../protocol/state.md)). It begins with protocol recognition (LEARN-1) and ends when the learner model is complete; the journey then transitions to `RESEARCHING`.

## Contents

- [Learner model](#learner-model)
- [Efficient elicitation](#efficient-elicitation)
- [Output](#output)
- [Example exchange](#example-exchange)

## Learner model

**LEARN-D-1** — The learner model MUST cover eleven dimensions before curriculum compilation begins:

```yaml
subject:                        # what to learn — taken from the invocation
current_knowledge:              # prior exposure, from none to expert
learning_goal:                  # what the learner wants to understand or be able to do
desired_depth:                  # overview | working knowledge | advanced | expert
daily_time_budget:              # minutes per day
program_duration:               # days (e.g. 7, 14, 30) or open-ended
preferred_language:             # teaching language — may differ from the chat language
preferred_formats:              # podcast, deep dive, exercises, presentations, combination
professional_context:           # role and field, where transfer is intended
desired_practical_application:  # where the material should be applied
assessment_preference:          # none | light retrieval | rigorous assessment
```

Every dimension is consumed downstream — none is decorative:

| Dimension | Consumed by |
|---|---|
| `subject` | Research scope ([research.md](research.md)), library package lookup |
| `current_knowledge` | Entry point and pruning of the knowledge graph ([knowledge-map.md](knowledge-map.md)) |
| `learning_goal`, `desired_practical_application` | Module learning objectives and exercises ([curriculum.md](curriculum.md)) |
| `desired_depth` | Research proportionality (LEARN-R-3), curriculum depth |
| `daily_time_budget`, `program_duration` | Module count and duration budget (LEARN-C-6) |
| `preferred_language` | All rendered output ([renderers/](renderers/)) |
| `preferred_formats` | Renderer selection, gated by verified capabilities (LEARN-2) |
| `professional_context` | Examples and transfer exercises |
| `assessment_preference` | Retrieval intensity and completion assessment ([adaptation.md](adaptation.md), [assessment.md](assessment.md)) |

**LEARN-D-2** — `subject` MUST be taken from the invocation. When the subject is ambiguous (for example "teach me transformers"), the agent MUST ask for disambiguation instead of guessing.

**LEARN-D-3** — A dimension MUST be counted as resolved only when it was (a) answered by the learner, (b) reused from reliably known context per LEARN-D-5, or (c) defaulted with disclosure per LEARN-D-6. Discovery is complete only when every dimension is resolved.

## Efficient elicitation

**LEARN-D-4** — Unknown dimensions MUST be requested in a single compact block of grouped questions. The agent MUST NOT interrogate the learner one question per turn, and MUST NOT ask for information it already reliably has. One round of follow-up clarification MAY occur; discovery MUST NOT loop.

**LEARN-D-5** — Context the agent reliably knows (chat language, stated profession, prior journeys where persistent memory is verified) SHOULD be reused instead of re-asked. Every reused or inferred value MUST be stated back to the learner so it can be corrected — silently assumed context is a protocol violation. Weak signals MUST NOT be treated as reliable context.

**LEARN-D-6** — When the learner declines to answer or answers partially, the agent MAY apply sensible defaults. It MUST name each default at the point of applying it and MUST restate all applied defaults in the learning contract (LEARN-C-7). The journey proceeds; discovery never stalls on missing preferences.

## Output

**LEARN-D-7** — The completed learner model MUST be recorded in learner state per [`../../protocol/state.md`](../../protocol/state.md) and SHOULD serialise per [`../../schemas/learner.schema.json`](../../schemas/learner.schema.json). Completion of discovery transitions the journey to `RESEARCHING`.

## Example exchange

Invocation:

```text
Teach me Austrian Economics using learn.rapold.io
```

Expected response pattern (the user wrote German, so the agent responds in German per LEARN-1):

```text
AEON Learn erkannt.

Bevor ich den Lernpfad kompiliere, brauche ich einige Parameter.

1. Wie gut kennst Du Austrian Economics bereits?
2. Was willst Du danach konkret verstehen oder können?
3. Wie viel Zeit möchtest Du pro Tag investieren?
4. Soll das Programm eher 7, 14, 30 oder mehr Tage umfassen?
5. Willst Du primär Podcast, Deep Dive, Übungen, Präsentationen
   oder eine Kombination?
```

The wording is illustrative, not fixed prose — the protocol defines behaviour, and the question block need not enumerate all eleven dimensions verbatim: several are resolved here by reuse (language), by the invocation (subject) or by defaults disclosed later in the learning contract.
