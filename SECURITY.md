# Security policy

> [!NOTE]
> **Management summary.** ÆON ships a specification, thirty curated library packages and one static
> website — no backend, no accounts and no learner database. The security surface is therefore
> unusual: the highest-value targets are the text an agent obeys, the sources an agent follows and
> the release tags an agent pins to. The single most underrated risk is prompt injection through
> content an agent fetches and treats as instruction. Report anything in that surface privately by
> email to <marcel@marcelrapold.com>. Do not open a public issue for a vulnerability.

## Reporting a vulnerability

1. Email <marcel@marcelrapold.com> with the subject line `ÆON security report`.
2. Describe the issue, the affected file or URL, and the impact you can demonstrate.
3. Include the steps or the transcript that reproduce it. For agent-behaviour reports, name the
   runtime and paste the relevant exchange.
4. Wait for a reply before disclosing publicly.

Private reporting through GitHub security advisories is not enabled on this repository, so email is
the reporting channel. If you prefer encrypted mail, say so in a first message without details and
you get a key in reply.

**Response targets.** The maintainer aims to acknowledge a report within three working days and to
send an initial assessment, with a severity judgement and a plan, within ten working days. Fixes
ship in the next release tag; a report that affects agent behaviour may ship faster because the
specification is text. If you have not heard back within the acknowledgement window, send a
reminder to the same address rather than opening an issue.

**Coordinated disclosure.** Please give the project ninety days from acknowledgement before
publishing, or less by agreement once a fix is released. Reporters are credited in the changelog
entry of the fixing release unless they ask not to be.

**Safe harbour.** Research done in good faith under this policy is welcome, and the project will
not pursue a reporter who stays within it. Stay within it by testing only against your own agent
sessions and your own copies of the specification, by not accessing or modifying data that is not
yours, by not degrading the invocation surface for other people, and by reporting privately before
disclosing. The invocation surface is a static site on third-party infrastructure; do not run load
or denial-of-service tests against it.

## Threat model

This repository ships no runtime. Nothing here executes on a server the project controls, and no
learner data reaches the project at all. What the project does ship is instructions that a
capable agent reads and follows, and pointers that tell the agent where to read them. So the
threat model has three assets.

- **The text an agent obeys.** Every normative sentence in [`protocol/`](protocol/) and
  [`products/learn/`](products/learn/), the entry contract in
  [`products/learn/bootstrap.md`](products/learn/bootstrap.md), and the curated content in
  [`library/`](library/). An attacker who changes this text changes what conforming agents do, in
  every session, without touching a single machine.
- **The path from an invocation to that text.** `learn.rapold.io/llms.txt`, the raw URLs it names,
  and the release tag those URLs are pinned to. An attacker who redirects that path substitutes
  their own instructions for the project's.
- **The invocation surface itself.** The static site in [`site/learn/`](site/learn/) and the
  domain it is served from.

The people at risk are learners running the protocol in their own agent, and implementers who
build a conforming runtime. The project holds nothing of theirs to lose, which is deliberate — see
[what this project does not hold](#what-this-project-does-not-hold).

## Prompt injection

An ÆON agent is instructed to fetch documents and act on them. That is the entire point of the
protocol, and it is also the most realistic attack against it. Injected text does not need a
vulnerability in any software: it needs a sentence in a document an agent already trusts.

Three paths deserve naming.

- **Injection through repository content.** Text merged into a specification, a library package or
  a fixture that reads as an instruction to the agent rather than as content — a sentence that
  tells the agent to ignore earlier instructions, to skip a phase, to reveal its system prompt, to
  contact a URL, or to treat an untrusted source as authoritative. This repository is public and
  accepts pull requests, so this is a supply-chain risk, and review is the control: a specification
  change is read as instructions, because that is what it is.
- **Injection through a cited source.** A library package names real sources, and a conforming
  agent fetches them during research. A page that is legitimate today can serve instruction-shaped
  text tomorrow. The protocol's answer is that fetched sources are evidence to be weighed and
  cited, never instructions to be executed — but a package that cites a hostile or hijacked source
  still puts that text in front of every agent researching the subject.
- **Injection through learner input.** A learner's own message travels into the agent's context.
  Text that impersonates the protocol — for example, a message claiming a new ÆON requirement —
  must not be able to relax a `MUST`.

What the project does about it: specification and library changes are reviewed as instructions
rather than as prose; agent-facing URLs are pinned to immutable release tags rather than a moving
branch, so what an agent fetched in a reproducible run is what it fetches again
([ADR 0002](docs/decisions/0002-llms-txt-bootstrap.md)); library sources must be real, reachable,
tier-classified and named, so a hijacked source is attributable rather than anonymous; and
requirement identifiers make it possible to say precisely which sentence an agent followed.

What an implementer should do: treat everything fetched during research as data, not as
instruction; keep the protocol's own requirements in a channel the fetched content cannot write
to; and do not let a research result raise its own credibility, claim a capability, or change the
learner's approved learning contract.

If you find text anywhere in this repository that would steer a conforming agent rather than
inform it, report it privately as a vulnerability. It is not a documentation nit.

## Supported versions

| Version | Supported |
|---|---|
| Latest release tag | Yes — fixes ship here |
| Earlier release tags | No — tags stay immutable, because agents pin their fetches to them |
| `main` | Yes for reports, but fixes are released as a new tag rather than by moving one |

Agents fetch specifications from an immutable tag rather than a branch, so a released tag is never
rewritten. If a released tag ever needs correction, the project publishes a new patch tag and
records the reason in [`CHANGELOG.md`](CHANGELOG.md). Anyone pinned to an older tag stays on the
content they pinned; upgrading is how they get the fix, and the changelog says what changed.

## What counts as a vulnerability here

The following are in scope and worth reporting.

- **Unsafe normative behaviour.** A requirement in [`protocol/`](protocol/) or
  [`products/learn/`](products/learn/) that instructs a conforming agent to do something harmful —
  exfiltrating learner data, executing untrusted content, or claiming a capability it has not
  verified.
- **Prompt-injection paths.** Text in [`products/learn/bootstrap.md`](products/learn/bootstrap.md)
  or any specification, library package or fixture that would let a fetched web source or a
  learner message take over the agent's instructions. See [prompt injection](#prompt-injection).
- **Hostile or hijacked sources.** A URL in a [`library/`](library/) package or a source map that
  now serves malware, credential phishing or content that no longer matches its citation.
- **Release-integrity problems.** A moved or forged tag, a mismatch between
  `learn.rapold.io/llms.txt` and the specification it claims to mirror, or a pinned URL that
  resolves to content other than the tagged specification.
- **Invocation-surface issues.** Vulnerable dependencies, missing or wrong security headers, or
  deployment and DNS weaknesses in [`site/learn/`](site/learn/) and `learn.rapold.io`.
- **Repository supply-chain issues.** A workflow, action or script in this repository that could be
  made to execute untrusted input or leak a credential.

The following are out of scope; open a normal issue instead.

- An agent that answers badly, hallucinates, or ignores the protocol. That is a conformance
  failure — score it with [`evals/learn/`](evals/learn/) and file an eval issue.
- A factual error, a weak source or a missing counterposition in a library package. That is a
  content issue, and the library forms exist for it.
- Missing security features on services this project does not run, such as the model vendors whose
  agents execute the protocol.
- Output from an automated scanner with no demonstrated impact on the surfaces above.

## What this project does not hold

ÆON has no user accounts, no backend, no content API and no central learner database. Learner state
lives in the user's own agent session, which is why [`protocol/state.md`](protocol/state.md) keeps
it portable rather than hosted. A report that assumes a server-side learner store is describing a
system this project deliberately does not build — see the non-goals in
[`products/learn/specification.md`](products/learn/specification.md).
