/**
 * Security FAQ content — the single source for both the visible accordion on
 * /product/security and the FAQPage JSON-LD on that route. Keeping them in one
 * place stops the rendered copy and the structured data from drifting apart.
 */

export interface SecurityFaq {
  q: string;
  a: string;
}

export const SECURITY_FAQS: SecurityFaq[] = [
  {
    q: "Who at Avrentis can access our data?",
    a: "No Avrentis engineer can read customer data by default. Platform administrators can be granted audit-logged, permission-gated access to a specific tenant for support purposes — every action is written to the same immutable audit trail the customer sees.",
  },
  {
    q: "What happens when someone leaves our organisation?",
    a: "Deactivation revokes active JWTs via Redis within seconds. If deprovisioned over SCIM, this happens automatically when your IdP marks the user inactive. Their historical actions remain in the audit trail — the record is preserved, not deleted.",
  },
  {
    q: "Can we export everything — for an auditor, regulator, or migration?",
    a: "Yes. The audit-trail export bundles every approval, signature, query, and role change for any period into a regulator-ready file. Document PDFs and attachments are exported alongside. You own your data; we don't hold it hostage.",
  },
  {
    q: "Do you support SSO and SCIM?",
    a: "Yes — OpenID Connect (OIDC) for SSO and SCIM 2.0 for provisioning, tested against Okta, Microsoft Entra, and Google Workspace. SAML 2.0 is on our enterprise roadmap. Client secrets and tokens are encrypted with AES-256-GCM at rest.",
  },
  {
    q: "Where is our data hosted and can it stay in a specific region?",
    a: "Today, the platform runs on managed infrastructure primarily hosted in the UK (London), with a global edge network in front. Dedicated in-country or in-region hosting is available on request as part of an enterprise engagement.",
  },
  {
    q: "Can we sign a Data Processing Agreement?",
    a: "Yes. A DPA is available on request for any enterprise engagement. Contact us and we'll send the current version.",
  },
  {
    q: "Do you have a responsible disclosure policy?",
    a: "Yes. Security researchers can report vulnerabilities to security@avrentis.com. We triage within two business days and do not pursue legal action against good-faith researchers following standard responsible-disclosure practice.",
  },
];
