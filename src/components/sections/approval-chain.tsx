"use client";

import { motion } from "framer-motion";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/animations";
import { RoleBadge } from "@/components/ui/role-badge";

const PV_CHAIN = [
  { stage: "STAGE 01", role: "staff" as const, title: "Raises the voucher", body: "Staff creates the Payment Voucher with vendor, amount, and purpose." },
  { stage: "STAGE 02", role: "finance" as const, title: "Reviews & approves", body: "Finance checks budget position and vendor standing before escalation.", active: true },
  { stage: "STAGE 03", role: "md" as const, title: "Gives final sanction", body: "The MD gives final authority. The record is sealed permanently." },
];

const PO_CHAIN = [
  { stage: "STAGE 01", role: "staff" as const, title: "Raises the order", body: "Staff creates the Purchase Order with vendor, items, and justification." },
  { stage: "STAGE 02", role: "hod" as const, title: "Reviews & approves", body: "Head of Department confirms legitimacy before the decision advances.", active: true },
  { stage: "STAGE 03", role: "md" as const, title: "Gives final sanction", body: "The MD gives final authority. The record is sealed permanently." },
];

type ChainNode = (typeof PV_CHAIN)[number] | (typeof PO_CHAIN)[number];

function ChainCard({ node, index, baseDelay }: { node: ChainNode; index: number; baseDelay: number }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      transition={staggerDelay(baseDelay + index)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        background: "#1e293b",
        border: node.active ? "0.5px solid rgba(198,139,47,0.4)" : "0.5px solid rgba(198,139,47,0.15)",
        borderRadius: "8px",
        padding: "20px 16px",
      }}
    >
      <span style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "9px", letterSpacing: "0.10em", textTransform: "uppercase", color: "#475569", marginBottom: "4px" }}>
        {node.stage}
      </span>
      <RoleBadge role={node.role} />
      <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "13px", color: "#ffffff", margin: "4px 0 2px" }}>{node.title}</h3>
      <p style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: "11px", color: "#64748b", lineHeight: 1.5, margin: 0 }}>{node.body}</p>
    </motion.div>
  );
}

export function ApprovalChain() {
  return (
    <section id="the-structure" style={{ backgroundColor: "#0f172a", padding: "120px 40px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <motion.span
          variants={fadeUp} initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: "-40px" }} transition={fadeUpTransition}
          style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "10px", letterSpacing: "0.10em", textTransform: "uppercase", color: "#C68B2F", display: "block", marginBottom: "16px" }}
        >
          THE STRUCTURE
        </motion.span>

        <motion.h2
          variants={fadeUp} initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: "-40px" }} transition={staggerDelay(1)}
          style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: "22px", color: "#ffffff", lineHeight: 1.3, margin: "0 0 12px", maxWidth: "480px" }}
        >
          Two document types. Two defined authority chains.
        </motion.h2>

        <motion.p
          variants={fadeUp} initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: "-40px" }} transition={staggerDelay(2)}
          style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: "14px", color: "#94a3b8", lineHeight: 1.7, margin: "0 0 48px", maxWidth: "520px" }}
        >
          Payment Vouchers follow one chain. Purchase Orders follow another. Each chain is role-enforced and permanently on record. Authority at every stage.
        </motion.p>

        {/* Two parallel chains */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "40px" }} className="lg:grid-cols-2">
          {/* Payment Voucher chain */}
          <div>
            <motion.h3
              variants={fadeUp} initial="hidden" whileInView="visible"
              viewport={{ once: true, margin: "-40px" }} transition={staggerDelay(3)}
              style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#C68B2F", marginBottom: "16px" }}
            >
              Payment Voucher Chain
            </motion.h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }} className="sm:grid-cols-3">
              {PV_CHAIN.map((node, i) => (
                <ChainCard key={node.stage} node={node} index={i} baseDelay={4} />
              ))}
            </div>
          </div>

          {/* Purchase Order chain */}
          <div>
            <motion.h3
              variants={fadeUp} initial="hidden" whileInView="visible"
              viewport={{ once: true, margin: "-40px" }} transition={staggerDelay(3)}
              style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#C68B2F", marginBottom: "16px" }}
            >
              Purchase Order Chain
            </motion.h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }} className="sm:grid-cols-3">
              {PO_CHAIN.map((node, i) => (
                <ChainCard key={node.stage} node={node} index={i} baseDelay={7} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
