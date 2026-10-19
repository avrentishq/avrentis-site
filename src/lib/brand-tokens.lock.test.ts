import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { brandTokensCss } from "@edidi-hq/core/brand";

/**
 * `src/app/brand-tokens.generated.css` is core's palette, exactly — written by
 * this test as a file snapshot (`pnpm generate:brand-tokens` runs it with -u),
 * so the site needs no script runner of its own. After a core bump that
 * changes the palette this fails until it is regenerated, rather than shipping
 * the old colours.
 */
describe("brand-tokens.generated.css", () => {
  it("equals core's brandTokensCss() — run `pnpm generate:brand-tokens`", async () => {
    await expect(brandTokensCss()).toMatchFileSnapshot("../app/brand-tokens.generated.css");
  });

  it("is imported by globals.css before the design tokens that read it", () => {
    const globals = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");
    const importAt = globals.indexOf('@import "./brand-tokens.generated.css";');
    expect(importAt).toBeGreaterThanOrEqual(0);
    expect(importAt).toBeLessThan(globals.indexOf("@theme"));
  });
});
