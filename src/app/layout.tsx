import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AVRENTIS — Approval Workflow Infrastructure",
  description:
    "Every document in your organisation follows a structured path — from submission through review to final approval — with a permanent record of every action taken along the way. Built for Nigerian business.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "AVRENTIS — Approval Workflow Infrastructure",
    description: "Every decision, structured. Every approval, on record.",
    type: "website",
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    title: "AVRENTIS — Approval Workflow Infrastructure",
    description: "Every decision, structured. Every approval, on record.",
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AVRENTIS",
  url: "https://avrentis.com",
  description:
    "Approval workflow infrastructure for Nigerian Oil & Gas SMEs.",
  foundingDate: "2026",
  foundingLocation: "Nigeria",
  areaServed: "Nigeria",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body
        className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} antialiased`}
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {children}
      </body>
    </html>
  );
}
