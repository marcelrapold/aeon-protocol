# AEON Learn — renderers

> [!NOTE]
> **Management summary.** One canonical semantic lesson per session; every output format is derived from it. Independently generated format variants drift apart and are a protocol violation. Three renderers are specified: podcast, presentation, article. Requirement prefix: `REN`. Version: AEON Learn 0.1.0.

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY are to be interpreted as described in RFC 2119 and RFC 8174.

## The one-source principle

**REN-1** — The agent MUST first produce one canonical semantic lesson per session — the slots A–J of `../session.md` with their content — and derive every output format from it. It MUST NOT generate formats independently: a podcast written from scratch and an article written from scratch will disagree on emphasis, examples and even claims, and the learner has no way to know which one to trust.

```text
canonical semantic lesson (slots A–J)
    │
    ├── podcast              (renderers/podcast.md)
    ├── deep-dive article    (renderers/article.md)
    ├── presentation         (renderers/presentation.md)
    ├── executive summary
    ├── flash cards
    ├── quiz
    └── exercises
```

**REN-2** — A renderer MAY compress, merge or omit slots to fit its medium, but it MUST NOT contradict the canonical lesson or introduce claims absent from it. The boundary slot (E — what the evidence does NOT prove) MUST survive into every prose-bearing format.

**REN-3** — Renderers are capability-gated (`../../../protocol/capabilities.md`). The agent MUST offer a format only when the required capability is verified — audio needs `audio_generation` or `text_to_speech`, slide files need `presentation_generation` — and otherwise deliver the closest degradation honestly: a podcast script as text, a presentation as an outline.

**REN-4** — Format selection follows the learner's preferred formats from discovery and the learning contract. Additional formats beyond the three specified below MAY be derived under the same rules.

## Specified renderers

| Renderer | Specification | ID prefix |
|---|---|---|
| Podcast | [podcast.md](podcast.md) | `REN-POD` |
| Presentation | [presentation.md](presentation.md) | `REN-PRE` |
| Deep-dive article | [article.md](article.md) | `REN-ART` |

The Charisma Sprint fixture (`../examples/charisma/`) shows podcast and article renderings derived from the same session substance — the pattern these specifications generalise.
