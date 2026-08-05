---
name: repo-map
description: Read FIRST when working in the avrentis-site repo and you need to know where anything lives or how it fits together — where code lives, which directory owns what, where a route or component or helper should go, how modules relate and which way dependencies flow, how data flows through a page or a form, where state lives, what this repo talks to that it does not own (the @avrentishq/core shared package, the app.avrentis.com platform API, Resend, Upstash, Turnstile, Doppler, Vercel), which env vars exist and what breaks without them, what conventions to follow for naming, styling, animation, error handling, logging or tests, how to add a feature or a product module, what a domain term means (module, launch gate, org size, plan tier, feature group, section backdrop, Verification Network), and which known landmines and deliberate tradeoffs must not be naively "fixed". Use instead of exploring the codebase from scratch.
---

# Repo map — avrentis-site

Public marketing site for Avrentis. One Next.js 16 App Router service; brand identity comes
from a private shared package; the only server surfaces are four Server Actions.

Reference docs live in `docs/architecture/`. **Read the one file that answers your
question — do not read them all.**

| Your question | File |
|---|---|
| Where do I put this? What does this directory do? What are the build/test/lint commands? Is this file generated? | `docs/architecture/structure.md` |
| Which way do dependencies flow? How does this page render? How does the trial / contact / pricing flow work end to end? Where does state live? What's cached? | `docs/architecture/architecture.md` |
| What does this repo consume or expose? What's in `@avrentishq/core` and which subpaths are safe? Which env var do I need? What are the platform API endpoints? What are the CSP and security headers? | `docs/architecture/boundaries.md` |
| How do I name this? Tailwind classes or inline styles? `m` or `motion`? How do errors and logging work? How do I write a test? How do I add a product module? | `docs/architecture/conventions.md` |
| What will trip me up? Why is this written the weird way? Is this a bug or a deliberate tradeoff? | `docs/architecture/landmines.md` |
| What does this domain word actually mean here? Is it defined in code or only in copy? | `docs/architecture/glossary.md` |
| Should this work get a plan file, and where? | `docs/architecture/planning.md` |

## Before you write code

Three rules that silence-fail if you get them wrong, all detailed in `conventions.md`:

- Import `{ m }` from framer-motion, never `motion` — `LazyMotion strict` throws on `motion.*`.
- Import only from `@avrentishq/core/brand`. Every other subpath needs peer deps this repo
  does not install.
- Name tests `*.test.ts`. A `*.test.tsx` file is silently never executed.

Also: this codebase styles with inline `style={{}}` objects, not Tailwind classes, and
`src/data/pricing-fallback.json` is generated — never hand-edit it.

## Keeping this current

The reference docs are refreshed from a git range rather than re-explored — see the
`repo-map-refresh` skill. If you find a claim in `docs/architecture/` that no longer
matches the code, fix that file in the same branch as the code change.
