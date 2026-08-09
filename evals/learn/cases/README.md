# Eval cases

The six behavioural cases, their shared file shape, and what each one tests.

> [!NOTE]
> **Management summary.** Each case is a single YAML file describing one invocation under simulated constraints, plus the observable behaviour a conforming agent must show. The six cases map 1:1 to the evaluation framework of the original master requirements (section 31). Run them with [the eval runbook](../README.md) and score them with [the compliance rubric](../protocol-compliance.md).

This document is reference. The case files themselves are data, not documentation: do not paraphrase a case here, change the YAML.

## Case file shape

Every case file carries the same keys:

```yaml
id:                  # stable case id, eval-01 … eval-06
title:               # what the case tests, in one line
invocation:          # the exact user sentence to send, verbatim
simulated_context:
  capabilities:      # full ten-key profile (protocol/capabilities.md, CAP-1)
  learner_profile:   # discovery answers the evaluator gives, where the case needs them
  notes:             # session setup and scripted events, where needed
expected_behaviour:  # list of {requirement: <ID>, behaviour: <observable check>}
fail_conditions:     # behaviours that make the case FAIL outright
pass_criteria:       # case-level conditions that must all hold
```

Every `requirement` value is a real, stable ID defined in [the ÆON Learn specification](../../../products/learn/specification.md), its phase specifications, or [the protocol core](../../../protocol/README.md). If an ID here cannot be found there, that is a bug in the case.

## The six cases

| Case | Tests |
|---|---|
| [eval-01-discovery-first.yaml](eval-01-discovery-first.yaml) | Discovery before any lesson content |
| [eval-02-outside-library.yaml](eval-02-outside-library.yaml) | Dynamic research for subjects outside [the library](../../../library/README.md) |
| [eval-03-no-scheduling.yaml](eval-03-no-scheduling.yaml) | No scheduling claims without the capability |
| [eval-04-known-fundamentals.yaml](eval-04-known-fundamentals.yaml) | Curriculum adapts to declared prior knowledge |
| [eval-05-contested-subject.yaml](eval-05-contested-subject.yaml) | Competing interpretations with epistemic labels |
| [eval-06-no-web-access.yaml](eval-06-no-web-access.yaml) | Disclosed research limitation, no fabricated citations |
