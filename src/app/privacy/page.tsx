import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { AvrentisMark } from "@/components/ui/logo";

export default function PrivacyPage() {
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
          gap: "16px",
        }}
      >
        <AvrentisMark size={48} variant="transparent-navy" />
        <h1
          style={{
            fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
            fontWeight: 400,
            fontSize: "32px",
            color: "#0f172a",
            margin: 0,
          }}
        >
          Privacy
        </h1>
        <p
          style={{
            fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
            fontWeight: 400,
            fontSize: "16px",
            color: "#475569",
            margin: 0,
            textAlign: "center",
          }}
        >
          This page is on its way. In the meantime, request access to AVRENTIS.
        </p>
        <div style={{ marginTop: "8px" }}>
          <Button variant="navy" href="/contact">
            Request access
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
