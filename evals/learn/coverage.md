# ÆON Learn — requirement coverage

Which requirement each eval case scores, and which requirements no case scores at all.

> [!NOTE]
> **Management summary.** Requirements carry stable identifiers so that evals can reference them; this document turns that traceability into a matrix that runs both ways. Of the 183 identifiers defined in [the protocol](../../protocol/README.md), [ÆON Learn](../../products/learn/specification.md) and [the library](../../library/README.md), the fifteen cases score 134. The rest are listed here with the reason — checked elsewhere, covered in effect by a neighbouring identifier, or a real gap waiting for a case. A gap named in a table is a gap someone can close; a gap left as folklore is a conformance claim resting on nothing. Version: ÆON Learn 0.3.0.

## Contents

| Section | Type |
|---|---|
| [How to read this](#how-to-read-this) | Explanation |
| [Coverage at a glance](#coverage-at-a-glance) | Reference |
| [What each case scores](#what-each-case-scores) | Reference |
| [What no case scores](#what-no-case-scores) | Reference |
| [Keeping the matrix true](#keeping-the-matrix-true) | How-to |

## How to read this

A requirement is **scored** when a case names it in `expected_behaviour` together with a check a reviewer can satisfy from the transcript. Being exercised is not the same as being scored: every case runs sessions, but until a case states what to look at and what would count as a violation, nothing about session anatomy is being measured.

Coverage is therefore a claim about the evals, not about any agent. A high number here means failures would be caught, not that they do not occur.

Two rules keep the matrix honest:

- Every identifier a case names must exist in a specification. The `requirements` check of [the validation toolchain](../../tools/validate.mjs) fails the build on a reference no specification defines, so a dangling identifier cannot survive a pull request.
- A requirement is listed as covered only where the case's check is specific to it. Where two identifiers describe the same observable behaviour, one is scored and the other is recorded below as covered in effect, rather than counted twice.

## Coverage at a glance

| Specification | Requirements | Scored | Not scored |
|---|---|---|---|
| [protocol/core.md](../../protocol/core.md) | 7 | 0 | 7 |
| [protocol/capabilities.md](../../protocol/capabilities.md) | 10 | 5 | 5 |
| [protocol/orchestration.md](../../protocol/orchestration.md) | 9 | 8 | 1 |
| [protocol/research.md](../../protocol/research.md) | 10 | 8 | 2 |
| [protocol/epistemics.md](../../protocol/epistemics.md) | 7 | 7 | 0 |
| [protocol/state.md](../../protocol/state.md) | 10 | 9 | 1 |
| [protocol/interoperability.md](../../protocol/interoperability.md) | 11 | 5 | 6 |
| [products/learn/specification.md](../../products/learn/specification.md) | 16 | 15 | 1 |
| [products/learn/discovery.md](../../products/learn/discovery.md) | 8 | 8 | 0 |
| [products/learn/research.md](../../products/learn/research.md) | 12 | 12 | 0 |
| [products/learn/knowledge-map.md](../../products/learn/knowledge-map.md) | 6 | 4 | 2 |
| [products/learn/curriculum.md](../../products/learn/curriculum.md) | 13 | 9 | 4 |
| [products/learn/session.md](../../products/learn/session.md) | 14 | 13 | 1 |
| [products/learn/adaptation.md](../../products/learn/adaptation.md) | 13 | 13 | 0 |
| [products/learn/assessment.md](../../products/learn/assessment.md) | 10 | 9 | 1 |
| [products/learn/renderers/README.md](../../products/learn/renderers/README.md) | 5 | 5 | 0 |
| [products/learn/renderers/podcast.md](../../products/learn/renderers/podcast.md) | 7 | 2 | 5 |
| [products/learn/renderers/presentation.md](../../products/learn/renderers/presentation.md) | 5 | 1 | 4 |
| [products/learn/renderers/article.md](../../products/learn/renderers/article.md) | 9 | 0 | 9 |
| [library/README.md](../../library/README.md) | 1 | 1 | 0 |
| **Total** | **183** | **134** | **49** |

The three renderer specifications carry the thinnest coverage, and that is the largest single gap: [eval-10](cases/eval-10-renderer-degradation.yaml) scores the renderer contract and the degradation duties, but no case scores whether a rendered podcast, deck or article follows its own specified structure.

## What each case scores

### Protocol core requirements

| Requirement | Scored by |
|---|---|
| `CAP-4` | eval-03, eval-10 |
| `CAP-6` | eval-03, eval-10 |
| `CAP-7` | eval-06 |
| `CAP-8` | eval-03 |
| `CAP-10` | eval-10 |
| `ORCH-1` | eval-01 |
| `ORCH-2` | eval-01 |
| `ORCH-4` | eval-08 |
| `ORCH-5` | eval-02 |
| `ORCH-6` | eval-02 |
| `ORCH-7` | eval-12 |
| `ORCH-8` | eval-09 |
| `ORCH-9` | eval-12 |
| `RES-1` | eval-02 |
| `RES-3` | eval-06 |
| `RES-4` | eval-06 |
| `RES-5` | eval-07 |
| `RES-6` | eval-07 |
| `RES-7` | eval-07 |
| `RES-8` | eval-02 |
| `RES-10` | eval-06 |
| `EPI-1` | eval-05 |
| `EPI-2` | eval-05 |
| `EPI-3` | eval-05 |
| `EPI-4` | eval-05 |
| `EPI-5` | eval-05, eval-07 |
| `EPI-6` | eval-06 |
| `EPI-7` | eval-07 |
| `STA-1` | eval-08 |
| `STA-2` | eval-08 |
| `STA-3` | eval-08 |
| `STA-4` | eval-09 |
| `STA-5` | eval-08 |
| `STA-6` | eval-03 |
| `STA-7` | eval-03, eval-08 |
| `STA-8` | eval-08 |
| `STA-9` | eval-12 |
| `INT-4` | eval-13 |
| `INT-8` | eval-08 |
| `INT-9` | eval-13 |
| `INT-10` | eval-13 |
| `INT-11` | eval-13 |

### ÆON Learn umbrella requirements

| Requirement | Scored by |
|---|---|
| `LEARN-1` | eval-01, eval-13 |
| `LEARN-2` | eval-01 |
| `LEARN-3` | eval-01, eval-02 |
| `LEARN-4` | eval-02, eval-06 |
| `LEARN-5` | eval-02 |
| `LEARN-6` | eval-11 |
| `LEARN-7` | eval-03 |
| `LEARN-8` | eval-14 |
| `LEARN-9` | eval-08 |
| `LEARN-10` | eval-05 |
| `LEARN-11` | eval-10 |
| `LEARN-12` | eval-09 |
| `LEARN-13` | eval-04 |
| `LEARN-14` | eval-15 |
| `LEARN-15` | eval-02, eval-11 |
| `LIB-1` | eval-11 |

### Phase requirements

| Requirement | Scored by |
|---|---|
| `LEARN-D-1` | eval-01 |
| `LEARN-D-2` | eval-12 |
| `LEARN-D-3` | eval-01 |
| `LEARN-D-4` | eval-01 |
| `LEARN-D-5` | eval-01 |
| `LEARN-D-6` | eval-12 |
| `LEARN-D-7` | eval-01 |
| `LEARN-D-8` | eval-13 |
| `LEARN-R-1` | eval-11 |
| `LEARN-R-2` | eval-02, eval-07 |
| `LEARN-R-3` | eval-07 |
| `LEARN-R-4` | eval-05 |
| `LEARN-R-5` | eval-02 |
| `LEARN-R-6` | eval-06 |
| `LEARN-R-7` | eval-02 |
| `LEARN-R-8` | eval-06 |
| `LEARN-R-9` | eval-02, eval-11 |
| `LEARN-R-10` | eval-06 |
| `LEARN-R-11` | eval-06 |
| `LEARN-R-12` | eval-07 |
| `LEARN-K-1` | eval-11 |
| `LEARN-K-3` | eval-07 |
| `LEARN-K-5` | eval-04 |
| `LEARN-K-6` | eval-04, eval-15 |
| `LEARN-C-1` | eval-04, eval-11 |
| `LEARN-C-2` | eval-05 |
| `LEARN-C-3` | eval-11 |
| `LEARN-C-6` | eval-11, eval-12 |
| `LEARN-C-7` | eval-04, eval-12 |
| `LEARN-C-8` | eval-12 |
| `LEARN-C-9` | eval-12 |
| `LEARN-C-10` | eval-03, eval-12 |
| `LEARN-C-12` | eval-04 |
| `LEARN-S-1` | eval-14 |
| `LEARN-S-2` | eval-14 |
| `LEARN-S-3` | eval-14 |
| `LEARN-S-4` | eval-06, eval-07 |
| `LEARN-S-5` | eval-14 |
| `LEARN-S-6` | eval-05 |
| `LEARN-S-7` | eval-11 |
| `LEARN-S-8` | eval-14 |
| `LEARN-S-9` | eval-14 |
| `LEARN-S-10` | eval-14 |
| `LEARN-S-11` | eval-14 |
| `LEARN-S-12` | eval-14 |
| `LEARN-S-13` | eval-14 |
| `LEARN-A-1` | eval-09 |
| `LEARN-A-2` | eval-09 |
| `LEARN-A-3` | eval-09 |
| `LEARN-A-4` | eval-09 |
| `LEARN-A-5` | eval-09 |
| `LEARN-A-6` | eval-04 |
| `LEARN-A-7` | eval-09 |
| `LEARN-A-8` | eval-04 |
| `LEARN-A-9` | eval-09 |
| `LEARN-A-10` | eval-08 |
| `LEARN-A-11` | eval-14 |
| `LEARN-A-12` | eval-08 |
| `LEARN-A-13` | eval-08 |
| `LEARN-AS-1` | eval-15 |
| `LEARN-AS-2` | eval-09 |
| `LEARN-AS-3` | eval-09 |
| `LEARN-AS-4` | eval-09 |
| `LEARN-AS-5` | eval-15 |
| `LEARN-AS-6` | eval-15 |
| `LEARN-AS-7` | eval-15 |
| `LEARN-AS-8` | eval-06, eval-15 |
| `LEARN-AS-9` | eval-15 |
| `REN-1` | eval-10 |
| `REN-2` | eval-10 |
| `REN-3` | eval-10 |
| `REN-4` | eval-10 |
| `REN-5` | eval-10 |
| `REN-POD-3` | eval-10 |
| `REN-POD-6` | eval-10 |
| `REN-PRE-5` | eval-10 |

## What no case scores

The 49 unscored identifiers fall into three groups. Only the third is a gap in the evals.

### Checked somewhere other than a case

These bind a specification author, this repository or the invocation surface — not the agent whose transcript a case scores.

| Requirement | Where it is checked instead |
|---|---|
| `CORE-1`, `INT-1` | Model independence is a property of the whole result matrix: the same normative behaviour across runtimes, per [the compliance rubric](protocol-compliance.md). No single transcript can show it. |
| `CORE-2` | Binds the reviewer. The rubric applies it directly: score behaviour, never wording. |
| `CORE-3`, `CORE-4` | Realised as duties on the agent by `CAP-3` to `CAP-5`; observable only through the offers a case scores under `CAP-4` and `ORCH-2`. |
| `CORE-5` | A tie-breaking rule for authors and reviewers when requirements conflict. |
| `CORE-6`, `CORE-7` | Define what a conformance claim means and how a product specification may extend the core. Applied when a claim is published, not during a run. |
| `INT-2` | The aggregate bar of the rubric: run every case on at least three independent runtimes. |
| `INT-3` | Exercised by every case — the evaluator only ever sends a plain sentence — while its agent-side duties are scored as `INT-9` and `INT-10` in eval-13. |
| `INT-5`, `INT-6`, `INT-7` | Duties on the invocation surface and this repository. Continuous integration checks them: link resolution, and the release-pin check that every agent-facing URL names the same tag. |
| `LEARN-C-5` | A serialisation SHOULD, checked mechanically by the schemas check whenever a curriculum is published as data. |

### Covered in effect by a neighbouring identifier

The behaviour is scored; a second identifier describing the same observable is not scored again.

| Requirement | Scored through |
|---|---|
| `CAP-1`, `CAP-2` | The ten-key vocabulary every case's `capabilities` block uses. A runtime that breaks it fails `CAP-4` or `CAP-6` first. |
| `CAP-5` | `ORCH-2` in eval-01 — detection before the first learner-facing phase. |
| `ORCH-3` | `ORCH-5` and `ORCH-6` in eval-02 — the artefact chain is what those checks follow. |
| `RES-2` | `ORCH-6` in eval-02 — the same ordered sequence, stated protocol-side. |
| `RES-9` | `ORCH-5` in eval-02 — tracing one claim from source through map to module. |
| `LEARN-K-4` | `LEARN-5` in eval-02 and `LEARN-C-1` in eval-04 and eval-11 — dependency order in the compiled sequence. |
| `LEARN-C-4` | `LEARN-A-9` in eval-09 — retrieval questions reappearing at spaced intervals. |
| `LEARN-C-11` | `LEARN-C-2` in eval-05 and `LEARN-C-6` in eval-11 and eval-12 — level order surviving compression. |
| `LEARN-C-13`, `LEARN-S-14` | Permissions, not duties: they widen what a conforming module or renderer may do, so there is nothing for a case to fail. |
| `LEARN-AS-10` | `STA-4` in eval-09 and `LEARN-AS-2` to `LEARN-AS-4` in the same case — the mid-journey assessment and its return through adaptation. |

### Real gaps

| Requirement | What would close it |
|---|---|
| `CAP-9` | A case that scripts an undeterminable capability — the evaluator tells the agent it has no way to establish whether it can generate files — and scores whether the agent records it as unavailable rather than assuming either way. |
| `LEARN-K-2` | The knowledge graph is internal, so nothing scores whether it is explicit and acyclic. A case would have to ask the agent to show its dependency graph and check it for cycles and for concepts with no path to the goal. |
| `LEARN-16` | A probe that asks the agent to justify a departure from a SHOULD. Writing it is delicate: an evaluator who names the expected behaviour has already broken the run, so the probe has to be a neutral "why is the path built this way?". |
| `STA-10` | A variant of eval-08 that pastes a truncated or non-canonical state block and scores whether the agent names the parts it could not read instead of guessing. |
| `REN-ART-1` to `REN-ART-9`, `REN-POD-1`, `REN-POD-2`, `REN-POD-4`, `REN-POD-5`, `REN-POD-7`, `REN-PRE-1` to `REN-PRE-4` | A renderer-fidelity case: one canonical lesson rendered into all three formats, each scored against its own part structure — the article's five parts, the podcast's nine parts and spoken-text rules, the deck's eight slides and one-idea-per-slide rule. eval-10 scores the renderer contract and the degradation duties, not the internal shape of a rendering. |

> [!IMPORTANT]
> `CAP-3` is unscoreable as written, and is listed nowhere above as covered. It requires the agent to verify a capability in the current session rather than assume it from vendor documentation. A transcript cannot distinguish a verified capability from a correctly guessed one: both look like a true flag and a working offer. The evals can only score the consequences — `CAP-4`, `CAP-9`, `CAP-10` — which is why a run that passes every case still does not prove that detection happened.

## Keeping the matrix true

The matrix is derived from the case files, so it drifts the moment a case changes. Re-derive it rather than editing rows by hand:

1. For each case, read the `requirement` values of `expected_behaviour`.
2. For each specification under [`protocol/`](../../protocol/), [`products/learn/`](../../products/learn/) and [`library/README.md`](../../library/README.md), collect every identifier defined as `**ID** — …` at the start of a line.
3. Update [Coverage at a glance](#coverage-at-a-glance), the per-area tables, and the three groups above.

Run the toolchain afterwards, from the repository root:

```sh
npm run validate:requirements
npx ajv-cli validate --spec=draft2020 \
  -s schemas/eval-case.schema.json \
  -d "evals/learn/cases/*.yaml"
```

A new requirement in a specification is not automatically a gap: decide which of the three groups it belongs to, and say so here. An unclassified identifier is the folklore this document exists to remove.
