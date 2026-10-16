import { describe, expect, it } from "vitest";

import { CONTACT_INTENTS } from "@/lib/brand";
import { CONTACT_EMAIL } from "@/lib/contacts";
import { CONTACT_TOPICS, INPUT_DEFAULTS, inputRule, topicEmail, topicInputs } from "./topics";

describe("contact topics", () => {
  it("every topic asks for an email, required — it is how we reply", () => {
    for (const intent of CONTACT_INTENTS) {
      expect(inputRule(intent, "email")?.required, intent).toBe(true);
    }
  });

  it("every choice input offers its options, with unique values", () => {
    for (const intent of CONTACT_INTENTS) {
      for (const input of ["relationship", "requestType", "module"] as const) {
        const rule = inputRule(intent, input);
        if (!rule) continue;
        expect(rule.options?.length, `${intent}.${input}`).toBeGreaterThan(0);
        const values = rule.options!.map((option) => option.value);
        expect(new Set(values).size, `${intent}.${input}`).toBe(values.length);
      }
    }
  });

  it("every topic reaches a published inbox", () => {
    for (const intent of CONTACT_INTENTS) {
      expect(Object.values(CONTACT_EMAIL), intent).toContain(topicEmail(intent));
    }
    expect(topicEmail("disclosure")).toBe(CONTACT_EMAIL.security);
  });

  it("the topics that do not fit a business enquiry no longer ask for one", () => {
    // The defects this table fixed: one identical business form for every topic.
    expect(topicInputs("subscribe")).toEqual(["email"]);
    expect(topicInputs("careers")).not.toContain("organisation");
    expect(topicInputs("careers")).not.toContain("size");
    expect(topicInputs("careers")).toContain("link");
    expect(inputRule("careers", "email")?.label).toBe(INPUT_DEFAULTS.email.label);
    expect(inputRule("privacy", "organisation")?.required).toBe(false);
    expect(topicInputs("privacy")).toEqual(expect.arrayContaining(["requestType", "relationship"]));
    expect(inputRule("disclosure", "organisation")?.required).toBe(false);
    expect(topicInputs("notify")).toContain("module");
  });

  it("every topic words its own message prompt — no topic inherits another's", () => {
    const prompts = CONTACT_INTENTS.flatMap((intent) => {
      const rule = inputRule(intent, "message");
      return rule ? [`${rule.label}|${rule.placeholder}`] : [];
    });
    expect(new Set(prompts).size).toBe(prompts.length);
  });

  it("only updates topics join the mailing list", () => {
    const joining = CONTACT_INTENTS.filter((intent) => CONTACT_TOPICS[intent].joinsUpdatesList);
    expect(joining.sort()).toEqual(["notify", "subscribe"]);
  });

  it("every headline is short enough to stay on one line on a small phone", () => {
    // The form shrinks a headline to fit one line (contact-form.tsx); this cap
    // keeps the shrunk size heading-sized on a 320px screen.
    const HEADLINE_MAX_CHARACTERS = 32;
    for (const intent of CONTACT_INTENTS) {
      expect(CONTACT_TOPICS[intent].headline.length, intent).toBeLessThanOrEqual(HEADLINE_MAX_CHARACTERS);
    }
  });
});
