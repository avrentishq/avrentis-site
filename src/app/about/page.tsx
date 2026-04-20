import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const VALUES = [
  {
    title: "Structure over speed",
    body: "We never ship fast at the cost of correctness. The organisations that trust us are making decisions that move money. Every feature must be reliable.",
  },
  {
    title: "Authority by design",
    body: "We build software that enforces authority — not assumes it. Every permission, every workflow, every record is intentional.",
  },
  {
    title: "Transparency always",
    body: "We communicate directly with our users, our team, and our stakeholders. No ambiguity. No hidden terms.",
  },
  {
    title: "Built for Africa, built for the world",
    body: "We started in Africa because that is where we saw the problem most clearly. We build for every organisation that faces it.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ── Hero ── */}
        <section
          style={{
            backgroundColor: "#0f172a",
            padding: "120px 40px 80px",
          }}
        >
          <div
            style={{
              maxWidth: 800,
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: "#C68B2F",
                fontSize: 12,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                margin: "0 0 16px",
              }}
            >
              ABOUT AVRENTIS
            </p>
            <h1
              style={{
                color: "#ffffff",
                fontSize: 36,
                fontWeight: 400,
                margin: "0 0 16px",
                lineHeight: 1.3,
              }}
            >
              We believe every organisation deserves operational structure.
            </h1>
            <p
              style={{
                color: "#64748b",
                fontSize: 18,
                fontWeight: 400,
                margin: 0,
              }}
            >
              Regardless of industry, size, or geography.
            </p>
          </div>
        </section>

        {/* ── Mission & Story ── */}
        <section
          style={{
            backgroundColor: "#ffffff",
            padding: "80px 40px",
          }}
        >
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <p
              style={{
                color: "#475569",
                fontSize: 16,
                fontWeight: 400,
                lineHeight: 1.8,
                margin: "0 0 24px",
              }}
            >
              Avrentis was built after watching capable organisations operate
              below their potential — not because of a lack of talent or
              ambition, but because their internal processes had no structure.
              Decisions were made over email. Approvals were lost in inboxes.
              Authority was assumed, not enforced.
            </p>
            <p
              style={{
                color: "#475569",
                fontSize: 16,
                fontWeight: 400,
                lineHeight: 1.8,
                margin: "0 0 48px",
              }}
            >
              We built Avrentis to change that — for every organisation, across
              Africa and beyond.
            </p>

            <p
              style={{
                color: "#C68B2F",
                fontSize: 10,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                margin: "0 0 12px",
              }}
            >
              THE VISION
            </p>
            <p
              style={{
                color: "#475569",
                fontSize: 16,
                fontWeight: 400,
                lineHeight: 1.8,
                margin: 0,
              }}
            >
              A world where every organisation — from a ten-person professional
              services firm to a thousand-person manufacturing operation — has
              the operational structure to make decisions with confidence,
              enforce authority with clarity, and build institutional memory that
              outlasts any individual.
            </p>
          </div>
        </section>

        {/* ── Values ── */}
        <section
          style={{
            backgroundColor: "#f1f5f9",
            padding: "80px 40px",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <p
              style={{
                color: "#C68B2F",
                fontSize: 12,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                textAlign: "center",
                margin: "0 0 32px",
              }}
            >
              OUR VALUES
            </p>
            <div
              className="grid grid-cols-1 md:grid-cols-2"
              style={{ gap: 20 }}
            >
              {VALUES.map((v) => (
                <div
                  key={v.title}
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    padding: 24,
                  }}
                >
                  <p
                    style={{
                      color: "#0f172a",
                      fontSize: 16,
                      fontWeight: 600,
                      margin: "0 0 8px",
                    }}
                  >
                    {v.title}
                  </p>
                  <p
                    style={{
                      color: "#64748b",
                      fontSize: 14,
                      fontWeight: 400,
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {v.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Join Us ── */}
        <section
          style={{
            backgroundColor: "#ffffff",
            padding: "80px 40px",
          }}
        >
          <div
            style={{
              maxWidth: 640,
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: "#C68B2F",
                fontSize: 12,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                margin: "0 0 16px",
              }}
            >
              JOIN THE TEAM
            </p>
            <h2
              style={{
                color: "#0f172a",
                fontSize: 24,
                fontWeight: 400,
                lineHeight: 1.4,
                margin: "0 0 16px",
              }}
            >
              We are building the team that will bring operational structure to
              organisations everywhere.
            </h2>
            <p
              style={{
                color: "#64748b",
                fontSize: 15,
                fontWeight: 400,
                lineHeight: 1.7,
                margin: "0 0 24px",
              }}
            >
              No open roles right now — but we are always interested in
              exceptional people. If you are passionate about building enterprise
              software that solves real operational problems, we want to hear
              from you.
            </p>
            <a
              href="mailto:careers@avrentis.com"
              style={{
                display: "inline-block",
                border: "1px solid #C68B2F",
                color: "#C68B2F",
                backgroundColor: "transparent",
                padding: "10px 24px",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                textDecoration: "none",
                borderRadius: 4,
              }}
            >
              GET IN TOUCH
            </a>
          </div>
        </section>

        {/* ── Contact ── */}
        <section
          style={{
            backgroundColor: "#0f172a",
            padding: "80px 40px",
          }}
        >
          <div
            style={{
              maxWidth: 640,
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                color: "#ffffff",
                fontSize: 28,
                fontWeight: 400,
                margin: "0 0 16px",
              }}
            >
              Get in touch
            </h2>
            <p
              style={{
                color: "#64748b",
                fontSize: 15,
                fontWeight: 400,
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              Whether you have questions about Avrentis, want to discuss how it
              can work for your organisation, or need support — we are here.
            </p>
            <a
              href="mailto:hello@avrentis.com"
              style={{
                display: "block",
                color: "#C68B2F",
                fontSize: 16,
                fontWeight: 500,
                marginTop: 20,
                textDecoration: "none",
              }}
            >
              hello@avrentis.com
            </a>
            <p
              style={{
                color: "#475569",
                fontSize: 13,
                fontWeight: 400,
                marginTop: 8,
                marginBottom: 0,
              }}
            >
              We respond to all inquiries within one business day.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
