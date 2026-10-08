"use client";

/**
 * The form-level message a server action returns, announced to screen readers.
 *
 * `role="alert"` is read out when the node appears, not when its text stays the
 * same — so a second submission that fails the same way would be silent. The
 * alert is therefore taken off the page while the form is sending and put back
 * with the answer, which announces it every time. Must sit inside the <form>
 * (`useFormStatus` reads the enclosing form).
 */

import { useFormStatus } from "react-dom";

export function FormAlert({
  id,
  style,
  children,
}: {
  id?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const { pending } = useFormStatus();
  if (pending) return null;
  return (
    <div id={id} role="alert" style={style}>
      {children}
    </div>
  );
}
