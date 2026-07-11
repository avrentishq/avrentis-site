"use client";

import { useState } from "react";
import { m } from "framer-motion";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";
import { SectionBackdrop } from "@/components/ui/section-backdrop";
import { SECTION_BACKDROPS } from "@/lib/section-backdrops";
import Link from "next/link";
import type {
  PricingData,
  Plan,
  PricingCurrency,
} from "@/lib/pricing";
import { formatCurrencyAmount } from "@/lib/pricing";
import { PUBLIC_MODULE_COUNT } from "@/lib/brand";

type BillingCycle = "monthly" | "annual";

const FEATURED_PLAN = "business";

/* ── Helpers ─────────────────────────────────────────────────── */

function getPriceForCurrency(
  plan: Plan,
  currencyCode: string,
): PricingCurrency | undefined {
  return plan.pricing.find((p) => p.currency === currencyCode);
}

function getAvailableCurrencies(data: PricingData): string[] {
  const first = data.plans[0];
  if (!first) return ["NGN"];
  return first.pricing.map((p) => p.currency);
}

function getHighlights(plan: Plan): string[] {
  return plan.highlights ?? [];
}

/**
 * The Trial card is rendered client-side, not fetched from the API.
 * It's a marketing construct — the server's truth is `subscriptionStatus === "trial"`
 * on a tenant whose plan key is "business".
 */
// Deltas only — the module scope is the card's badge, and the watermark +
// 30-day-grace detail lives in the footnote below the CTA (no repetition).
const TRIAL_HIGHLIGHTS: string[] = [
  "Full Business tier — switched on, not a sandbox",
  "Up to 10 users, ready to invite",
  "Bank-ready PDF exports (trial watermark)",
  "1 GB storage during trial",
];

/* ── Component ───────────────────────────────────────────────── */

interface PricingProps {
  data: PricingData;
  /** Section-title tag. "h1" on the standalone /pricing page (its main
   *  heading); defaults to "h2" when embedded as a section on the home page,
   *  which already has its own page h1. */
  headingAs?: "h1" | "h2";
}

export function Pricing({ data, headingAs = "h2" }: PricingProps) {
  const Headline = headingAs === "h1" ? m.h1 : m.h2;
  // Default to annual — the higher-value cycle we already frame as "2 months
  // free". The card keeps the monthly-equivalent and annual total visible so
  // the default informs rather than tricks.
  const [billing, setBilling] = useState<BillingCycle>("annual");

  const currencies = getAvailableCurrencies(data);
  // Nigeria-first market — lead with Naira; fall back to whatever the API offers.
  const [currency, setCurrency] = useState<string>(
    currencies.includes("NGN") ? "NGN" : currencies[0],
  );

  // Contrast / anchoring: render plans in ascending price so the premium tier
  // (Enterprise) sits to the right of the featured plan and anchors it — the
  // standard, honest three-tier layout. Deterministic regardless of API order.
  const orderedPlans = (
    data.planOrder
      .map((key) => data.plans.find((p) => p.key === key))
      .filter(Boolean) as Plan[]
  ).sort((a, b) => {
    const pa = getPriceForCurrency(a, currency)?.monthly ?? Infinity;
    const pb = getPriceForCurrency(b, currency)?.monthly ?? Infinity;
    return pa - pb;
  });

  return (
    <section style={{ backgroundColor: "#f1f5f9", padding: "100px 40px", position: "relative", overflow: "hidden", isolation: "isolate" }}>
      <SectionBackdrop src={SECTION_BACKDROPS.pricing} scrim="light" />
      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Eyebrow */}
        <m.span
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={fadeUpTransition}
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            fontSize: "12px",
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color: "var(--color-gold-on-light)",
            display: "block",
            textAlign: "center",
            marginBottom: "16px",
          }}
        >
          PRICING
        </m.span>

        {/* Headline */}
        <Headline
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={staggerDelay(1)}
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 400,
            fontSize: "36px",
            color: "#0f172a",
            lineHeight: 1.3,
            margin: "0 auto 12px",
            textAlign: "center",
          }}
          className="lg:!text-[42px]"
        >
          Structured pricing for every stage of growth.
        </Headline>

        {/* Subheadline */}
        <m.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={staggerDelay(2)}
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 400,
            fontSize: "16px",
            color: "#64748b",
            lineHeight: 1.7,
            margin: "0 auto 32px",
            textAlign: "center",
            maxWidth: "500px",
          }}
        >
          Every plan starts with a 14-day trial &mdash; no card on file,
          nothing to cancel. Scale as your organisation grows. No hidden fees.
        </m.p>

        {/* Controls row */}
        <m.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={staggerDelay(3)}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "16px",
            marginBottom: "48px",
            flexWrap: "wrap",
          }}
        >
          {/* Billing toggle */}
          <div
            style={{
              display: "inline-flex",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              padding: "4px",
            }}
          >
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              style={{
                padding: "8px 20px",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: 500,
                fontFamily: "var(--font-sans)",
                cursor: "pointer",
                border: "none",
                transition: "all 150ms ease",
                backgroundColor:
                  billing === "monthly" ? "#0f172a" : "transparent",
                color: billing === "monthly" ? "#FFFFFF" : "#64748b",
              }}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBilling("annual")}
              style={{
                padding: "8px 20px",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: 500,
                fontFamily: "var(--font-sans)",
                cursor: "pointer",
                border: "none",
                transition: "all 150ms ease",
                backgroundColor:
                  billing === "annual" ? "var(--color-gold)" : "transparent",
                color: billing === "annual" ? "#0f172a" : "#64748b",
              }}
            >
              Annual · 2 months free
            </button>
          </div>

          {/* Currency toggle */}
          {currencies.length > 1 && (
            <div
              style={{
                display: "inline-flex",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "4px",
              }}
            >
              {currencies.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCurrency(c)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: 500,
                    fontFamily: "var(--font-sans)",
                    cursor: "pointer",
                    border: "none",
                    transition: "all 150ms ease",
                    backgroundColor:
                      currency === c ? "#0f172a" : "transparent",
                    color: currency === c ? "#FFFFFF" : "#64748b",
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </m.div>

        {/* Plan Cards */}
        <div
          style={{ display: "grid", gap: "20px" }}
          className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        >
          {/* Trial card — marketing-only, not a real plan */}
          <m.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(4)}
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "32px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "20px", color: "#0f172a", margin: "0 0 6px" }}>
              Try Avrentis
            </h3>
            <p style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: "14px", color: "#64748b", lineHeight: 1.5, margin: "0 0 20px" }}>
              The full Business tier, switched on for your own data the moment
              you verify — not a demo environment.
            </p>
            <div style={{ marginBottom: "6px" }}>
              <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "36px", color: "#0f172a" }}>$0</span>
              <span style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: "14px", color: "#64748b" }}>
                {" "}/ 14 days
              </span>
            </div>
            <p style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: "12px", color: "#64748b", margin: "0 0 20px", minHeight: "16px" }}>
              No credit card required
            </p>
            <div style={{ display: "inline-block", fontSize: "11px", fontWeight: 500, fontFamily: "var(--font-sans)", padding: "4px 10px", borderRadius: "4px", backgroundColor: "rgba(var(--color-gold-rgb), 0.08)", color: "var(--color-gold-on-light)", border: "1px solid rgba(var(--color-gold-rgb), 0.2)", marginBottom: "16px", alignSelf: "flex-start" }}>
              Payables + Procurement + Documents + Compliance
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", flex: 1 }}>
              {TRIAL_HIGHLIGHTS.map((feature) => (
                <li
                  key={feature}
                  style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: "13px", color: "#64748b", lineHeight: 1.5, marginBottom: "10px", display: "flex", alignItems: "flex-start", gap: "8px" }}
                >
                  <span style={{ color: "#27AE60", fontWeight: 600, flexShrink: 0 }}>✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href="/trial"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "44px", borderRadius: "9999px", fontSize: "14px", fontWeight: 600, fontFamily: "var(--font-sans)", textDecoration: "none", transition: "all 150ms ease", backgroundColor: "transparent", color: "#0f172a", border: "1px solid #e2e8f0" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0f172a"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; }}
            >
              Start your 14-day trial
            </Link>
            <p style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: "11px", color: "#64748b", lineHeight: 1.5, margin: "12px 0 0" }}>
              Exports carry an Avrentis Trial watermark until you upgrade. Data is preserved for 30 days after your trial ends.
            </p>
          </m.div>

          {orderedPlans.map((plan, i) => {
            const isFeatured = plan.key === FEATURED_PLAN;
            const priceData = getPriceForCurrency(plan, currency);
            const isEnterprise = plan.key === "enterprise";

            const displayAmount =
              billing === "annual" && priceData?.annualPerMonth != null
                ? priceData.annualPerMonth
                : priceData?.monthly ?? 0;

            // Honest contrast: on annual, show the real monthly struck through
            // and the genuine yearly saving — a true discount, not a fake anchor.
            const showStrike =
              !isEnterprise &&
              billing === "annual" &&
              priceData?.annualPerMonth != null &&
              priceData.monthly > priceData.annualPerMonth;
            const annualSaving =
              !isEnterprise && billing === "annual" && priceData?.annualTotal != null
                ? priceData.monthly * 12 - priceData.annualTotal
                : 0;

            const features = getHighlights(plan);
            // Ladder: every tier above the cheapest lists only its DELTAS,
            // under an "Everything in <next-cheaper tier>, plus —" lead-in.
            // Order-derived (orderedPlans is sorted ascending) so it never
            // hardcodes tier names.
            const inheritFrom = i > 0 ? orderedPlans[i - 1] : undefined;

            const moduleNames = plan.modules
              .map((m) => m.name.replace("Avrentis ", ""))
              .join(" + ");
            const moduleLabel =
              plan.modules.length >= PUBLIC_MODULE_COUNT
                ? `All ${PUBLIC_MODULE_COUNT} modules`
                : moduleNames;

            return (
              <m.div
                key={plan.key}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                transition={staggerDelay(i + 4)}
                style={{
                  backgroundColor: isFeatured ? "#0f172a" : "#FFFFFF",
                  border: isFeatured
                    ? "1px solid rgba(var(--color-gold-rgb), 0.3)"
                    : "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "32px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* MOST POPULAR badge */}
                {isFeatured && (
                  <span
                    style={{
                      display: "inline-block",
                      backgroundColor: "var(--color-gold)",
                      color: "#0f172a",
                      fontSize: "11px",
                      fontWeight: 600,
                      fontFamily: "var(--font-sans)",
                      textTransform: "uppercase",
                      padding: "6px 14px",
                      borderRadius: "4px",
                      marginBottom: "8px",
                      alignSelf: "flex-start",
                    }}
                  >
                    MOST POPULAR
                  </span>
                )}

                {/* Plan name */}
                <h3
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 600,
                    fontSize: "20px",
                    color: isFeatured ? "#FFFFFF" : "#0f172a",
                    margin: "0 0 6px",
                  }}
                >
                  {plan.name}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 400,
                    fontSize: "14px",
                    color: isFeatured ? "#94a3b8" : "#64748b",
                    lineHeight: 1.5,
                    margin: "0 0 20px",
                  }}
                >
                  {plan.description}
                </p>

                {/* Price */}
                <div style={{ marginBottom: "6px", display: "flex", alignItems: "baseline", gap: "8px", flexWrap: "wrap" }}>
                  {isEnterprise && (
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontWeight: 400,
                        fontSize: "16px",
                        color: "#64748b",
                      }}
                    >
                      From
                    </span>
                  )}
                  {showStrike && priceData && (
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontWeight: 500,
                        fontSize: "18px",
                        textDecoration: "line-through",
                        color: isFeatured ? "#94a3b8" : "#64748b",
                      }}
                    >
                      {formatCurrencyAmount(priceData.monthly, currency)}
                    </span>
                  )}
                  <span style={{ whiteSpace: "nowrap" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontWeight: 700,
                        fontSize: "34px",
                        color: isFeatured ? "#FFFFFF" : "#0f172a",
                      }}
                    >
                      {formatCurrencyAmount(displayAmount, currency)}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontWeight: 400,
                        fontSize: "14px",
                        color: isFeatured ? "#94a3b8" : "#64748b",
                      }}
                    >
                      /month
                    </span>
                  </span>
                </div>

                {/* Real yearly saving on annual — honest contrast */}
                {annualSaving > 0 && (
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 600,
                      fontSize: "12px",
                      color: isFeatured ? "var(--color-gold)" : "var(--color-gold-on-light)",
                      margin: "0 0 8px",
                    }}
                  >
                    Save {formatCurrencyAmount(annualSaving, currency)} a year
                  </p>
                )}

                {/* Billing note */}
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 400,
                    fontSize: "13px",
                    color: isFeatured ? "#cbd5e1" : "#64748b",
                    margin: "0 0 20px",
                    minHeight: "18px",
                    lineHeight: 1.5,
                  }}
                >
                  {isEnterprise ? (
                    "Custom pricing — tailored to your organisation"
                  ) : billing === "annual" ? (
                    priceData?.annualTotal != null ? (
                      <>
                        Monthly equivalent ·{" "}
                        <strong
                          style={{
                            fontWeight: 600,
                            color: isFeatured ? "#FFFFFF" : "#0f172a",
                          }}
                        >
                          {formatCurrencyAmount(priceData.annualTotal, currency)} billed
                          annually
                        </strong>
                      </>
                    ) : (
                      "Billed annually"
                    )
                  ) : (
                    "Cancel anytime"
                  )}
                </p>

                {/* Modules badge */}
                {moduleLabel && (
                  <div
                    style={{
                      display: "inline-block",
                      fontSize: "11px",
                      fontWeight: 500,
                      fontFamily: "var(--font-sans)",
                      padding: "4px 10px",
                      borderRadius: "4px",
                      backgroundColor: isFeatured
                        ? "rgba(var(--color-gold-rgb), 0.15)"
                        : "rgba(var(--color-gold-rgb), 0.08)",
                      color: isFeatured ? "var(--color-gold)" : "var(--color-gold-on-light)",
                      border: "1px solid rgba(var(--color-gold-rgb), 0.2)",
                      marginBottom: "16px",
                      alignSelf: "flex-start",
                    }}
                  >
                    {moduleLabel}
                  </div>
                )}

                {/* Features */}
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: "0 0 24px",
                    flex: 1,
                  }}
                >
                  {inheritFrom && (
                    <li
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontWeight: 600,
                        fontSize: "13px",
                        color: isFeatured ? "#FFFFFF" : "#0f172a",
                        marginBottom: "12px",
                      }}
                    >
                      Everything in {inheritFrom.name}, plus &mdash;
                    </li>
                  )}
                  {features.map((feature) => (
                    <li
                      key={feature}
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontWeight: 400,
                        fontSize: "13px",
                        color: isFeatured ? "#94a3b8" : "#64748b",
                        lineHeight: 1.5,
                        marginBottom: "10px",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "8px",
                      }}
                    >
                      <span
                        style={{
                          color: isFeatured ? "var(--color-gold)" : "#27AE60",
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={isEnterprise ? "/contact?intent=demo" : "/trial"}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "44px",
                    borderRadius: "9999px",
                    fontSize: "14px",
                    fontWeight: 600,
                    fontFamily: "var(--font-sans)",
                    textDecoration: "none",
                    transition: "all 150ms ease",
                    ...(isFeatured
                      ? {
                          backgroundColor: "var(--color-gold)",
                          color: "#0f172a",
                          border: "none",
                        }
                      : {
                          backgroundColor: "transparent",
                          color: "#0f172a",
                          border: "1px solid #e2e8f0",
                        }),
                  }}
                  onMouseEnter={(e) => {
                    if (isFeatured) {
                      e.currentTarget.style.backgroundColor = "var(--color-gold-hover)";
                    } else {
                      e.currentTarget.style.borderColor = "#0f172a";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isFeatured) {
                      e.currentTarget.style.backgroundColor = "var(--color-gold)";
                    } else {
                      e.currentTarget.style.borderColor = "#e2e8f0";
                    }
                  }}
                >
                  {isEnterprise ? "Talk to us" : "Start my trial"}
                </Link>
              </m.div>
            );
          })}
        </div>

        {/* Reassurance strip */}
        <m.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={staggerDelay(8)}
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 400,
            fontSize: "13px",
            color: "#64748b",
            textAlign: "center",
            marginTop: "40px",
          }}
        >
          All plans include: Multi-level approvals &middot; Enterprise-grade
          security &middot; Data protection compliant
        </m.p>

        <m.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={staggerDelay(9)}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
            textAlign: "center",
            marginTop: "12px",
          }}
        >
          <Link
            href="/tools/savings"
            style={{
              color: "var(--color-gold-on-light)",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Not sure yet? Estimate what you&rsquo;d save &rarr;
          </Link>
        </m.p>
      </div>
    </section>
  );
}
