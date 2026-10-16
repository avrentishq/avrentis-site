/**
 * What may be logged about a caught error: its name and, when it carries one,
 * its code — never its message or the error itself. A provider's message can
 * echo the addresses or the text it was given, and logs are not the place for
 * a visitor's details.
 */
export function errorSummary(error: unknown): string {
  if (!(error instanceof Error)) return typeof error;
  const code = (error as { code?: unknown }).code;
  return typeof code === "string" || typeof code === "number" ? `${error.name} (${code})` : error.name;
}
