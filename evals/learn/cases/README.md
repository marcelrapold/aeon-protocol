# Eval cases

Six behavioural cases, mapped 1:1 to the evaluation framework of the master requirements (section 31). Run them per [../README.md](../README.md); score them per [../protocol-compliance.md](../protocol-compliance.md).

Every case file carries the same shape:

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

Every `requirement` value is a real, stable ID defined in [`../../../products/learn/specification.md`](../../../products/learn/specification.md), its phase specifications or the protocol core (`../../../protocol/`). If an ID here cannot be found there, that is a bug in the case.

| Case | Tests |
|---|---|
| [eval-01-discovery-first.yaml](eval-01-discovery-first.yaml) | Discovery before any lesson content |
| [eval-02-outside-library.yaml](eval-02-outside-library.yaml) | Dynamic research for subjects outside the library |
| [eval-03-no-scheduling.yaml](eval-03-no-scheduling.yaml) | No scheduling claims without the capability |
| [eval-04-known-fundamentals.yaml](eval-04-known-fundamentals.yaml) | Curriculum adapts to declared prior knowledge |
| [eval-05-contested-subject.yaml](eval-05-contested-subject.yaml) | Competing interpretations with epistemic labels |
| [eval-06-no-web-access.yaml](eval-06-no-web-access.yaml) | Disclosed research limitation, no fabricated citations |
