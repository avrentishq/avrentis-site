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

| Family       | Files                                           | Contents                       |
| ------------ | ----------------------------------------------- | ------------------------------ |
| **Mark**     | `mark-{variant}-{48,64,128,256,512}.svg`        | Gate Mark only (pure geometry) |
| **Wordmark** | `wordmark-{gold,navy,white}{,-lg}.svg` + `.png` | "AVRENTIS" logotype only       |
| **Lockup**   | `lockup-{variant}-{48,64,128,256}.svg` + `.png` | Mark + wordmark                |

Variants: `primary` (navy container), `reversed` (gold container), `transparent-gold`,
`transparent-navy`. Pick by background:

- On **light** backgrounds → `*-navy` or `transparent-navy`, or `primary` lockup.
- On **dark** backgrounds → `*-white` / `transparent-gold`, or `reversed` lockup.

## Safe to copy & re-upload externally

**Yes — all of them.** The wordmark is rendered as **outlined vector `<path>` data**, not
live `<text>`, so:

- there is **no font dependency** — the asset renders identically anywhere, even on a
  service that does not have Hanken Grotesk installed; and
- the viewBox is sized to the real glyph advance, so **no character is ever clipped**.

> Historical note: an earlier generator sized the wordmark box with a `fontSize * 5.2`
> approximation that was ~12px too narrow, which clipped the trailing **S** so the
> rasterized logo read "AVRENTI". That is fixed; the spelling in source was always
> correct. The `src/lib/brand-logo-assets.lock.test.ts` guard re-derives the on-canvas
> glyph extent from each committed SVG and fails if any future change reintroduces clipping.

## Browser / PWA icons

The favicon and PWA icons live one level up in `public/` (`favicon.svg`, `favicon.ico`,
`apple-touch-icon.png`, `icon-192.png`, `icon-512.png`) and are referenced from
`public/manifest.json`. They are the Gate Mark only (no wordmark) and are maintained
separately from this folder.

## Brand colours

Gold `#C68B2F` · Navy `#0F172A`. The canonical values live in `src/lib/brand.ts`
(`BRAND_COLORS`) and are drift-locked by `src/lib/drift-prevention.lock.test.ts`.
