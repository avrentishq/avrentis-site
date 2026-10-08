import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Every form submits through `submitWithoutReset` (submit.ts), never through
 * React 19's automatic form action alone, which resets the form after each
 * answer: typed values wiped and the consent tick lost on screen after a failed
 * send. Pending state comes from the form's own `useActionState`, so
 * `useFormStatus` is not used anywhere.
 */

const SRC = join(process.cwd(), "src");
const SELF = join("components", "ui", "form", "form-submit.lock.test.ts");

// A JSX form opening carries attributes; "<form>" in prose comments does not match.
const FORM_OPEN = /<(?:m\.)?form\s/g;
const HANDLED = /onSubmit=\{submitWithoutReset\(/g;

function sourceFiles(): string[] {
  return readdirSync(SRC, { recursive: true, encoding: "utf8" })
    .filter((file) => /\.tsx$/.test(file))
    .filter((file) => file !== SELF);
}

/** Forms in `text` that do not submit through the handler (0 when every form does). */
function unhandledForms(text: string): number {
  const forms = text.match(FORM_OPEN)?.length ?? 0;
  const handled = text.match(HANDLED)?.length ?? 0;
  return Math.max(0, forms - handled);
}

describe("forms submit without React's automatic reset", () => {
  it("the detector flags a bare action form and passes a handled one", () => {
    expect(unhandledForms("<form action={action}>")).toBe(1);
    expect(unhandledForms("<m.form\n  action={action}\n>")).toBe(1);
    expect(unhandledForms("<form action={action} onSubmit={submitWithoutReset(action)}>")).toBe(0);
    expect(unhandledForms("<formatted />")).toBe(0);
    expect(unhandledForms("// posts with the surrounding <form>/server action")).toBe(0);
  });

  it("scans the site (proves the walk sees a known form)", () => {
    const trial = join("app", "trial", "trial-form.tsx");
    expect(sourceFiles()).toContain(trial);
    expect(readFileSync(join(SRC, trial), "utf8")).toMatch(FORM_OPEN);
  });

  it("every form submits through submitWithoutReset", () => {
    const offenders = sourceFiles().filter(
      (file) => unhandledForms(readFileSync(join(SRC, file), "utf8")) > 0,
    );
    expect(offenders, "Submit with onSubmit={submitWithoutReset(action)} (src/components/ui/form/submit.ts)").toEqual([]);
  });

  it("no component reads pending state from useFormStatus", () => {
    const readers = sourceFiles().filter((file) =>
      /\buseFormStatus\s*\(/.test(readFileSync(join(SRC, file), "utf8")),
    );
    expect(readers, "Pass useActionState's pending value down instead").toEqual([]);
  });
});
