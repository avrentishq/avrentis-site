# Architecture

## Dependency direction

```
src/app/**/page.tsx  (server shell: metadata + one child)
        ↓
src/components/**    (page bodies, sections, primitives — mostly "use client")
        ↓
src/lib/**           (registries, pure helpers, I/O wrappers)
        ↓
@avrentishq/core/brand   ← external, brand identity only (see boundaries.md)
```

Nothing flows back up. `src/lib` never imports from `src/components`. The one deviation:
`src/app/about/page.tsx` and `src/components/sections/hero.tsx` import `BRAND` straight
from `@avrentishq/core/brand` instead of through the `src/lib/brand.ts` shim — two
provenance paths for the same constant. Prefer `@/lib/brand`.

## The page-shell pattern

Almost every route is a ~20-line server file that exports `metadata` and renders exactly
one client component which owns the whole page — including its own `Navbar`, `CtaBanner`,
and `Footer`. Example: `src/app/product/pay/page.tsx` → `PayModulePage`
(`src/components/product/pages/pay-module-page.tsx`) → `ProductModuleLayout`
(`src/components/product/module-layout.tsx`).

Consequence: chrome is **not** in a layout. Changing the navbar's position in the page
means editing every page body, not one file.

## Module responsibilities (`src/lib`)

| File | Owns | I/O? |
|---|---|---|
| `brand.ts` | Re-exports the brand SSOT, **plus** the site-only marketing module catalog (`MODULES`, `MODULE_ORDER`, `isModulePublic`, `PUBLIC_MODULE_COUNT`, `moduleName`). Do not add parent-brand values here. | no |
| `launch.ts` | The launch gate — `HIDDEN_AT_LAUNCH` + `isLaunchHidden`/`isLaunchVisible`. Dependency-free on purpose so client nav and server pages share it. | no |
| `pricing.ts` | The pricing API contract (types), `fetchPricingData()`, and the money formatters. | fetch |
| `platform.ts` | Product-app origins, split browser vs server to avoid hydration mismatch. | reads env |
| `section-backdrops.ts` | `SECTION_BACKDROPS` — one registry mapping every section band to one of five recycled textures. `scrim` stays at the call site as a per-section legibility choice. | no |
| `seo.tsx` | Canonical origin, `JsonLd`, and the schema.org builders. | no |
| `animations.ts` | The only shared motion variants: `fadeUp`, `fadeUpTransition`, `staggerDelay`. | no |
| `org-size.ts`, `security-faqs.ts`, `utils.ts` | Static config; `cn()`. | no |
| `email.ts` | Resend wrapper. `"server-only"`. | yes |
| `rate-limit.ts` | Upstash sliding window with in-memory fallback; `clientIp()`. `"server-only"`. | yes |
| `turnstile.ts` | Cloudflare siteverify. `"server-only"`. | yes |

## Server surfaces

**There are zero API route handlers.** No `route.ts` exists anywhere in `src/app`. Every
server surface is a Server Action:

| Action | File | Purpose |
|---|---|---|
| `submitTrialRequest` | `src/app/trial/actions.ts` | Trial signup → platform |
| `reissueTrialToken` | `src/app/trial/actions.ts` | Re-send an expired verification link |
| `submitContact` | `src/app/contact/actions.ts` | Contact form → email |
| `emailEstimate` | `src/app/tools/savings/actions.ts` | Savings estimate → email |

All four follow the same pipeline: **bot check → per-IP rate limit → field validation and
length caps → Turnstile → external call → return a state object.** Actions never throw to
the client; they return a discriminated state object consumed by `useActionState`.

The abuse-defence layers, their tuning, and their deliberate tradeoffs are **not** documented
in this public repo — see `guides/security-posture.md` (gitignored) and the header comments in
`src/lib/rate-limit.ts` and `src/lib/turnstile.ts` before touching any of it.

## Rendering

No route declares any rendering directive — no `export const dynamic`, `revalidate`,
`runtime`, `generateStaticParams`, `generateMetadata`, or `use cache` exists in `src/app`,
and `next.config.ts` enables no `experimental`/`cacheComponents`/`ppr` flags. Caching is
therefore inferred from data access, not declared:

- `/` and `/pricing` — static/ISR, because their only fetch sets `next: { revalidate: 3600 }`
  inside `fetchPricingData` (`src/lib/pricing.ts`). That is the **only** revalidation
  directive in the codebase.
- `/contact` — dynamic; it awaits `searchParams`.
- `/trial/verify/[token]` — dynamic; the only dynamic segment, fetched `cache: "no-store"`.

## Where state lives

There is **no client state library** — no Redux, Zustand, or Context beyond
`MotionProvider`. State is:

1. **Form state** — `useActionState` against the Server Action, e.g.
   `src/app/trial/trial-form.tsx`.
2. **Server cache** — Next Data Cache, 1 hour, for pricing only.
3. **One `localStorage` key** — a short-lived duplicate-submit guard in
   `src/app/trial/trial-form.tsx`. Best-effort only, by design; it is not a security
   control. See the local security guide.
4. **Viewport/motion preference** — the three hooks in `src/lib/hooks/`, all using
   `useSyncExternalStore` with `getServerSnapshot → false`, so SSR renders the
   desktop/un-reduced path and the client corrects on mount.

## Data flow 1 — trial signup → verify → platform redirect

1. `src/app/trial/page.tsx` renders `TrialForm` (`src/app/trial/trial-form.tsx`).
2. `useActionState(submitTrialRequest, INITIAL_STATE)`; `INITIAL_STATE` lives in
   `src/app/trial/state.ts`, deliberately outside the `"use server"` module.
3. `submitTrialRequest` (`src/app/trial/actions.ts`) → bot check → rate limit → validates
   email regex, `role` against a local allow-list, `orgSize` against `ORG_SIZES`, required
   name/organisation/country/consent, and length caps → `verifyTurnstile` →
   `POST {PLATFORM_ORIGIN}/api/v1/public/trial/request`.
4. Response maps to `verification_sent` | `queued_for_review` | `hard_blocked` | `error`.
   A `422` maps the backend's field errors through a known-key filter and **always**
   falls back to a general message, so it is never a silent no-op. The form branches to
   the matching card and writes the `localStorage` guard.
5. The emailed link hits `src/app/trial/verify/[token]/page.tsx`, which guards token
   length, POSTs to `/api/v1/public/trial/verify` with `cache: "no-store"`, then
   **open-redirect guards**: it parses the returned invite/login URL and only calls
   `redirect()` when its origin equals `PLATFORM_ORIGIN`'s. Otherwise it falls through
   to the error card. Do not weaken this.
6. `status === "expired"` renders a form posting to `reissueTrialToken`
   (`src/app/trial/verify/[token]/client.tsx`).

## Data flow 2 — contact → email

`src/app/contact/page.tsx` resolves `?intent=` against a local valid-intent list →
`ContactForm` (`src/components/contact/contact-form.tsx`) → `submitContact`
(`src/app/contact/actions.ts`) → bot check → rate limit → validation (minimum message
length, plus per-field caps) → `verifyTurnstile` → **every interpolated field HTML-escaped
and CR/LF stripped from subject inputs** → `sendContactEmail` (`src/lib/email.ts`, Resend).
Nothing is persisted. On failure the user is told to email `hello@avrentis.com`.

Tab grouping is derived, not hardcoded: `CONTACT_TABS` + `tabForIntent`
(`src/app/contact/tabs.ts`) map 12 intents onto 5 tabs, with the invariant locked by
`src/app/contact/tabs.test.ts`.

## Data flow 3 — pricing → page

1. Build/dev: `scripts/sync-pricing-fallback.mjs` refreshes `src/data/pricing-fallback.json`
   from the live API. Fail-safe, exit 0.
2. Runtime: `PLATFORM_ORIGIN` (`src/lib/platform.ts`) → `PRICING_API` →
   `fetchPricingData()` (`src/lib/pricing.ts`) with `next: { revalidate: 3600 }`.
3. A shape guard requires non-empty `plans`, non-empty `planOrder`, and an array
   `pricing` on every plan. **Any** failure — non-ok, bad shape, thrown fetch — returns
   the committed fallback JSON. The payload is never type-validated, only shape-sniffed
   (`as unknown as PricingData`).
4. `src/app/page.tsx` and `src/app/pricing/page.tsx` both await it and pass it down to
   `Pricing` (`src/components/sections/pricing.tsx`) and `PlanComparison`
   (`src/components/sections/plan-comparison.tsx`).
5. `softwareApplicationSchema` (`src/lib/seo.tsx`) derives an `AggregateOffer` from the
   same object, returning `null` when there is no positive USD price.
