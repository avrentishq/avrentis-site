/**
 * SEO / structured-data helpers — one place for the canonical origin, the
 * JSON-LD <script> renderer, and the schema.org builders used across pages.
 *
 * JSON-LD can live anywhere in the document; we render <JsonLd> inside page
 * bodies. Keep emitted facts truthful and in lockstep with the visible copy.
 */

import { BRAND } from "@/lib/brand";
import type { PricingData } from "@/lib/pricing";

export const SITE_URL = "https://avrentis.com";

/** Absolute canonical URL for a route path ("/" → site root). */
export function canonical(path: string): string {
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

/** Renders a JSON-LD script tag. Safe in server or client components. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function organizationSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND.name,
    url: SITE_URL,
    logo: `${SITE_URL}/apple-touch-icon.png`,
    description: `${BRAND.positioningStatement} for organisations across Nigeria and Africa.`,
    slogan: "Every organisation runs on decisions. Avrentis makes sure they stick.",
    contactPoint: {
      "@type": "ContactPoint",
      email: BRAND.supportEmail,
      contactType: "customer support",
    },
  };
}

/** AggregateOffer derived from the live/fallback pricing (USD, major units). */
function aggregateOffer(pricing?: PricingData | null): Record<string, unknown> | null {
  if (!pricing?.plans?.length) return null;
  const usd = pricing.plans
    .map((plan) => plan.pricing?.find((p) => p.currency === "USD")?.monthly)
    .filter((n): n is number => typeof n === "number" && n > 0);
  if (!usd.length) return null;
  return {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    lowPrice: Math.min(...usd),
    highPrice: Math.max(...usd),
    offerCount: pricing.plans.length,
  };
}

export function softwareApplicationSchema(pricing?: PricingData | null): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: BRAND.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: SITE_URL,
    description:
      `${BRAND.positioningStatement} — structured approval workflows, enforced authority, ` +
      "and a permanent operational record for payment vouchers, purchase orders, and more.",
  };
  const offer = aggregateOffer(pricing);
  if (offer) schema.offers = offer;
  return schema;
}

export function faqPageSchema(faqs: { q: string; a: string }[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: canonical(item.path),
    })),
  };
}
