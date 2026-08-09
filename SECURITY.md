# Security policy

> [!NOTE]
> **Management summary.** ÆON ships a specification, thirty curated library packages and one static
> website — no backend, no accounts and no learner database. The security surface is therefore
> unusual: the highest-value targets are the text an agent obeys, the sources an agent follows and
> the release tags an agent pins to. Report anything in that surface privately by email to
> <marcel@marcelrapold.com>. Do not open a public issue for a vulnerability.

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
specification is text.

**Coordinated disclosure.** Please give the project ninety days from acknowledgement before
publishing, or less by agreement once a fix is released. Reporters are credited in the changelog
entry of the fixing release unless they ask not to be.

## Supported versions

| Version | Supported |
|---|---|
| Latest release tag | Yes — fixes ship here |
| Earlier release tags | No — tags stay immutable, because agents pin their fetches to them |
| `main` | Yes for reports, but fixes are released as a new tag rather than by moving one |

Agents fetch specifications from an immutable tag rather than a branch, so a released tag is never
rewritten. If a released tag ever needs correction, the project publishes a new patch tag and
records the reason in [`CHANGELOG.md`](CHANGELOG.md).

## What counts as a vulnerability here

The following are in scope and worth reporting.

- **Unsafe normative behaviour.** A requirement in [`protocol/`](protocol/) or
  [`products/learn/`](products/learn/) that instructs a conforming agent to do something harmful —
  exfiltrating learner data, executing untrusted content, or claiming a capability it has not
  verified.
- **Prompt-injection paths.** Text in [`products/learn/bootstrap.md`](products/learn/bootstrap.md)
  or any specification that would let a fetched web source, a library package or a fixture take
  over the agent's instructions during research.
- **Hostile or hijacked sources.** A URL in a [`library/`](library/) package or a source map that
  now serves malware, credential phishing or content that no longer matches its citation.
- **Release-integrity problems.** A moved or forged tag, a mismatch between
  `learn.rapold.io/llms.txt` and the specification it claims to mirror, or a pinned URL that
  resolves to content other than the tagged specification.
- **Invocation-surface issues.** Vulnerable dependencies, missing or wrong security headers, or
  deployment and DNS weaknesses in [`site/learn/`](site/learn/) and `learn.rapold.io`.

The following are out of scope; open a normal issue instead.

- An agent that answers badly, hallucinates, or ignores the protocol. That is a conformance
  failure — score it with [`evals/learn/`](evals/learn/) and file an eval issue.
- A factual error, a weak source or a missing counterposition in a library package. That is a
  content issue, and the library forms exist for it.
- Missing security features on services this project does not run, such as the model vendors whose
  agents execute the protocol.

## What this project does not hold

ÆON has no user accounts, no backend, no content API and no central learner database. Learner state
lives in the user's own agent session, which is why [`protocol/state.md`](protocol/state.md) keeps
it portable rather than hosted. A report that assumes a server-side learner store is describing a
system this project deliberately does not build — see the non-goals in
[`products/learn/specification.md`](products/learn/specification.md).
