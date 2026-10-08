/* ── Sales tax on a listed price ───────────────────────────────── */

// Package imports only: the fallback generator loads this file through jiti.
import { platformSalesTax } from "@avrentishq/core/billing/platform-tax";
import { isCurrencyCode } from "@avrentishq/core/money/types";
import type { SalesTaxKind } from "@avrentishq/core/region/sales-tax";

/**
 * Listed prices are BEFORE tax. A currency the platform bills itself (naira,
 * through Paystack) adds sales tax on top ONLY where Avrentis is registered to
 * collect it — core's `platformSalesTax` (its `PLATFORM_TAX_REGISTRATIONS`
 * list) is the sole authority on WHETHER a tax line shows. Stripe currencies
 * (USD, …) get tax computed per customer at checkout, so the site states no
 * tax line for them; the site has no "plus applicable tax" convention to
 * borrow, so nothing is shown.
 *
 * Precedence: core decides, the payload only formats. When core says no tax
 * applies, no line renders whatever the pricing API's `taxRate` says — a
 * deployed app on an older core may still send a rate it no longer charges,
 * and the site must never advertise tax core says is not charged. When core
 * says tax applies, the line shows the payload's positive numeric `taxRate`
 * (the product's live answer) when present, else core's rate. Never a typed
 * rate.
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

/**
 * The tax added to a price in this currency, or null when none is. Core decides
 * whether (null = no registration, or the provider computes it); the payload's
 * positive numeric rate, when present, is what is shown, else core's.
 */
export function addedSalesTax(
  currency: string,
  payloadRate?: number | null,
): { rate: number; word: string } | null {
  const platform = isCurrencyCode(currency) ? platformSalesTax(currency) : null;
  if (!platform) return null;
  const rate = typeof payloadRate === "number" && payloadRate > 0 ? payloadRate : platform.rate;
  return { rate, word: TAX_WORD[platform.kind] };
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
