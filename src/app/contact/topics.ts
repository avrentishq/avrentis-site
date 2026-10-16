/**
 * The /contact form's topics — for each one, its words (heading, lede, button,
 * confirmation), WHICH FIELDS it asks for and how each is labelled, and which
 * inbox it reaches. One table, keyed by core's ContactIntent, read by the form
 * (contact-form.tsx) and the Server Action (actions.ts): the browser shows
 * exactly the fields the server checks, so a topic can never ask for one thing
 * and validate another. `topics.test.ts` holds that contract.
 *
 * Client-safe: no server imports.
 */
import { BRAND, moduleName, publicModuleKeys, type ContactIntent } from "@/lib/brand";
import { CONTACT_EMAIL, ENQUIRY_PROMISE, SECURITY_TRIAGE_TIME } from "@/lib/contacts";
import { DATA_PROTECTION_LAW_NAMES } from "@/lib/compliance-posture";

/** Every input the contact form can show. A topic picks the ones it needs. */
export const CONTACT_INPUTS = [
  "name",
  "email",
  "organisation",
  "size",
  "country",
  "relationship",
  "requestType",
  "module",
  "link",
  "message",
] as const;
export type ContactInput = (typeof CONTACT_INPUTS)[number];

export interface ChoiceOption {
  value: string;
  label: string;
}

/** How a topic asks for one input. Label and placeholder fall back to `INPUT_DEFAULTS`. */
export interface InputRule {
  required: boolean;
  label?: string;
  placeholder?: string;
  /** The allowed answers, for a choice input (relationship, requestType, module). */
  options?: readonly ChoiceOption[];
}

/** Which inbox a topic reaches — a key of `CONTACT_EMAIL`. */
export type ContactInbox = "general" | "security";

export interface ContactTopic {
  /** The topic's name in its tab's choice row (a tab with several topics). */
  choiceLabel: string;
  /** The small upper-case line above the headline. */
  eyebrow: string;
  headline: string;
  lede: string;
  /** The submit button's label. */
  cta: string;
  /** How the topic is named in the internal notification's subject and body. */
  subjectLabel: string;
  /** The inputs this topic shows, in the order written (= display order). `email` is always required. */
  inputs: Partial<Record<ContactInput, InputRule>> & { email: InputRule & { required: true } };
  /** What the consent box says the details are used for. */
  consent: string;
  /** The confirmation's heading and line. */
  successTitle: string;
  successMessage: string;
  /** The "What happens next" points beside the form. */
  nextSteps: readonly string[];
  /** The line under the "Prefer email?" address. */
  emailNote: string;
  inbox: ContactInbox;
  /** Added to the updates mailing list (when one is configured) instead of only emailing the team. */
  joinsUpdatesList?: boolean;
}

/** Labels used where a topic does not word an input itself. */
export const INPUT_DEFAULTS: Record<ContactInput, { label: string; placeholder?: string }> = {
  name: { label: "Full name" },
  email: { label: "Email" },
  organisation: { label: "Organisation" },
  size: { label: "Organisation size" },
  country: { label: "Country", placeholder: "Search your country…" },
  relationship: { label: "Your relationship to us" },
  requestType: { label: "What do you need?" },
  module: { label: "Which module?" },
  link: { label: "Link", placeholder: "https://" },
  message: { label: "Your message" },
};

const RELATIONSHIPS: readonly ChoiceOption[] = [
  { value: "customer-admin", label: `I run ${BRAND.name} for my organisation` },
  { value: "customer-user", label: `I use ${BRAND.name} at work` },
  { value: "supplier", label: "I'm a supplier or payee of a customer" },
  { value: "public", label: "Member of the public" },
  { value: "other", label: "Other" },
];

const PRIVACY_REQUESTS: readonly ChoiceOption[] = [
  { value: "access", label: "A copy of my data" },
  { value: "correction", label: "Correct my data" },
  { value: "deletion", label: "Delete my data" },
  { value: "objection", label: "Object to or restrict how my data is used" },
  { value: "dpa", label: "A data processing agreement (DPA)" },
  { value: "question", label: "A question about the privacy policy" },
  { value: "other", label: "Something else" },
];

const LEGAL_REQUESTS: readonly ChoiceOption[] = [
  { value: "contract", label: "A contract or agreement" },
  { value: "notice", label: "A formal notice under our terms" },
  { value: "vendor", label: "Vendor or supplier onboarding paperwork" },
  { value: "other", label: "Something else" },
];

/** The modules a launch notification can name — the site's public catalogue. */
function moduleOptions(): ChoiceOption[] {
  return publicModuleKeys().map((key) => ({ value: key, label: moduleName(key) }));
}

const REQUIRED = { required: true } as const;
const OPTIONAL = { required: false } as const;
const WORK_EMAIL = { required: true, label: "Work email" } as const;

/** The business enquiry shape: who you are, where you work, what you need. */
function businessInputs(message: { label: string; placeholder: string }): ContactTopic["inputs"] {
  return {
    name: REQUIRED,
    email: WORK_EMAIL,
    organisation: REQUIRED,
    size: OPTIONAL,
    country: OPTIONAL,
    message: { required: true, ...message },
  };
}

const ENQUIRY_CONSENT = `I agree that ${BRAND.name} may use the details above to respond to this enquiry`;
const UPDATES_CONSENT = `I'd like ${BRAND.name} to email me these updates (I can unsubscribe at any time)`;
const REPLY_ONLY_NOTE = "We only use your details to reply to this enquiry — never for marketing lists.";
const BUSINESS_NEXT_STEPS = [
  `${ENQUIRY_PROMISE} No routing bots.`,
  "For enterprise enquiries, we can sign an NDA before the first call.",
] as const;
const ENQUIRY_RECEIVED = {
  successTitle: "Enquiry received.",
  successMessage: `Thanks — we've received your enquiry. ${ENQUIRY_PROMISE}`,
} as const;

export const CONTACT_TOPICS: Record<ContactIntent, ContactTopic> = {
  general: {
    choiceLabel: "A question",
    eyebrow: "CONTACT US",
    headline: "Let's talk.",
    lede:
      `Whether you're evaluating ${BRAND.name}, have a question our product pages didn't answer, or want to partner. ${ENQUIRY_PROMISE}`,
    cta: "Contact us",
    subjectLabel: "General enquiry",
    inputs: businessInputs({
      label: "How can we help?",
      placeholder: "What are you evaluating, or what would you like to ask?",
    }),
    consent: ENQUIRY_CONSENT,
    ...ENQUIRY_RECEIVED,
    nextSteps: BUSINESS_NEXT_STEPS,
    emailNote: REPLY_ONLY_NOTE,
    inbox: "general",
  },
  demo: {
    choiceLabel: "A walkthrough",
    eyebrow: "CONTACT US",
    headline: "Talk to our team.",
    lede:
      `Tell us what you're evaluating or what you need — a walkthrough, a question, or a use case. ${ENQUIRY_PROMISE}`,
    cta: "Contact us",
    subjectLabel: "Personalised demo",
    inputs: businessInputs({
      label: "Tell us about your use case",
      placeholder: "What approvals or records are you trying to structure? How many people, how often?",
    }),
    consent: ENQUIRY_CONSENT,
    ...ENQUIRY_RECEIVED,
    nextSteps: BUSINESS_NEXT_STEPS,
    emailNote: REPLY_ONLY_NOTE,
    inbox: "general",
  },
  roadmap: {
    choiceLabel: "Share a use case",
    eyebrow: "SHARE YOUR USE CASE",
    headline: "Shape what we build next.",
    lede:
      "Tell us the approval or record-keeping problem you're trying to solve. We'll share where it sits on our roadmap and, where it fits, loop you in early.",
    cta: "Share my use case",
    subjectLabel: "Roadmap input",
    inputs: businessInputs({
      label: "The problem you're trying to solve",
      placeholder: "What happens today, and what would good look like?",
    }),
    consent: ENQUIRY_CONSENT,
    ...ENQUIRY_RECEIVED,
    nextSteps: BUSINESS_NEXT_STEPS,
    emailNote: REPLY_ONLY_NOTE,
    inbox: "general",
  },
  feedback: {
    choiceLabel: "Docs feedback",
    eyebrow: "DOCS FEEDBACK",
    headline: "What guide would have helped?",
    lede:
      "Tell us what you were looking for, what you couldn't find, and what you'd expect it to cover. We write docs that customers actually ask for.",
    cta: "Send feedback",
    subjectLabel: "Docs feedback",
    inputs: {
      name: REQUIRED,
      email: REQUIRED,
      organisation: OPTIONAL,
      message: {
        required: true,
        label: "What were you looking for?",
        placeholder: "The task you were trying to do, and what the guide should have covered.",
      },
    },
    consent: ENQUIRY_CONSENT,
    successTitle: "Feedback received.",
    successMessage: `Thanks — this goes straight to the people who write the docs. ${ENQUIRY_PROMISE}`,
    nextSteps: [`${ENQUIRY_PROMISE} Requests shape what we write next.`],
    emailNote: REPLY_ONLY_NOTE,
    inbox: "general",
  },
  security: {
    choiceLabel: "Book a security review",
    eyebrow: "SECURITY REVIEW",
    headline: "Talk to us about the security posture.",
    lede:
      "We'll walk your CISO or security team through the stack — isolation, authority, audit, access lifecycle, encryption — and answer anything the page hasn't.",
    cta: "Book a security review",
    subjectLabel: "Security review",
    inputs: businessInputs({
      label: "What would you like to review?",
      placeholder: "Your questionnaire, the areas you need covered, and any deadline.",
    }),
    consent: ENQUIRY_CONSENT,
    ...ENQUIRY_RECEIVED,
    nextSteps: BUSINESS_NEXT_STEPS,
    emailNote: REPLY_ONLY_NOTE,
    inbox: "general",
  },
  disclosure: {
    choiceLabel: "Report a vulnerability",
    eyebrow: "RESPONSIBLE DISCLOSURE",
    headline: "Report a security vulnerability.",
    lede:
      `Thank you for looking. Describe what you found, how to reproduce it, and what impact you think it has. We triage security reports ${SECURITY_TRIAGE_TIME} and do not pursue legal action against good-faith research.`,
    cta: "Submit report",
    subjectLabel: "Responsible disclosure",
    inputs: {
      name: { required: true, label: "Name or handle" },
      email: REQUIRED,
      organisation: OPTIONAL,
      link: { required: false, label: "Link to a write-up or proof of concept" },
      message: {
        required: true,
        label: "What you found",
        placeholder: "What is affected, the steps to reproduce it, and the impact you think it has.",
      },
    },
    consent: `I agree that ${BRAND.name} may use the details above to handle this report`,
    successTitle: "Report received.",
    successMessage: `Thank you — we triage security reports ${SECURITY_TRIAGE_TIME} and will reply to the address you gave.`,
    nextSteps: [
      `We triage security reports ${SECURITY_TRIAGE_TIME}.`,
      "We do not pursue legal action against good-faith research.",
    ],
    emailNote: "We only use your details to handle this report.",
    inbox: "security",
  },
  privacy: {
    choiceLabel: "Privacy or data request",
    eyebrow: "DATA-PROTECTION ENQUIRY",
    headline: "Privacy, data-subject rights, or a DPA.",
    lede:
      `Whether you're exercising a right under ${DATA_PROTECTION_LAW_NAMES.gdpr.short} / ${DATA_PROTECTION_LAW_NAMES.ndpa.short} / CCPA, requesting our DPA, or asking a privacy-policy question — describe what you need and we'll route it to the right person.`,
    cta: "Send privacy enquiry",
    subjectLabel: "Data-protection enquiry",
    inputs: {
      name: REQUIRED,
      email: REQUIRED,
      requestType: { required: true, options: PRIVACY_REQUESTS },
      relationship: { required: true, options: RELATIONSHIPS },
      organisation: OPTIONAL,
      country: OPTIONAL,
      message: {
        required: true,
        label: "Details",
        placeholder: "What you need, and anything that helps us find the right records.",
      },
    },
    consent: `I agree that ${BRAND.name} may use the details above to handle this request`,
    successTitle: "Request received.",
    successMessage: `Thanks — we've logged your request and will reply to the address you gave. ${ENQUIRY_PROMISE}`,
    nextSteps: [
      ENQUIRY_PROMISE,
      "We may ask you to confirm your identity before sharing or changing personal data.",
    ],
    emailNote: "We only use your details to handle this request.",
    inbox: "general",
  },
  legal: {
    choiceLabel: "Legal matter",
    eyebrow: "LEGAL ENQUIRY",
    headline: "Notices, agreements, and legal questions.",
    lede:
      "Contract redlines, notices under our Terms of Service, vendor onboarding paperwork — send it here and our team will respond promptly.",
    cta: "Send legal enquiry",
    subjectLabel: "Legal enquiry",
    inputs: {
      name: REQUIRED,
      email: REQUIRED,
      organisation: REQUIRED,
      requestType: { required: true, options: LEGAL_REQUESTS },
      country: OPTIONAL,
      message: {
        required: true,
        label: "Details",
        placeholder: "What the matter is about, and any reference or deadline.",
      },
    },
    consent: ENQUIRY_CONSENT,
    ...ENQUIRY_RECEIVED,
    nextSteps: [ENQUIRY_PROMISE],
    emailNote: REPLY_ONLY_NOTE,
    inbox: "general",
  },
  subscribe: {
    choiceLabel: "Product updates",
    eyebrow: "SUBSCRIBE TO UPDATES",
    headline: "Get notable changes in your inbox.",
    lede:
      "We send a short email when something material ships — release notes, security updates, and service-impacting incidents. No promotional material.",
    cta: "Subscribe me",
    subjectLabel: "Subscribe to updates",
    inputs: { email: REQUIRED },
    consent: UPDATES_CONSENT,
    successTitle: "You're subscribed.",
    successMessage: "We'll email you when something material ships. Every email has an unsubscribe link.",
    nextSteps: ["One short email when something material ships.", "No promotional material."],
    emailNote: "We only use your email to send these updates.",
    inbox: "general",
    joinsUpdatesList: true,
  },
  notify: {
    choiceLabel: "Launch alert",
    eyebrow: "LAUNCH NOTIFICATION",
    headline: "Be the first to know when this launches.",
    lede:
      "Drop your details and we'll reach out as soon as this module is generally available — plus a chance to join an early-access cohort.",
    cta: "Notify me at launch",
    subjectLabel: "Launch notification",
    inputs: {
      name: OPTIONAL,
      email: REQUIRED,
      module: { required: false, options: moduleOptions() },
    },
    consent: UPDATES_CONSENT,
    successTitle: "You're on the list.",
    successMessage: "We'll email you when it launches. Every email has an unsubscribe link.",
    nextSteps: ["One email when it launches.", "No promotional material."],
    emailNote: "We only use your email to tell you about this launch and product updates.",
    inbox: "general",
    joinsUpdatesList: true,
  },
  beta: {
    choiceLabel: "Join the beta",
    eyebrow: "BETA ACCESS",
    headline: "Join the beta.",
    lede:
      "Early-access users get hands-on support, a shorter feedback loop with our product team, and pricing locked at launch terms.",
    cta: "Request beta access",
    subjectLabel: "Beta access",
    inputs: businessInputs({
      label: "What would you use it for?",
      placeholder: "The process you'd run on it, and roughly how many people would use it.",
    }),
    consent: ENQUIRY_CONSENT,
    successTitle: "Request received.",
    successMessage: `Thanks — we'll be in touch about the beta. ${ENQUIRY_PROMISE}`,
    nextSteps: BUSINESS_NEXT_STEPS,
    emailNote: REPLY_ONLY_NOTE,
    inbox: "general",
  },
  careers: {
    choiceLabel: "Register interest",
    eyebrow: "REGISTER YOUR INTEREST",
    headline: "Tell us what you’d like to own.",
    lede:
      `We hire deliberately. Share a short note about what draws you to ${BRAND.name}, a link to something you're proud of, and the kind of work you want to do. We read every message.`,
    cta: "Register my interest",
    subjectLabel: "Careers — register interest",
    inputs: {
      name: REQUIRED,
      email: REQUIRED,
      link: {
        required: false,
        label: "Link to your work",
        placeholder: "A portfolio, GitHub or LinkedIn link",
      },
      country: OPTIONAL,
      message: {
        required: true,
        label: "What draws you here, and what would you like to work on?",
        placeholder: "A few lines about you and the kind of work you want to own.",
      },
    },
    consent: `I agree that ${BRAND.name} may use the details above to consider me for a role`,
    successTitle: "Thanks for your interest.",
    successMessage: `We've received your note. ${ENQUIRY_PROMISE}`,
    nextSteps: [ENQUIRY_PROMISE, "We keep your note on file only while we're hiring for a matching role."],
    emailNote: "We only use your details to consider you for a role.",
    inbox: "general",
  },
};

/** The address shown under "Prefer email?" for a topic — the inbox it reaches. */
export function topicEmail(intent: ContactIntent): string {
  return CONTACT_EMAIL[CONTACT_TOPICS[intent].inbox];
}

/** The inputs a topic shows, in the order the topic lists them. */
export function topicInputs(intent: ContactIntent): ContactInput[] {
  return (Object.keys(CONTACT_TOPICS[intent].inputs) as ContactInput[]).filter((input) =>
    (CONTACT_INPUTS as readonly string[]).includes(input),
  );
}

/** A topic's rule for one input, with the default label/placeholder filled in. */
export function inputRule(
  intent: ContactIntent,
  input: ContactInput,
): (InputRule & { label: string; placeholder?: string }) | undefined {
  const rule = CONTACT_TOPICS[intent].inputs[input];
  if (!rule) return undefined;
  return {
    ...rule,
    label: rule.label ?? INPUT_DEFAULTS[input].label,
    placeholder: rule.placeholder ?? INPUT_DEFAULTS[input].placeholder,
  };
}
