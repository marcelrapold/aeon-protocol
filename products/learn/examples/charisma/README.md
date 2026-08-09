# Charisma Sprint — reference fixture

> [!NOTE]
> **Management summary.** The Charisma Sprint is the real 14-day learning journey that motivated ÆON Learn. It predates the protocol and is preserved here unchanged: three byte-identical source documents, fourteen verbatim session slices, and three retroactive companion documents (curriculum, source map, retrospective) that read the sprint through the protocol it inspired.

## Origin

A third-party Instagram advertisement for a charisma course supplied a list of lesson titles. Instead of buying the course, the user had an AI agent decompose the topic, research it against 26 anchored sources, and build a 14-day German-language sprint around the advertised titles — each day with one core thesis, a podcast manuscript, a deep-dive, operators, a daily drill and three reflection questions. The sprint is a research-grounded rebuild of a topic list, not the advertised product; full provenance, including why there are exactly 14 days, is in [source-map.md](source-map.md).

The important abstraction is not charisma. It is the reusable learning pattern behind the sprint:

```text
Raw external stimulus
→ User curiosity
→ Topic decomposition
→ Research
→ Daily sequencing
→ Podcast-native explanation
→ Evidence
→ Concrete behavioural transfer
→ Reflection
→ Progressive immersion
```

ÆON Learn generalises this chain into a subject-independent protocol. The fixture is the evidence that the pattern worked once, end to end, before it was specified — and [retrospective.md](retrospective.md) records what it got right and what the protocol adds.

## Inventory

| Path | Content | Status |
|---|---|---|
| `original/AEON_Charisma_Sprint_Deep_Dive_14_Tage.md` | The primary source: roadmap, 14 day sections, integration section, Quellenbasis S1–S26 | Preserved byte-identical |
| `original/AEON_Charisma_Sprint_Podcast_Scripts.md` | Compact daily briefings with a per-day mnemonic model and an informal Research Stack | Preserved byte-identical |
| `original/AEON_Charisma_Podcast_Manuskripte_14_Tage.md` | The deep-dive's fourteen podcast manuscripts as a standalone file — fully redundant, kept as historical artifact (see [source-map.md](source-map.md)) | Preserved byte-identical |
| `sessions/01-…14-*.md` | 14 verbatim character slices of the deep-dive's day sections, derived by [`scripts/split-charisma.mjs`](../../../../scripts/split-charisma.mjs) | Derived, regenerable |
| `integration.md` | The deep-dive's closing "Abschluss" section — the learner-facing integration protocol | Derived, regenerable |
| `curriculum.yaml` | Retroactive formalisation of the sprint into the ÆON Learn module contract | Companion document |
| `source-map.md` | Both evidence systems bridged and tiered; provenance; documented deviations | Companion document |
| `retrospective.md` | What worked, what the protocol improves | Companion document |

`node scripts/split-charisma.mjs` (from the repository root) regenerates `sessions/` and `integration.md`; it asserts the day count, every day title, and that the concatenated slices reproduce the source region character for character.

## Editorial notes

The `original/` files are frozen (see [CONTRIBUTING.md](../../../../CONTRIBUTING.md)); all editorial observations live here and in [source-map.md](source-map.md), never inline:

- **Typography varies across sources and is preserved as-is.** The deep-dive quotes with guillemets («…») and capitalises the formal address («Du»); the podcast-scripts file uses German low quotes („…“), lowercase «du», and titles the sprint «ÆON» with a ligature.
- **Swiss orthography throughout**: «ss» for «ß» («grösser», «heisst»), consistent with the sprint's de-CH audience.
- **Day titles are English inside German documents** («Tag 1: First Impression Hacks»). This is not a style choice of the sprint but inherited provenance — the titles were adopted verbatim from the advertisement's lesson index, as documented in [source-map.md](source-map.md).
