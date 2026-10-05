/**
 * generate-pricing-fallback.mjs — write (or check) src/data/pricing-fallback.json.
 *
 * The fallback is the pricing page's cold-start floor, served only when the
 * pricing API is unreachable on an empty cache. It is GENERATED from core's plan
 * catalogue by `src/lib/pricing-fallback-build.ts`; this script only runs that
 * builder and writes its output. Never hand-edit the JSON.
 *
 *   node scripts/generate-pricing-fallback.mjs           write the file (prebuild / predev)
 *   node scripts/generate-pricing-fallback.mjs --check   exit 1 if the committed file is stale
 *
 * The builder is TypeScript importing core's TypeScript source, which plain Node
 * cannot load, so it goes through jiti (a devDependency; also what loads the
 * ESLint and Tailwind configs). No network: the output depends only on the
 * installed core and the site's own copy, so a build never varies with whether
 * the product API happens to be up.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createJiti } from "jiti";

const RELATIVE_OUT = "src/data/pricing-fallback.json";
const OUT = join(process.cwd(), RELATIVE_OUT);

const jiti = createJiti(import.meta.url);
const { serialisePricingFallback } = await jiti.import("../src/lib/pricing-fallback-build.ts");

const generated = serialisePricingFallback();
let committed = "";
try {
  committed = readFileSync(OUT, "utf8");
} catch {
  /* first write */
}

if (process.argv.includes("--check")) {
  if (generated !== committed) {
    console.error(
      `[pricing-fallback] ${RELATIVE_OUT} is stale — run \`node scripts/generate-pricing-fallback.mjs\` and commit it.`,
    );
    process.exit(1);
  }
  console.log(`[pricing-fallback] ${RELATIVE_OUT} is current.`);
} else if (generated === committed) {
  console.log(`[pricing-fallback] ${RELATIVE_OUT} already current.`);
} else {
  writeFileSync(OUT, generated);
  console.log(`[pricing-fallback] wrote ${RELATIVE_OUT} from core's plan catalogue.`);
}
