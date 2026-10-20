"use client";

import { m } from "framer-motion";
import { Lock, Check, Zap, Globe } from "lucide-react";
import { SITE_PAGES } from "@/lib/brand";
import { fadeUpOnScroll } from "@/lib/animations";
import { ButtonLink } from "@/components/ui/button";
import { DarkHeroBackdrop } from "@/components/ui/dark-hero-backdrop";
import { START_TRIAL_CTA, TRIAL_DURATION_DAYS, NO_CARD_REQUIRED, TRIAL_SETUP_TIME } from "@/lib/trial-terms";
import { contactHref } from "@/app/contact/tabs";
import { TRUST_SIGNALS } from "@/lib/compliance-posture";
import { MARKET_REGION } from "@/lib/market";
import { Z_INDEX } from "@/lib/layers";

const trustSignals = [
  { icon: Globe, label: `Built for ${MARKET_REGION}` },
  { icon: Lock, label: TRUST_SIGNALS.security },
  { icon: Zap, label: TRUST_SIGNALS.auditTrail },
  { icon: Check, label: TRUST_SIGNALS.dataProtection },
];

export function CtaBanner() {
  return (
    <section
      style={{
        backgroundColor: "var(--color-navy-primary)",
        padding: "120px 40px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        isolation: "isolate",
      }}
    >
      {/* Ambient glow frames the CTA from behind. Two offset glows keep the
          motion asymmetric so the cycle never looks mechanical. */}
      <DarkHeroBackdrop glows="centered" grid />

      <div
        style={{
          maxWidth: "var(--measure)",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          zIndex: Z_INDEX.content,
        }}
      >
        {/* Headline */}
        <m.h2
          {...fadeUpOnScroll()}
          className="lg:!text-display-lg"
          style={{
            fontWeight: 700,
            fontSize: "var(--text-display-xs)",
            color: "var(--color-white)",
            lineHeight: 1.2,
            margin: "0 0 16px",
          }}
        >
          Your organisation&rsquo;s decisions deserve better than an email
          thread.
        </m.h2>

        {/* Subheadline */}
        <m.p
          {...fadeUpOnScroll(1)}
          style={{
            fontWeight: 400,
            fontSize: "var(--text-xl)",
            color: "var(--color-text-muted)",
            lineHeight: 1.7,
            margin: "0 0 32px",
          }}
        >
          Replace paper, email, and assumption with structure, authority, and an
          audit trail that lasts.
        </m.p>

        {/* CTAs */}
        <m.div
          {...fadeUpOnScroll(2)}
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <ButtonLink href={SITE_PAGES.trial()} size="xl">
            {START_TRIAL_CTA}
          </ButtonLink>
          <ButtonLink href={contactHref()} variant="secondary" surface="dark" size="xl">
            Contact us &rarr;
          </ButtonLink>
        </m.div>

        {/* Micro copy */}
        <m.p
          {...fadeUpOnScroll(3)}
          style={{
            fontWeight: 400,
            fontSize: "var(--text-sm)",
            color: "var(--color-text-secondary)",
            marginTop: "20px",
          }}
        >
          {TRIAL_DURATION_DAYS} days. {NO_CARD_REQUIRED}. Set up {TRIAL_SETUP_TIME} &mdash; your
          first approval can happen today.
        </m.p>

        {/* Trust signals */}
        <m.div
          {...fadeUpOnScroll(4)}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "center",
            marginTop: "32px",
          }}
        >
          {trustSignals.map(({ icon: Icon, label }) => (
            <span
              key={label}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "var(--text-sm)",
                color: "var(--color-text-muted)",
              }}
            >
              <Icon size={14} color="var(--color-gold)" strokeWidth={2} />
              {label}
            </span>
          ))}
        </m.div>
      </div>
    </section>
  );
}
