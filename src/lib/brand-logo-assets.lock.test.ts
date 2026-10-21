import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { MARK_VARIANTS, markVariantSvgString, type MarkVariant } from "@/lib/brand";

/**
 * The logo files in public/logos are the product app's generator output, copied
 * here (the generator needs font and raster tooling this console does not
 * carry). After a core release changes the mark, a stale copy would keep the old
 * logo; every mark file must equal what core draws today. Re-copy from the app
 * (`pnpm generate:logos` there) when this fails.
 */
const LOGOS = join(process.cwd(), "public", "logos");
const MARK_FILE = /^mark-(.+)-(\d+)\.svg$/;

describe("public/logos marks are core's current mark", () => {
  const marks = readdirSync(LOGOS).filter((file) => MARK_FILE.test(file));

  it("finds the mark files", () => {
    expect(marks.length).toBeGreaterThanOrEqual(Object.keys(MARK_VARIANTS).length);
  });

  it.each(marks)("%s matches core's drawing of the variant", (file) => {
    const [, variant, size] = MARK_FILE.exec(file)!;
    expect(variant! in MARK_VARIANTS, `${file} names no current variant`).toBe(true);
    expect(readFileSync(join(LOGOS, file), "utf8")).toBe(markVariantSvgString(variant as MarkVariant, Number(size)));
  });
});
