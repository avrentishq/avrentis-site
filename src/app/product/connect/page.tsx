import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function ProductConnectPage() {
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
          AVRENTIS CONNECT
        </span>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            fontSize: "10px",
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color: "#64748b",
            backgroundColor: "rgba(100,116,139,0.1)",
            border: "1px solid rgba(100,116,139,0.2)",
            borderRadius: "4px",
            padding: "4px 10px",
          }}
        >
          ON THE ROADMAP
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
          Connected to how your organisation already works.
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
          Avrentis — connected to your banking, ERP, and financial systems. Your
          structured operational data, flowing where it needs to go.
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
            color: "#64748b",
            border: "1px solid rgba(100,116,139,0.4)",
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
          GET NOTIFIED
        </a>
      </main>
      <Footer />
    </>
  );
}
