"use client";

import { motion } from "framer-motion";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";

const slideInFromRight = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
};

export function Hero() {
  return (
    <section
      style={{
        backgroundColor: "#0f172a",
        padding: "140px 40px 120px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle grid texture overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.05,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gap: "48px",
          alignItems: "center",
          position: "relative",
        }}
        className="grid-cols-1 lg:grid-cols-2"
      >
        {/* Left — Copy */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <motion.span
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={fadeUpTransition}
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: "13px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#C68B2F",
              marginBottom: "20px",
            }}
          >
            OPERATIONAL AUTHORITY PLATFORM
          </motion.span>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(1)}
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              fontSize: "36px",
              color: "#FFFFFF",
              lineHeight: 1.15,
              margin: "0 0 24px",
            }}
            className="lg:!text-[56px]"
          >
            Every organisation runs on decisions.
            <br />
            Avrentis makes sure they stick.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(2)}
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              fontSize: "18px",
              color: "#64748b",
              lineHeight: 1.7,
              margin: "0 0 36px",
              maxWidth: "520px",
            }}
          >
            Replace scattered emails, paper trails, and manual processes with a
            single platform that brings structure, authority, and permanent
            record to every operation — regardless of your industry, size, or
            location.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(3)}
            style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}
          >
            <a
              href="/contact"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "16px",
                lineHeight: 1,
                backgroundColor: "#C68B2F",
                color: "#0f172a",
                border: "none",
                borderRadius: "6px",
                height: "48px",
                padding: "0 28px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                cursor: "pointer",
                transition: "background-color 150ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#A87425";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#C68B2F";
              }}
            >
              Start for free
            </a>
            <a
              href="#how-it-works"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
                fontSize: "16px",
                lineHeight: 1,
                backgroundColor: "transparent",
                color: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "6px",
                height: "48px",
                padding: "0 28px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                cursor: "pointer",
                transition: "border-color 150ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
              }}
            >
              See how it works &rarr;
            </a>
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={staggerDelay(4)}
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              fontSize: "13px",
              color: "#475569",
              marginTop: "24px",
              lineHeight: 1.5,
            }}
          >
            No credit card required &middot; Setup in minutes &middot; Used by
            organisations across multiple industries worldwide
          </motion.p>
        </div>

        {/* Right — Phone mockup with approval notification */}
        <motion.div
          variants={slideInFromRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={staggerDelay(4)}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Phone frame */}
          <div
            style={{
              width: "320px",
              borderRadius: "36px",
              border: "2px solid rgba(255,255,255,0.12)",
              background:
                "linear-gradient(145deg, #1e293b 0%, #0f172a 50%, #020617 100%)",
              padding: "16px",
              boxShadow:
                "0 0 60px rgba(198,139,47,0.08), 0 25px 50px rgba(0,0,0,0.4)",
              position: "relative",
            }}
          >
            {/* Notch */}
            <div
              style={{
                width: "120px",
                height: "28px",
                backgroundColor: "#0f172a",
                borderRadius: "0 0 16px 16px",
                margin: "0 auto 12px",
                border: "1px solid rgba(255,255,255,0.06)",
                borderTop: "none",
              }}
            />

            {/* Phone inner screen */}
            <div
              style={{
                backgroundColor: "#020617",
                borderRadius: "20px",
                overflow: "hidden",
              }}
            >
              {/* Avrentis header bar */}
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 700,
                    fontSize: "15px",
                    color: "#FFFFFF",
                    letterSpacing: "0.02em",
                  }}
                >
                  Avrentis
                </span>
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#C68B2F",
                    boxShadow: "0 0 6px rgba(198,139,47,0.5)",
                  }}
                />
              </div>

              {/* Pending Approval label */}
              <div style={{ padding: "16px 20px 8px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 600,
                    fontSize: "11px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#C68B2F",
                    backgroundColor: "rgba(198,139,47,0.1)",
                    padding: "5px 10px",
                    borderRadius: "4px",
                  }}
                >
                  Pending Approval
                </span>
              </div>

              {/* Payment voucher card */}
              <div style={{ padding: "12px 20px 20px" }}>
                <div
                  style={{
                    backgroundColor: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    padding: "20px",
                  }}
                >
                  {/* Document type */}
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 500,
                      fontSize: "11px",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "#64748b",
                      display: "block",
                      marginBottom: "12px",
                    }}
                  >
                    Payment Voucher
                  </span>

                  {/* Vendor name */}
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 600,
                      fontSize: "16px",
                      color: "#FFFFFF",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Brightpath Technologies
                  </span>

                  {/* Amount */}
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 700,
                      fontSize: "24px",
                      color: "#FFFFFF",
                      display: "block",
                      marginBottom: "14px",
                    }}
                  >
                    &#x20A6;850,000
                  </span>

                  {/* Details */}
                  <div
                    style={{
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                      paddingTop: "14px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "12px",
                          color: "#475569",
                        }}
                      >
                        Purpose
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "12px",
                          color: "#64748b",
                          fontWeight: 500,
                        }}
                      >
                        Diesel supply — November
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "12px",
                          color: "#475569",
                        }}
                      >
                        Submitted by
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "12px",
                          color: "#64748b",
                          fontWeight: 500,
                        }}
                      >
                        Fatima Abubakar, Finance
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                    marginTop: "16px",
                  }}
                >
                  <button
                    type="button"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 600,
                      fontSize: "13px",
                      backgroundColor: "rgba(52,199,89,0.15)",
                      color: "#34C759",
                      border: "1px solid rgba(52,199,89,0.3)",
                      borderRadius: "8px",
                      height: "42px",
                      cursor: "default",
                      letterSpacing: "0.02em",
                    }}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 600,
                      fontSize: "13px",
                      backgroundColor: "transparent",
                      color: "#FF3B30",
                      border: "1px solid rgba(255,59,48,0.3)",
                      borderRadius: "8px",
                      height: "42px",
                      cursor: "default",
                      letterSpacing: "0.02em",
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>

            {/* Home indicator */}
            <div
              style={{
                width: "100px",
                height: "4px",
                backgroundColor: "rgba(255,255,255,0.15)",
                borderRadius: "2px",
                margin: "12px auto 4px",
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
