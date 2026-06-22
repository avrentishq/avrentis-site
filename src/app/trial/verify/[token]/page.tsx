import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { VerifyResult } from "./client";

export const metadata: Metadata = {
  title: "Verifying your Avrentis trial",
  robots: { index: false, follow: false },
};

const PLATFORM_ORIGIN = process.env.PLATFORM_API_URL ?? "https://app.avrentis.com";

interface PageProps {
  params: Promise<{ token: string }>;
}

interface VerifyResponse {
  status?: string;
  message?: string;
  /** Preferred field returned by the current platform API. */
  inviteUrl?: string;
  /** Legacy field — kept for backward compatibility. */
  loginUrl?: string;
  tenantSlug?: string;
}

export default async function VerifyPage({ params }: PageProps) {
  const { token } = await params;

  let response: Response | null = null;
  let payload: VerifyResponse = {};
  // Guard against absurd token input before forwarding to the platform.
  if (token && token.length <= 512) {
    try {
      response = await fetch(`${PLATFORM_ORIGIN}/api/v1/public/trial/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
        cache: "no-store",
      });
      payload = (await response.json().catch(() => ({}))) as VerifyResponse;
    } catch {
      // Network failure — fall through to the error card.
    }
  }

  // Success — the platform has provisioned (or found an existing) tenant.
  // Prefer inviteUrl; fall back to loginUrl when it is absent.
  // SECURITY (open-redirect guard): this is a token-bearing flow, so only ever
  // redirect to the trusted platform origin — never to an arbitrary URL echoed
  // back in the response.
  const successUrl = payload.inviteUrl ?? payload.loginUrl;
  if (response?.ok && payload.status === "provisioned" && successUrl) {
    const appOrigin = new URL(PLATFORM_ORIGIN).origin;
    let target: URL | null = null;
    try {
      target = new URL(successUrl);
    } catch {
      target = null;
    }
    if (target && target.origin === appOrigin) {
      redirect(target.toString());
    }
    // Untrusted or malformed target — fall through to the error card.
  }

  return (
    <>
      <Navbar />
      <main
        style={{
          backgroundColor: "#f1f5f9",
          padding: "120px 32px",
          minHeight: "70vh",
        }}
      >
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
          <VerifyResult
            status={payload.status ?? "error"}
            message={payload.message ?? "We couldn't verify this link."}
            token={token}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
