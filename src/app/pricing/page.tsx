import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main
        style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "96px 24px",
          gap: "12px",
        }}
      >
        <h1
          style={{
            fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
            fontWeight: 400,
            fontSize: "36px",
            color: "#0f172a",
            margin: 0,
          }}
        >
          Pricing
        </h1>
        <p
          style={{
            fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
            fontWeight: 400,
            fontSize: "16px",
            color: "#64748b",
            margin: 0,
          }}
        >
          This page is being built.
        </p>
      </main>
      <Footer />
    </>
  );
}
