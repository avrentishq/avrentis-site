import { useSyncExternalStore } from "react";

const subscribeNever = () => () => {};

/**
 * False in the server HTML (and while hydrating), true once the client runs.
 *
 * Client-side gating (holding a submit button until the form looks valid) must
 * not reach the server HTML: without JavaScript nothing would ever lift it,
 * and the form could never be sent. Gate on `hydrated && …` instead.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
}
