import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { CONTACT_TABS, contactHref, tabForIntent } from "./tabs";
import { CONTACT_INTENTS, type ContactIntent } from "@/lib/brand";

describe("contact tabs", () => {
  // The load-bearing invariant: a new intent added to core without a tab
  // would fall through to "Talk to us" silently — this fails instead.
  it("maps every intent to exactly one tab", () => {
    for (const intent of CONTACT_INTENTS) {
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

describe("contactHref", () => {
  it("spells the general enquiry as plain /contact and every other intent as a deep link", () => {
    expect(contactHref("general")).toBe("/contact");
    expect(contactHref("security")).toBe("/contact?intent=security");
  });

  it("every tab's link resolves back to that tab", () => {
    for (const tab of CONTACT_TABS) {
      const intent = new URL(contactHref(tab.value), "https://example.org").searchParams.get("intent") ?? "general";
      expect(tabForIntent(intent as ContactIntent)).toBe(tab.value);
    }
  });
});

describe("contact URLs are built in one place", () => {
  const LITERAL = /["'`]\/contact\?intent=/;

  it("the detector catches a typed contact URL", () => {
    expect(LITERAL.test('href="/contact?intent=demo"')).toBe(true);
    expect(LITERAL.test("// route through /contact?intent=careers")).toBe(false);
  });

  it("no file types a /contact?intent= URL; they call contactHref", () => {
    const src = join(process.cwd(), "src");
    const offenders = readdirSync(src, { recursive: true, encoding: "utf8" })
      .filter((file) => /\.tsx?$/.test(file) && !/\.test\.ts$/.test(file))
      .filter((file) => file !== join("app", "contact", "tabs.ts"))
      .filter((file) => LITERAL.test(readFileSync(join(src, file), "utf8")));
    expect(offenders).toEqual([]);
  });
});
