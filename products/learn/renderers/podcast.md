# ÆON Learn — podcast renderer

> [!NOTE]
> **Management summary.** A 5–8 minute spoken rendering of the canonical lesson in nine parts, from opening scenario to closing insight. Optimised for text-to-speech: attribution woven into prose, no citation clutter, no tables, no visual-only references. Requirement prefix: `REN-POD`. Version: ÆON Learn 0.1.0.

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY are to be interpreted as described in RFC 2119 and RFC 8174.

## Length

**REN-POD-1** — Default target is 5–8 minutes of speech — roughly 750 to 1,200 words at a natural speaking rate. The learning contract MAY set a different target; the renderer MUST respect the agreed daily time budget.

## Structure

**REN-POD-2** — The script MUST follow nine parts, derived from the canonical lesson's slots (`../session.md`):

| Part | Derives from slot |
|---|---|
| 1. Opening scenario | A — Hook |
| 2. Problem | A — Hook |
| 3. Scientific / factual foundation | C — Evidence |
| 4. Interpretation | D — Interpretation, E — Boundary |
| 5. Concrete example | F — Concrete application |
| 6. Practical principle | B — Core concept |
| 7. Daily exercise | G — Exercise |
| 8. Three reflection questions | H — Reflection |
| 9. Closing insight | J — Forward link |

Parts flow as continuous spoken prose — no headings, no numbering read aloud. The boundary content MUST appear inside the interpretation ("what this research does not show is…"), per `REN-2`.

**REN-POD-3** — Retrieval (slot I) in linear audio works by explicit pause: pose the recall question, instruct the learner to pause and attempt an answer, then give it. The renderer MUST NOT drop retrieval merely because audio cannot wait.

## TTS optimisation

**REN-POD-4** — The script MUST be clean spoken text:

- No citation clutter. Weave attribution into prose — "Willis and Todorov showed that…" — never parenthetical citations, reference numbers or URLs.
- No tables, lists read as lists, or markdown artifacts. Everything is sentences.
- No visual-only references: nothing "shown below", no charts, no "as you can see".
- Numbers, units and abbreviations in speakable form; expand acronyms on first use.
- Punctuation and paragraph breaks placed to produce natural pauses at part boundaries.

**REN-POD-5** — Register: direct address in the learner's language, conversational but precise — one voice explaining one idea, as in the Charisma Sprint scripts (`../examples/charisma/`). The script SHOULD land on a single memorable closing sentence that states the practical principle and points to the next session.

## Delivery

**REN-POD-6** — Audio is produced only when `audio_generation` or `text_to_speech` is verified (`../../../protocol/capabilities.md`). Otherwise the agent MUST say so and deliver the script as readable text — which, being clean spoken prose, remains a complete rendering.
