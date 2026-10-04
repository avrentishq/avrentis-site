# Avrentis brand logo assets

Generated, portable brand assets for use **inside the app and on external services**
(favicon generators, social/OG cards, email, Slack, app stores, partner sites).

All files here are generated from the brand SSOT, **`@avrentishq/core/brand`** (the
gate-mark geometry, wordmark spec, variant colours, and the **Cabinet Grotesk Extrabold**
wordmark font). Do not hand-edit the SVG/PNG files.

They are produced by the shared logo generator (which lives in the product app, where the
`opentype.js` / `@resvg/resvg-js` build deps are present) and committed here — so the
marketing site carries no image-toolchain dependency. When the brand changes in core,
regenerate in the app and copy the assets across; the output is byte-identical everywhere
because both consume the same core geometry + font.

## Families

| Family       | Files                                             | Contents                       |
| ------------ | ------------------------------------------------- | ------------------------------ |
| **Mark**     | `mark-{variant}-{48,64,128,256,512}.svg` + `.png` | Gate Mark only (pure geometry) |
| **Wordmark** | `wordmark-{gold,navy,white}{,-lg}.svg` + `.png`   | "AVRENTIS" logotype only       |
| **Lockup**   | `lockup-{variant}-{48,64,128,256}.svg` + `.png`   | Mark + wordmark                |

Variants: `primary` (navy container), `reversed` (gold container), `transparent-gold`,
`transparent-navy`. Pick by background:

- On **light** backgrounds → `*-navy` or `transparent-navy`, or `primary` lockup.
- On **dark** backgrounds → `*-white` / `transparent-gold`, or `reversed` lockup.

## Safe to copy & re-upload externally

**Yes — all of them.** The wordmark is rendered as **outlined vector `<path>` data**, not
live `<text>`, so:

- there is **no font dependency** — the asset renders identically anywhere, even on a
  service that does not have Cabinet Grotesk installed; and
- the viewBox is sized to the real glyph advance, so **no character is ever clipped**.

> Historical note: an earlier generator sized the wordmark box with a `fontSize * 5.2`
> approximation that was ~12px too narrow, which clipped the trailing **S** so the
> rasterized logo read "AVRENTI". That is fixed; the spelling in source was always
> correct. A lock test in the product app (`src/lib/brand-logo-assets.lock.test.ts`, which
> runs against the app's copy of these files) re-derives the on-canvas glyph extent from each
> committed SVG and fails if any future change reintroduces clipping. This repo has no such
> test, so copy the regenerated files across unchanged.

## Browser icons

The browser icons live one level up in `public/` (`favicon.svg`, `favicon.ico`,
`apple-touch-icon.png`); `src/app/layout.tsx` references `favicon.ico` and
`apple-touch-icon.png` through its `metadata.icons`. There is no web manifest on this site.
They are the Gate Mark only (no wordmark) and are maintained separately from this folder.

## Brand colours

Gold `#C68B2F` · Navy `#0F172A`. The canonical values are `BRAND_COLORS` in
`@avrentishq/core/brand` (re-exported by `src/lib/brand.ts`). Components use the `@theme`
tokens in `src/app/globals.css`, never these literals.
