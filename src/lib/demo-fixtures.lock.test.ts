import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join, sep } from "node:path";
import ts from "typescript";

/**
 * The demo organisation's figures and the lead currency are stated once.
 *
 * The featured voucher told different stories on different pages, a webhook
 * sample carried an amount that matched no mockup, and every figure was a typed
 * "₦…" string — so a total could disagree with its lines and nothing noticed.
 * Amounts now live as numbers in `src/components/product/demo-fixtures.ts` and
 * print through `formatCurrencyAmount` in the lead currency from
 * `src/lib/market.ts`. This test fails on a typed currency symbol, a typed lead
 * currency code, or a typed featured-voucher reference anywhere else in `src/`.
 *
 * Exempt: the fixtures, `market.ts` (it names the lead market), `money.ts` (the
 * formatter), tests, and the changelog — an entry records what was true on its
 * date. Comments are stripped first: a comment may describe a figure.
 */

const SRC = join(process.cwd(), "src");

const ALLOWED_FILES = new Set([
  join("components", "product", "demo-fixtures.ts"),
  join("lib", "market.ts"),
  join("lib", "money.ts"),
]);

const EXEMPT_DIRECTORIES = [join("components", "changelog") + sep, join("app", "changelog") + sep];

const FORBIDDEN: readonly { name: string; pattern: RegExp; fix: string }[] = [
  { name: "typed naira sign", pattern: /₦/, fix: "format a number with formatCurrencyAmount(amount, LEAD_CURRENCY)" },
  { name: "typed lead currency code", pattern: /\bNGN\b/, fix: "use LEAD_CURRENCY from @/lib/market" },
  { name: "typed featured voucher reference", pattern: /PV-2026-0184/, fix: "use FEATURED_VOUCHER.reference from demo-fixtures" },
];

/**
 * The source with every comment removed. Comment ranges come from TypeScript's
 * own parser (the trivia around every token), so a `//` inside a string
 * ("https://…") or an apostrophe in JSX text is never mistaken for a comment or
 * a string; JSX comments (`{/* … *\/}`) are trivia inside braces and go too.
 */
function stripComments(source: string): string {
  const sourceFile = ts.createSourceFile("scanned.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const ranges = new Map<number, number>();
  const collect = (commentRanges: ts.CommentRange[] | undefined) => {
    for (const range of commentRanges ?? []) ranges.set(range.pos, range.end);
  };
  const visit = (node: ts.Node) => {
    // JSX text is not trivia: "// like this" inside an element is visible copy.
    if (node.kind !== ts.SyntaxKind.JsxText) {
      collect(ts.getLeadingCommentRanges(source, node.pos));
      collect(ts.getTrailingCommentRanges(source, node.end));
    }
    for (const child of node.getChildren(sourceFile)) visit(child);
  };
  visit(sourceFile);
  let output = "";
  let cursor = 0;
  for (const [start, end] of [...ranges].sort(([first], [second]) => first - second)) {
    if (start < cursor) continue;
    output += source.slice(cursor, start);
    cursor = end;
  }
  return output + source.slice(cursor);
}

function violations(source: string): string[] {
  const code = stripComments(source);
  return FORBIDDEN.filter((rule) => rule.pattern.test(code)).map((rule) => `${rule.name} — ${rule.fix}`);
}

function scannedFiles(): string[] {
  return readdirSync(SRC, { recursive: true, encoding: "utf8" })
    .filter((file) => /\.tsx?$/.test(file))
    .filter((file) => !file.endsWith(".test.ts"))
    .filter((file) => !ALLOWED_FILES.has(file))
    .filter((file) => !EXEMPT_DIRECTORIES.some((directory) => file.startsWith(directory)));
}

describe("demo figures and the lead currency are stated once", () => {
  it("the detector catches the typed values it exists to stop", () => {
    // A scan that matches nothing proves nothing; these are the old lines.
    for (const old of [
      'amount: "₦850,000",',
      '"currency": "NGN",',
      '<MockupShell url="Avrentis / vouchers / PV-2026-0184">',
      "<span>Amount (NGN)</span>",
    ]) {
      expect(violations(old), old).not.toEqual([]);
    }
  });

  it("ignores comments but not strings that look like them", () => {
    expect(violations("// a typed ₦850,000 in a comment is fine\nconst a = 1;")).toEqual([]);
    expect(violations("/* NGN */ const b = 2;")).toEqual([]);
    expect(violations("const element = <p>{/* PV-2026-0184 */}don't</p>;")).toEqual([]);
    expect(violations('const url = "https://example.test"; const c = "₦1";')).not.toEqual([]);
  });

  it("scans the site's source (proves the walk sees a known file and skips the allowed ones)", () => {
    const files = scannedFiles();
    expect(files).toContain(join("components", "sections", "hero.tsx"));
    expect(files).not.toContain(join("components", "product", "demo-fixtures.ts"));
    expect(files.some((file) => file.startsWith(join("components", "changelog")))).toBe(false);
  });

  it("no file outside the fixtures types a demo figure, the lead currency or the featured reference", () => {
    const offenders = scannedFiles().flatMap((file) =>
      violations(readFileSync(join(SRC, file), "utf8")).map((violation) => `src/${file}: ${violation}`),
    );
    expect(offenders, offenders.join("\n")).toEqual([]);
  });
});
