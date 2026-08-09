# AEON Protocol — capabilities

> [!NOTE]
> **Management summary.** Capability-dependent behaviour is only ever offered after verification. This document defines the ten-key capability vocabulary every AEON runtime establishes, the detection duty that precedes any reliance, and graceful degradation as a first-class requirement: a missing capability is named honestly and substituted, never faked. Version: AEON Protocol 0.1.0.

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY are to be interpreted as described in RFC 2119 and RFC 8174.

## Contents

- [Capability vocabulary](#capability-vocabulary)
- [Detection before reliance](#detection-before-reliance)
- [Graceful degradation](#graceful-degradation)

## Capability vocabulary

**CAP-1** — Before offering or relying on any capability-dependent behaviour ([core.md](core.md), CORE-3), an AEON runtime MUST establish an internal capability profile over this vocabulary:

```yaml
capabilities:
  web_research: true|false
  persistent_memory: true|false
  scheduled_tasks: true|false
  proactive_notifications: true|false
  audio_generation: true|false
  text_to_speech: true|false
  file_generation: true|false
  presentation_generation: true|false
  image_generation: true|false
  code_execution: true|false
```

**CAP-2** — Implementations MAY extend the vocabulary with additional keys but MUST NOT redefine the meaning of the ten keys above. Sibling specifications and evals reference capabilities by these exact key names.

## Detection before reliance

**CAP-3** — An agent MUST verify a capability in its current session before relying on it. Assumptions carried over from other sessions, other models or vendor documentation are not verification.

**CAP-4** — An agent MUST NOT claim, imply or offer a capability it has not verified. An unavailable capability named honestly is protocol-conformant; a hallucinated one is a protocol violation.

**CAP-5** — The capability profile MUST be established before learner-facing workflow phases begin, so that every offer the agent makes (recurring delivery, audio, files, …) is already grounded ([orchestration.md](orchestration.md), ORCH-2; for AEON Learn: [specification.md](../products/learn/specification.md), LEARN-2).

## Graceful degradation

**CAP-6** — Graceful degradation is a first-class requirement. When a capability is unavailable, the agent MUST say so explicitly and SHOULD offer the closest available substitute. Silent failure and silent omission are both violations.

**CAP-7** — A missing capability MUST change only *how* a normative phase is fulfilled, never *whether* it occurs. Example: missing `web_research` triggers disclosure and lowered confidence ([research.md](research.md), RES-3) — it does not waive discovery, mapping or epistemic duties.

**CAP-8** — Scheduling example, normative: if `scheduled_tasks` is available, the agent MAY offer recurring delivery. If it is unavailable, the agent MUST explicitly say so and MUST preserve the learning state for on-demand continuation ([state.md](state.md), STA-6).
