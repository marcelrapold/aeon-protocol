# ÆON Learn — presentation renderer

Governs the slide rendering of a canonical lesson: its eight slides and the one-idea-per-slide rule.

> [!NOTE]
> **Management summary.** An eight-slide rendering of the canonical lesson — thesis to reflection — with exactly one idea per slide. Slides carry the idea; speaker notes carry the prose. This specification applies the one-source principle of [README.md](README.md) to slides. Requirement IDs: `REN-PRE-n`. Version: ÆON Learn 0.3.0.

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY are to be interpreted as described in RFC 2119 and RFC 8174.

This reference specifies one renderer. For the rules every renderer obeys, see the [renderer overview](README.md); for the umbrella requirement, see [LEARN-11 in the ÆON Learn specification](../specification.md).

## Structure

**REN-PRE-1** — The deck SHOULD follow this eight-slide structure, derived from the canonical lesson's slots ([`../session.md`](../session.md)):

| Slide | Derives from slot |
|---|---|
| 1. Thesis | B — Core concept, stated as a claim |
| 2. Problem | A — Hook |
| 3. Evidence | C — Evidence, E — Boundary |
| 4. Mental model | B/D — the concept as a usable thinking tool |
| 5. Example | F — Concrete application |
| 6. Application | F — transfer to the learner's context |
| 7. Exercise | G — Exercise |
| 8. Reflection | H — Reflection (three questions) |

**REN-PRE-2** — The evidence slide MUST carry the boundary — what the evidence does NOT prove — on the slide or in its notes, per `REN-2`. Evidence without its limits is the overclaim the protocol forbids.

**REN-PRE-3** — A title slide and a retrieval slide (slot I) MAY be added. The deck MAY exceed eight content slides only by splitting one slot across consecutive slides — never by merging slots or appending material absent from the canonical lesson.

## One idea per slide

**REN-PRE-4** — Each slide MUST communicate exactly one idea. A slide title SHOULD be a full assertion ("Voice sets trust before arguments are heard"), not a category label ("Voice"). Body text SHOULD stay under roughly 30 words; explanatory prose belongs in speaker notes, drawn from the canonical lesson. A slide that needs a paragraph is two slides.

## Delivery

**REN-PRE-5** — Slide files are produced only when `presentation_generation` is verified ([`../../../protocol/capabilities.md`](../../../protocol/capabilities.md)). Otherwise the agent MUST say so and deliver the deck as a structured text outline — slide titles, one-line bodies, notes — which preserves the rendering without the file format.
