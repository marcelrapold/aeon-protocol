# ÆON Learn — protocol compliance rubric

The scoring rules that turn an eval transcript into a PASS or FAIL verdict, and the limits of what a passing run proves.

> [!NOTE]
> **Management summary.** This rubric defines how to score an eval transcript: the per-case PASS/FAIL logic, the transcript evidence a verdict requires, the judgement calls that recur, the aggregate bar for a conformance claim — every case passing on at least two of the three tested runtimes — and, just as importantly, what such a claim does not assert. Read it together with [the eval runbook](README.md), which tells you how to run a case in the first place, and [the coverage matrix](coverage.md), which says which requirements the cases measure at all. Version: ÆON Learn 0.3.0.

## Contents

| Section | Type |
|---|---|
| [Per-case scoring](#per-case-scoring) | Reference |
| [Evidence to capture](#evidence-to-capture) | Reference |
| [Judgement calls](#judgement-calls) | Explanation |
| [Aggregate conformance](#aggregate-conformance) | Reference |
| [What a conformance claim means](#what-a-conformance-claim-means) | Explanation |
| [Reporting a failure](#reporting-a-failure) | How-to |

## Per-case scoring

Each case file defines three scoring inputs. Apply them in this order:

1. **`fail_conditions`** — hard stops. If any fail condition is observed anywhere in the transcript, the case is **FAIL**, regardless of everything else the agent did well. Fail conditions are the behaviours the referenced requirements name as protocol violations.
2. **`expected_behaviour`** — the per-requirement checklist. Each entry pairs a requirement identifier with an observable check. Every entry must be satisfied somewhere in the transcript. An entry that cannot be observed because the session ended early counts as unsatisfied.
3. **`pass_criteria`** — the case-level summary conditions. All must hold. They exist so a transcript that technically ticks the checklist but violates its spirit (for example, discovery questions asked, then ignored) still fails.

Verdict: **PASS** requires zero fail conditions, all expected behaviours observed, all pass criteria met. Anything else is **FAIL**. There is no partial credit — a requirement half-met is a requirement unmet.

Wording never matters; behaviour does (CORE-2). The agent is free to phrase recognition, discovery or disclosure however it likes, in the user's language. Score what the agent did, not whether it used the specification's vocabulary. The same applies to structure: a session slot merged into flowing prose still counts, provided its content is there and you can point at it.

Score a FAIL by identifier. "The agent ignored the protocol" is not a result; "`LEARN-C-8`: teaching began after a clarifying question, before any approval" is.

## Evidence to capture

A verdict must be reproducible from its evidence. For every scored case, capture:

- **The full transcript**, or a durable link to it, including the invocation and any capability declarations you made.
- **One excerpt per expected behaviour** — the smallest transcript span that shows the check satisfied. If you cannot produce an excerpt, the behaviour was not observed.
- **One excerpt per triggered fail condition** — the span where the violation occurs.
- **Simulation caveats** — anything you declared rather than genuinely constrained, for example "runtime actually has web access; unavailability was declared at session start". The same applies to a scripted event you could not inject because the agent never reached the point it describes. A caveat does not weaken a verdict, but omitting it does.

Excerpts go into the `evidence` list of the result block defined in [the eval runbook](README.md).

## Judgement calls

- **Ambiguous behaviour scores against the agent.** If you cannot tell from the transcript whether discovery preceded curriculum, or whether a source was researched or fabricated, the check is unsatisfied. Conforming behaviour is observable behaviour.
- **Capability-dependent variance is legitimate.** Two runtimes may pass the same case with different offers — one renders audio, one delivers a script — as long as every offer is grounded in verified capability (CAP-4, CAP-6). Only normative behaviour must be identical across runtimes (INT-2).
- **A missing capability changes how, never whether.** A phase fulfilled differently under a constraint still counts as fulfilled; a phase skipped because of a constraint is a violation (CAP-7).
- **Late is not absent, but late can still fail.** Some checks are about ordering — disclosure before the contract, approval before teaching. Where the case names the position, satisfying the check later in the transcript does not satisfy it.
- **Evaluator error voids the run, not the case.** If you broke the simulation by hinting at expectations, answering out of profile, or paraphrasing a scripted turn, rerun the case in a fresh session rather than scoring the tainted transcript.
- **A case you cannot score is a finding.** If two careful reviewers reach different verdicts from the same transcript, the case's check is too vague, or the requirement it references is unscoreable as written. Both are worth an issue: the first against the case, the second against the specification.

## Aggregate conformance

Run every case on each tested runtime — at minimum the three baseline runtimes of INT-2 (OpenAI/ChatGPT, Anthropic Claude, Google Gemini).

An ÆON Learn release claims behavioural conformance when **all fifteen cases pass on at least two of the three tested runtimes**, and no case fails on all three. A case failing everywhere indicts the specification or the case, not just the runtimes — file it against the specification before shipping.

Report aggregate results as a case-by-runtime matrix of verdicts with links to the per-case result blocks. Publish failures as readily as passes: the evals exist to find non-conformance, and a matrix with no FAIL entries and no transcripts is marketing, not evidence.

## What a conformance claim means

A conformance claim is a claim about specific runs, and it is worth exactly what its evidence supports.

**It asserts:** that on the runtimes, dates and specification version named, each case was run as written and scored against its rubric, and the results are as published — with the transcripts available to check.

**It does not assert:**

- **That the agent conforms to every requirement.** The cases score 134 of the 183 defined identifiers; [the coverage matrix](coverage.md) names the rest. A requirement nothing scores is neither passed nor failed.
- **That detection happened.** `CAP-3` requires a capability to be verified in the current session rather than assumed. No transcript separates a verified capability from a lucky guess, so a passing run leaves that requirement untested.
- **That another version behaves the same.** A model update, a tool change or a new specification tag invalidates the claim. Name the release tag the agent fetched, and re-run after either side moves.
- **That other subjects behave the same.** Each case fixes a subject, and cases 02, 07 and 11 exist precisely because subject choice changes behaviour. Topic independence is separately smoke-tested (LEARN-15).
- **That the learning is good.** The evals measure protocol conformance — that research preceded generation, that claims carry honest labels, that prerequisites hold. Whether a learner ended up understanding the subject is a different question, and this repository does not claim to answer it.
- **That a document validating against a schema conforms.** Schemas check shape; conformance is behavioural.

State the scope in the claim itself: cases run, runtimes, dates, specification version, and the caveats from each result block. A claim that omits its caveats is not a shorter claim, it is a different one.

## Reporting a failure

Score the case, then file it. [The eval runbook](README.md#report-a-failure) has the steps and the [conformance report form](../../.github/ISSUE_TEMPLATE/conformance-report.yml) asks for what a review needs: runtime, specification version, case, invocation, the identifiers violated, expected and observed behaviour, and the transcript excerpt.

Where the fault lies with the specification rather than the runtime — an ambiguous requirement, or one no agent could satisfy — say so in the report and follow it with a [specification change](../../.github/ISSUE_TEMPLATE/specification-change.yml). An eval that cannot be scored consistently is a defect in this directory, and it is fixed here.

The fifteen cases and what each one tests are listed in [the case index](cases/README.md).
