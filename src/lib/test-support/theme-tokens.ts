import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The @theme block of globals.css, for the colour lock tests. Brand tokens
 * there read core's palette (`var(--brand-…)`, from brand-tokens.generated.css);
 * a test that needs the colour itself reads `THEME_BLOCK`, in which every such
 * reference is replaced by its value. `THEME_BLOCK_RAW` is the block as written,
 * for tests that cut it out of the stylesheet. Test-only: nothing ships it.
 */
const APP = join(process.cwd(), "src", "app");

export const GLOBALS_CSS = readFileSync(join(APP, "globals.css"), "utf8");
export const THEME_BLOCK_RAW = GLOBALS_CSS.match(/@theme[^{]*\{([\s\S]*?)\n\}/)?.[1] ?? "";

const BRAND_VALUES = new Map(
  [...readFileSync(join(APP, "brand-tokens.generated.css"), "utf8").matchAll(/(--brand-[a-z0-9-]+)\s*:\s*([^;]+);/g)].map(
    (match) => [match[1]!, match[2]!.trim()],
  ),
);

export const THEME_BLOCK = THEME_BLOCK_RAW.replace(/var\((--brand-[a-z0-9-]+)\)/g, (reference, name: string) => {
  const value = BRAND_VALUES.get(name);
  if (value === undefined) throw new Error(`${name} is not in brand-tokens.generated.css`);
  return value;
});
