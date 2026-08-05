---
name: repo-map-refresh
description: Update the avrentis-site architecture reference docs in docs/architecture/ from a git range instead of re-exploring the codebase. Use after merging work, before a handoff, when a reference doc has gone stale or contradicts the code, or when asked to refresh, update, or re-sync the repo map, architecture docs, boundaries, conventions, or glossary.
---

# Refresh the architecture reference

Updates `docs/architecture/` from a diff. **Do not re-explore the repo** — read what is
already written, find what changed, patch only the affected sections.

Takes a git range. If none was given, ask, or default to `main@{1}..main` for
"since I last pulled". Examples: `a7e404f..HEAD`, `origin/main..HEAD`, `v1.2.0..HEAD`.

## Steps

1. **Read the existing docs first** — every file in `docs/architecture/`. You are editing
   them, so you need their current claims and structure before looking at the diff.

2. **Get the change surface:**
   ```
   git diff --stat <range>
   git diff --name-only <range>
   ```
   If the range is empty or invalid, say so and stop — do not silently refresh nothing.

3. **Map changed paths to the files they affect.** Only these paths can invalidate a
   reference doc; ignore everything else:

   | Changed path | Re-check |
   |---|---|
   | `package.json` (scripts/deps), `vercel.json`, `.github/**` | `structure.md` commands + CI; `boundaries.md` if a dependency or the install command changed |
   | new/deleted/moved directory under `src/` | `structure.md` directory map |
   | `src/app/**` route added/removed, `layout.tsx`, `error.tsx`, `not-found.tsx` | `structure.md` entry points; `architecture.md` rendering |
   | `src/app/**/actions.ts`, `src/app/**/state.ts` | `architecture.md` server surfaces + the data flows; `conventions.md` error handling |
   | `src/lib/*.ts` added/removed, or a change to `pricing.ts`, `platform.ts`, `launch.ts`, `brand.ts` | `architecture.md` module table + data flow 3; `boundaries.md`; `glossary.md` |
   | `src/lib/email.ts`, `rate-limit.ts`, `turnstile.ts` | `boundaries.md` services table (esp. failure behaviour) |
   | any `process.env.*` added or removed anywhere | `boundaries.md` env var table — this one goes stale fastest |
   | `next.config.ts` | `boundaries.md` exposed surface (CSP/headers); `structure.md` if `transpilePackages` changed |
   | `scripts/**`, `src/data/**` | `structure.md` generated-vs-authored; `architecture.md` data flow 3 |
   | `src/components/ui/**`, `providers/**` | `conventions.md` reuse list + animation rules |
   | `src/app/globals.css` | `conventions.md` styling tokens |
   | `**/*.test.ts`, `vitest.config.ts` | `conventions.md` testing table |
   | `@avrentishq/core` pin in `package.json` | `boundaries.md` §1 — re-check the version, the exports map, and whether any new subpath is imported (`rg -n "@avrentishq/core" src/`) |

4. **Verify before you rewrite.** For each section you touch, confirm the new fact against
   the actual code — `rg` for the symbol, read the specific lines. Same standard as the
   original: cite a concrete `path` or `path:symbol`, and write `UNVERIFIED` rather than
   guessing. Prefer `path:symbol` over `path:line`; line numbers rot.

5. **Re-verify existing citations in the files you touched.** Any path cited in a section
   you edited must still exist. A moved or deleted file makes the citation a lie:
   ```
   rg -o '`src/[^`]+`' docs/architecture/<file>.md | tr -d '`' | sed 's/:.*//' | sort -u | while read -r p; do [ -e "$p" ] || echo "MISSING: $p"; done
   ```

6. **Respect the caps.** Each reference file is capped at 150 lines. If a section grows,
   compress or cut something stale — do not exceed the cap, and do not create a new file
   without saying why.

7. **Landmines are load-bearing.** `docs/architecture/landmines.md` and the documented
   security tradeoffs noted in `boundaries.md` exist so nobody "fixes" one by accident.
   Never move detail out of `guides/security-posture.md` into a tracked file — this repo
   is public.
   If the diff *resolved* a landmine, delete that entry. If it introduced one, add it.
   Never drop an entry just because it is inconvenient.

## Report

- The range used and `git diff --stat` summary.
- Per file: updated / unchanged, and which sections changed.
- Any claim that became stale but you could not verify — say so explicitly.
- Anything in the diff that looked like a new landmine or boundary you did not have enough
  context to document.
