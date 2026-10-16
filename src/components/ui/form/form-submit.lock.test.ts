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

function sourceFiles(): string[] {
  return readdirSync(SRC, { recursive: true, encoding: "utf8" })
    .filter((file) => /\.tsx$/.test(file))
    .filter((file) => file !== SELF);
}

/** Source without comments, so a comment naming the handler cannot vouch for a form. */
function withoutComments(text: string): string {
  return text.replace(/\{\/\*[\s\S]*?\*\/\}/g, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");
}

/** Each form's opening tag — up to the `>` that closes it, skipping braces and their contents. */
function formOpenings(text: string): string[] {
  const openings: string[] = [];
  for (const match of text.matchAll(FORM_OPEN)) {
    let depth = 0;
    let end = match.index!;
    for (; end < text.length; end++) {
      const character = text[end];
      if (character === "{") depth++;
      else if (character === "}") depth--;
      else if (character === ">" && depth === 0) break;
    }
    openings.push(text.slice(match.index!, end + 1));
  }
  return openings;
}

/**
 * Forms in `text` that do not submit through the handler — checked per form,
 * and the handler must wrap the same action the form posts to (a handler
 * around a different action submits the wrong thing).
 */
function unhandledForms(text: string): number {
  return formOpenings(withoutComments(text)).filter((opening) => {
    const action = opening.match(/\baction=\{([^}]+)\}/)?.[1]?.trim();
    const handled = opening.match(/\bonSubmit=\{submitWithoutReset\(([^)]+)\)\}/)?.[1]?.trim();
    return !handled || (action !== undefined && action !== handled);
  }).length;
}

describe("forms submit without React's automatic reset", () => {
  it("the detector flags a bare action form and passes a handled one", () => {
    expect(unhandledForms("<form action={action}>")).toBe(1);
    expect(unhandledForms("<m.form\n  action={action}\n>")).toBe(1);
    expect(unhandledForms("<form action={action} onSubmit={submitWithoutReset(action)}>")).toBe(0);
    expect(unhandledForms("<formatted />")).toBe(0);
    expect(unhandledForms("// posts with the surrounding <form>/server action")).toBe(0);
    // One handled form cannot vouch for another, nor can a comment, nor a handler around the wrong action.
    expect(unhandledForms("<form action={a} onSubmit={submitWithoutReset(a)}>\n<form action={b}>")).toBe(1);
    expect(unhandledForms("{/* onSubmit={submitWithoutReset(a)} */}<form action={a}>")).toBe(1);
    expect(unhandledForms("<form action={save} onSubmit={submitWithoutReset(other)}>")).toBe(1);
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
