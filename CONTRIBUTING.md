# Contributing

> [!NOTE]
> **Management summary.** The protocol is the product. Specifications change by pull request, follow RFC-style normativity, and are versioned semantically. Keep changes small, evidence-backed and model-agnostic.

## Ground rules

1. **Model-agnostic or it does not merge.** No requirement may depend on proprietary behaviour of one model vendor. Capability-dependent behaviour belongs behind capability negotiation (`protocol/capabilities.md`).
2. **Normative language is load-bearing.** `MUST`, `MUST NOT`, `SHOULD`, `SHOULD NOT`, `MAY` follow RFC 2119/8174 semantics. A sentence with a keyword is a requirement; give it a stable requirement ID (e.g. `LEARN-D-2`) so evals can reference it.
3. **Research over opinion.** Changes to research, epistemics or assessment specs should cite the evidence or reasoning that motivates them.
4. **The Charisma fixture is frozen.** Files under `products/learn/examples/charisma/original/` are preserved byte-identical. Editorial notes belong in the fixture README or `source-map.md`, never inline.
5. **Schemas and specs move together.** If a spec changes a field, the corresponding JSON Schema in `schemas/` changes in the same pull request, and the site's fixture-validation tests must stay green.

## Workflow

1. Fork or branch, keep one concern per pull request.
2. For the website (`site/learn/`): `npm ci && npm run lint && npm run typecheck && npm run test && npm run build` must pass.
3. For specs: run the docs checks locally if you can (markdownlint), and check that internal links resolve.
4. Describe in the PR body which requirement IDs you add, change or remove.

## Versioning and releases

- Semantic versioning per component (`ÆON Protocol x.y.z`, `ÆON Learn x.y.z`).
- Breaking a `MUST` is a major bump; adding requirements is minor; editorial fixes are patch.
- Agents fetch specs via release-tag-pinned URLs. A release re-pins `site/learn/public/llms.txt` and `products/learn/bootstrap.md` via `scripts/bump-version.mjs`.

## Conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
