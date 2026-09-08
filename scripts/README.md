# Repository scripts

> [!NOTE]
> **Management summary.** Two Node scripts support the repository, and neither ships to anyone.
> `bump-version.mjs` is release-critical: it re-pins every agent-facing URL and version banner to a
> new tag and refuses to write anything unless it can account for every pin site.
> `split-charisma.mjs` derived the Charisma session fixtures from the preserved source and has done
> its job; run it with `--check` to prove the derived files are still exact slices of that source.
> Both need only Node 22 or newer, with no dependencies.

The validation toolchain that the root `npm run validate` scripts drive lives in
[`tools/`](../tools/), not here. This directory holds release and fixture tooling that a person
runs deliberately.

## `bump-version.mjs`

Re-pins the release tag everywhere an agent can see it, so a released tag is a complete, coherent
snapshot rather than a mixture of two versions.

```sh
node scripts/bump-version.mjs v0.4.0   # re-pin and stamp the release date
node scripts/bump-version.mjs --check  # verify every pin site, write nothing
```

**Pin sites.** Each one is declared in the script with the minimum number of occurrences it must
carry.

| File | What is pinned |
|---|---|
| `products/learn/bootstrap.md` | The raw specification URLs an agent fetches, and the `ÆON Learn x.y.z · ÆON Protocol x.y.z` banner |
| `site/learn/public/llms.txt` | The same URLs and the same banner, in the copy served at `learn.rapold.io/llms.txt` |
| `site/learn/lib/content.ts` | `export const VERSION`, and `export const RELEASED`, which the sitemap uses as its `lastmod` |

**How it fails.** The script counts the occurrences of every pin before it substitutes, verifies
afterwards that no stale tag or banner survived, and writes nothing at all until every file has
passed. A missing pin site, a renamed constant or a leftover version exits `1` with the file named
and the working tree untouched, so a partly re-pinned release cannot reach a tag. Invalid arguments
exit `2`.

`--check` reads the tag the site already declares and asserts that every other pin site agrees with
it. It is safe to run at any time and never writes.

**Release procedure.**

1. Move the `Unreleased` entries of [`CHANGELOG.md`](../CHANGELOG.md) under the new version
   heading, and add the comparison link at the bottom of that file.
2. Run `node scripts/bump-version.mjs vX.Y.Z` and read its summary: the counts it prints are the
   evidence that every pin moved.
3. Review `git diff`. The only changes should be the tag, the banners and the `RELEASED` date.
4. Commit, then create the annotated tag. Agents pin to it, so it is never moved afterwards — a
   correction ships as a new patch tag, per [`SECURITY.md`](../SECURITY.md).

**When you add a pinned URL.** A file that gains an agent-facing URL or a version banner without
being added to `PINNED` in this script drifts silently at the next release. Add it in the same pull
request that introduces the URL. [ADR 0002](../docs/decisions/0002-llms-txt-bootstrap.md) explains
why the pinning exists at all.

## `split-charisma.mjs`

Derives the fourteen session files and `integration.md` from the preserved Charisma Deep-Dive
source by taking verbatim character slices, asserting the day count and every day title, and
re-concatenating the slices to prove nothing was rewritten.

```sh
node scripts/split-charisma.mjs --check  # verify the derived fixture, write nothing
node scripts/split-charisma.mjs          # regenerate it
```

This script has already produced the fixture that is committed, and the fixture is frozen by
[ground rule 4](../CONTRIBUTING.md#ground-rules). It is kept because it is the executable statement
of an invariant that prose cannot enforce: the sessions under
`products/learn/examples/charisma/sessions/` are exact slices of
`products/learn/examples/charisma/original/AEON_Charisma_Sprint_Deep_Dive_14_Tage.md`, not an
edited retelling of it. Prefer `--check`, which reports a drift and exits `1` instead of
overwriting a committed fixture.

Regenerate only when the preserved source itself is corrected — which ground rule 4 makes a rare
and deliberate act — and expect the derived files to change in the same commit.
