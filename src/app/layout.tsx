import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
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
  title: "AVRENTIS — Financial Decision Infrastructure for Nigerian Business",
  description:
    "Give every financial decision in your organisation a defined structure — from the moment it is raised to the moment it is permanently on record.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "AVRENTIS — Financial Decision Infrastructure for Nigerian Business",
    description:
      "Give every financial decision in your organisation a defined structure — from the moment it is raised to the moment it is permanently on record.",
    url: "https://avrentis.com",
    siteName: "AVRENTIS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AVRENTIS — Financial Decision Infrastructure for Nigerian Business",
    description:
      "Give every financial decision in your organisation a defined structure — from the moment it is raised to the moment it is permanently on record.",
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AVRENTIS",
  url: "https://avrentis.com",
  description: "Financial decision infrastructure for Nigerian business.",
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
        {children}
      </body>
    </html>
  );
}
