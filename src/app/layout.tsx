import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono, Hanken_Grotesk } from "next/font/google";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-hanken-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AVRENTIS — Operational Authority Platform",
  description:
    "Avrentis replaces scattered emails, paper trails, and manual processes with a single platform that structures how your organisation makes decisions, enforces authority, and builds a permanent operational record.",
  openGraph: {
    title: "AVRENTIS — Every organisation runs on decisions. Avrentis makes sure they stick.",
    description:
      "Replace scattered approvals with structured authority. One platform for decisions, approvals, and permanent operational records.",
    url: "https://avrentis.com",
    siteName: "AVRENTIS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AVRENTIS — Every organisation runs on decisions. Avrentis makes sure they stick.",
    description:
      "Replace scattered approvals with structured authority. One platform for decisions, approvals, and permanent operational records.",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AVRENTIS",
  url: "https://avrentis.com",
  description: "Operational authority platform for organisations worldwide.",
  slogan: "Every organisation runs on decisions. Avrentis makes sure they stick.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} ${hankenGrotesk.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="antialiased" style={{ fontFamily: "var(--font-sans)" }}>
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
