/**
 * What a visitor posted, handed back with a refusal so the form can start
 * from it.
 *
 * With JavaScript the page keeps its own field state, so this goes unused.
 * Without it, a server action's answer is a freshly rendered page, and every
 * field would come back empty after a refusal: the visitor would retype
 * everything to fix one box. These values go only to the visitor who sent
 * them, in that one response; never log or store them.
 */

export type SubmittedValues<Field extends string> = Partial<Record<Field, string>>;

/** Bounds what is echoed back; a real field is far shorter (the actions cap at 200–5,000). */
const ECHO_MAX_LENGTH = 5000;

/** The named fields' posted text (file uploads and empty fields left out). */
export function submittedValues<Field extends string>(
  formData: FormData,
  fields: readonly Field[],
): SubmittedValues<Field> {
  const values: SubmittedValues<Field> = {};
  for (const field of fields) {
    const value = formData.get(field);
    if (typeof value === "string" && value !== "") values[field] = value.slice(0, ECHO_MAX_LENGTH);
  }
  return values;
}
