/**
 * After a failed send, put focus where the visitor has to act: the first field
 * marked invalid (in page order), or the form's alert when the failure is not
 * about any one field. A keyboard or screen-reader user lands on the problem
 * instead of on a submit button that has nothing left to say.
 *
 * Fields mark themselves with aria-invalid="true" (the accessibility contract
 * the forms already keep), so this needs no list of field names.
 */

import { useEffect, type RefObject } from "react";

const FOCUSABLE = 'input:not([type="hidden"]), textarea, select, button, [tabindex]:not([tabindex="-1"])';

/** The DOM surface the choice needs: real elements satisfy it, and so can a test double. */
export interface FocusCandidate {
  matches(selector: string): boolean;
  querySelector(selector: string): FocusCandidate | null;
}

/** Where focus goes after a failed answer: the first invalid field, else the alert, else nowhere. */
export function failureFocusTarget(
  form: Pick<FocusCandidate, "querySelector">,
  alert: FocusCandidate | null,
): FocusCandidate | null {
  const invalid = form.querySelector('[aria-invalid="true"]');
  if (!invalid) return alert;
  if (invalid.matches(FOCUSABLE)) return invalid;
  // A radio group carries aria-invalid on its container; focus the radio in the tab order.
  return invalid.querySelector('[tabindex="0"]') ?? invalid.querySelector(FOCUSABLE) ?? alert;
}

/** Runs once per server answer; moves focus only when that answer is a failure. */
export function useFocusAfterFailure(
  formRef: RefObject<HTMLFormElement | null>,
  answer: unknown,
  failed: boolean,
  alertId: string,
): void {
  useEffect(() => {
    const form = formRef.current;
    if (!failed || !form) return;
    const target = failureFocusTarget(form, document.getElementById(alertId));
    (target as HTMLElement | null)?.focus();
  }, [answer, failed, formRef, alertId]);
}
