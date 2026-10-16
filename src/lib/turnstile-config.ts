/**
 * The Cloudflare Turnstile facts the browser widget and the server check
 * share. Client-safe: the site key is a public (NEXT_PUBLIC_) value, inlined
 * identically into the server and client bundles.
 */

/** The widget's site key; undefined when the bot check is not configured. */
export const TURNSTILE_SITE_KEY: string | undefined = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/** The field the widget adds to the form with its one-time answer. */
export const TURNSTILE_RESPONSE_FIELD = "cf-turnstile-response";

/** Cloudflare's widget script, loaded in explicit-render mode. */
export const TURNSTILE_SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
