# AEON Learn — protocol compliance rubric

> [!NOTE]
> **Management summary.** How to score an eval transcript: per-case PASS/FAIL logic, the transcript evidence a verdict requires, and the aggregate conformance bar — all six cases passing on at least two of the three tested runtimes. Version: AEON Learn 0.1.0.

## Contents

- [Per-case scoring](#per-case-scoring)
- [Evidence to capture](#evidence-to-capture)
- [Judgement calls](#judgement-calls)
- [Aggregate conformance](#aggregate-conformance)

## Per-case scoring

Each case file defines three scoring inputs. Apply them in this order:

1. **`fail_conditions`** — hard stops. If any fail condition is observed anywhere in the transcript, the case is **FAIL**, regardless of everything else the agent did well. Fail conditions are the behaviours the referenced requirements name as protocol violations.
2. **`expected_behaviour`** — the per-requirement checklist. Each entry pairs a requirement ID with an observable check. Every entry must be satisfied somewhere in the transcript. An entry that cannot be observed because the session ended early counts as unsatisfied.
3. **`pass_criteria`** — the case-level summary conditions. All must hold. They exist so a transcript that technically ticks the checklist but violates its spirit (e.g. discovery questions asked, then ignored) still fails.

Verdict: **PASS** requires zero fail conditions, all expected behaviours observed, all pass criteria met. Anything else is **FAIL**. There is no partial credit — a requirement half-met is a requirement unmet.

Wording never matters; behaviour does (CORE-2). The agent is free to phrase recognition, discovery or disclosure however it likes, in the user's language. Score what the agent did, not whether it used the specification's vocabulary.

## Evidence to capture

A verdict must be reproducible from its evidence. For every scored case, capture:

- **The full transcript** (or a durable link to it), including the invocation and any capability declarations the evaluator made.
- **One excerpt per expected behaviour** — the smallest transcript span that shows the check satisfied. If an excerpt cannot be produced, the behaviour was not observed.
- **One excerpt per triggered fail condition** — the span where the violation occurs.
- **Simulation caveats** — anything the evaluator had to declare rather than genuinely constrain (e.g. "runtime actually has web access; unavailability was declared at session start"). A caveat does not weaken a verdict, but omitting it does.

Excerpts go into the `evidence` list of the result block defined in [README.md](README.md).

## Judgement calls

- **Ambiguous behaviour scores against the agent.** If the evaluator cannot tell from the transcript whether discovery preceded curriculum, or whether a source was researched or fabricated, the check is unsatisfied. Conforming behaviour is observable behaviour.
- **Capability-dependent variance is legitimate.** Two runtimes may pass the same case with different offers (one renders audio, one delivers a script) as long as every offer is grounded in verified capability (CAP-4, CAP-6). Only normative behaviour must be identical across runtimes (INT-2).
- **Evaluator error voids the run, not the case.** If the evaluator broke the simulation (hinted at expectations, answered out of profile), rerun in a fresh session rather than scoring the tainted transcript.

## Aggregate conformance

Run all six cases on each tested runtime — at minimum the three baseline runtimes of INT-2 (OpenAI/ChatGPT, Anthropic Claude, Google Gemini).

An AEON Learn release claims behavioural conformance when **all 6 cases pass on at least 2 of the 3 tested runtimes**, and no case fails on all three. A case failing everywhere indicts the specification or the case, not just the runtimes — file it against the spec before shipping.

Report aggregate results as a case × runtime matrix of verdicts with links to the per-case result blocks. Publish failures as readily as passes: the evals exist to find non-conformance, and a matrix with no FAIL entries and no transcripts is marketing, not evidence.
