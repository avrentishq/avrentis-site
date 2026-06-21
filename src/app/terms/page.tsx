import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell, type LegalSection } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Terms of service — Avrentis",
  description:
    "The terms that govern your organisation's use of Avrentis — service description, acceptable use, data ownership, fees, liability, and termination.",
  openGraph: {
    title: "Avrentis terms of service",
    description:
      "What we commit to, what we expect of you, who owns the data, and how the agreement can end.",
    url: "https://avrentis.com/terms",
    type: "website",
  },
};

const SECTIONS: LegalSection[] = [
  {
    id: "agreement",
    heading: "Agreement overview",
    body: (
      <>
        <p>
          These terms (&ldquo;Terms&rdquo;) form a contract between Avrentis (&ldquo;Avrentis&rdquo;,
          &ldquo;we&rdquo;) and the organisation (&ldquo;Customer&rdquo;, &ldquo;you&rdquo;) that uses the Avrentis
          platform at <a href="https://app.avrentis.com" rel="noreferrer">app.avrentis.com</a> (the &ldquo;Service&rdquo;).
        </p>
        <p>
          By creating an Avrentis workspace, accessing the Service, or accepting these Terms through an order form,
          you agree to be bound by them on behalf of the organisation you represent. If you do not agree, do not use
          the Service.
        </p>
      </>
    ),
  },
  {
    id: "service",
    heading: "The Service",
    body: (
      <>
        <p>
          Avrentis is a multi-tenant platform for structuring, approving, and permanently recording operational
          documents — payment vouchers, purchase orders, personnel actions, and related records. The Service
          includes workflow automation, notifications, PDF generation, audit trails, administrative tooling, and
          supporting APIs. We may release new features, retire features that no longer serve the product, or
          improve existing ones. Where a change materially reduces functionality, we will give reasonable notice to
          account administrators.
        </p>
        <p>
          A detailed, current description of capabilities lives at{" "}
          <Link href="/product">/product</Link> and is authoritative over any earlier marketing material.
        </p>
      </>
    ),
  },
  {
    id: "accounts",
    heading: "Accounts and eligibility",
    body: (
      <>
        <p>
          You may create accounts only for people authorised by your organisation. Each user must be an identified
          individual; shared logins are not permitted. The account administrator is responsible for provisioning,
          deprovisioning, and the appropriateness of role assignments.
        </p>
        <p>
          You must be legally capable of entering into this agreement in your jurisdiction and must not be located
          in, or act on behalf of persons in, a country or entity subject to comprehensive sanctions that would make
          use of the Service unlawful.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    heading: "Acceptable use",
    body: (
      <>
        <p>You agree not to use the Service to:</p>
        <ul>
          <li>Violate law, intellectual-property rights, or the rights of others.</li>
          <li>Upload malware, transmit spam, or conduct fraud.</li>
          <li>
            Probe, scan, or test the vulnerability of the Service other than through our responsible-disclosure
            programme via <Link href="/contact?intent=disclosure">our responsible-disclosure form</Link>.
          </li>
          <li>Attempt to bypass tenant isolation, rate limits, or authentication.</li>
          <li>Reverse-engineer the Service, except to the extent that applicable law prohibits such a restriction.</li>
          <li>Use the Service to build a competing product by copying its interfaces or workflows.</li>
        </ul>
        <p>We may suspend access to address an active abuse incident; we will notify you and act proportionately.</p>
      </>
    ),
  },
  {
    id: "data",
    heading: "Your data",
    body: (
      <>
        <p>
          <strong>You own your data.</strong> Content you or your users submit to the Service remains the
          Customer&rsquo;s property. We process it under these Terms and our{" "}
          <Link href="/privacy">Privacy Policy</Link>, and, where required, under a Data Processing Agreement.
        </p>
        <p>
          <strong>We protect your data.</strong> A summary of the technical and organisational measures we apply is
          at <Link href="/product/security">/product/security</Link>. Audit logs are immutable by design — this is a
          deliberate product commitment, not an optional feature.
        </p>
        <p>
          <strong>You can export it.</strong> At any time during the subscription, and for a reasonable period after
          termination, administrators can export documents, audit events, and account data through the Service.
        </p>
      </>
    ),
  },
  {
    id: "fees",
    heading: "Fees and billing",
    body: (
      <>
        <p>
          Paid plans and their fees are described at <Link href="/pricing">/pricing</Link> and any order form you
          execute. Unless otherwise stated, fees are charged in advance for the subscription term, are
          non-refundable, and are exclusive of taxes.
        </p>
        <p>
          We may change list pricing for future terms. Existing contracts run out at the agreed price. Enterprise
          pricing on an order form is governed by that order form.
        </p>
        <p>
          If payment is overdue, we will contact you. Continued non-payment may lead to suspension or termination
          following reasonable notice.
        </p>
      </>
    ),
  },
  {
    id: "service-levels",
    heading: "Service levels and support",
    body: (
      <>
        <p>
          We work to keep the Service available, performant, and safe. Enterprise customers receive a written
          service-level commitment as part of their order form. Where you depend on a specific uptime or response
          target, please request an enterprise agreement.
        </p>
        <p>
          Scheduled maintenance is communicated in advance where reasonably possible. Emergency maintenance to
          protect security or integrity may occur without notice.
        </p>
      </>
    ),
  },
  {
    id: "intellectual-property",
    heading: "Intellectual property",
    body: (
      <>
        <p>
          Avrentis owns all intellectual-property rights in the Service, its interfaces, and its underlying code.
          These Terms grant you a limited, non-exclusive, non-transferable right to access and use the Service for
          your internal business purposes during the subscription term. No other rights are granted by implication
          or estoppel.
        </p>
        <p>
          Feedback you provide is appreciated. We may incorporate it into the Service without obligation or
          attribution.
        </p>
      </>
    ),
  },
  {
    id: "warranties",
    heading: "Warranties and disclaimers",
    body: (
      <>
        <p>
          We warrant that the Service will be provided in a professional manner consistent with industry standards.
          Except for that warranty and any written commitments in an executed order form,{" "}
          <strong>
            the Service is provided &ldquo;as is&rdquo; and we disclaim all other warranties, express or implied, to
            the fullest extent permitted by law
          </strong>{" "}
          — including merchantability, fitness for a particular purpose, and non-infringement.
        </p>
        <p>
          Avrentis is a tool that records and routes approvals; it does not replace your organisation&rsquo;s
          responsibility for legal, financial, or regulatory decisions made inside it.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    heading: "Limitation of liability",
    body: (
      <>
        <p>
          To the fullest extent permitted by law, neither party is liable for indirect, consequential, incidental,
          special, or punitive damages, or for lost profits, revenues, or data, even if advised of the possibility.
          Each party&rsquo;s aggregate liability arising out of or related to these Terms is capped at the fees paid
          by the Customer to Avrentis in the twelve months preceding the event giving rise to liability.
        </p>
        <p>
          The cap does not apply to breaches of confidentiality obligations, misuse of intellectual property,
          indemnification obligations, or liability that cannot be excluded under applicable law.
        </p>
      </>
    ),
  },
  {
    id: "indemnification",
    heading: "Indemnification",
    body: (
      <p>
        Each party will defend the other against third-party claims arising from (a) the indemnifying party&rsquo;s
        violation of law, (b) infringement of third-party intellectual property by the indemnifying party&rsquo;s
        own materials, or (c) breach of confidentiality. Reasonable, substantiated losses, damages, and costs
        awarded in a final judgment or settlement will be reimbursed. The indemnified party must give prompt
        notice, reasonable cooperation, and sole control of the defence to the indemnifying party.
      </p>
    ),
  },
  {
    id: "termination",
    heading: "Termination",
    body: (
      <>
        <p>
          Either party may terminate for material breach that is not cured within 30 days of written notice.
          Customer may terminate for convenience at the end of a subscription term per its plan or order form.
          Avrentis may suspend or terminate access to address severe misuse, non-payment, or legal requirement.
        </p>
        <p>
          On termination, access to the Service ends. Customer may, for a reasonable period, export data through
          the Service. We will then delete Customer data in accordance with our retention practices, except where
          we are legally required to retain it.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    heading: "Changes to these Terms",
    body: (
      <p>
        We may update these Terms to reflect product evolution or legal changes. Material changes will be notified
        to account administrators at least 30 days before they take effect. Continuing to use the Service after the
        effective date constitutes acceptance of the updated Terms.
      </p>
    ),
  },
  {
    id: "governing-law",
    heading: "Governing law and disputes",
    body: (
      <p>
        These Terms are governed by the laws of the jurisdiction identified in the applicable order form, or, in
        the absence of an order form, the laws of the Federal Republic of Nigeria, without regard to conflict-of-law
        rules. Disputes will be resolved in the courts of that jurisdiction, except where statute gives a consumer
        or regulated customer a non-waivable right to another forum.
      </p>
    ),
  },
  {
    id: "contact",
    heading: "Contact",
    body: (
      <p>
        Legal questions, requests for a signed agreement, or notices under these Terms should be sent to{" "}
        <Link href="/contact?intent=legal">our legal enquiry form</Link>.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPageShell
      eyebrow="TERMS OF SERVICE"
      title="The terms of our agreement."
      lede="These terms describe what Avrentis commits to, what we expect of our customers, how data is handled, and how the agreement can end. Written for people, not just lawyers."
      effectiveDate="21 April 2026"
      sections={SECTIONS}
      footerNote={
        <>
          <strong>Note.</strong> These standard Terms apply to self-serve customers. Enterprise customers typically
          operate under a negotiated order form that takes precedence over any conflicting provision here. To
          request that form, send a note through{" "}
          <Link href="/contact?intent=legal" style={{ color: "var(--color-gold)", textDecoration: "none" }}>
            our legal enquiry form
          </Link>
          .
        </>
      }
    />
  );
}
