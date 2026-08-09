# learn.rapold.io

The static invocation surface for ÆON Learn: a Next.js site that serves the agent bootstrap and explains the protocol to humans.

> [!NOTE]
> **Management summary.** This project builds learn.rapold.io, a fully static Next.js site with no backend and no accounts. It serves the agent bootstrap at `/llms.txt` and explains the protocol to humans in English and Swiss German. The site is not the intelligence: it points agents at the specifications in this repository, pinned to an immutable release tag, and the user's own agent is the runtime. Deployment is Git-integrated on Vercel, so every push to `main` ships.

This document is reference for the stack and the conventions, and a how-to for [Develop locally](#develop-locally).

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, fully static) |
| Runtime | Node.js 22 (`.nvmrc`, `engines.node >= 22`) |
| Styling | Tailwind CSS v4, CSS-first tokens, dark mode via next-themes |
| Fonts | Inter and JetBrains Mono, self-hosted through `next/font/google` |
| Testing | Vitest — five suites over content, i18n, Swiss German orthography, repository fixtures and llms.txt |
| Hosting | Vercel (root directory `site/learn`), security headers in `vercel.json` |

## Routes

| Path | Purpose |
|---|---|
| `/` | English landing page |
| `/de` | Swiss German landing page |
| `/imprint`, `/privacy` | English legal pages |
| `/de/impressum`, `/de/datenschutz` | Swiss German legal pages |
| `/llms.txt` | The agent bootstrap, served as a static file from `public/` |

Next.js file conventions additionally generate `robots.txt`, `sitemap.xml`, the web manifest, the icons and the Open Graph images from `app/`.

## Develop locally

```bash
npm ci             # install exactly what the lockfile pins
npm run dev        # local development server
npm run build      # production build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm run test       # vitest run
```

Run `npm run lint && npm run typecheck && npm run test && npm run build` before you open a pull request; the `site` workflow runs the same sequence on every push and pull request that touches `site/learn/**`.

## Conventions

- **Locale-correct layouts.** Two root layouts via the route groups `(en)` and `(de)` keep `<html lang>` correct per locale; every page sets `alternates.languages` with `en`, `de` and `x-default`.
- **Facts and prose stay separate.** Language-neutral facts live in `lib/content.ts`; all prose lives in `lib/i18n.ts` keyed by stable identifiers. Client components receive only pre-localised strings.
- **The bootstrap has one source of truth.** `public/llms.txt` mirrors [the agent entry contract](../../products/learn/bootstrap.md); `lib/llms-sync.test.ts` asserts that the two carry the same raw specification URLs, that every URL is pinned to the current release tag, and that the bootstrap still names all ten capability keys.
- **Fixtures are validated here.** `lib/fixtures.test.ts` validates the repository's YAML fixtures against [the JSON Schemas](../../schemas/README.md), which is why a schema change belongs in the same pull request as its fixture change.
- **German copy is de-CH.** No sharp s, enforced by `lib/locale-de-ch.test.ts`.

## Deployment

The Vercel project `aeon-learn` uses root directory `site/learn` and is connected to the GitHub repository: every push to `main` deploys to production, and every pull request gets a preview deployment. The domain `learn.rapold.io` is assigned to the project; DNS is a CNAME `learn` to `cname.vercel-dns.com` (DNS-only, no proxy) plus a `_vercel` TXT verification record.

> [!IMPORTANT]
> Releasing re-pins the specification URLs. Run `node scripts/bump-version.mjs vX.Y.Z` from the repository root to update `products/learn/bootstrap.md`, `site/learn/public/llms.txt` and `site/learn/lib/content.ts` together. [ADR 0002](../../docs/decisions/0002-llms-txt-bootstrap.md) explains why agents fetch specifications from an immutable tag and never from this site.
