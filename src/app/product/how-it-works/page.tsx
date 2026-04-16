import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function HowItWorksPage() {
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
          HOW IT WORKS
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
          See exactly how Avrentis works.
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
          From raising a request to final approval to permanent record —
          understand the complete Avrentis workflow in three steps.
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
            backgroundColor: "#C68B2F",
            color: "#0f172a",
            border: "none",
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
          START FOR FREE
        </a>
      </main>
      <Footer />
    </>
  );
}
