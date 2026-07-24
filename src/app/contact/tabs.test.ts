import { describe, it, expect } from "vitest";
import { CONTACT_TABS, tabForIntent } from "./tabs";
import { VALID_INTENTS } from "./state";

describe("contact tabs", () => {
  // The load-bearing invariant: a new intent added to state.ts without a tab
  // would fall through to "Talk to us" silently — this fails instead.
  it("maps every intent to exactly one tab", () => {
    for (const intent of VALID_INTENTS) {
      const owners = CONTACT_TABS.filter((t) => t.members.includes(intent));
      expect(owners, `intent "${intent}" must belong to exactly one tab`).toHaveLength(1);
    }
  });

  it("each tab's canonical value is one of its own members", () => {
    for (const tab of CONTACT_TABS) {
      expect(tab.members, tab.label).toContain(tab.value);
    }
  });

  it("lights the parent tab for deep-linked members", () => {
    expect(tabForIntent("disclosure")).toBe("security");
    expect(tabForIntent("legal")).toBe("privacy");
    expect(tabForIntent("beta")).toBe("subscribe");
    expect(tabForIntent("demo")).toBe("general");
  });
});
