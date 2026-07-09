import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { MotionProvider } from "@/components/providers/motion-provider";
import { BRAND } from "@/lib/brand";
import { JsonLd, organizationSchema } from "@/lib/seo";
import "./globals.css";

const OG_TITLE = `${BRAND.name} — Every organisation runs on decisions. ${BRAND.name} makes sure they stick.`;
const OG_DESCRIPTION =
  "Replace scattered approvals with structured authority — a permanent operational record for every decision, approval, and process your organisation runs.";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-archivo",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

// Wordmark font — self-hosted from the brand SSOT (@avrentishq/core/brand/fonts),
// so the file lives in exactly one place across app / site / admin.
const cabinetGrotesk = localFont({
  src: "../../node_modules/@avrentishq/core/src/brand/fonts/CabinetGrotesk-Extrabold.woff2",
  weight: "800",
  variable: "--font-cabinet-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://avrentis.com"),
  title: `${BRAND.name} — ${BRAND.positioningStatement}`,
  description:
    "Avrentis replaces scattered emails, paper trails, and manual processes with structure, authority, and a permanent operational record for every decision your organisation makes.",
  openGraph: {
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    url: "https://avrentis.com",
    siteName: BRAND.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: OG_TITLE,
    description: OG_DESCRIPTION,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${ibmPlexMono.variable} ${cabinetGrotesk.variable}`}
    >
      <head>
        <JsonLd data={organizationSchema()} />
      </head>
      <body className="antialiased" style={{ fontFamily: "var(--font-sans)" }}>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <MotionProvider>
          <ScrollProgress />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
