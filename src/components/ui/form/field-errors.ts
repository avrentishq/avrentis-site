/**
 * Server field errors that step aside once the visitor edits the field.
 *
 * A server action answers a submission with per-field errors; they stay in the
 * action's state until the next submission. Without this, a visitor who fixes
 * a field keeps reading the old complaint (and a red border) beneath the value
 * they just corrected. Each form keeps its own server state; this module only
 * decides which of those errors are still worth showing.
 *
 * A dismissal belongs to one server answer: the next answer (a new object from
 * `useActionState`) starts with every error showing again.
 */

import { useState } from "react";

export type FieldErrors<Field extends string> = Partial<Record<Field, string>>;

export interface Dismissals<Field extends string> {
  /** The server answer these dismissals were made against. */
  readonly source: FieldErrors<Field> | undefined;
  readonly fields: readonly Field[];
}

export const NO_DISMISSALS: Dismissals<never> = { source: undefined, fields: [] };

/** The server errors still shown: all of them, minus fields edited since this answer. */
export function visibleFieldErrors<Field extends string>(
  serverErrors: FieldErrors<Field> | undefined,
  dismissals: Dismissals<Field>,
): FieldErrors<Field> {
  if (!serverErrors) return {};
  if (dismissals.source !== serverErrors) return serverErrors;
  const visible: FieldErrors<Field> = { ...serverErrors };
  for (const field of dismissals.fields) delete visible[field];
  return visible;
}

/** Record that `field` was edited; unchanged (same object) when there is nothing to dismiss. */
export function dismissFieldError<Field extends string>(
  serverErrors: FieldErrors<Field> | undefined,
  dismissals: Dismissals<Field>,
  field: Field,
): Dismissals<Field> {
  const current = dismissals.source === serverErrors ? dismissals.fields : [];
  if (!serverErrors?.[field] || current.includes(field)) return dismissals;
  return { source: serverErrors, fields: [...current, field] };
}

/** The server errors worth showing, and `clear(field)` to call from that field's change handler. */
export function useServerFieldErrors<Field extends string>(
  serverErrors: FieldErrors<Field> | undefined,
): { errors: FieldErrors<Field>; clear: (field: Field) => void } {
  const [dismissals, setDismissals] = useState<Dismissals<Field>>(NO_DISMISSALS);
  return {
    errors: visibleFieldErrors(serverErrors, dismissals),
    clear: (field) => setDismissals((current) => dismissFieldError(serverErrors, current, field)),
  };
}
