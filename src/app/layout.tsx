import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono, Hanken_Grotesk } from "next/font/google";
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
  title: "AVRENTIS — Financial decision infrastructure for Nigerian business",
  description:
    "AVRENTIS structures the financial decisions that authorise money to move. Every Payment Voucher and Purchase Order follows a defined approval chain — permanently on record. Built for Nigerian business.",
  openGraph: {
    title: "AVRENTIS — Every decision, structured. Every approval, on record.",
    description:
      "Financial decision infrastructure for any Nigerian organisation where financial decisions require structured authority.",
    url: "https://avrentis.com",
    siteName: "AVRENTIS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AVRENTIS — Every decision, structured. Every approval, on record.",
    description:
      "Financial decision infrastructure for any Nigerian organisation where financial decisions require structured authority.",
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
  description: "Financial decision infrastructure for Nigerian business.",
  slogan: "Every decision, structured. Every approval, on record.",
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
