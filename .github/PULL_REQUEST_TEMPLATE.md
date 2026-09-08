# Summary

<!-- Two or three sentences, conclusion first: what changes and why it earns its place. -->

Closes <!-- issue number, or "no issue" with a sentence on why this needs none -->

## Type of change

<!-- Tick every box that applies. -->

- [ ] Protocol core specification (`protocol/`)
- [ ] ÆON Learn specification or bootstrap (`products/learn/`)
- [ ] Library package (`library/`)
- [ ] JSON Schema (`schemas/`)
- [ ] Eval case or rubric (`evals/`)
- [ ] Invocation surface (`site/learn/`)
- [ ] Validation toolchain or release tooling (`tools/`, `scripts/`)
- [ ] Documentation, decision record or repository configuration

## Requirement identifiers

<!-- List every identifier you add, change or remove; write "none" if the change is not normative.
     Identifiers are never reused after removal. -->

- Added:
- Changed:
- Removed:

## Version impact

- [ ] Major — a `MUST` changed or was removed
- [ ] Minor — requirements were added, nothing broke
- [ ] Patch — editorial only, no behaviour change
- [ ] None — no versioned surface touched

## What an agent sees differently

<!-- One or two sentences on the observable behaviour change, or "nothing" for a non-normative
     change. If a conforming agent would act differently after this merges, say how it would show
     up in a transcript. -->

## Local gate

<!-- Run the gate and paste the result. A tick without output is not evidence. -->

```text
paste the output of: npm run validate
```

- [ ] `npm run validate` passes on a clean clone
- [ ] `npx markdownlint-cli2 "**/*.md" "!**/node_modules/**" "!products/learn/examples/charisma/original/**" "!products/learn/examples/charisma/sessions/**" "!products/learn/examples/charisma/integration.md"` passes
- [ ] `npm run lint && npm run typecheck && npm run test && npm run build` passes in `site/learn/` (only if the site changed)
- [ ] `node scripts/bump-version.mjs --check` passes (only if a pinned URL, version banner or version constant moved)

## Checklist

- [ ] No requirement depends on the proprietary behaviour of one model vendor; capability-dependent
      behaviour sits behind capability negotiation.
- [ ] Every new or changed requirement is observable in a transcript, and an eval case can score it.
- [ ] Specifications and the JSON Schemas they describe change together in this pull request.
- [ ] The bootstrap and `site/learn/public/llms.txt` still agree with the specifications, and with
      each other.
- [ ] Files under `products/learn/examples/charisma/original/` remain byte-identical.
- [ ] Every source I cite is real, reachable and says what I claim it says.
- [ ] `CHANGELOG.md` records the change under `Unreleased`.
- [ ] Prose follows the house style: second person, present tense, active voice, sentence-case
      headings, no emojis, and ÆON spelled with the ligature while slugs and URLs stay ASCII.
