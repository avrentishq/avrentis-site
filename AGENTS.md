<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- Everything above is tool-managed. Add rules below this line only. -->

# avrentis-site

The public marketing site for Avrentis (avrentis.com) — a single Next.js 16 App Router
service on Vercel. Brand identity comes from a private shared package, pricing comes from
the platform API at `app.avrentis.com`, and the only server code is four Server Actions.

## Architecture questions → invoke `repo-map`

**Do not explore the codebase to orient yourself.** Invoke the `repo-map` skill for
anything architectural: where code lives, how modules relate, how this talks to things it
does not own, which conventions to follow, what a domain term means, or what the known
landmines are. It points at `docs/architecture/` — one reference file per topic.
Use `repo-map-refresh` to update those docs from a git range after a change.

`docs/architecture/` is **gitignored and stays that way**. This repository is public and
those files are internal engineering detail. Keep them on disk; never track them.

## Commands

| | |
|---|---|
| `pnpm dev` | Dev server. **Requires Doppler** (`doppler run --config dev`) — bare `next dev` has no secrets. |
| `pnpm build` | Production build. |
| `pnpm test` | `vitest run`. |
| `pnpm lint` | `eslint .` — expect `0 problems`. |
| `pnpm type-check` | `tsc --noEmit`. **Turbopack dev does not typecheck — run this before claiming done.** |

Run these locally before you claim anything is done.

## Non-negotiables

- **`import { m } from "framer-motion"`, never `motion`.** The app is wrapped in
  `LazyMotion strict`, so a stray `motion.*` throws at runtime.
- **Runtime code imports only `@avrentishq/core/brand`, `@avrentishq/core/region/countries`,
  `@avrentishq/core/security/rate-limit`, `@avrentishq/core/security/rate-limit-tiers` and the
  pure slices `billing/trial-deadlines`, `billing/capacity`, `billing/catalog`,
  `billing/limit-format`, `money/format`, `money/types`, `billing/features`, `billing/platform-tax`, `region/sales-tax` and `billing/reserved-mail-domain`.**
  Every other subpath of that package needs peer dependencies this repo does not install
  (`region/countries` has type-only imports; the `region` index pulls in a phone library; the
  two rate-limit modules need only the Upstash packages the site already has — the rest of
  `security/` does not, so it is admitted module by module, never as `security/*`).
  Tests may also import the dependency-free `modules/catalog`, `security/dependency-floors` and
  `brand/copy-guardrails`
  — they back the parity lock tests and never ship. `src/lib/core-imports.lock.test.ts`
  enforces this list AND walks each allowed subpath's value-import graph, failing on any
  package the site does not install; extend both together.
- **Never type a trial term.** The trial's length, read-only grace, seat cap, storage and
  message caps and the plan it runs on come from core via `src/lib/trial-terms.ts`
  (`START_TRIAL_CTA`, `TRIAL_LENGTH`, …); a page that renders the pricing API's `trial`
  block reads `days`/`seatCap` from it. `trial-terms.lock.test.ts` fails on a typed
  "30-day trial", "N-seat", "N days after trial" or "<Plan> tier". The changelog is exempt —
  an entry records what was true on its date.
- **Rate limiting runs on core's shared limiter.** `src/lib/rate-limit.ts` holds one entry per
  Server Action (core tier, identifier, numbers, fail mode) and `limitVisitor(action)`; never
  build an Upstash client or limiter in this repo. Every limiter carries a `site_*` tier from
  `@avrentishq/core/security/rate-limit-tiers`, so refusals show up in the platform console.
  Refusal counts reach the console only when the site uses the same Upstash database and
  `RATE_LIMIT_KEY_PREFIX` as that environment's app; environments sharing one database each need
  a distinct prefix. `RATE_LIMIT_DISABLED=true` bypasses limits in `next dev` only.
- **Never hand-edit `src/data/pricing-fallback.json`.** It is generated from core's plan
  catalogue (prices, capacity, features, modules, trial) plus the site's own plan words in
  `src/data/plan-copy.ts`, by `src/lib/pricing-fallback-build.ts`, run through
  `scripts/generate-pricing-fallback.mjs` on every `pnpm dev` / `pnpm build` — no network.
  `pricing-fallback.test.ts` (and `pnpm pricing:check`) fails when the committed file
  differs, so after a core bump: run the script and commit the JSON. The generator and the
  plan copy are build-only — no page imports them (`core-imports.lock.test.ts`).
- **`pnpm.overrides` materialises core's canonical floor map**
  (`@avrentishq/core/security/dependency-floors`), enforced by
  `src/lib/security/dependency-floors.lock.test.ts`. Change a shared floor in core, not here;
  copy the entries verbatim, reinstall, and confirm the lockfile moved. A site-only extra floor
  must be bounded to one major (use the version-ranged key form) — an unbounded one silently
  floated three majors and broke `pnpm lint` repo-wide. Re-run `pnpm lint` after any change.
- **Name tests `*.test.ts`, never `*.test.tsx`.** The vitest glob excludes `.tsx`, so a
  `.tsx` test is silently never executed and appears to pass.
- **Server Actions return a state object; they never throw to the client.**
- **The abuse-defence and CSP behaviour in `src/lib/rate-limit.ts` (each action's
  `failClosed`), `src/lib/turnstile.ts` and `next.config.ts` encodes deliberate tradeoffs,
  not oversights.** Read the header comment in the file first. This repo is public, so the specifics live in
  `guides/security-posture.md`, which is gitignored.
- **Never weaken the origin check before `redirect()`** in `src/app/trial/verify/[token]/`.
- **The focus ring comes from the surface, never the component.** `src/lib/surfaces.ts` maps each
  background (token, or a strong translucent layer with what it sits on) to its ring; a new
  background must be registered there or `focus-ring-contrast.lock.test.ts` fails, and every
  pairing is held at 3:1. Never set `outline` on a component.
- **Forms work without JavaScript.** Pass the server action itself to `useActionState` (never a
  client wrapper), submit with `onSubmit={submitWithoutReset(action)}` next to `action`
  (`form-submit.lock.test.ts`), gate buttons on `useHydrated()` so the server HTML never ships
  them disabled, spread `JS_ONLY` / `FORM_STEP` (`src/lib/no-script.ts`) on script-only controls
  and steps, and hand a refusal's posted values back (`src/lib/submitted-values.ts`).
- **Never hardcode a colour.** Use the `@theme` tokens in `src/app/globals.css` as
  `var(--color-…)`, or `rgba(var(--color-…-rgb), alpha)` for a tint; add a role-named token
  for a genuinely new colour. Only `src/lib/static-colors.ts` (email, OG image) holds values.
  `colour-tokens.lock.test.ts` enforces it. This codebase styles with inline `style={{}}`
  objects, not Tailwind classes.
- **Never type an address.** Contact emails live in `src/lib/contacts.ts` (`CONTACT_EMAIL`);
  the site URL is core's `BRAND.siteUrl`, used through `src/lib/seo.tsx` (`SITE_URL`,
  `canonical(path)`); `contacts.lock.test.ts` enforces both. `/.well-known/security.txt` is
  generated from them (expiry always a year ahead, rebuilt daily) — never replace it with a
  static file.
- **Never type a path core owns.** Other surfaces (product emails, trial screens, billing)
  link to this site through core's `@avrentishq/core/brand`, so the site links the same way:
  legal pages via `LEGAL_PAGES`, the trial via `SITE_PAGES.trial()`, contact via
  `contactHref(intent?)` (= `SITE_PAGES.contact`), topics from `CONTACT_INTENTS` /
  `isContactIntent`. `site-pages.lock.test.ts` proves every path core publishes is a real,
  sitemapped page here (moving one fails this build, not a customer's click) and forbids a
  hand-typed copy outside the route inventories (`sitemap.ts`, `launch.ts`). The trust
  centre is a named exception there while it is launch-hidden.
- **Prices and limits are formatted on the site from the numbers.** A price goes through
  `formatCurrencyAmount` (`src/lib/money.ts`, core's `formatMoney`); a limit through
  `src/lib/plan-limits.ts` (`0` = unlimited; storage via core's `formatByteSize`, so GiB).
  Never print the API's `*Label` strings — their wording is not part of the contract.
- **Listed prices are before tax, and a tax line shows only where core says tax is
  charged.** `priceTaxNote` (`src/lib/price-tax.ts`) asks core's `platformSalesTax`, which
  adds tax only for a country in core's `PLATFORM_TAX_REGISTRATIONS` — empty until Avrentis
  is registered, so no VAT line today. Core decides WHETHER; the API's numeric `taxRate`
  only formats the rate once core says yes (else core's rate), and is ignored when core
  says no — so an app on an older core can never make the site advertise uncharged tax.
  Never a typed rate. Stripe currencies show no tax line (tax is computed at checkout).
- **Service commitments (dedicated onboarding, priority support) are their own comparison
  group**, "Service & support" — never under "Workflow & platform". `fetchPricingData` runs
  every payload (live or fallback) through `withServiceCommitmentGroup`
  (`src/lib/service-commitments.ts`, keys from core's `SERVICE_COMMITMENT_KEYS`), which reads
  per-plan `serviceCommitments` and falls back to `features` for an older payload.
- **Never hardcode a plan tier or module name.** Tiers come from the pricing API; module
  names come from `MODULES` in `src/lib/brand.ts` (`moduleName(key)` in titles and prose —
  `module-names.lock.test.ts` fails on a typed "Avrentis <Module>" anywhere else). This includes BRANCHING on a tier:
  `plan.key === "enterprise"` is the same bug as printing the name — it decided the CTA,
  the struck-through price and the annual saving, and is wrong the moment a second tier
  is quote-priced or Enterprise becomes self-serve. Read `plan.selfServeCheckout`, which
  the product API publishes and enforces on its own Pay button; the featured tier is core's
  `PLAN_CATALOG[*].recommended`; "N months free" is core's `ANNUAL_BILLED_MONTHS`; a sentence
  naming the plans a feature is on uses `planNames(data, feature)`. `pricing.test.ts` fails
  on any plan key typed in the pricing section.
- Full-word variable names. No cryptic abbreviations.
- Visual changes get verified in a real browser and looked at, not reasoned about.

## Planning

Long-horizon work gets a plan file on disk at
`docs/superpowers/plans/<YYYY-MM-DD>-<slug>.md`, updated as the work proceeds — plans do
not live in session context. See `docs/architecture/planning.md`. Both `docs/superpowers/`
and `docs/architecture/` are gitignored, so a plan does not survive a fresh clone — promote a
durable decision that every session must respect into this file.

# Compact instructions
When compacting, preserve: the current task and plan, file paths touched, decisions
made and why, and unresolved errors. Summarize exploration and file contents
aggressively.
