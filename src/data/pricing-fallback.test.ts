/**
 * The committed pricing fallback must not rot unnoticed.
 *
 * WHAT THE FALLBACK IS, precisely — because it is easy to overstate. The site
 * fetches pricing from the live API on every render path (`fetchPricingData`,
 * ISR at one hour). Visitors see the API's answer whenever the API answers. This
 * file is the COLD-START FLOOR: it renders only when the cache holds nothing
 * good AND the API is unreachable or returns an invalid shape. So a stale
 * fallback is not "the site shows wrong prices" — it is "the site shows wrong
 * prices DURING AN OUTAGE, on a cold cache".
 *
 * That window is narrow and it is also the worst possible moment to be wrong,
 * and the refresh has a gap that makes it likelier than it looks:
 * `sync-pricing-fallback.mjs` runs on prebuild and FAILS SAFE, keeping the
 * committed file when the API is down. Which is correct — a build during an
 * outage must not wipe the floor — but it means the file is refreshed only when
 * the API is up, and consulted only when the API is down. A long outage spanning
 * a deploy therefore serves whatever was last committed, however old.
 *
 * It went eight core releases stale before an unrelated dependency bump happened
 * to regenerate it, at which point Business had been recorded as NOT including
 * two features that had gone GA. Nothing flagged it: the file only changes when
 * someone builds, and nothing compares it to anything.
 *
 * SO THIS TEST SKIPS RATHER THAN FAILS WHEN THE API IS UNREACHABLE. A drift
 * check that goes red during an outage teaches people to ignore it, and it would
 * be red for a reason that has nothing to do with the change under review. It
 * reports drift only when it can prove drift.
 */

import { describe, expect, it } from "vitest";

import fallback from "./pricing-fallback.json";

const PRICING_API = "https://app.avrentis.com/api/v1/public/pricing";

/** Feature membership per plan — the part a stale file gets wrong. */
function featureMatrix(data: {
  plans: { key?: string; features?: Record<string, boolean> }[];
}): Record<string, Record<string, boolean>> {
  const matrix: Record<string, Record<string, boolean>> = {};
  for (const plan of data.plans ?? []) {
    if (plan.key) matrix[plan.key] = plan.features ?? {};
  }
  return matrix;
}

/**
 * Published module copy — the `name` and `description` a buyer actually reads
 * on the pricing page and the module cards.
 *
 * Checked separately from the feature matrix because it drifts separately, and
 * because it is the half with reputational consequences: a boolean that is
 * wrong understates or oversells a tier, but a stale DESCRIPTION can keep
 * advertising a capability the company has already retracted. That happened —
 * this file carried "…; ERP integrations" and "separation-of-duties breaches
 * surfaced as review flags" for a full release after both claims were removed
 * at source, and the matrix check above was green throughout, because it never
 * looks at a string.
 */
function moduleCopy(data: {
  modules?: Record<string, { name?: string; description?: string }>;
}): Record<string, { name: string; description: string }> {
  const copy: Record<string, { name: string; description: string }> = {};
  for (const [key, entry] of Object.entries(data.modules ?? {})) {
    copy[key] = { name: entry.name ?? "", description: entry.description ?? "" };
  }
  return copy;
}

async function livePricing(): Promise<{
  plans: { key?: string; features?: Record<string, boolean>; modules?: { key?: string; name?: string; description?: string }[] }[];
  modules?: Record<string, { name?: string; description?: string }>;
} | null> {
  try {
    const res = await fetch(PRICING_API, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data?.plans) && data.plans.length > 0 ? data : null;
  } catch {
    return null;
  }
}

describe("pricing fallback", () => {
  it("has the shape the renderer requires", () => {
    // Runs offline. `fetchPricingData` validates this same shape before using a
    // response, so a fallback that failed it would leave the cold-start path
    // with nothing at all to render.
    expect(Array.isArray(fallback.plans)).toBe(true);
    expect(fallback.plans.length).toBeGreaterThan(0);
    expect(Array.isArray(fallback.planOrder)).toBe(true);
    expect(fallback.planOrder.length).toBeGreaterThan(0);
    for (const plan of fallback.plans) {
      expect(Array.isArray(plan.pricing)).toBe(true);
    }
  });

  it("names every plan the order references", () => {
    // A planOrder entry with no matching plan renders a gap in the comparison
    // table — offline-checkable, and the kind of thing a partial hand-edit does.
    const keys = new Set(fallback.plans.map((plan) => plan.key));
    for (const key of fallback.planOrder) {
      expect(keys.has(key), `planOrder names "${key}" but no plan has that key`).toBe(true);
    }
  });

  it("says the same thing about a module everywhere it appears", () => {
    // Offline. Every module's copy is published TWICE — once in the canonical
    // `modules` map and again inside each plan that includes it. A partial
    // refresh (or a hand-edit, which this file forbids) leaves the two
    // disagreeing, and whichever one a given surface happens to read decides
    // what the buyer is told.
    const canonical = moduleCopy(fallback);
    const mismatches: string[] = [];

    for (const plan of fallback.plans) {
      for (const listed of (plan as { modules?: { key: string; name?: string; description?: string }[] })
        .modules ?? []) {
        const source = canonical[listed.key];
        if (!source) {
          mismatches.push(`plan "${plan.key}" lists module "${listed.key}", absent from the modules map`);
          continue;
        }
        if (listed.description !== undefined && listed.description !== source.description) {
          mismatches.push(`${plan.key}/${listed.key}: description differs from the modules map`);
        }
        if (listed.name !== undefined && listed.name !== source.name) {
          mismatches.push(`${plan.key}/${listed.key}: name differs from the modules map`);
        }
      }
    }

    expect(mismatches, `the fallback contradicts itself:\n${mismatches.join("\n")}`).toEqual([]);
  });

  it("matches the live API's module copy, when the API can be reached", async () => {
    const live = await livePricing();
    if (!live) {
      console.warn(
        "[pricing-fallback] live API unreachable — module copy not checked this run. " +
          "Run `node scripts/sync-pricing-fallback.mjs` locally to refresh.",
      );
      return;
    }

    const liveCopy = moduleCopy(live);
    const committedCopy = moduleCopy(fallback);

    // Guard on the guard: if the projection ever returned nothing — a renamed
    // payload key, say — every comparison below would pass over an empty set
    // and this check would be decorative.
    expect(
      Object.keys(liveCopy).length,
      "live API returned no module copy — the projection is reading the wrong key",
    ).toBeGreaterThan(0);

    const drift: string[] = [];
    for (const [key, live_] of Object.entries(liveCopy)) {
      const committed = committedCopy[key];
      if (!committed) {
        drift.push(`module "${key}" is live but missing from the fallback`);
        continue;
      }
      if (committed.description !== live_.description) {
        drift.push(
          `${key}.description has drifted:\n    fallback: ${committed.description}\n    live:     ${live_.description}`,
        );
      }
      if (committed.name !== live_.name) {
        drift.push(`${key}.name: fallback says "${committed.name}", live says "${live_.name}"`);
      }
    }
    for (const key of Object.keys(committedCopy)) {
      if (!(key in liveCopy)) drift.push(`module "${key}" is in the fallback but no longer live`);
    }

    expect(
      drift,
      "published module copy has drifted — run `node scripts/sync-pricing-fallback.mjs` and commit " +
        "the result. A stale description keeps advertising what the product no longer claims.",
    ).toEqual([]);
  }, 15_000);

  it("matches the live API's feature matrix, when the API can be reached", async () => {
    const live = await livePricing();
    if (!live) {
      // Unreachable. Say so rather than passing quietly — a silent skip is
      // indistinguishable from a check that ran.
      console.warn(
        "[pricing-fallback] live API unreachable — drift not checked this run. " +
          "Run `node scripts/sync-pricing-fallback.mjs` locally to refresh.",
      );
      return;
    }

    const liveMatrix = featureMatrix(live);
    const committedMatrix = featureMatrix(fallback);

    const drift: string[] = [];
    for (const [planKey, liveFeatures] of Object.entries(liveMatrix)) {
      const committed = committedMatrix[planKey];
      if (!committed) {
        drift.push(`plan "${planKey}" is live but missing from the fallback`);
        continue;
      }
      for (const [feature, enabled] of Object.entries(liveFeatures)) {
        if (committed[feature] !== enabled) {
          drift.push(
            `${planKey}.${feature}: fallback says ${String(committed[feature])}, live says ${String(enabled)}`,
          );
        }
      }
      for (const feature of Object.keys(committed)) {
        if (!(feature in liveFeatures)) {
          drift.push(`${planKey}.${feature} is in the fallback but no longer live`);
        }
      }
    }

    expect(
      drift,
      "pricing fallback has drifted — run `node scripts/sync-pricing-fallback.mjs` and commit the result",
    ).toEqual([]);
  }, 15_000);
});
