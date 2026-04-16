import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function ProductAuditPage() {
  return (
    <>
      <Navbar />
      <main
        style={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "96px 24px",
          gap: "20px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            fontSize: "11px",
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color: "#C68B2F",
          }}
        >
          AVRENTIS AUDIT
        </span>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            fontSize: "10px",
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color: "#C68B2F",
            backgroundColor: "rgba(198,139,47,0.1)",
            border: "1px solid rgba(198,139,47,0.2)",
            borderRadius: "4px",
            padding: "4px 10px",
          }}
        >
          COMING SOON
        </span>
        <h1
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 400,
            fontSize: "36px",
            color: "#0f172a",
            margin: 0,
            textAlign: "center",
            maxWidth: "600px",
          }}
        >
          Audit-ready. Always.
        </h1>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 400,
            fontSize: "16px",
            color: "#64748b",
            margin: 0,
            textAlign: "center",
            maxWidth: "480px",
            lineHeight: 1.7,
          }}
        >
          A complete, tamper-proof log of every action across your organisation.
          When auditors arrive — you are ready.
        </p>
        <a
          href="/contact"
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 500,
            fontSize: "11px",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            lineHeight: 1,
            backgroundColor: "transparent",
            color: "#C68B2F",
            border: "1px solid #C68B2F",
            borderRadius: "3px",
            height: "36px",
            padding: "0 20px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            marginTop: "8px",
          }}
        >
          JOIN THE WAITLIST
        </a>
      </main>
      <Footer />
    </>
  );
}
