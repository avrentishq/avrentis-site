# Brand logo assets

Generated, portable brand assets for use **inside the product and on external services**
(social/OG cards, email, Slack, app stores, partner sites).

Every file here is generated from the brand SSOT, **`@edidi-hq/core/brand`**: the Gate-N
drawings (full mark from 48px, ringless small mark below, the app-icon tile), the variant
colours, the wordmark spec and the **Marcellus** display font. Do not hand-edit them.

They are produced by the shared generator in the product app
(`public/logos/generate-logos.ts`, run with `pnpm generate:logos`; it needs
`opentype.js` and `@resvg/resvg-js`, which only the app carries) and copied unchanged to
the console and the site. The generator clears the old files first, so a renamed variant
leaves nothing stale. Each repo's `brand-logo-assets` lock test fails if a mark file stops
matching what core draws.

## Families

| Family       | Files                                               | Contents             |
| ------------ | --------------------------------------------------- | -------------------- |
| **Mark**     | `mark-{variant}-{48,64,128,256,512}.svg` + `.png`   | The Gate-N mark      |
| **Lockup**   | `lockup-{variant}-{48,64,128,256}.svg` + `.png`     | Mark + wordmark      |
| **Wordmark** | `wordmark-{variant}{,-lg}.svg` + `.png`             | The name alone       |

Variants are named for the surface they sit on:

- `on-light` — ink gate and ring, gold signature. Parchment or white backgrounds.
- `on-dark` — parchment gate and ring, gold signature. The ink shell.
- `mono-ink` / `mono-white` — one colour, for single-colour print, stamps and embossing.
- `app-icon` — the small mark on an ink tile (marks only; never a lockup).

The gold diagonal is the only gold part, and it never appears on its own.

## Safe to copy and re-upload externally

**Yes — all of them.** The wordmark is **outlined vector `<path>` data**, not live
`<text>`, so it needs no font installed and the view box is sized to the real glyph
advance, so no letter is ever clipped.

## Browser icons

The generator also writes the browser icons one level up in `public/` from the app
icon: `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`.
Copy the ones a repo serves.

## Brand colours

The canonical values are `BRAND_COLORS` / `BRAND_PALETTE` in `@edidi-hq/core/brand`.
Components use the theme tokens in `globals.css`, never literal values.
