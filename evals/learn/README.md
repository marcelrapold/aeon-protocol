# ÆON Learn — behavioural evals

How to run and score the six behavioural cases that decide whether a live agent conforms to ÆON Learn.

> [!NOTE]
> **Management summary.** These evals test whether a live agent actually behaves as the ÆON Learn specification requires — discovery before content, research before curriculum, honest capability handling, epistemic labelling. They are model-agnostic, run manually against any capable agent, and score PASS/FAIL per case against stable requirement IDs. There is no harness and no code to install: you run a case in a real agent session and score the transcript. Version: ÆON Learn 0.3.0.

## Contents

| Section | Type |
|---|---|
| [What these evals are](#what-these-evals-are) | Explanation |
| [Run a case](#run-a-case) | How-to |
| [Record results](#record-results) | Reference |
| [Topic-independence smoke prompts](#topic-independence-smoke-prompts) | How-to |
| [Related documents](#related-documents) | Reference |

## What these evals are

ÆON Learn is a behavioural protocol: conformance is observable in transcripts, not in code. Each case in [the case directory](cases/) presents one invocation under simulated constraints and defines the observable behaviour a conforming agent must show, keyed to requirement IDs from [the ÆON Learn specification](../../products/learn/specification.md), its phase specifications and [the protocol core](../../protocol/README.md).

The evals are model-agnostic by construction (INT-1). Per INT-2, conformance is tested against at least three independent runtimes — the V1 baseline is OpenAI/ChatGPT, Anthropic Claude and Google Gemini. The same case is run identically on each; only capability-dependent behaviour may legitimately differ.

There is no harness. You run the case in a real agent session and score the transcript against [the compliance rubric](protocol-compliance.md).

## Run a case

1. **Start a fresh session.** Open a clean conversation with no prior ÆON context — no memory of earlier journeys, no leftover instructions. State-dependent cases say so explicitly in `simulated_context`.
2. **Present the invocation.** Send the case's `invocation` sentence verbatim, as a user would.
3. **Simulate the context constraints.** Apply `simulated_context` faithfully:
   - `capabilities` — the ten-key profile (CAP-1) the runtime genuinely has or is constrained to. Where you cannot constrain a real runtime (for example, it always has web access), tell the agent at session start which capabilities are unavailable and treat that declaration as the runtime's truth.
   - `learner_profile` and `notes` — the answers you give when the agent asks discovery questions, plus any mid-session events the case scripts.
4. **Play the learner, not the examiner.** Answer discovery questions with the case's profile, approve or challenge the contract as scripted, and let the agent drive. Do not hint at expected behaviour.
5. **Score the transcript.** Compare it against the case's `expected_behaviour`, `fail_conditions` and `pass_criteria` using [the compliance rubric](protocol-compliance.md).

## Record results

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

Store results wherever you track the run — an issue, a pull request, a results directory. The block shape is the contract, not the location. A conformance claim without transcript evidence is not a result.

## Topic-independence smoke prompts

The protocol is subject-independent: any subject must work. Before you claim conformance, run the full workflow with these three unrelated invocations and confirm that the same normative behaviour appears for each:

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

## Related documents

| Document | Why you would read it |
|---|---|
| [Case files and their shape](cases/README.md) | What each of the six case files contains, and which requirement each tests |
| [Compliance rubric](protocol-compliance.md) | How to turn a transcript into a PASS or FAIL verdict |
| [ÆON Learn specification](../../products/learn/specification.md) | The umbrella requirements the cases reference |
| [Protocol core](../../protocol/README.md) | Capability, research, epistemics and state requirements the cases also reference |
| [Deep-dive library](../../library/README.md) | Why one smoke prompt uses a library-seeded subject and two do not |
