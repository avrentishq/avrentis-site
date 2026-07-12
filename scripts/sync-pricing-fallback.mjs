/**
 * sync-pricing-fallback.mjs — refresh the offline pricing fallback from the live API.
 *
 * The site fetches pricing from the app's public API at runtime (see
 * src/lib/pricing.ts) with Next's Data Cache serving the last-good response.
 * `src/data/pricing-fallback.json` is the COLD-START floor — used only when the
 * cache is empty (fresh deploy / eviction) AND the API is unreachable.
 *
 * A hand-maintained fallback drifts from the API (module names, plan membership,
 * pricing). This script eliminates that drift: on every build it overwrites the
 * fallback with the current live API response, so the committed file is always
 * "the last fetched data" as of the last build.
 *
 * Fail-safe: if the API is unreachable or returns an invalid shape at build time,
 * it KEEPS the existing committed file (never clobbers it) and exits 0 — a build
 * while the app is down must not wipe the fallback.
 *
 * Zero-dependency: Node built-ins only (global fetch, fs). Wired into
 * `prebuild` / `predev`. The runtime URL is the SSOT in src/lib/pricing.ts;
 * keep this in step with it.
 */
import { writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

const PRICING_API = "https://app.avrentis.com/api/v1/public/pricing";
const OUT = join(process.cwd(), "src/data/pricing-fallback.json");

function isValidPricing(data) {
  return (
    Array.isArray(data?.plans) &&
    data.plans.length > 0 &&
    Array.isArray(data?.planOrder) &&
    data.planOrder.length > 0 &&
    data.plans.every((p) => Array.isArray(p?.pricing))
  );
}

async function main() {
  let res;
  try {
    res = await fetch(PRICING_API, { signal: AbortSignal.timeout(15_000) });
  } catch (err) {
    console.warn(
      `[sync-pricing-fallback] API unreachable (${String(err)}); keeping committed fallback.`,
    );
    return;
  }
  if (!res.ok) {
    console.warn(`[sync-pricing-fallback] API ${res.status}; keeping committed fallback.`);
    return;
  }

  let data;
  try {
    data = await res.json();
  } catch {
    console.warn("[sync-pricing-fallback] API returned non-JSON; keeping committed fallback.");
    return;
  }
  if (!isValidPricing(data)) {
    console.warn("[sync-pricing-fallback] API shape invalid; keeping committed fallback.");
    return;
  }

  const next = JSON.stringify(data, null, 2) + "\n";
  let current = "";
  try {
    current = readFileSync(OUT, "utf8");
  } catch {
    /* first write */
  }
  if (next === current) {
    console.log("[sync-pricing-fallback] fallback already current; no change.");
    return;
  }
  writeFileSync(OUT, next);
  console.log("[sync-pricing-fallback] refreshed src/data/pricing-fallback.json from live API.");
}

void main();
