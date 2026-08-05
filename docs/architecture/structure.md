# Structure

Public marketing site for Avrentis. Single Next.js 16 App Router service (`package.json`),
not a monorepo — but one repo among several: the shared package it consumes describes
itself as "consumed by avrentis-app, avrentis-site, and avrentis-admin"
(`node_modules/@avrentishq/core/package.json`). See `boundaries.md` for that edge.

Stack: Next 16.2.7, React 19.2.7, TypeScript, Tailwind CSS 4, framer-motion,
lucide-react, pnpm 10.30.3 (`package.json`).

## Commands

| Command | What it does |
|---|---|
| `pnpm dev` | `doppler run --config dev -- next dev`. **Needs Doppler** — plain `next dev` gets no secrets. Runs `predev` first. |
| `pnpm build` | `next build`. Runs `prebuild` first. |
| `pnpm start` | Serve the production build. |
| `pnpm test` | `vitest run`. 6 test files, `environment: "node"` (`vitest.config.ts`). |
| `pnpm lint` / `pnpm lint:fix` | `eslint .` (`eslint.config.mjs`). Should report `0 problems`. |
| `pnpm type-check` | `tsc --noEmit`. Turbopack dev does **not** typecheck — run this explicitly. |

`prebuild` and `predev` both run `node scripts/sync-pricing-fallback.mjs`
(`package.json`).

**There is no CI.** `.github/` contains only `CODEOWNERS` — no workflows, no test or lint
gate. Deployment is Vercel, configured by `vercel.json` (custom `installCommand` that
rewrites the git URL so the private package can be cloned; see `boundaries.md`).

## Directory map

| Path | Purpose |
|---|---|
| `src/app/` | Routes. 50 files, **one** layout (root), no route groups, no nested layouts, no `loading.tsx`, no `middleware.ts`. |
| `src/components/ui/` | Route-agnostic prop-driven primitives. Reuse before writing. |
| `src/components/ui/form/` | `ChoiceGroup`, `SearchableSelect`. |
| `src/components/layout/` | `Navbar`, `Footer`, `MobileMenu`. |
| `src/components/sections/` | Named bands of the home + pricing pages, composed by `src/app/page.tsx`. Copy lives in module-scope consts. |
| `src/components/product/` | Product-area page bodies, the module template (`module-layout.tsx`), shared mockup art. |
| `src/components/product/pages/` | One config-only wrapper per module slug (8). |
| `src/components/product/previews/` | Static fake-UI art rendered into each module hero (8). |
| `src/components/{docs,legal,trust,contact,careers,changelog,customers}/` | One page body each. |
| `src/components/providers/` | `MotionProvider` — the only app-wide context. |
| `src/lib/` | Config registries, pure helpers, and the three I/O wrappers (email, rate limit, turnstile). See `architecture.md`. |
| `src/lib/hooks/` | `useIsMobile`, `useMediaQuery`, `useReducedMotion`. |
| `src/data/` | `countries.ts` (authored), `pricing-fallback.json` (**generated**). |
| `scripts/` | `sync-pricing-fallback.mjs` — the only build script. |
| `public/` | 94 tracked static assets (brand SVGs, hero/backdrop textures, favicons). |
| `docs/architecture/` | These reference files. The only tracked docs directory. |
| `docs/superpowers/{plans,specs}/` | Plan and spec files. **Gitignored** — see `planning.md`. |
| `guides/` | Brand, setup, and copy-deck guides. **Gitignored.** Treat as stale: `guides/public-site-setup.md` documents env vars that no longer exist in code. |

## Entry points

- `src/app/layout.tsx` — the only layout. Loads three fonts (two from `next/font/google`,
  the wordmark via `localFont` sourced out of the shared package), sets `metadataBase`
  and default metadata from `BRAND`, injects organization JSON-LD into `<head>`, renders
  the skip link, and wraps everything in `MotionProvider` + `ScrollProgress`.
  **No analytics and no error tracking are wired up anywhere.**
- `src/app/page.tsx` — home. Awaits `fetchPricingData()`, then composes `Hero`, `Problem`,
  `HowItWorks`, `SocialProof`, `FeaturesGrid`, `Pricing`, `CtaBanner`.
- `src/app/error.tsx` — client route error boundary. Renders a retry button and
  **discards the error object**, so production failures leave no trace (no logger exists).
- `src/app/not-found.tsx` — standalone 404, deliberately without `Navbar`/`Footer`.
- `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/opengraph-image.tsx` — metadata
  routes. Each hardcodes the base URL separately from `layout.tsx`'s `metadataBase`.

## Generated vs authored

| Artifact | Status |
|---|---|
| `src/data/pricing-fallback.json` | **Generated and git-tracked.** Written by `scripts/sync-pricing-fallback.mjs` on every `pnpm dev` and `pnpm build`. **Never hand-edit** — the next run overwrites it. |
| `src/data/countries.ts` | Authored. |
| `next-env.d.ts`, `tsconfig.tsbuildinfo`, `.next/` | Generated, gitignored. |
| `public/` assets | Authored/copied; brand SVGs originate from the shared package's design source. |
| `AGENTS.md` marker block | The `<!-- BEGIN:nextjs-agent-rules -->`…`<!-- END: -->` block is tool-managed. Edit only below it. |

The sync script is fail-safe: unreachable API, non-2xx, non-JSON, or an invalid shape all
`console.warn` and **exit 0**, keeping the committed file. A build never fails because
pricing was unreachable.

**Known landmine:** the committed `pricing-fallback.json` is a single minified line, but
the script writes pretty-printed JSON with a trailing newline. The first successful sync
reformats the whole file and produces a large spurious diff. Expect it; don't treat it as
a real change. Full landmine list in `conventions.md`.
