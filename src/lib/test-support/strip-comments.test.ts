import { describe, expect, it } from "vitest";

import { stripComments, stripCommentsFor } from "./strip-comments";

describe("stripComments", () => {
  it("removes line, block and JSX comments", () => {
    const stripped = stripComments('const a = 1; // note\n/* block */ <p>{/* jsx */}text</p>');
    expect(stripped).not.toMatch(/note|block|jsx/);
    expect(stripped).toContain("text");
  });

  it("keeps // inside strings and JSX text", () => {
    expect(stripComments('const url = "https://example.test";')).toContain("https://example.test");
    expect(stripComments("<p>a // b</p>")).toContain("a // b");
  });

  it("strips stylesheet comments by extension", () => {
    expect(stripCommentsFor("globals.css", "a { /* x */ color: red; }")).toBe("a {  color: red; }");
  });
});
