"use client";

/**
 * The form-level message a server action returns, announced to screen readers.
 *
 * `role="alert"` is read out when the node appears, not when its text stays the
 * same, so a second submission that fails the same way would be silent. The
 * alert therefore leaves the page while the form is sending (`pending`, from
 * the form's own `useActionState`) and comes back with the answer, so it is
 * announced every time. It takes focus (tabIndex -1) when the failure is not
 * about any one field (focus-after-failure.ts).
 */

export function FormAlert({
  id,
  pending,
  style,
  children,
}: {
  id?: string;
  pending: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  if (pending) return null;
  return (
    <div id={id} role="alert" tabIndex={-1} style={style}>
      {children}
    </div>
  );
}
