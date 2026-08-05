# Glossary

Domain terms as they are actually used in this code. Split into terms with a canonical
definition **in code** and terms that exist only in **copy** — the difference matters,
because only the first kind can be grepped or type-checked.

## Defined in code

**module** — `ModuleKey` in `src/lib/brand.ts`: `pay | procure | vault | audit | guard |
grants | people | connect`. The keys and slugs are internal identifiers; only the `name`
field is ever rendered. The catalog (`MODULES`, `MODULE_ORDER`) is **site-specific** and
lives here, not in the shared package.

**module brand names** — the customer-facing name per key (`src/lib/brand.ts`, accessor
`moduleName`). Note these do not match the keys, which is the most common source of
confusion in this repo:

| Key | Name |
|---|---|
| `pay` | Avrentis Payables |
| `procure` | Avrentis Procurement |
| `vault` | Avrentis Records |
| `audit` | Avrentis Compliance |
| `guard` | Avrentis Guard |
| `grants` | Avrentis Grants |
| `people` | **Avrentis Requests** |
| `connect` | Avrentis Integrations |

**classification** — `ModuleClassification` in `src/lib/brand.ts`: `core` (on every tier),
`substrate` (always-on foundation), `expansion` (plan-gated).

**publicly visible / `publicModuleKeys()` / `isModulePublic()` / `PUBLIC_MODULE_COUNT`** —
`src/lib/brand.ts`. Whether the *marketing site* advertises a module. `people` (Requests)
is the single hidden one, so the public count is 7. Used to filter API-driven badges down
to what the site actually markets.

**launch gate** — `HIDDEN_AT_LAUNCH` plus `isLaunchHidden` / `isLaunchVisible` in
`src/lib/launch.ts`. The set of routes that exist in code but must 404 until launch:
`/customers`, `/careers`, `/changelog`, `/docs`, `/trust`, each with a stated reason in the
file. Enforced three ways — `notFound()` in the page, link filtering in
`src/components/layout/footer.tsx` and `src/components/layout/mobile-menu.tsx`, and
exclusion from `src/app/sitemap.ts`. `src/lib/launch.test.ts` derives its cases from the
constant so the gate can never drift from its test.

**org size** — `ORG_SIZES` in `src/lib/org-size.ts`: `1–20 | 21–50 | 51–200 | 200+`
(**en-dashes**, not hyphens — string comparisons fail if you type a hyphen).
`DEFAULT_ORG_SIZE` is `21–50`, badged "Most common". Mirrors the platform's trial
allow-list, so it is validated server-side in `src/app/trial/actions.ts`. The contact form
prepends a "Prefer not to say" option; the trial form does not.

**section backdrop / texture / scrim** — `SECTION_BACKDROPS` in
`src/lib/section-backdrops.ts`: a registry of ~60 named section slots mapped onto five
recycled background textures (navy, gold, light, structure, flow, plus `feather`). `scrim`
(`"dark" | "light" | "hero"`) is deliberately **not** in the registry — it stays at each
call site as a per-section legibility choice. `SectionBackdrop`
(`src/components/ui/section-backdrop.tsx`) consumes both.

**plan / tier** — `starter | business | enterprise`. **Not defined in this repo.** They
arrive from the pricing API as `plans[].key` plus `planOrder`, and are only visible locally
in `src/data/pricing-fallback.json`. Do not hardcode them; read them from `PricingData`.

**feature group** — `FeatureGroup` in `src/lib/pricing.ts`. A section of the plan
comparison table, derived server-side by the platform from its module→feature ownership
source of truth. `label` is either a module short name or the "Workflow & platform"
catch-all.

**platform module / substrate** — `platformModules` in `PricingData`
(`src/lib/pricing.ts`). Always-on modules advertised once as "included on every plan"
rather than as a per-plan badge. Today the fallback contains one: `authority`.

**archetype add-on / `availableToSectors`** — `src/lib/pricing.ts`. A module included in
the plan but usable only by certain sectors — Grants is only meaningful to grant-funded
organisations — so its plan-card badge must be **qualified** rather than shown as plain
availability.

**module status** — `ModuleStatus` in `src/components/product/module-layout.tsx`:
`available | coming_soon | partial | roadmap`. Drives the status ribbon and which CTA pair
the module page renders.

**mark variant / wordmark spec / gate mark** — the logo primitives, defined in the
**external** package and consumed via `src/components/ui/logo.tsx`. `MarkVariant` is
`primary | reversed | transparent-gold | transparent-navy`; the "gate mark" is the
beam/post/slot/ledger geometry returned by `getProps(size)`. Shapes are tabulated in
`boundaries.md` so you never need to open the package.

**white-label tenant** — external (`@avrentishq/core/brand`), re-exported through
`src/lib/brand.ts` but **entirely unused on this site**. It exists for the platform app.

## Copy only — no code definition

These are real product concepts a session will meet in page text, but they have no
identifier, type, or data structure anywhere. Do not go looking for an implementation.

**Verification Network** — the cross-company proof concept. Appears only as legal and
marketing prose: `src/app/privacy/page.tsx` (a `verification-network` section covering
opt-out) and `src/app/terms/page.tsx` (de-identification, opt-out, prohibited uses).

**Aggregated Insights** — prose in `src/app/terms/page.tsx` only.

**"Nothing moves without authority"** / **"Delegation-of-Authority Platform"** — the
tagline and positioning line. Copy, but sourced from `BRAND.tagline` and
`BRAND.positioningStatement`, so they are single-sourced from the shared package and used
in `src/lib/seo.tsx`. Do not retype them as string literals.

**Requests** — the marketing name for the `people` module. Described only in a comment in
`src/lib/brand.ts`; the route `/product/people` renders but is deliberately kept out of the
sitemap.
