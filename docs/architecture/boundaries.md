# Boundaries

Everything this repo does **not** own. Written so a session never has to open another
repo or package to answer a boundary question.

## 1. `@avrentishq/core` — the shared package

Pinned in `package.json` as `github:avrentishq/avrentis-core#v0.70.0` (a **private** GitHub
repo, cloned at install). Listed in `transpilePackages` in `next.config.ts`.

Facts from `node_modules/@avrentishq/core/package.json`:

- `version` 0.70.0, `type: module`, `engines.node >= 22.15.0`.
- **Ships raw TypeScript source, no build step, no `dist`** (`files: ["src", ...]`). That
  is why `transpilePackages` is mandatory — remove it and the build breaks.
- Self-described as "Shared substrate for the Avrentis platform — consumed by
  avrentis-app, avrentis-site, and avrentis-admin." So changes there are cross-repo.
- ~40 export subpaths: `./db*`, `./money*`, `./auth/*`, `./audit/*`, `./billing/*`,
  `./trial/*`, `./domains*`, `./entitlements/*`, `./modules/*`, `./kms/*`,
  `./kill-switches*`, `./platform*`, `./security/*`, `./ai*`, `./funnel`,
  `./csv-sanitize`, `./idempotency`, `./brand`, `./brand/*`, `./brand/fonts/*`.
- **13 heavy `peerDependencies`** (drizzle-orm, @neondatabase/serverless, zod, bcryptjs,
  @aws-sdk/*, otpauth, @simplewebauthn/server, ws, tldts, ai) and **none are installed
  here**. `.npmrc` sets `auto-install-peers=false`.

### ⚠ Only `./brand` is safe to import

This site imports **exclusively** from `@avrentishq/core/brand`, which is dependency-free.
Importing any other subpath (`./db*`, `./auth/*`, `./money*`, `./ai*`, …) pulls in peer
deps that do not exist in this repo — it will fail at build or, worse, at runtime.

Current import sites: `src/lib/brand.ts` (`export *`, the shim everything else should use),
`src/app/about/page.tsx`, `src/components/sections/hero.tsx`, `src/components/ui/logo.tsx`.

### Shapes (so you never open the package)

`@avrentishq/core/brand` re-exports exactly:

- from `constants`: `BRAND`, `BRAND_COLORS`, `BRAND_FONTS`, `WORDMARK_SPEC`, `type BrandKey`
- from `white-label`: `WhiteLabelTenantSettings`, `isWhiteLabelTenant`, and eight
  `resolve*` helpers — **all unused by this site**
- from `logo-geometry`: `type MarkVariant`, `getProps`, `MARK_VARIANTS`, `avrentisMarkSvgString`

| Export | Shape |
|---|---|
| `BRAND` | 17 string fields: `name`, `tagline` ("Nothing moves without authority"), `positioningStatement` ("Delegation-of-Authority Platform"), `pdfChromeSubtitle`, `emailSenderDefault`, `poweredBy`, `documentCredit`, `emailFooterChromeStandard`, `emailFooterChromeWhiteLabel`, `copyrightChrome`, `legalEntity` ("Avrentis Inc."), `supportEmail`, `securityEmail`, `trialsEmail`, `contactEmail` ("hello@avrentis.com"), `statusEmail`, `appUrl` ("https://app.avrentis.com") |
| `BrandKey` | `keyof typeof BRAND` |
| `BRAND_COLORS` | `{ navy: "#0f172a", gold: "#c68b2f" }`. In practice components only ever read `.gold`. |
| `BRAND_FONTS` | `{ ui: "Archivo", wordmark: "Cabinet Grotesk", mono: "IBM Plex Mono" }` |
| `WORDMARK_SPEC` | `{ tracking, weight: 800, sizeFactor: .6, baselineLiftFactor: .19, gapFactor: .25 }` |
| `MarkVariant` | `"primary" \| "reversed" \| "transparent-gold" \| "transparent-navy"` |
| `getProps(size)` | Pure gate-mark geometry → beam/post/slot/ledger rect coordinates from fixed ratios. |
| `MARK_VARIANTS` | `Record<MarkVariant, { container; stroke; slot; border; wordmark }>` of literal colours, for non-CSS contexts. |
| `avrentisMarkSvgString({ size, stroke, slot? })` | Standalone SVG string with literal colours, for email/Swagger chrome. |

### Who owns what

- **Core owns:** brand identity strings, brand colours, font names **and the font files**,
  wordmark spec, gate-mark geometry, white-label resolvers.
- **Core does not own:** pricing (live API, §2) or the marketing module catalog — that is
  site-specific and lives in `src/lib/brand.ts`.
- `src/components/ui/logo.tsx` wraps the geometry into a React lockup and maps variants to
  CSS custom properties rather than using `MARK_VARIANTS`.

**Landmine:** `src/app/layout.tsx` loads the wordmark font by a *deep relative path* into
`../../node_modules/@avrentishq/core/src/brand/fonts/...` instead of the declared
`./brand/fonts/*` export. A hoisting change or a `src/` restructure in the package breaks
the build.

## 2. APIs consumed — `app.avrentis.com`

Origin resolution: `PLATFORM_ORIGIN` (`src/lib/platform.ts`) = `PLATFORM_API_URL` →
`NEXT_PUBLIC_PLATFORM_URL` → `BRAND.appUrl`. Allowed in the CSP `connect-src`
(`next.config.ts`).

| Endpoint | Method | Called from | Contract |
|---|---|---|---|
| `/api/v1/public/pricing` | GET | `src/lib/pricing.ts` (`fetchPricingData`), `next: { revalidate: 3600 }` | Response typed as `PricingData` in `src/lib/pricing.ts`. Shape-sniffed only, never validated. Falls back to `src/data/pricing-fallback.json`. |
| `/api/v1/public/trial/request` | POST | `src/app/trial/actions.ts` | Returns 202 + `verification_sent` \| `queued_for_review`; 403 + `hard_blocked`; 422 + `errors.fieldErrors`; 429. |
| `/api/v1/public/trial/reissue` | POST | `src/app/trial/actions.ts` | `response.ok` ⇒ sent. |
| `/api/v1/public/trial/verify` | POST | `src/app/trial/verify/[token]/page.tsx`, `cache: "no-store"` | Returns a status plus `inviteUrl`/`loginUrl`. **Origin-checked before redirect.** |

Every one of these is server-side. There is no `fetch()` in any `"use client"` file, so
the `connect-src https://app.avrentis.com` grant currently covers no browser request.

**Shared schema, no shared types.** `PricingData` in `src/lib/pricing.ts` is a
hand-maintained mirror of the platform's response — it is *not* imported from
`@avrentishq/core`. If the platform changes that payload, the mirror drifts silently.
Confirmed drift today: the fallback JSON carries a `trial` key that `PricingData` does not
model. Source of truth is the platform API; this repo holds a copy.

The shape validator is duplicated on purpose in two places —
`scripts/sync-pricing-fallback.mjs` (cannot import TS) and `src/lib/pricing.ts`. Update both.

## 3. Other services

| Service | Integration point | Used for | Failure behaviour |
|---|---|---|---|
| **Upstash Redis** + `@upstash/ratelimit` | `src/lib/rate-limit.ts` (`getRedis`, `getLimiter`) | Per-IP limits on all four Server Actions | Degrades rather than hard-failing when unconfigured or unreachable. The exact behaviour is a deliberate tradeoff documented in the file's header comment and in `guides/security-posture.md` (gitignored) — read it before changing. |
| **Resend** | `src/lib/email.ts` (`sendEmail`, `sendContactEmail`); client constructed per call | Contact form; savings-estimate emails | Missing `RESEND_API_KEY` ⇒ **throws at send time**, not at boot (deliberate — no env validation at module load). A Resend error ⇒ throws `"Resend failed: …"`, caught by the action. |
| **Cloudflare Turnstile** | `src/lib/turnstile.ts` (`verifyTurnstile` → `challenges.cloudflare.com/turnstile/v0/siteverify`); widget read in `contact-form.tsx`, `trial-form.tsx`, `estimator.tsx` | Bot defence on all three public forms | Requires **both** keys to enforce. Partial configuration changes behaviour in a way that is easy to miss — see the file header and `guides/security-posture.md` (gitignored) before deploying with either key unset. |
| **Doppler** | `package.json` `dev` script **only** | Local dev secrets | Referenced nowhere else — no `doppler.yaml`, no CI. `pnpm build`/`start` do not go through it; production env comes from Vercel. UNVERIFIED which Doppler project/config maps to which vars — nothing in-repo declares it. |
| **Vercel** | `vercel.json` | Hosting, build | `installCommand` writes a git config to `/tmp/gc` rewriting `git@github.com:` → `https://x-access-token:${GITHUB_TOKEN}@`, so the private package can be cloned. An unset or expired `GITHUB_TOKEN` kills the build at install. Nothing in-repo documents rotation. |

## 4. Environment variables — complete list

| Name | Read at | Public | Required | If absent |
|---|---|---|---|---|
| `GITHUB_TOKEN` | `vercel.json` (installCommand) | no | **yes, to install** | `pnpm install` cannot clone `@avrentishq/core`; build fails |
| `RESEND_API_KEY` | `src/lib/email.ts` | no | **yes in prod** | Contact + estimate emails throw at send time |
| `TURNSTILE_SECRET_KEY` | `src/lib/turnstile.ts` | no | **yes in prod** | Bot verification behaviour changes — see local security guide |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | `src/lib/turnstile.ts`, `contact-form.tsx`, `trial-form.tsx`, `estimator.tsx` | **yes** | **yes in prod** | Widget not rendered; see local security guide |
| `UPSTASH_REDIS_REST_URL` | `src/lib/rate-limit.ts` | no | **yes in prod** | Limiter degrades — see local security guide |
| `UPSTASH_REDIS_REST_TOKEN` | `src/lib/rate-limit.ts` | no | **yes in prod** | Same |
| `NEXT_PUBLIC_PLATFORM_URL` | `src/lib/platform.ts` | **yes** | no | Falls back to `BRAND.appUrl` |
| `PLATFORM_API_URL` | `src/lib/platform.ts` | no | no | Falls back to the browser origin |
| `CONTACT_FROM` | `src/lib/email.ts` | no | no | `"Avrentis <hello@avrentis.com>"` |
| `CONTACT_INBOX` | `src/lib/email.ts` | no | no | `hello@avrentis.com` |
| `NODE_ENV` | `next.config.ts`, `src/lib/turnstile.ts` | — | framework-set | n/a |

There is **no `.env.example`** and `.gitignore` ignores `.env*` wholesale. The only env
documentation is `guides/public-site-setup.md`, which is gitignored **and stale** — it
lists `NEXT_PUBLIC_APP_URL` and `EMAIL_FROM`, neither of which exists in code. This table
is the source of truth.

**Note:** `scripts/sync-pricing-fallback.mjs` **hardcodes** `https://app.avrentis.com/...`
rather than honouring `PLATFORM_API_URL`, so pointing the runtime at a preview backend
does not redirect the fallback sync. The script's own header admits the duplication.

## 5. Surface this repo exposes

- `GET /sitemap.xml` (`src/app/sitemap.ts`) — 12 hardcoded routes plus public module
  slugs, filtered through `isLaunchVisible`. `lastModified` is render time.
- `GET /robots.txt` (`src/app/robots.ts`) — allow-all + sitemap URL.
- `GET /opengraph-image` (`src/app/opengraph-image.tsx`) — 1200×630 PNG via `next/og`,
  drawn from brand constants only, deliberately asset-free.
- JSON-LD: organization (layout), softwareApplication (home), faqPage
  (`src/app/product/security/page.tsx`), breadcrumbs (`module-layout.tsx`).
- **Security headers and CSP** — defined in `next.config.ts`: CSP, `X-Frame-Options: DENY`,
  `nosniff`, `Referrer-Policy`, HSTS with preload, `Permissions-Policy`,
  `poweredByHeader: false`. The CSP encodes one documented accepted residual with a stated
  upgrade path; the reasoning is in the file's header comment. Do not "fix" it casually —
  the upgrade requires real browser verification.
- One redirect: `/contact?intent=trial` → `/trial`, permanent.

The base URL is hardcoded in three separate places — `metadataBase` in
`src/app/layout.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`, plus `SITE_URL` in
`src/lib/seo.tsx`. Changing domain means touching all of them.
