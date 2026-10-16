import { HONEYPOT_FIELD } from "@/lib/form-rules";

/**
 * The hidden decoy field (`HONEYPOT_FIELD`). Off-screen, out of the tab order
 * and hidden from assistive technology, so people never fill it; form-filling
 * bots do, and the Server Action then answers as if it succeeded.
 */
export function HoneypotField() {
  return (
    <input
      type="text"
      name={HONEYPOT_FIELD}
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
    />
  );
}
