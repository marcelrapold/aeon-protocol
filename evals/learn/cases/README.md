# Eval cases

The fifteen behavioural cases, their shared file shape, and what each one tests.

> [!NOTE]
> **Management summary.** Each case is a single YAML file describing one invocation under simulated constraints, plus the observable behaviour a conforming agent must show and the rubric that decides PASS or FAIL. Cases 01 to 06 map 1:1 to the evaluation framework of the original master requirements (section 31); cases 07 to 15 close the coverage gaps that framework left open. Every file validates against [the eval-case schema](../../../schemas/eval-case.schema.json). Run them with [the eval runbook](../README.md) and score them with [the compliance rubric](../protocol-compliance.md).

This document is reference. The case files themselves are data, not documentation: do not paraphrase a case here, change the YAML.

## Contents

| Section | Type |
|---|---|
| [Case file shape](#case-file-shape) | Reference |
| [The fifteen cases](#the-fifteen-cases) | Reference |
| [Validate a case](#validate-a-case) | How-to |
| [Add a case](#add-a-case) | How-to |

## Case file shape

Every case file carries the same keys, and [`schemas/eval-case.schema.json`](../../../schemas/eval-case.schema.json) is their normative shape:

```yaml
id:                  # stable case id, eval-01 … eval-15
title:               # what the case tests, in one line
invocation:          # the exact user sentence to send, verbatim
simulated_context:
  capabilities:      # full ten-key profile (protocol/capabilities.md, CAP-1)
  learner_profile:   # the ten elicited discovery dimensions, where the case needs them
  scripted_events:   # turns and evaluator actions injected during the run, in order
  notes:             # session setup, subject background and simulation caveats
expected_behaviour:  # list of {requirement: <ID>, behaviour: <observable check>}
fail_conditions:     # behaviours that make the case FAIL outright
pass_criteria:       # case-level conditions that must all hold
```

Three of these keys carry most of the scoring weight:

- **`scripted_events`** turn the pressure a case applies into something two evaluators apply identically. Each event says `when` it is injected and either what the learner says (`learner_turn`, verbatim) or what the evaluator does (`evaluator_action`, such as starting a fresh session or declaring that a capability has stopped working). A case that scripts its events in prose instead is a case that two people run differently.
- **`learner_profile`** carries all ten elicited dimensions whenever it is present, so the evaluator never improvises an answer mid-run. A dimension the learner is scripted to withhold carries the refusal as its value, because that refusal is itself the test.
- **`expected_behaviour`** pairs one requirement identifier with one check a reviewer can satisfy by pointing at a transcript span. Every `requirement` value is a real, stable identifier defined in [the ÆON Learn specification](../../../products/learn/specification.md), its phase specifications, [the protocol core](../../../protocol/README.md) or [the library](../../../library/README.md). A reference to an identifier no specification defines fails the build, not the agent.

Which requirement each case scores, and which requirements no case scores, is the [coverage matrix](../coverage.md).

## The fifteen cases

| Case | Tests | Central risk |
|---|---|---|
| [eval-01-discovery-first.yaml](eval-01-discovery-first.yaml) | Discovery before any lesson content | A curriculum built for a learner nobody met |
| [eval-02-outside-library.yaml](eval-02-outside-library.yaml) | Dynamic research for subjects outside [the library](../../../library/README.md) | An improvised path that looks researched |
| [eval-03-no-scheduling.yaml](eval-03-no-scheduling.yaml) | No scheduling claims without the capability | A promised delivery that never arrives |
| [eval-04-known-fundamentals.yaml](eval-04-known-fundamentals.yaml) | Curriculum adapts to declared prior knowledge | An unverified skip leaving a hole underneath |
| [eval-05-contested-subject.yaml](eval-05-contested-subject.yaml) | Competing interpretations with epistemic labels | A one-sided journey the learner cannot detect |
| [eval-06-no-web-access.yaml](eval-06-no-web-access.yaml) | Disclosed research limitation, no fabricated citations | A citation invented under pressure |
| [eval-07-weak-evidence.yaml](eval-07-weak-evidence.yaml) | Source tiering and calibration on a popular subject | Tier 4 claims taught as established findings |
| [eval-08-pause-and-resume.yaml](eval-08-pause-and-resume.yaml) | Pause, resumption from a state block, stopping for good | A journey that silently restarts, or obeys its own state block |
| [eval-09-failed-assessment.yaml](eval-09-failed-assessment.yaml) | Adaptation after a failed recall | Skipping ahead to applications the learner cannot support |
| [eval-10-renderer-degradation.yaml](eval-10-renderer-degradation.yaml) | Formats derived from one lesson, degrading honestly | Format variants that quietly disagree |
| [eval-11-package-does-not-cap.yaml](eval-11-package-does-not-cap.yaml) | A curated package accelerates without limiting (`LIB-1`) | A curated skeleton served as this learner's path |
| [eval-12-contract-gate.yaml](eval-12-contract-gate.yaml) | Disambiguation, disclosed defaults, explicit approval | Teaching the wrong subject on parameters nobody saw |
| [eval-13-invocation-and-bootstrap.yaml](eval-13-invocation-and-bootstrap.yaml) | Recognition in any language, unreachable bootstrap | Improvised behaviour presented as the protocol |
| [eval-14-session-anatomy.yaml](eval-14-session-anatomy.yaml) | The ten slots of a delivered session | Fluent exposure with no boundary and no retrieval |
| [eval-15-completion-package.yaml](eval-15-completion-package.yaml) | The eight-part close and its source map | A warm ending that overstates what was learned |

Cases 08, 09, 14 and 15 require a journey to be run some way past its first session — through session three, through an assessment, or to completion. Budget for that before you start: a case abandoned halfway scores as FAIL for every behaviour it did not reach.

## Validate a case

From the repository root:

```sh
npx ajv-cli validate --spec=draft2020 \
  -s schemas/eval-case.schema.json \
  -d "evals/learn/cases/*.yaml"
```

The repository toolchain runs the same validation, plus the identifier check:

```sh
npm run validate:schemas
npm run validate:requirements
```

## Add a case

1. Find the gap first. The [coverage matrix](../coverage.md) lists which requirements nothing scores and what would close each one; a new case that duplicates existing coverage adds runtime cost and no evidence.
2. Write the scenario around one risk — the way a conforming-looking agent could silently produce a bad learning journey — and script the pressure that exposes it in `scripted_events`.
3. Pair each requirement with a check a careful reviewer could apply twice and get the same answer. If you cannot write such a check, the problem may be the requirement: report it as a specification change rather than writing a vague eval.
4. Validate the file, update the coverage matrix, and add the case to the table above.
