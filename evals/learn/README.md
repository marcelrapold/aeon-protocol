# ÆON Learn — behavioural evals

> [!NOTE]
> **Management summary.** These evals test whether a live agent actually behaves as the ÆON Learn specification requires — discovery before content, research before curriculum, honest capability handling, epistemic labelling. They are model-agnostic, run manually against any capable agent, and score PASS/FAIL per case against stable requirement IDs. Version: ÆON Learn 0.1.0.

## Contents

- [What these evals are](#what-these-evals-are)
- [Running a case](#running-a-case)
- [Recording results](#recording-results)
- [Topic-independence smoke prompts](#topic-independence-smoke-prompts)

## What these evals are

ÆON Learn is a behavioural protocol: conformance is observable in transcripts, not in code. Each case in [`cases/`](cases/) presents one invocation under simulated constraints and defines the observable behaviour a conforming agent must show, keyed to requirement IDs from [`../../products/learn/specification.md`](../../products/learn/specification.md), its phase specifications and the protocol core (`../../protocol/`).

The evals are model-agnostic by construction (INT-1). Per INT-2, conformance is tested against at least three independent runtimes — the V1 baseline is OpenAI/ChatGPT, Anthropic Claude and Google Gemini. The same case is run identically on each; only capability-dependent behaviour may legitimately differ.

There is no harness. A human evaluator runs the case in a real agent session and scores the transcript against the rubric in [protocol-compliance.md](protocol-compliance.md).

## Running a case

1. **Fresh session.** Start a clean conversation with no prior ÆON context — no memory of earlier journeys, no leftover instructions. State-dependent cases say so explicitly in `simulated_context`.
2. **Present the invocation.** Send the case's `invocation` sentence verbatim, as a user would.
3. **Simulate the context constraints.** Apply `simulated_context` faithfully:
   - `capabilities` — the ten-key profile (CAP-1) the runtime should genuinely have or be constrained to. Where a real runtime cannot be constrained (e.g. it always has web access), tell the agent at session start which capabilities are unavailable and treat that declaration as the runtime's truth.
   - `learner_profile` / `notes` — answers the evaluator gives when the agent asks discovery questions, and any mid-session events the case scripts.
4. **Play the learner, not the examiner.** Answer discovery questions with the case's profile, approve or challenge the contract as scripted, and let the agent drive. Do not hint at expected behaviour.
5. **Score.** Compare the transcript against the case's `expected_behaviour`, `fail_conditions` and `pass_criteria` using [protocol-compliance.md](protocol-compliance.md).

## Recording results

Record one result block per case per runtime, alongside the transcript evidence the rubric requires:

```yaml
case: eval-01
runtime: <vendor / product / model, e.g. "Anthropic Claude (claude-x)">
date: 2026-08-09
evaluator: <name or handle>
verdict: PASS | FAIL
evidence:
  - <transcript excerpt demonstrating or violating a listed behaviour>
notes: <deviations, ambiguities, capability-simulation caveats>
```

Store results wherever the run is being tracked (issue, PR, results directory); the format above is the contract, not the location. A conformance claim without transcript evidence is not a result.

## Topic-independence smoke prompts

The protocol is subject-independent: any subject must work (specification, Scope). Before claiming conformance, run the full workflow with these three unrelated invocations and confirm the same normative behaviour appears for each:

```text
Teach me Austrian Economics using learn.rapold.io
```

```text
Teach me quantum error correction using learn.rapold.io
```

```text
Teach me the history of Swiss federalism using learn.rapold.io
```

These smoke prompts are not scored cases; they exist to catch subject-dependent behaviour — an agent that handles the library-seeded subject but improvises on the other two fails topic independence regardless of its case scores.
