"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Check, Zap, Globe } from "lucide-react";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";

const trustSignals = [
  { icon: Lock, label: "Nigerian data residency" },
  { icon: Check, label: "NDPR compliant" },
  { icon: Zap, label: "99.9% uptime SLA" },
  { icon: Globe, label: "Built for West Africa" },
];

export function CtaBanner() {
  return (
    <section
      style={{
        backgroundColor: "#0A2540",
        padding: "120px 40px",
        textAlign: "center",
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }}
    >
      <div
        style={{
          maxWidth: "640px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Headline */}
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={fadeUpTransition}
          className="lg:!text-[42px]"
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            fontSize: "36px",
            color: "#FFFFFF",
            lineHeight: 1.2,
            margin: "0 0 16px",
          }}
        >
          Your organisation&rsquo;s decisions deserve better than an email
          thread.
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={staggerDelay(1)}
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 400,
            fontSize: "16px",
            color: "#8492A6",
            lineHeight: 1.7,
            margin: "0 0 32px",
          }}
        >
          Join the organisations across West Africa that have replaced paper,
          email, and assumption with structure, authority, and permanent record.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={staggerDelay(2)}
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Link
            href="/contact"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: "16px",
              backgroundColor: "#F5A623",
              color: "#0A2540",
              border: "none",
              borderRadius: "6px",
              height: "52px",
              padding: "0 32px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              cursor: "pointer",
              transition: "background-color 150ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#D4891E";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#F5A623";
            }}
          >
            Start for free — no credit card required
          </Link>
          <Link
            href="/contact"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              fontSize: "16px",
              backgroundColor: "transparent",
              color: "#ffffff",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "6px",
              height: "48px",
              padding: "0 32px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              cursor: "pointer",
              transition: "border-color 150ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            }}
          >
            Book a personalised demo &rarr;
          </Link>
        </motion.div>

        {/* Micro copy */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={staggerDelay(3)}
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 400,
            fontSize: "13px",
            color: "#5A6B7F",
            marginTop: "20px",
          }}
        >
          Setup takes less than 10 minutes. Your first approval can happen
          today.
        </motion.p>

        {/* Trust signals */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={staggerDelay(4)}
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
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                color: "#8492A6",
              }}
            >
              <Icon size={14} color="#F5A623" strokeWidth={2} />
              {label}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
