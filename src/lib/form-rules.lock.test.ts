import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { stripComments } from "@/lib/test-support/strip-comments";

/**
 * The forms' shared rules live once, in `src/lib/form-rules.ts`: the decoy
 * field's name, the email pattern and every field length cap. A typed copy in
 * a form or an action is a second rule that drifts — the caps were typed about
 * thirteen times and mostly never reached the browser.
 *
 * Fails on, in `src/app` and `src/components` (tests excluded, comments
 * stripped first):
 *   - the decoy field's name in quotes,
 *   - the email pattern (`[^\s@]+@`),
 *   - a length cap: `.length > N` with N of two or more digits (a count check
 *     like `.length > 1` is not a cap), or `maxLength={N}`.
 */

const SRC = join(process.cwd(), "src");
const SCANNED_ROOTS = ["app", "components", "lib"];

const RULES: { name: string; pattern: RegExp }[] = [
  { name: "typed decoy field name", pattern: /["'`]fax_number["'`]/ },
  { name: "typed email pattern", pattern: /\[\^\\s@\]\+@/ },
  { name: "typed length cap", pattern: /\.length\s*>=?\s*\d{2,}\b/ },
  { name: "typed maxLength", pattern: /maxLength=\{?\s*["']?\d/ },
];

function violations(text: string): string[] {
  const code = stripComments(text);
  return RULES.filter(({ pattern }) => pattern.test(code)).map(({ name }) => name);
}

function sourceFiles(): string[] {
  return SCANNED_ROOTS.flatMap((root) =>
    readdirSync(join(SRC, root), { recursive: true, encoding: "utf8" })
      .filter((file) => /\.tsx?$/.test(file) && !/\.test\.ts$/.test(file))
      .map((file) => join(root, file))
      .filter((file) => file !== join("lib", "form-rules.ts")),
  );
}

describe("form rules are typed once (form-rules.ts)", () => {
  it("the detector fires on each typed copy and ignores comments and the shared names", () => {
    expect(violations(`formData.get("fax_number")`)).toEqual(["typed decoy field name"]);
    expect(violations(`const EMAIL = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;`)).toEqual(["typed email pattern"]);
    expect(violations(`if (name.length > 200) refuse();`)).toEqual(["typed length cap"]);
    expect(violations(`if (token.length >= 512) refuse();`)).toEqual(["typed length cap"]);
    expect(violations(`<input maxLength={120} />`)).toEqual(["typed maxLength"]);
    expect(violations(`<input maxLength="120" />`)).toEqual(["typed maxLength"]);

    expect(violations(`// was formData.get("fax_number") and name.length > 200`)).toEqual([]);
    expect(violations(`/* maxLength={120} */`)).toEqual([]);
    expect(violations(`formData.get(HONEYPOT_FIELD); exceedsLimit(name, "name");`)).toEqual([]);
    expect(violations(`<input maxLength={FORM_LIMITS.name} />`)).toEqual([]);
    expect(violations(`items.length > 1 && value.trim().length > 0`)).toEqual([]);
    expect(violations(`const url = "https://example.test/x"; name.length > 200`)).toEqual(["typed length cap"]);
  });

  it("scans the forms (proves the walk sees known files)", () => {
    const files = sourceFiles();
    expect(files).toContain(join("app", "trial", "trial-form.tsx"));
    expect(files).toContain(join("components", "contact", "contact-form.tsx"));
    expect(files).toContain(join("app", "contact", "actions.ts"));
  });

  it("no form or action types a rule form-rules.ts owns", () => {
    const offenders = sourceFiles().flatMap((file) =>
      violations(readFileSync(join(SRC, file), "utf8")).map((rule) => `src/${file}: ${rule}`),
    );
    expect(offenders, "Use FORM_LIMITS / HONEYPOT_FIELD / hasEmailShape from src/lib/form-rules.ts").toEqual([]);
  });
});
