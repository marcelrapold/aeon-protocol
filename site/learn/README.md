# learn.rapold.io

> [!NOTE]
> **Management summary.** Minimal static invocation surface for ÆON Learn. The site serves the agent bootstrap at `/llms.txt` and explains the protocol to humans in English (`/`) and Swiss German (`/de`). No backend, no accounts — the user's AI agent is the runtime.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, fully static) |
| Styling | Tailwind CSS v4, CSS-first tokens, dark mode via next-themes |
| Fonts | Inter + JetBrains Mono (next/font) |
| Testing | Vitest — data-integrity tests over content, i18n, fixtures and llms.txt |
| Hosting | Vercel (root directory `site/learn`), security headers in `vercel.json` |

## Commands

```bash
npm run dev        # local development
npm run build      # production build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm run test       # vitest run
```

## Conventions

- Two root layouts via route groups `(en)` and `(de)` so `<html lang>` is correct per locale; every page sets `alternates.languages` with `en`, `de` and `x-default`.
- Language-neutral facts live in `lib/content.ts`; all prose lives in `lib/i18n.ts` keyed by stable identifiers. Client components receive only pre-localised strings.
- `public/llms.txt` mirrors `products/learn/bootstrap.md`; `lib/llms-sync.test.ts` asserts the two stay in sync and pinned to the same release tag.
- `lib/fixtures.test.ts` validates the repository's YAML fixtures against the JSON Schemas in `schemas/`.
- German copy is de-CH (no sharp s), enforced by `lib/locale-de-ch.test.ts`.

## Deployment

Vercel project `aeon-learn` with root directory `site/learn`, connected to the GitHub repository: every push to `main` deploys to production automatically; pull requests get preview deployments. The domain `learn.rapold.io` is assigned to the project; DNS is a CNAME `learn` to `cname.vercel-dns.com` (DNS-only, no proxy) plus a `_vercel` TXT verification record.
