/**
 * The comment stripper the lock tests share, so a lock reads code and copy,
 * never prose that explains a rule. It is core's (`brand/typed-brand`), the same
 * one the app and the console use, so every repo strips comments identically.
 * Test-only: it pulls in the TypeScript compiler.
 */
import { scannedLanguageFor, stripComments } from "@edidi-hq/core/brand/typed-brand";

export { stripComments };

/** The stripper for a file by its extension. */
export function stripCommentsFor(file: string, source: string): string {
  return stripComments(source, scannedLanguageFor(file));
}
