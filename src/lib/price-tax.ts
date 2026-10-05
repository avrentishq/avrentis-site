/* ── Sales tax on a listed price ───────────────────────────────── */

// Package imports only: the fallback generator loads this file through jiti.
import { platformSalesTax } from "@avrentishq/core/billing/platform-tax";
import { isCurrencyCode } from "@avrentishq/core/money/types";
import type { SalesTaxKind } from "@avrentishq/core/region/sales-tax";

/**
 * Listed prices are BEFORE tax. For a currency the platform bills itself
 * (naira, through Paystack) it adds the country's standard sales tax on top —
 * Nigerian VAT; core's `platformSalesTax` says which currencies and at what
 * rate. Stripe currencies (USD, …) get tax computed per customer at checkout,
 * so the site states no tax line for them; the site has no "plus applicable
 * tax" convention to borrow, so nothing is shown.
 *
 * The rate a card shows is the pricing API's numeric `taxRate` when the payload
 * carries one (the product's live answer), else core's — so today's payload,
 * an older one without the field and the generated fallback all render alike.
 * Never a typed rate.
 */

const TAX_WORD: Readonly<Record<SalesTaxKind, string>> = {
  vat: "VAT",
  gst: "GST",
  sales_tax: "sales tax",
};

/** A rate as a percent ("12.5%") — up to two decimals, no trailing zeros. */
export function formatTaxRate(rate: number): string {
  return new Intl.NumberFormat("en", { style: "percent", maximumFractionDigits: 2 }).format(rate);
}

/** The tax added to a price in this currency: the payload's numeric rate, else core's; null = none. */
export function addedSalesTax(
  currency: string,
  payloadRate?: number | null,
): { rate: number; word: string } | null {
  const platform = isCurrencyCode(currency) ? platformSalesTax(currency) : null;
  const rate = typeof payloadRate === "number" ? payloadRate : (platform?.rate ?? null);
  if (rate === null || rate <= 0) return null;
  return { rate, word: platform ? TAX_WORD[platform.kind] : "tax" };
}

/** "+ <rate> VAT" under a naira price, or null when no tax is added on top. */
export function priceTaxNote(currency: string, payloadRate?: number | null): string | null {
  const tax = addedSalesTax(currency, payloadRate);
  return tax ? `+ ${formatTaxRate(tax.rate)} ${tax.word}` : null;
}

/** "VAT <rate>" — the price list's `taxLabel` form, for the generated fallback. */
export function taxLabel(currency: string): string | null {
  const tax = addedSalesTax(currency);
  return tax ? `${tax.word} ${formatTaxRate(tax.rate)}` : null;
}
