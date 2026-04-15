"use client";

import { motion } from "framer-motion";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";

const SECONDARY_TESTIMONIALS = [
  {
    quote:
      "\u201CWe replaced an entire cabinet of physical files with a searchable digital archive. Compliance preparation that used to take weeks now takes hours.\u201D",
    attribution: "\u2014 Administrative Manager, Engineering Firm",
  },
  {
    quote:
      "\u201CDecision makers in our organisation can now approve from anywhere. That single change removed our biggest operational bottleneck.\u201D",
    attribution: "\u2014 Finance Officer, Professional Services",
  },
];

const STATS = [
  { value: "87%", label: "reduction in approval time" },
  { value: "100%", label: "paperless approval process" },
  { value: "3 minutes", label: "average approval time" },
  { value: "Zero", label: "lost documents since deployment" },
];

export function SocialProof() {
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
          TRUSTED BY ORGANISATIONS WORLDWIDE
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
          Organisations that chose structure over chaos.
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
            margin: "0 auto 40px",
            maxWidth: "600px",
            textAlign: "center",
          }}
        >
          From energy operators to professional services firms — Avrentis brings
          the same operational authority to every organisation that needs it.
        </motion.p>

        {/* Primary Testimonial */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={staggerDelay(3)}
          style={{
            backgroundColor: "#FFFFFF",
            borderLeft: "4px solid #F5A623",
            borderRadius: "8px",
            padding: "32px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            maxWidth: "800px",
            margin: "0 auto 32px",
          }}
        >
          <span
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "48px",
              color: "#F5A623",
              lineHeight: 1,
              display: "block",
              marginBottom: "8px",
            }}
            aria-hidden="true"
          >
            &ldquo;
          </span>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              fontStyle: "italic",
              fontSize: "18px",
              color: "#0A2540",
              lineHeight: 1.7,
              margin: "0 0 20px",
            }}
          >
            &ldquo;Before Avrentis, every approval meant emails, printing,
            physical signatures, and manual filing. The whole process could take
            days. Now approvals happen in minutes from any device. The process
            has fundamentally changed how fast our organisation moves.&rdquo;
          </p>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              fontSize: "14px",
              color: "#0A2540",
              margin: 0,
            }}
          >
            &mdash; Operations Director,{" "}
            <span style={{ fontWeight: 400, color: "#8492A6" }}>
              Energy Sector
            </span>
          </p>
        </motion.div>

        {/* Secondary Testimonials */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "20px",
            marginBottom: "40px",
          }}
          className="md:grid-cols-2"
        >
          {SECONDARY_TESTIMONIALS.map((testimonial, i) => (
            <motion.div
              key={testimonial.attribution}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              transition={staggerDelay(i + 4)}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "8px",
                padding: "24px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <span
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "32px",
                  color: "#F5A623",
                  lineHeight: 1,
                  display: "block",
                  marginBottom: "8px",
                }}
                aria-hidden="true"
              >
                &ldquo;
              </span>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 400,
                  fontStyle: "italic",
                  fontSize: "15px",
                  color: "#0A2540",
                  lineHeight: 1.6,
                  margin: "0 0 16px",
                }}
              >
                {testimonial.quote}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 700,
                  fontSize: "13px",
                  color: "#0A2540",
                  margin: 0,
                }}
              >
                {testimonial.attribution.split(",")[0]},{" "}
                <span style={{ fontWeight: 400, color: "#8492A6" }}>
                  {testimonial.attribution.split(",").slice(1).join(",").trim()}
                </span>
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats Bar */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={staggerDelay(6)}
          style={{
            backgroundColor: "#0A2540",
            borderRadius: "10px",
            padding: "32px",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "24px",
          }}
          className="md:!grid-cols-4"
        >
          {STATS.map((stat) => (
            <div
              key={stat.label}
              style={{ textAlign: "center" }}
            >
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 700,
                  fontSize: "28px",
                  color: "#FFFFFF",
                  margin: "0 0 4px",
                }}
              >
                {stat.value}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 400,
                  fontSize: "13px",
                  color: "#8492A6",
                  margin: 0,
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
