# Summary

<!-- Two or three sentences, conclusion first: what changes and why it earns its place. -->

## Type of change

<!-- Tick every box that applies. -->

- [ ] Protocol core specification (`protocol/`)
- [ ] ÆON Learn specification or bootstrap (`products/learn/`)
- [ ] Library package (`library/`)
- [ ] JSON Schema (`schemas/`)
- [ ] Eval case or rubric (`evals/`)
- [ ] Invocation surface (`site/learn/`)
- [ ] Documentation, decision record or tooling

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

## Checks

<!-- Paste the commands you ran and their result. -->

- [ ] `npx markdownlint-cli2 "**/*.md" "!site/learn/node_modules/**"` passes
- [ ] Internal links resolve to files that exist
- [ ] `npm ci && npm run lint && npm run typecheck && npm run test && npm run build` passes in `site/learn/` (only if the site changed)

## Checklist

- [ ] No requirement depends on the proprietary behaviour of one model vendor; capability-dependent
      behaviour sits behind capability negotiation.
- [ ] Specifications and the JSON Schemas they describe change together in this pull request.
- [ ] Files under `products/learn/examples/charisma/original/` remain byte-identical.
- [ ] `CHANGELOG.md` records the change under `Unreleased`.
- [ ] Prose follows the house style: second person, present tense, active voice, sentence-case
      headings, no emojis, and ÆON spelled with the ligature while slugs and URLs stay ASCII.
