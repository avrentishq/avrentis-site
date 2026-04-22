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
  loginUrl?: string;
  tenantSlug?: string;
}

export default async function VerifyPage({ params }: PageProps) {
  const { token } = await params;

  let response: Response | null = null;
  let payload: VerifyResponse = {};
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

  // Success — the platform has provisioned (or found an existing) tenant.
  // Redirect straight to the login URL; the invite email with the
  // password-setup link is already in the user's inbox.
  if (response?.ok && payload.status === "provisioned" && payload.loginUrl) {
    redirect(payload.loginUrl);
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
