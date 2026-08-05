# Landmines

Known traps in this repo. Read before changing anything in `src/lib` or `next.config.ts`.

## Never leave a `pnpm.overrides` entry unbounded

**Rule: every entry in the `pnpm.overrides` block in `package.json` must be bounded to a
single major (`^1.2.3`), never open-ended (`>=1.2.3`).** An unbounded target keeps floating
upward forever, so a security floor set today silently becomes a major-version jump the
moment upstream publishes one. There is no CI here, so nothing catches it.

This is not hypothetical. `"brace-expansion@>=1.0.0 <1.1.13": ">=1.1.13"` was meant as a
ReDoS floor inside the 1.x line. When 5.x shipped, the unbounded range floated three majors
to it, and `minimatch@3.1.5` — which `require()`s brace-expansion expecting the module
itself to be callable, as 1.x exported it — got 5.x's `{ EXPANSION_MAX, expand }` object
instead. `pnpm lint` died with `TypeError: expand is not a function` and linted **nothing**,
repo-wide, silently, for weeks. Three other entries had already drifted a major the same way
(`uuid` 11→14, `@babel/core` 7→8, `js-yaml` 4→5) without anyone choosing it.

All entries are bounded now, and the floors clear the advisories open at the time. When you
add or raise one, bound it and re-run `pnpm audit` **and** `pnpm lint` — a resolution change
can break tooling that a passing build will not reveal.

## Abuse defences — deliberate tradeoffs, not bugs

`src/lib/rate-limit.ts`, `src/lib/turnstile.ts`, and the CSP in `next.config.ts` each
encode a **deliberate** availability-over-strictness tradeoff, with the reasoning written
out in a header comment at each decision site. They look like oversights and are not.

**Read the header comment in the file before changing any of them**, and do not "harden"
one without understanding what it was traded against — several interact.

This repo is public, so the specifics (tuning values, degradation behaviour, which
controls are advisory) are deliberately **not** documented here. They are in
`guides/security-posture.md`, which is gitignored. If that file is missing from your
checkout, ask — do not reconstruct it into a tracked file.

`src/lib/email.ts` also validates no environment at module load, so a missing API key
surfaces as a throw on first submission rather than at boot. That one is a startup-vs-runtime
choice, not a security control.

**Real defects and traps:**

- `src/data/pricing-fallback.json` is committed minified on one line while
  `scripts/sync-pricing-fallback.mjs` writes pretty-printed JSON — the next successful build
  reformats it and produces a large spurious diff.
- `TrialFormState.auto_rejected` (`src/app/trial/state.ts`) is handled by the UI but **no code
  path produces it**, despite its comment claiming the adapter maps it.
- The valid-intent list is declared twice: `src/app/contact/state.ts` and again inline in
  `src/app/contact/page.tsx`.
- Two byte-identical `escape()` helpers: `src/app/contact/actions.ts` and
  `src/app/tools/savings/actions.ts`.
- `src/app/product/people/page.tsx` and `src/app/product/integrations/page.tsx` call
  `isLaunchHidden` → `notFound()` but are not listed in `HIDDEN_AT_LAUNCH`, so the guard and
  the registry disagree. `src/app/sitemap.ts` treats Requests differently again. Being
  reconciled on `fix/gate-unlisted-module-pages`.
- Some client-side input checks in `src/app/trial/trial-form.tsx` are advisory nudges with
  no server-side counterpart, by design. Which ones, and why, is in the local security guide
  — do not assume a client check is enforced.
- The only `eslint-disable` in the tree is `react-hooks/exhaustive-deps` in
  `src/app/trial/trial-form.tsx`, where the persist effect reads the email value while
  depending on status alone — a stale value is possible on the `queued_for_review` branch.
- `src/lib/rate-limit.ts` exports `rateLimit`, which has no consumer outside its own module —
  dead surface. App code uses `rateLimitDurable`.
- **Duplicated art:** the submit→approve→record flow is drawn twice, inline in
  `src/components/sections/how-it-works.tsx` (~600 lines) and again in
  `src/components/product/stage-mockups.tsx` (~700 lines) — editing one diverges the other.
  The 8 preview files each re-hand-roll the same frame/card/row chrome (~1340 lines total), so
  a 9th module means copy-pasting ~170 lines.
- `src/components/product/security-mockups.tsx` carries `"use client"` while its structurally
  similar sibling `src/components/product/stage-mockups.tsx` does not. Whether it needs the
  directive is UNVERIFIED.

**No `TODO`/`FIXME`/`HACK`/`ponytail:` markers exist anywhere in this repo** — verified.
Deliberate simplifications are recorded as long prose header comments instead
(`src/lib/rate-limit.ts`, `src/lib/turnstile.ts`, `next.config.ts`,
`scripts/sync-pricing-fallback.mjs`). Follow that: explain the ceiling where the decision lives.
