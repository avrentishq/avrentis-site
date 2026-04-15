"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";
import Link from "next/link";

type BillingCycle = "monthly" | "annual";

interface Plan {
  name: string;
  description: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  cta: string;
  features: string[];
  featured?: boolean;
}

const PLANS: Plan[] = [
  {
    name: "Free",
    description: "For organisations exploring structured approvals",
    monthlyPrice: 0,
    annualPrice: 0,
    cta: "Start today",
    features: [
      "Up to 5 users",
      "10 documents/month",
      "Basic approval chain",
      "Email notifications",
    ],
  },
  {
    name: "Starter",
    description: "For small teams ready to go paperless",
    monthlyPrice: 100000,
    annualPrice: 85000,
    cta: "Get started",
    features: [
      "Up to 15 users",
      "Unlimited documents",
      "Full approval chain",
      "WhatsApp & email notifications",
      "Document PDF generation",
    ],
  },
  {
    name: "Business",
    description:
      "For growing organisations that need full operational structure",
    monthlyPrice: 250000,
    annualPrice: 212500,
    cta: "Get started",
    featured: true,
    features: [
      "Up to 50 users",
      "Unlimited documents",
      "Full approval chain",
      "All notification channels",
      "Document PDF generation",
      "Audit trail & compliance",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    description:
      "For large organisations with complex operational requirements",
    monthlyPrice: null,
    annualPrice: null,
    cta: "Contact us",
    features: [
      "Unlimited users",
      "Unlimited documents",
      "Custom workflows",
      "Full API access",
      "Dedicated support",
      "Custom integrations",
      "SLA guarantee",
    ],
  },
];

function formatPrice(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}

export function Pricing() {
  const [billing, setBilling] = useState<BillingCycle>("monthly");

  return (
    <section style={{ backgroundColor: "#F7F9FC", padding: "100px 40px" }}>
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
            color: "#F5A623",
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
            color: "#0A2540",
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
            color: "#8492A6",
            lineHeight: 1.7,
            margin: "0 auto 32px",
            textAlign: "center",
            maxWidth: "500px",
          }}
        >
          Start free. Scale as your organisation grows. No hidden fees. No
          surprises.
        </motion.p>

        {/* Toggle */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={staggerDelay(3)}
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "48px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              border: "1px solid #E8ECF0",
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
                  billing === "monthly" ? "#0A2540" : "transparent",
                color: billing === "monthly" ? "#FFFFFF" : "#8492A6",
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
                  billing === "annual" ? "#F5A623" : "transparent",
                color: billing === "annual" ? "#0A2540" : "#8492A6",
              }}
            >
              Annual (Save 15%)
            </button>
          </div>
        </motion.div>

        {/* Plan Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "20px",
          }}
          className="md:grid-cols-2 lg:grid-cols-4"
        >
          {PLANS.map((plan, i) => {
            const isFeatured = plan.featured === true;
            const isEnterprise = plan.monthlyPrice === null;
            const price =
              billing === "annual" ? plan.annualPrice : plan.monthlyPrice;

            return (
              <motion.div
                key={plan.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                transition={staggerDelay(i + 4)}
                style={{
                  backgroundColor: isFeatured ? "#0A2540" : "#FFFFFF",
                  border: isFeatured
                    ? "1px solid rgba(245,166,35,0.3)"
                    : "1px solid #E8ECF0",
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
                      backgroundColor: "#F5A623",
                      color: "#0A2540",
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
                    color: isFeatured ? "#FFFFFF" : "#0A2540",
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
                    color: "#8492A6",
                    lineHeight: 1.5,
                    margin: "0 0 20px",
                  }}
                >
                  {plan.description}
                </p>

                {/* Price */}
                <div style={{ marginBottom: "24px" }}>
                  {isEnterprise ? (
                    <>
                      <span
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontWeight: 700,
                          fontSize: "36px",
                          color: isFeatured ? "#FFFFFF" : "#0A2540",
                        }}
                      >
                        Custom
                      </span>
                      <span
                        style={{
                          display: "block",
                          fontFamily: "var(--font-sans)",
                          fontWeight: 400,
                          fontSize: "14px",
                          color: "#8492A6",
                          marginTop: "4px",
                        }}
                      >
                        Contact for pricing
                      </span>
                    </>
                  ) : (
                    <>
                      <span
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontWeight: 700,
                          fontSize: "36px",
                          color: isFeatured ? "#FFFFFF" : "#0A2540",
                        }}
                      >
                        {formatPrice(price as number)}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontWeight: 400,
                          fontSize: "14px",
                          color: "#8492A6",
                        }}
                      >
                        /month
                      </span>
                    </>
                  )}
                </div>

                {/* Features */}
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: "0 0 24px",
                    flex: 1,
                  }}
                >
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontWeight: 400,
                        fontSize: "13px",
                        color: "#8492A6",
                        lineHeight: 1.5,
                        marginBottom: "10px",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "8px",
                      }}
                    >
                      <span
                        style={{
                          color: isFeatured ? "#F5A623" : "#27AE60",
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
                  href="/contact"
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
                          backgroundColor: "#F5A623",
                          color: "#0A2540",
                          border: "none",
                        }
                      : {
                          backgroundColor: "transparent",
                          color: "#0A2540",
                          border: "1px solid #E8ECF0",
                        }),
                  }}
                  onMouseEnter={(e) => {
                    if (isFeatured) {
                      e.currentTarget.style.backgroundColor = "#D4891E";
                    } else {
                      e.currentTarget.style.borderColor = "#0A2540";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isFeatured) {
                      e.currentTarget.style.backgroundColor = "#F5A623";
                    } else {
                      e.currentTarget.style.borderColor = "#E8ECF0";
                    }
                  }}
                >
                  {plan.cta}
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
            color: "#8492A6",
            textAlign: "center",
            marginTop: "40px",
          }}
        >
          All plans include: 99.9% uptime &middot; Nigerian data residency
          &middot; NDPR compliant &middot; Cancel anytime
        </motion.p>
      </div>
    </section>
  );
}
