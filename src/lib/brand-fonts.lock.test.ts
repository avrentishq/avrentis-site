import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { BRAND_FONTS, DISPLAY_FONT_FILES } from "@/lib/brand";

/**
 * Fonts are code, not data: `next/font` needs a literal import per family, so
 * the layout cannot read core's `BRAND_FONTS`. This pins the layout to it
 * instead — a font change in core fails here until the layout follows.
 */
const layout = readFileSync(join(process.cwd(), "src/app/layout.tsx"), "utf8");

/** `IBM Plex Mono` → `IBM_Plex_Mono`, the name next/font/google exports. */
const googleExport = (family: string) => family.replaceAll(" ", "_");

describe("the layout loads core's brand fonts", () => {
  it("imports the UI and money fonts from next/font/google by core's family names", () => {
    const imported = /import \{([^}]+)\} from "next\/font\/google";/.exec(layout)?.[1] ?? "";
    for (const family of [BRAND_FONTS.ui, BRAND_FONTS.mono]) {
      expect(imported, family).toContain(googleExport(family));
    }
  });

  it("loads the display font from the file core ships", () => {
    expect(BRAND_FONTS.display).toBe("Marcellus");
    expect(layout).toContain(DISPLAY_FONT_FILES.ttf.split("/").pop()!);
  });
});
