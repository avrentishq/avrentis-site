/// <reference types="next/image-types/global" />

// Type declarations for static image imports (`import hero from "…/x.jpg"`),
// which resolve to `StaticImageData` rather than a string.
//
// WHY THIS FILE IS TRACKED, when Next.js already emits the same reference into
// `next-env.d.ts`: that file is GENERATED and GITIGNORED. It exists in a working
// checkout because someone has run `next dev` or `next build` there, and it does
// not exist in a fresh clone or a fresh worktree until a build has run.
//
// So `pnpm type-check` passed locally for everyone and failed in every clean
// checkout — which is precisely where CI and the core release fan-out run it.
// The fan-out creates a worktree off origin/main, installs, and type-checks
// before pushing; this site's leg of it failed on EVERY release, always with
// these six errors, and always for a reason that had nothing to do with the
// release being verified. A gate that fails for an unrelated reason every time
// stops being read, which is worse than not having it.
//
// Referencing the types here makes type-check self-sufficient: it depends on
// source that is committed, not on a build artefact that may or may not be
// lying around. `next-env.d.ts` keeps regenerating and keeps its own copy of
// this reference — harmless, since a duplicate triple-slash reference is a
// no-op.
