/**
 * Contact-form topic tabs. The /contact form supports 12 fine-grained
 * intents (deep-linked via `?intent=`), but exposes them on-page as a small
 * set of top-level tabs. Each tab owns a set of member intents: a deep link
 * to any member lights that tab, and clicking a tab selects its canonical
 * intent. Pure data + lookup so it can be unit-tested without the client form.
 */
import type { ContactIntent } from "./state";

export interface ContactTab {
  /** Intent posted (and copy shown) when the tab itself is clicked. */
  value: ContactIntent;
  label: string;
  /** Intents (incl. `value`) that light this tab when arrived at via deep link. */
  members: ContactIntent[];
}

export const CONTACT_TABS: ContactTab[] = [
  { value: "general", label: "Talk to us", members: ["general", "demo", "roadmap", "feedback"] },
  { value: "security", label: "Security", members: ["security", "disclosure"] },
  { value: "privacy", label: "Privacy & legal", members: ["privacy", "legal"] },
  { value: "subscribe", label: "Updates & access", members: ["subscribe", "notify", "beta"] },
  { value: "careers", label: "Careers", members: ["careers"] },
];

/** The canonical tab intent that should be lit for a given (possibly deep-linked) intent. */
export function tabForIntent(intent: ContactIntent): ContactIntent {
  const tab = CONTACT_TABS.find((t) => t.members.includes(intent));
  return (tab ?? CONTACT_TABS[0]!).value;
}
