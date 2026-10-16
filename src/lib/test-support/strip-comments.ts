import ts from "typescript";

/**
 * Source with every comment removed — the one comment stripper the lock tests
 * share, so a lock reads code and copy, never prose that explains a rule.
 *
 * Script comments come from TypeScript's own parser (the trivia around every
 * token), so a `//` inside a string ("https://…") or an apostrophe in JSX text
 * is never mistaken for a comment, and JSX comments (`{/* … *\/}`) go too. A
 * stylesheet has only block comments, removed directly. Test-only: no page
 * imports this (it pulls in the TypeScript compiler).
 */
export function stripComments(source: string, language: "script" | "stylesheet" = "script"): string {
  if (language === "stylesheet") return source.replace(/\/\*[\s\S]*?\*\//g, "");
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

/** The stripper for a file by its extension. */
export function stripCommentsFor(file: string, source: string): string {
  return stripComments(source, file.endsWith(".css") ? "stylesheet" : "script");
}
