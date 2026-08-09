# AEON Learn — subject research

> [!NOTE]
> **Management summary.** After discovery the agent researches the subject before writing a single lesson. It applies the protocol research discipline to the learning subject and produces an evidence map: tiered sources, epistemically labelled claims, researched counterpositions and named gaps. Without web research the agent does not simulate this step — it discloses the limitation and lowers its confidence claims. This specification refines LEARN-4 and LEARN-10 of [specification.md](specification.md). Requirement IDs: `LEARN-R-n`. Version: AEON Learn 0.1.0.

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY are to be interpreted as described in RFC 2119 and RFC 8174.

Research is the `RESEARCHING` state of the journey state machine ([`../../protocol/state.md`](../../protocol/state.md)), between discovery and knowledge mapping. Source tiering and the general research discipline are defined in [`../../protocol/research.md`](../../protocol/research.md); epistemic labels in [`../../protocol/epistemics.md`](../../protocol/epistemics.md). This document specifies how both apply to a learning subject.

## Contents

- [Research discipline](#research-discipline)
- [Evidence map](#evidence-map)
- [Behaviour without web research](#behaviour-without-web-research)
- [Library packages](#library-packages)

## Research discipline

**LEARN-R-1** — When `web_research` is verified available (LEARN-2, [`../../protocol/capabilities.md`](../../protocol/capabilities.md)), the agent MUST research the subject before knowledge mapping begins. Expanding pretrained knowledge into a course while research was possible is a protocol violation (LEARN-4).

**LEARN-R-2** — Research MUST follow the source tiers of [`../../protocol/research.md`](../../protocol/research.md): Tier 1 primary sources first, then Tier 2 high-quality synthesis. Tier 3 expert interpretation and Tier 4 popular explanation are pedagogically useful — for hooks, examples and phrasing — but MUST NOT silently substitute for Tier 1–2 evidence in a module's `evidence` field.

**LEARN-R-3** — Research scope SHOULD be proportional to `desired_depth` and `program_duration` from the learner model. A 7-day overview does not require the source base of an expert path — but every claim the curriculum will teach still needs either a source or an honest label per LEARN-R-6.

**LEARN-R-4** — For contested subjects the agent MUST research serious counterpositions rather than construct them from imagination. Counterpositions enter the journey here, at research time; LEARN-10 requires them to survive into curriculum and sessions.

## Evidence map

**LEARN-R-5** — Research MUST produce an evidence map containing at least sources, claims and gaps. The serialisation is internal; the following content is normative:

```yaml
evidence_map:
  subject:
  research_capability: web_research | pretrained_only
  sources:
    - id:
      title:
      tier: 1 | 2 | 3 | 4        # per ../../protocol/research.md
      locator:                    # URL, DOI, ISBN or equivalent
      supports: []                # claim ids
  claims:
    - id:
      statement:
      label:                      # per ../../protocol/epistemics.md
      sources: []                 # source ids
      counterpositions: []        # researched, for contested claims
  gaps: []                        # what research could not resolve or verify
```

**LEARN-R-6** — Every claim MUST carry an epistemic label per [`../../protocol/epistemics.md`](../../protocol/epistemics.md). A claim without any supporting source MUST be labelled `AEON inference`. The agent MUST NOT fabricate sources: a gap named honestly is protocol-conformant; an invented citation is a violation.

**LEARN-R-7** — The evidence map is internal but not secret. It feeds the `evidence` and `counterposition` fields of curriculum modules ([curriculum.md](curriculum.md)) and the source map delivered at completion (LEARN-14, [assessment.md](assessment.md)). The agent MUST be able to show the sources behind any taught claim on request.

## Behaviour without web research

**LEARN-R-8** — When `web_research` is unavailable, the agent MUST:

1. disclose the limitation to the learner before presenting the learning contract (Eval 06),
2. record `research_capability: pretrained_only` in the evidence map,
3. label claims as recall from pretrained knowledge, not as researched evidence, and reduce confidence claims accordingly — unverifiable claims MUST NOT be presented with the certainty of verified ones,
4. not fabricate citations to simulate research.

The agent SHOULD offer to re-run research if the capability becomes available later in the journey.

## Library packages

**LEARN-R-9** — A topic package in [`../../library/`](../../library/) MAY seed the evidence map (its `canonical-sources.yaml` becomes an initial source list) and so accelerate research. Packages MUST NOT cap research or limit AEON Learn to predefined subjects (see [specification.md](specification.md), Scope).
