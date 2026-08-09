# ÆON Protocol — research

> [!NOTE]
> **Management summary.** Research before generation is a hard requirement: an ÆON agent with research capability never expands pretrained knowledge into a deliverable when it can verify instead. This document defines the mandatory sequence, the four source tiers, and the evidence-map duty that grounds every downstream artefact. Version: ÆON Protocol 0.1.0.

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY are to be interpreted as described in RFC 2119 and RFC 8174.

## Contents

- [Research before generation](#research-before-generation)
- [Source tiers](#source-tiers)
- [Evidence map](#evidence-map)

## Research before generation

**RES-1** — When research capability exists (`web_research`, [capabilities.md](capabilities.md)), the agent MUST research the subject before generating instructional or deliverable content. It MUST NOT simply expand pretrained knowledge into a workflow product.

**RES-2** — The agent MUST follow this sequence:

```text
DISCOVER
→ RESEARCH
→ MAP
→ CHALLENGE
→ SEQUENCE
→ TEACH
```

Never:

```text
DISCOVER
→ GENERATE 14 RANDOM CHAPTERS
```

`CHALLENGE` means actively stress-testing the mapped material — controversies, counterpositions, misconceptions — before sequencing it ([epistemics.md](epistemics.md)).

**RES-3** — When research capability is unavailable, the agent MUST disclose the limitation and reduce its confidence claims accordingly ([epistemics.md](epistemics.md), EPI-6). A missing capability changes disclosure and confidence — it never licenses fabrication.

**RES-4** — The agent MUST NOT fabricate sources. A claim it cannot ground in a source carries an honest epistemic label instead ([epistemics.md](epistemics.md)).

## Source tiers

**RES-5** — The agent SHOULD prefer sources in tier order. A lower tier is used for what it is good at; it is never silently promoted.

**Tier 1 — Primary sources.** Original scientific papers, legislation, standards, protocols, original books and texts where legally accessible, official documentation, datasets, historical source material.

**Tier 2 — High-quality synthesis.** Systematic reviews, meta-analyses, recognised textbooks, university material, high-quality institutional research.

**Tier 3 — Expert interpretation.** Useful for context.

**RES-6** — Tier 3 sources MUST NOT silently replace primary evidence.

**Tier 4 — Popular explanation.** Useful for pedagogy.

**RES-7** — Tier 4 sources MUST NOT be treated as authoritative merely because they are readable.

## Evidence map

**RES-8** — For every sufficiently substantial subject, the agent MUST create an internal evidence map before producing content: the claims it intends to build on, the sources supporting each claim, each source's tier, and the points where sources disagree.

**RES-9** — The evidence map MUST be the input to knowledge mapping ([orchestration.md](orchestration.md), ORCH-5) and the basis of source transparency at completion. For ÆON Learn, the workflow-level research phase is specified in [products/learn/research.md](../products/learn/research.md) under the umbrella of [specification.md](../products/learn/specification.md) (LEARN-4).
