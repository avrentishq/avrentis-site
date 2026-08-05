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

## Commands

| | |
|---|---|
| `pnpm dev` | Dev server. **Requires Doppler** (`doppler run --config dev`) — bare `next dev` has no secrets. |
| `pnpm build` | Production build. |
| `pnpm test` | `vitest run`. |
| `pnpm lint` | `eslint .` — expect `0 problems`. |
| `pnpm type-check` | `tsc --noEmit`. **Turbopack dev does not typecheck — run this before claiming done.** |

There is no CI. Nothing runs these for you.

## Non-negotiables

- **`import { m } from "framer-motion"`, never `motion`.** The app is wrapped in
  `LazyMotion strict`, so a stray `motion.*` throws at runtime.
- **Only import from `@avrentishq/core/brand`.** Every other subpath of that package needs
  peer dependencies this repo does not install.
- **Never hand-edit `src/data/pricing-fallback.json`.** It is generated on every `pnpm dev`
  and `pnpm build`.
- **Keep every `pnpm.overrides` entry bounded to one major** (`^1.2.3`, never `>=1.2.3`).
  An unbounded override silently floated three majors and broke `pnpm lint` repo-wide.
- **Name tests `*.test.ts`, never `*.test.tsx`.** The vitest glob excludes `.tsx`, so a
  `.tsx` test is silently never executed and appears to pass.
- **Server Actions return a state object; they never throw to the client.**
- **The abuse-defence and CSP behaviour in `src/lib/rate-limit.ts`, `src/lib/turnstile.ts`
  and `next.config.ts` encodes deliberate tradeoffs, not oversights.** Read the header
  comment in the file first. This repo is public, so the specifics live in
  `guides/security-posture.md`, which is gitignored.
- **Never weaken the origin check before `redirect()`** in `src/app/trial/verify/[token]/`.
- **Never hardcode a colour.** Use the `@theme` tokens in `src/app/globals.css`. This
  codebase styles with inline `style={{}}` objects, not Tailwind classes.
- **Never hardcode a plan tier or module name.** Tiers come from the pricing API; module
  names come from `MODULES` in `src/lib/brand.ts`.
- Full-word variable names. No cryptic abbreviations.
- Visual changes get verified in a real browser and looked at, not reasoned about.

## Planning

Long-horizon work gets a plan file on disk at
`docs/superpowers/plans/<YYYY-MM-DD>-<slug>.md`, updated as the work proceeds — plans do
not live in session context. See `docs/architecture/planning.md`. Note that
`docs/superpowers/` is gitignored; only `docs/architecture/` is tracked, so promote any
durable decision out of the plan and into the reference docs.

# Compact instructions
When compacting, preserve: the current task and plan, file paths touched, decisions
made and why, and unresolved errors. Summarize exploration and file contents
aggressively.
