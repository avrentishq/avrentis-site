/**
 * Submit a form through its own handler instead of React 19's automatic form
 * action.
 *
 * Given `<form action={fn}>`, React resets the form once the action answers.
 * Inputs React does not hold in state are wiped, and a controlled checkbox
 * loses its tick on screen. After a failed send the visitor would retype what
 * they had already entered, and the consent box would look unticked though the
 * agreement still holds. This handler cancels the native submit and dispatches
 * the action in a transition. React's form-action listener then sees the
 * cancelled event and does not run its reset.
 *
 * Keep the form's `action` prop next to `onSubmit`. Without JavaScript the
 * browser posts to it as before, so any no-JS path a form already has stays.
 * Pending state comes from the form's own state (`useActionState`'s third
 * value), passed down as a prop, not from `useFormStatus`.
 * `form-submit.lock.test.ts` holds every form to this.
 */

import { startTransition, type FormEvent } from "react";

export function submitWithoutReset(dispatch: (formData: FormData) => void) {
  return (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const formData = new FormData(event.currentTarget, submitter);
    startTransition(() => dispatch(formData));
  };
}
