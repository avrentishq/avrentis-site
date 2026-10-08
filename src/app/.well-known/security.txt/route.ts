import { CONTACT_EMAIL, disclosurePolicyPath } from "@/lib/contacts";
import { canonical } from "@/lib/seo";

/**
 * `/.well-known/security.txt` (RFC 9116) — how a researcher reaches us.
 *
 * Generated rather than a static file so the required `Expires` field can never
 * lapse unnoticed: the standard says a reader should treat an expired file as
 * stale, and a hand-typed date silently goes past after a year. It is rebuilt
 * daily and always points one year ahead; every value comes from the same
 * constants the trust page shows. The Policy line names a page a reader can
 * open today (`disclosurePolicyPath`), never one the launch gate hides.
 */

export const dynamic = "force-static";
export const revalidate = 86_400;

const VALIDITY_DAYS = 365;

export function securityTxt(now: Date = new Date()): string {
  const expires = new Date(now.getTime() + VALIDITY_DAYS * 86_400_000);
  return [
    `Contact: mailto:${CONTACT_EMAIL.security}`,
    `Expires: ${expires.toISOString()}`,
    "Preferred-Languages: en",
    `Canonical: ${canonical("/.well-known/security.txt")}`,
    `Policy: ${canonical(disclosurePolicyPath())}`,
    "",
  ].join("\n");
}

export function GET(): Response {
  return new Response(securityTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
