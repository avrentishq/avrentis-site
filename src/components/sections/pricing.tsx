"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";
import Link from "next/link";
import type {
  PricingData,
  Plan,
  PricingCurrency,
} from "@/lib/pricing";
import { formatCurrencyAmount } from "@/lib/pricing";

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
  if (!first) return ["USD"];
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
const TRIAL_HIGHLIGHTS: string[] = [
  "Full Business tier for 14 days",
  "Up to 10 users",
  "Payables + Procurement + Documents + Compliance (real data)",
  "Bank-ready PDF exports (trial watermark)",
  "1 GB storage during trial",
  "30-day read-only grace after trial",
];

/* ── Component ───────────────────────────────────────────────── */

interface PricingProps {
  data: PricingData;
}

export function Pricing({ data }: PricingProps) {
  const [billing, setBilling] = useState<BillingCycle>("monthly");

  const currencies = getAvailableCurrencies(data);
  const [currency, setCurrency] = useState<string>(
    currencies.includes("USD") ? "USD" : currencies[0],
  );

  const orderedPlans = data.planOrder
    .map((key) => data.plans.find((p) => p.key === key))
    .filter(Boolean) as Plan[];

  return (
    <section style={{ backgroundColor: "#f1f5f9", padding: "100px 40px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Eyebrow */}
        <motion.span
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
            color: "var(--color-gold)",
            display: "block",
            textAlign: "center",
            marginBottom: "16px",
          }}
        >
          PRICING
        </motion.span>

        {/* Headline */}
        <motion.h2
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
        </motion.h2>

        {/* Subheadline */}
        <motion.p
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
          Every plan starts with a 14-day trial &mdash; no credit card
          required. Scale as your organisation grows. No hidden fees.
        </motion.p>

        {/* Controls row */}
        <motion.div
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
              Annual (Save 15%)
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
        </motion.div>

        {/* Plan Cards */}
        <div
          style={{ display: "grid", gap: "20px" }}
          className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        >
          {/* Trial card — marketing-only, not a real plan */}
          <motion.div
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
              Evaluate the full Business tier on your own data for 14 days.
            </p>
            <div style={{ marginBottom: "6px" }}>
              <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "36px", color: "#0f172a" }}>$0</span>
              <span style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: "14px", color: "#64748b" }}>
                {" "}/ 14 days
              </span>
            </div>
            <p style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: "12px", color: "#94a3b8", margin: "0 0 20px", minHeight: "16px" }}>
              No credit card required
            </p>
            <div style={{ display: "inline-block", fontSize: "11px", fontWeight: 500, fontFamily: "var(--font-sans)", padding: "4px 10px", borderRadius: "4px", backgroundColor: "rgba(var(--color-gold-rgb), 0.08)", color: "var(--color-gold)", border: "1px solid rgba(var(--color-gold-rgb), 0.2)", marginBottom: "16px", alignSelf: "flex-start" }}>
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
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "44px", borderRadius: "8px", fontSize: "14px", fontWeight: 600, fontFamily: "var(--font-sans)", textDecoration: "none", transition: "all 150ms ease", backgroundColor: "transparent", color: "#0f172a", border: "1px solid #e2e8f0" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0f172a"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; }}
            >
              Start your 14-day trial
            </Link>
            <p style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: "11px", color: "#94a3b8", lineHeight: 1.5, margin: "12px 0 0" }}>
              Exports carry an Avrentis Trial watermark until you upgrade. Data is preserved for 30 days after your trial ends.
            </p>
          </motion.div>

          {orderedPlans.map((plan, i) => {
            const isFeatured = plan.key === FEATURED_PLAN;
            const priceData = getPriceForCurrency(plan, currency);
            const isEnterprise = plan.key === "enterprise";

            const displayAmount =
              billing === "annual" && priceData?.annualPerMonth != null
                ? priceData.annualPerMonth
                : priceData?.monthly ?? 0;

            const features = getHighlights(plan);

            const moduleNames = plan.modules
              .map((m) => m.name.replace("Avrentis ", ""))
              .join(" + ");
            const moduleLabel =
              plan.modules.length >= 6 ? "All 6 modules" : moduleNames;

            return (
              <motion.div
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
                    color: "#64748b",
                    lineHeight: 1.5,
                    margin: "0 0 20px",
                  }}
                >
                  {plan.description}
                </p>

                {/* Price */}
                <div style={{ marginBottom: "6px" }}>
                  {isEnterprise && (
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontWeight: 400,
                        fontSize: "16px",
                        color: "#64748b",
                      }}
                    >
                      From{" "}
                    </span>
                  )}
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 700,
                      fontSize: "36px",
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
                      color: "#64748b",
                    }}
                  >
                    /month
                  </span>
                </div>

                {/* Billing note */}
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 400,
                    fontSize: "12px",
                    color: "#94a3b8",
                    margin: "0 0 20px",
                    minHeight: "16px",
                  }}
                >
                  {billing === "annual" ? "Billed annually" : "Cancel anytime"}
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
                      color: "var(--color-gold)",
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
                  {features.map((feature) => (
                    <li
                      key={feature}
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontWeight: 400,
                        fontSize: "13px",
                        color: "#64748b",
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
                    borderRadius: "8px",
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
                  {isEnterprise ? "Contact us" : "Get started"}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Reassurance strip */}
        <motion.p
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
          All plans include: Multi-level approvals &middot; 99.9% uptime
          &middot; Enterprise-grade security &middot; Data protection compliant
        </motion.p>
      </div>
    </section>
  );
}
