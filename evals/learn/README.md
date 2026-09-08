# ÆON Learn — behavioural evals

How to run and score the fifteen behavioural cases that decide whether a live agent conforms to ÆON Learn.

> [!NOTE]
> **Management summary.** These evals test whether a live agent actually behaves as the ÆON Learn specification requires — discovery before content, research before curriculum, honest capability handling, epistemic labelling, state that survives a pause, a close that does not overstate what was learned. They are model-agnostic, run by hand against any capable agent, and score PASS or FAIL per case against stable requirement identifiers. There is no harness and no code to install: you run a case in a real agent session and score the transcript. Version: ÆON Learn 0.3.0.

## Contents

| Section | Type |
|---|---|
| [What these evals are](#what-these-evals-are) | Explanation |
| [Run a case](#run-a-case) | How-to |
| [Record results](#record-results) | Reference |
| [Report a failure](#report-a-failure) | How-to |
| [Topic-independence smoke prompts](#topic-independence-smoke-prompts) | How-to |
| [Related documents](#related-documents) | Reference |

## What these evals are

ÆON Learn is a behavioural protocol: conformance is observable in transcripts, not in code. Each case in [the case directory](cases/) presents one invocation under simulated constraints and defines the observable behaviour a conforming agent must show, keyed to requirement identifiers from [the ÆON Learn specification](../../products/learn/specification.md), its phase specifications and [the protocol core](../../protocol/README.md).

The evals are model-agnostic by construction (INT-1). Per INT-2, conformance is tested against at least three independent runtimes — the V1 baseline is OpenAI/ChatGPT, Anthropic Claude and Google Gemini. The same case is run identically on each; only capability-dependent behaviour may legitimately differ.

There is no harness. You run the case in a real agent session and score the transcript against [the compliance rubric](protocol-compliance.md). What the cases do and do not measure is set out in [the coverage matrix](coverage.md): the fifteen cases score 134 of the 183 requirement identifiers, and the matrix names every one they do not.

## Run a case

1. **Read the whole case first.** Some cases script events for later in the journey, and some run several sessions deep. You cannot improvise those decisions mid-run without tainting the transcript.
2. **Start a fresh session.** Open a clean conversation with no prior ÆON context — no memory of earlier journeys, no leftover instructions. Cases that depend on that say so in `simulated_context`.
3. **Establish the constraints before the invocation.** Apply `simulated_context.capabilities` — the ten-key profile (CAP-1) the runtime genuinely has or is constrained to. Where you cannot constrain a real runtime (for example, it always has web access), tell the agent at session start which capabilities are unavailable, treat that declaration as the runtime's truth, and record it as a caveat.
4. **Present the invocation.** Send the case's `invocation` sentence verbatim, as a user would. Add nothing to it.
5. **Play the learner, not the examiner.** Answer discovery questions from `learner_profile`, inject each `scripted_events` entry at the point its `when` describes, and otherwise let the agent drive. Never hint at the expected behaviour, and never quote a requirement at the agent.
6. **Run the case far enough to observe every check.** A behaviour you never reached is a behaviour you did not observe, and scores as unsatisfied.
7. **Score the transcript** against the case's `expected_behaviour`, `fail_conditions` and `pass_criteria`, using [the compliance rubric](protocol-compliance.md).

Two rules about the simulation itself. First, a scripted turn is sent verbatim: paraphrasing it changes what the case tests. Second, when the agent's own path makes a scripted event impossible — it never asks the question the event answers — record that instead of forcing the event in, and say so in the result.

## Record results

Record one result block per case per runtime, alongside the transcript evidence the rubric requires:

```yaml
case: eval-01
runtime: <vendor / product / model, e.g. "Anthropic Claude (claude-x)">
specification_version: <release tag the agent fetched, or "main">
date: 2026-08-09
evaluator: <name or handle>
verdict: PASS | FAIL
requirements_violated: []   # identifiers, for a FAIL
evidence:
  - <transcript excerpt demonstrating or violating a listed behaviour>
caveats: <capabilities declared rather than constrained, scripted events that could not be injected>
```

Store results wherever you track the run — an issue, a pull request, a results directory. The block shape is the contract, not the location. A conformance claim without transcript evidence is not a result.

## Report a failure

A case that fails belongs in the open, whether the fault lies with the runtime or with the specification.

1. Score the case fully first. A report naming one violated identifier is worth more than an impression that the agent "ignored the protocol".
2. Open a [conformance report](../../.github/ISSUE_TEMPLATE/conformance-report.yml). It asks for the runtime, the specification version, the case, the invocation, the identifiers violated, the expected and observed behaviour, and the transcript excerpt that shows it.
3. Say where you think the fault lies. Three outcomes are ordinary: the runtime ignored a clear requirement, the specification is ambiguous enough to permit the behaviour, or the specification requires something the runtime cannot do. The last two change the specification, not the agent.
4. If the same case fails on every runtime you tested, say so prominently. A case failing everywhere indicts the specification or the case itself, and it blocks a release rather than one vendor.

## Topic-independence smoke prompts

The protocol is subject-independent: any subject must work (LEARN-15). Before you claim conformance, run the full workflow with these three unrelated invocations and confirm that the same normative behaviour appears for each:

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
| [Case files and their shape](cases/README.md) | What each of the fifteen case files contains, and which risk each one targets |
| [Compliance rubric](protocol-compliance.md) | How to turn a transcript into a PASS or FAIL verdict, and what a conformance claim means |
| [Requirement coverage](coverage.md) | Which requirement each case scores, and which requirements nothing scores yet |
| [Eval-case schema](../../schemas/eval-case.schema.json) | The machine-readable shape every case file validates against |
| [ÆON Learn specification](../../products/learn/specification.md) | The umbrella requirements the cases reference |
| [Protocol core](../../protocol/README.md) | Capability, research, epistemics and state requirements the cases also reference |
| [Deep-dive library](../../library/README.md) | Why one smoke prompt uses a library-seeded subject and two do not |
