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
  `billing/limit-format`, `money/format` and `money/types`.**
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
- **Never hardcode a colour.** Use the `@theme` tokens in `src/app/globals.css` as
  `var(--color-…)`, or `rgba(var(--color-…-rgb), alpha)` for a tint; add a role-named token
  for a genuinely new colour. Only `src/lib/static-colors.ts` (email, OG image) holds values.
  `colour-tokens.lock.test.ts` enforces it. This codebase styles with inline `style={{}}`
  objects, not Tailwind classes.
- **Never type an address.** Contact emails live in `src/lib/contacts.ts` (`CONTACT_EMAIL`),
  the site URL in `src/lib/seo.tsx` (`SITE_URL`, `canonical(path)`); `contacts.lock.test.ts`
  enforces both. `/.well-known/security.txt` is generated from them (expiry always a year
  ahead, rebuilt daily) — never replace it with a static file.
- **Prices and limits are formatted on the site from the numbers.** A price goes through
  `formatCurrencyAmount` (`src/lib/money.ts`, core's `formatMoney`); a limit through
  `src/lib/plan-limits.ts` (`0` = unlimited; storage via core's `formatByteSize`, so GiB).
  Never print the API's `*Label` strings — their wording is not part of the contract.
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
