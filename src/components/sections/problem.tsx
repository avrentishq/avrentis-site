"use client";

import { motion } from "framer-motion";
import { MessageSquare, Mail, Phone } from "lucide-react";
import { fadeUp, stagger } from "@/lib/animations";

const PAIN_POINTS = [
  {
    icon: MessageSquare,
    title: "WhatsApp approvals",
    description:
      'Payment vouchers forwarded through group chats. "Approved" typed as a reply with no timestamp, no attribution, no trail.',
  },
  {
    icon: Mail,
    title: "Email chains",
    description:
      "Documents buried in inboxes. Who approved what, and when? Nobody knows until the auditor asks.",
  },
  {
    icon: Phone,
    title: "Verbal sign-offs",
    description:
      '"The MD said yes on the call." No record. No proof. No way to verify when the question comes six months later.',
  },
];

export function Problem() {
  return (
    <section style={{ backgroundColor: "#ffffff", padding: "96px 24px" }}>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "48px",
        }}
      >
        <div style={{ maxWidth: "600px" }}>
          <motion.h2
            {...fadeUp}
            style={{
              fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
              fontWeight: 400,
              fontSize: "36px",
              color: "#0f172a",
              lineHeight: 1.2,
              margin: "0 0 12px",
            }}
          >
            How financial approvals work today
          </motion.h2>
          <motion.p
            {...stagger(1)}
            style={{
              fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
              fontWeight: 400,
              fontSize: "16px",
              color: "#64748b",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            No structure. No record. No control.
          </motion.p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "32px",
          }}
        >
          {PAIN_POINTS.map((point, i) => (
            <motion.div
              key={point.title}
              {...stagger(i + 2)}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  backgroundColor: "#fef2f2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <point.icon size={20} color="#ef4444" strokeWidth={1.5} />
              </div>
              <h3
                style={{
                  fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                  fontWeight: 500,
                  fontSize: "18px",
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                {point.title}
              </h3>
              <p
                style={{
                  fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                  fontWeight: 400,
                  fontSize: "15px",
                  color: "#64748b",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {point.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
