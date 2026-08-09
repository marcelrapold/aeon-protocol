# Deep-dive library

> [!NOTE]
> **Management summary.** Optional topic packages: curated epistemic scaffolding — tier-classified sources, knowledge maps, misconception debunks, curriculum templates — that an agent loads to accelerate the research and mapping phases for a known subject. A package pre-answers "where is the good evidence and how does this subject hang together?", never "what are the lessons?". ÆON Learn works identically for subjects with no package.

**LIB-1** — Topic packages are accelerators and MUST NOT limit ÆON to predefined subjects.

That is the only normative sentence in this directory. Everything below describes what a package contains and how a conforming agent exploits one when it happens to exist.

## Package anatomy

A topic package is a directory under `library/` with up to six YAML files:

| File | Required | Purpose |
|---|---|---|
| `manifest.yaml` | yes | Package identity: `id`, `name`, `version`, `domains`, `canonical_sources` (citation strings), `learning_paths`, `prerequisites`. Validates against [`schemas/topic-package.schema.json`](../schemas/topic-package.schema.json). |
| `canonical-sources.yaml` | no | Tier-classified source entries with URLs to legally accessible editions — the seed of the evidence map (`../protocol/research.md`). |
| `knowledge-map.yaml` | no | Prior knowledge structure: concepts and their dependencies, mental models, key people and schools, historical context, controversies with named counterpositions (`../products/learn/knowledge-map.md`). |
| `common-misconceptions.yaml` | no | Documented myths with corrections and evidence — feeds the misconception slot of the knowledge map and the boundary step of sessions. |
| `curriculum-template.yaml` | no | A sequencing skeleton that survived real use, for the curriculum compiler to adapt — never a fixed course. |
| `advanced-paths.yaml` | no | Deepening paths for the recommended-next-path step at completion. |

Curated epistemic scaffolding is preferred over fixed prose lessons: a package ships judgement about sources and structure, not finished content. Partial packages are normal — a package carries only the files it can ground in real sources.

## How an agent uses a package

Mapped to the journey state machine (`../protocol/state.md`):

1. **DISCOVERY** — unaffected. Discovery is about the learner, and no package knows the learner.
2. **RESEARCHING** — `canonical-sources.yaml` seeds the evidence map with verified starting points instead of a cold search. Live research still runs on top of it: links get checked, gaps get filled, anything newer than the package gets searched for. The package `version` and source dates tell the agent how stale the curation may be.
3. **MAPPING** — `knowledge-map.yaml` is a prior to test against research findings, not a substitute for mapping. `common-misconceptions.yaml` items land in the knowledge map's misconception slot and later become debunk material in sessions.
4. **CURRICULUM_READY** — `curriculum-template.yaml` offers a proven skeleton; the compiler reshapes it around the discovered learner (duration, depth, formats, goal) rather than serving it verbatim.
5. **COMPLETED** — `advanced-paths.yaml` feeds the recommended next learning path.

For any subject without a package, the agent runs the same phases from scratch. That is the normal case, and LIB-1 exists so it stays normal.

## Person lenses

Some packages carry a `popular_lenses` list in their manifest: public figures through whom many learners first meet a subject (a podcast host, an entrepreneur, a popular author). A lens is framing, not authority — it documents why people arrive and which tier the person's material occupies, so an invocation like "teach me what X teaches" can be accelerated by the underlying subject package while the person's popular work is tiered honestly (usually Tier 4, peer-reviewed collaborations higher). Controversies around lens figures are handled like any other controversy: named critiques, no hagiography, no hit piece.

## Packages

| Package | Character |
|---|---|
| [`charisma/`](charisma/) | Reference package (all six files), grounded in the origin fixture ([Charisma Sprint](../products/learn/examples/charisma/)) and its S1–S26 source base |
| [`austrian-economics/`](austrian-economics/) | Research package for the canonical invocation subject |
| [`bitcoin/`](bitcoin/) | Technical-primary-source package |
| [`personality-psychology/`](personality-psychology/) | Person lens: Jordan Peterson |
| [`mindfulness-meditation/`](mindfulness-meditation/) | Person lens: Jay Shetty |
| [`first-principles-thinking/`](first-principles-thinking/) | Person lens: Elon Musk |
| [`game-theory/`](game-theory/) | Strategic interaction |
| [`monetary-history/`](monetary-history/) | Related: austrian-economics, bitcoin |
| [`cryptography/`](cryptography/) | Related: bitcoin |
| [`systems-thinking/`](systems-thinking/) | Feedback, stocks and flows, leverage points |
| [`stoicism/`](stoicism/) | Tier 1 primary texts in the public domain |
| [`negotiation/`](negotiation/) | Research first, practitioner lore labelled |
| [`sleep-science/`](sleep-science/) | Includes the popularisation controversy as a worked example |
| [`habit-formation/`](habit-formation/) | The 21-day myth, debunked at the source |

## Contributing a package

- Write `manifest.yaml` first and validate it against the topic-package schema.
- Real sources only, each entry tier-classified per `../protocol/research.md`, with working URLs where legally accessible editions exist.
- Contested subjects name real counterpositions in the knowledge map's controversies — see [`austrian-economics/knowledge-map.yaml`](austrian-economics/knowledge-map.yaml) for the expected depth.
- Package content is English; source-language quotes only when quoting a fixture or a primary text.
- YAML with 2-space indentation, no tabs.
