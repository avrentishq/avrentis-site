# Conventions

## Naming

| Thing | Rule | Example |
|---|---|---|
| Files | kebab-case, no exceptions | `src/components/product/pages/pay-module-page.tsx` |
| Exports | Named function exports. `export default` **only** in `src/app/**/page.tsx` | `src/components/trust/trust-page.tsx` |
| Page bodies | `<Area>ProductPage` / `<Area>Page` | `src/components/docs/docs-page.tsx` |
| Module wrappers | `<Module>ModulePage` in `<module>-module-page.tsx` | `src/components/product/pages/guard-module-page.tsx` |
| Previews / mockups | `<Module>Preview`, `<Thing>Mockup` | `src/components/product/previews/vault-preview.tsx` |
| Prop types | `interface <Component>Props`, co-located, **not exported**. Only data/option types are exported (`ChoiceGroupProps` private, `ChoiceOption` exported) | `src/components/ui/form/choice-group.tsx` |
| Prop names | `variant` for visual mode; `size`/`opacity`/`intensity` for numerics; `ariaLabel` camelCase; `invalid` for error state | `src/components/ui/form/searchable-select.tsx` |
| Variants | String-union prop + module-scope lookup `Record` keyed by it | `SCRIMS` in `src/components/ui/section-backdrop.tsx`, `ROLE_STYLES` in `src/components/ui/role-badge.tsx` |
| Union members | snake_case — `"available" \| "coming_soon" \| "partial" \| "roadmap"` | `src/components/product/module-layout.tsx` |
| Variables | Full words, no cryptic abbreviations | — |

## Client vs server

`"use client"` ⇔ **the file imports framer-motion or uses hooks.** 36 of 48 component files
are client; the pure-static exceptions are the 8 previews,
`src/components/product/stage-mockups.tsx`, `src/components/ui/logo.tsx`,
`src/components/ui/role-badge.tsx`, `src/components/ui/section-backdrop.tsx`. The server
boundary is `src/app/**/page.tsx` and nowhere else (see `docs/architecture/architecture.md`).

## Animation — three hard rules

1. **`import { m }`, never `motion`.** `src/components/providers/motion-provider.tsx` wraps
   the app in `<LazyMotion features={domAnimation} strict>`; `strict` makes any stray
   `motion.*` **throw at runtime**. All 25 import sites use `m`.
2. **Fade-up comes from `src/lib/animations.ts`** — `fadeUp`, `fadeUpTransition`,
   `staggerDelay`, imported as that trio by 21 files. Anything else (parallax,
   `AnimatePresence`, glow pulses) is defined inline; that is the norm.
3. **Reduced motion is two layers, both required.** `<MotionConfig reducedMotion="user">`
   in `src/components/providers/motion-provider.tsx` resolves framer animations to their
   *end* state (content is never stranded at `opacity: 0`), plus a blanket
   `@media (prefers-reduced-motion: reduce)` reset in `src/app/globals.css`. The division
   of labour is commented there.

Heavy animation degrades below 1024px via `useIsMobile` (`src/lib/hooks/use-is-mobile.ts`),
used in `src/components/sections/hero.tsx`, `src/components/sections/how-it-works.tsx`,
`src/components/sections/plan-comparison.tsx`, `src/components/product/module-layout.tsx`,
`src/components/ui/ambient-glow.tsx`, `src/components/ui/scroll-progress.tsx`.

## Styling — read before writing a component

**This codebase styles with inline `style={{}}` objects, not Tailwind classes.** Tailwind 4
exists mainly to provide the `@theme` token registry plus preflight; the highest `className`
count in any file is 9, while one mockup file has 86 inline `style` sites. `cn()`
(`src/lib/utils.ts`) has **2 consumers** — do not assume a class-based codebase.

Tokens live in the single `@theme` block in `src/app/globals.css`: navy (`--color-navy-*`),
gold (`--color-gold*`, including `--color-gold-rgb` for `rgba()` and `--color-gold-on-light`,
the AA-safe text gold), logo colours mirroring the platform app (`--color-accent`,
`--color-primary-800`, `--color-shell`, `--color-logo-*`), surfaces, five text greys, three
font vars, four radii.

**Use the tokens.** ~973 hardcoded hex literals across 35 component files currently duplicate
tokens that already exist — worst offenders `src/components/product/stage-mockups.tsx`,
`src/components/product/security-mockups.tsx`, `src/components/sections/how-it-works.tsx`,
`src/components/trust/trust-page.tsx`. Don't add to the pile; converge when you touch a file.

## Error handling

- **Server Actions return, never throw.** Each returns a discriminated state object
  (`src/app/trial/state.ts`, `src/app/contact/state.ts`, `src/app/tools/savings/state.ts`)
  consumed by `useActionState`. Failures become `{ status: "error", … }` with a human
  fallback, never a stack trace.
- **Bot-check rejections return a success-shaped response**, deliberately. Do not convert
  them into visible errors; see the local security guide before touching that path.
- **Never trust client numbers.** `src/app/tools/savings/actions.ts` re-parses and clamps
  every number server-side before computing.
- **Escape at the boundary.** `src/app/contact/actions.ts` HTML-escapes every interpolated
  field and strips CR/LF from subject inputs. `JsonLd` (`src/lib/seo.tsx`) escapes the `<`
  character so an injected closing script tag cannot break out of the JSON-LD block.
- **Validate at trust boundaries** — length caps and allow-lists on every action input,
  token length capped before verify, redirect targets origin-checked.

## Logging

`console.error` only, sparsely. **No error tracking, no analytics, no structured logger
anywhere.** `src/app/error.tsx` discards the error object entirely, so a production route
error is unreconstructable. Assume nothing is captured unless you add it.

## Testing

`pnpm test` → `vitest run`. `vitest.config.ts`: `environment: "node"`,
`include: ["src/**/*.test.ts"]`, `@` → `./src`.

- ⚠ **`.test.tsx` is silently not run** — the glob is `.test.ts` only, so such a test appears
  to pass by never executing.
- **No jsdom, no testing-library, no Playwright.** Zero component, render or browser tests.

The style is **invariant/lock tests over structures**, not unit tests over functions:
`src/lib/launch.test.ts` derives its cases from `HIDDEN_AT_LAUNCH` rather than a hardcoded
route list, and covers sub-paths plus the `/docsomething` prefix collision;
`src/lib/section-backdrops.test.ts` scans the filesystem asserting every
`SECTION_BACKDROPS.<key>` reference exists (written because Turbopack dev does not typecheck
and a typo 500s the page) and includes a scanner-sanity assertion so it cannot silently match
nothing; `src/app/contact/tabs.test.ts` locks each intent to exactly one tab;
`src/components/sections/plan-comparison.test.ts` guards drift in the synced fallback JSON;
`src/lib/pricing.test.ts` and `src/app/tools/savings/compute.test.ts` cover the money paths.

**Not covered:** `fetchPricingData` branching, `verifyTurnstile`, `sendEmail`, the rate
limiter, all of `src/lib/seo.tsx`, the brand catalog helpers, the three hooks, **every Server
Action**, and every component. New tests follow the lock-test style.

## Adding a product module — the feature template

**2 files plus 1 preview, and no layout:**

1. `src/app/product/<slug>/page.tsx` — ~20 lines: `export const metadata` (title,
   description, `alternates.canonical`, `openGraph`) + default export rendering the body.
2. `src/components/product/pages/<slug>-module-page.tsx` — `"use client"`, declares
   `const config: ModuleConfig = {…}` (slug, eyebrow, headline, description, status,
   previewUrl, preview, pillars, useCases, planAvailability, relatedModules) and returns
   `<ProductModuleLayout config={config} />`. **No layout markup.**
3. `src/components/product/previews/<slug>-preview.tsx` — the static fake screenshot.
4. Register in `MODULES` (`src/lib/brand.ts`); add backdrop keys to
   `src/lib/section-backdrops.ts`.

`src/components/product/module-layout.tsx` renders the rest in fixed order: breadcrumb
JSON-LD → `Navbar` → hero (backdrop, glows, status ribbon, CTA pair from `status`, preview
frame) → pillars → use-cases → plan availability → related modules → `CtaBanner` → `Footer`.

## Reuse before writing

`src/components/ui/`: `AmbientGlow`, `AvrentisLogo`/`AvrentisMark`, `RoleBadge`,
`SectionBackdrop`, `ScrollProgress`. `src/components/ui/form/`: `ChoiceGroup`,
`SearchableSelect`. Plus `ProductModuleLayout` and `LegalPageShell`
(`src/components/legal/legal-page.tsx`, driven entirely by a `sections` prop).

## Landmines

Moved to its own file so it stays findable: **`docs/architecture/landmines.md`** — the
deliberate tradeoffs that must not be naively "fixed", plus the real defects and
duplication traps. Read it before changing anything in `src/lib` or `next.config.ts`.
