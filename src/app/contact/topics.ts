/**
 * The /contact form's words for each topic — its heading, lede, button and the
 * name the internal notification gives it. One table, keyed by core's
 * ContactIntent, read by the form (contact-form.tsx) and the Server Action
 * (actions.ts), so a topic can never be shown one way and filed another.
 */
import { BRAND, type ContactIntent } from "@/lib/brand";
import { ENQUIRY_PROMISE, SECURITY_TRIAGE_TIME } from "@/lib/contacts";
import { DATA_PROTECTION_LAW_NAMES } from "@/lib/compliance-posture";

export interface ContactTopicCopy {
  /** The small upper-case line above the headline. */
  eyebrow: string;
  headline: string;
  lede: string;
  /** The submit button's label. */
  cta: string;
  /** How the topic is named in the internal notification's subject and body. */
  subjectLabel: string;
}

export const CONTACT_TOPICS: Record<ContactIntent, ContactTopicCopy> = {
  demo: {
    eyebrow: "CONTACT US",
    headline: "Talk to our team.",
    lede:
      `Tell us what you're evaluating or what you need — a walkthrough, a question, or a use case. ${ENQUIRY_PROMISE}`,
    cta: "Contact us",
    subjectLabel: "Personalised demo",
  },
  security: {
    eyebrow: "SECURITY REVIEW",
    headline: "Talk to us about the security posture.",
    lede:
      "We'll walk your CISO or security team through the stack — isolation, authority, audit, access lifecycle, encryption — and answer anything the page hasn't.",
    cta: "Book a security review",
    subjectLabel: "Security review",
  },
  disclosure: {
    eyebrow: "RESPONSIBLE DISCLOSURE",
    headline: "Report a security vulnerability.",
    lede:
      `Thank you for looking. Describe what you found, how to reproduce it, and what impact you think it has. We triage security reports ${SECURITY_TRIAGE_TIME} and do not pursue legal action against good-faith research.`,
    cta: "Submit report",
    subjectLabel: "Responsible disclosure",
  },
  privacy: {
    eyebrow: "DATA-PROTECTION ENQUIRY",
    headline: "Privacy, data-subject rights, or a DPA.",
    lede:
      `Whether you're exercising a right under ${DATA_PROTECTION_LAW_NAMES.gdpr.short} / ${DATA_PROTECTION_LAW_NAMES.ndpa.short} / CCPA, requesting our DPA, or asking a privacy-policy question — describe what you need and we'll route it to the right person.`,
    cta: "Send privacy enquiry",
    subjectLabel: "Data-protection enquiry",
  },
  legal: {
    eyebrow: "LEGAL ENQUIRY",
    headline: "Notices, agreements, and legal questions.",
    lede:
      "Contract redlines, notices under our Terms of Service, vendor onboarding paperwork — send it here and our team will respond promptly.",
    cta: "Send legal enquiry",
    subjectLabel: "Legal enquiry",
  },
  careers: {
    eyebrow: "REGISTER YOUR INTEREST",
    headline: "Tell us what you\u2019d like to own.",
    lede:
      `We hire deliberately. Share a short note about what draws you to ${BRAND.name}, a link to something you're proud of, and the kind of work you want to do. We read every message.`,
    cta: "Register my interest",
    subjectLabel: "Careers — register interest",
  },
  feedback: {
    eyebrow: "DOCS FEEDBACK",
    headline: "What guide would have helped?",
    lede:
      "Tell us what you were looking for, what you couldn't find, and what you'd expect it to cover. We write docs that customers actually ask for.",
    cta: "Send feedback",
    subjectLabel: "Docs feedback",
  },
  subscribe: {
    eyebrow: "SUBSCRIBE TO UPDATES",
    headline: "Get notable changes in your inbox.",
    lede:
      "We send a short email when something material ships — release notes, security updates, and service-impacting incidents. No promotional material.",
    cta: "Subscribe me",
    subjectLabel: "Subscribe to updates",
  },
  notify: {
    eyebrow: "LAUNCH NOTIFICATION",
    headline: "Be the first to know when this launches.",
    lede:
      "Drop your details and we'll reach out as soon as this module is generally available — plus a chance to join an early-access cohort.",
    cta: "Notify me at launch",
    subjectLabel: "Launch notification",
  },
  beta: {
    eyebrow: "BETA ACCESS",
    headline: "Join the beta.",
    lede:
      "Early-access users get hands-on support, a shorter feedback loop with our product team, and pricing locked at launch terms.",
    cta: "Request beta access",
    subjectLabel: "Beta access",
  },
  roadmap: {
    eyebrow: "SHARE YOUR USE CASE",
    headline: "Shape what we build next.",
    lede:
      "Tell us the approval or record-keeping problem you're trying to solve. We'll share where it sits on our roadmap and, where it fits, loop you in early.",
    cta: "Share my use case",
    subjectLabel: "Roadmap input",
  },
  general: {
    eyebrow: "CONTACT US",
    headline: "Let's talk.",
    lede:
      `Whether you're evaluating ${BRAND.name}, have a question our product pages didn't answer, or want to partner. ${ENQUIRY_PROMISE}`,
    cta: "Contact us",
    subjectLabel: "General enquiry",
  },
};
