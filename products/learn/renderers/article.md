# ÆON Learn — article renderer

> [!NOTE]
> **Management summary.** The deep-dive article is the reading-first rendering of the canonical lesson: thesis, scientific core, named operators, common errors, and a training block with one exercise and three reflection questions. The structure is abstracted from the Charisma Sprint deep-dives. Requirement prefix: `REN-ART`. Version: ÆON Learn 0.1.0.

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY are to be interpreted as described in RFC 2119 and RFC 8174.

## Length

**REN-ART-1** — Default target is an 8–12 minute read; the learning contract MAY set a different target. The article is the deepest prose rendering of a session; it complements, and MUST NOT contradict, the podcast rendering of the same canonical lesson (`REN-1`, `README.md`).

## Structure

**REN-ART-2** — The article MUST follow five parts, derived from the canonical lesson's slots (`../session.md`):

| Part | Derives from slot |
|---|---|
| 1. Thesis | B — Core concept |
| 2. Scientific core | C — Evidence, D — Interpretation, E — Boundary |
| 3. Operators | F — Concrete application |
| 4. Common errors | E/F — how applying the idea typically fails |
| 5. Training | G — Exercise, H — Reflection |

**REN-ART-3 (Thesis)** — The thesis MUST state the session's dominant idea as a defensible claim in a few sentences — including what the idea is *not* ("not manipulation, but a clean starting state"). The thesis is the article compressed to a paragraph; a reader who stops here still leaves with the idea intact.

**REN-ART-4 (Scientific core)** — The evidence with its epistemic labels (`../../../protocol/epistemics.md`), what it actually means, and its boundary — what it does NOT prove. Attribution appears inline and readable; compact source anchors keyed to the journey's source map (e.g. `Sources: S3, S4`) MAY replace full citations, which live in the source map (`../assessment.md`). The boundary MUST appear here, per `REN-2`.

**REN-ART-5 (Operators)** — Three to six concrete techniques that turn the concept into behaviour. Each operator SHOULD carry a short memorable name ("Entry Pause", "Directional Line"), one imperative definition, and where useful a worked example — named operators are retrieval handles, and examples come before abstraction. Operators MUST be derived from the canonical lesson's application, not invented per format.

**REN-ART-6 (Common errors)** — The common-errors part MUST list the typical failure modes of applying the idea, each with why it backfires ("too broad a smile reads as approval-seeking"). Errors are the boundary made practical: they mark where the technique stops working.

**REN-ART-7 (Training)** — The training part MUST contain one daily exercise: a concrete sequence the learner runs today in a real situation from their own context, with an example execution. It MUST then present exactly the session's three reflection questions, targeting the learner's own behaviour and judgement.

## Reference

The Charisma Sprint deep-dives (`../examples/charisma/sessions/`) instantiate this structure — Kernthese, Wissenschaftlicher Kern, Operatoren, Fehler, Training — and are the fixture this specification abstracts.

## Delivery

**REN-ART-8** — The article is plain formatted text and requires no special capability. When `file_generation` is verified, the agent MAY additionally deliver it as a file; otherwise it renders directly in conversation.
