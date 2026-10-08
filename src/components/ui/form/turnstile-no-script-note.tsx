/**
 * Shown only when JavaScript is off and the bot check (Cloudflare Turnstile)
 * is switched on. The check runs in script, so the server would refuse the
 * send; say so up front and give a way through that needs no script.
 */
export function TurnstileNoScriptNote({ email }: { email: string }) {
  return (
    <noscript>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "13px",
          color: "var(--color-text-secondary)",
          margin: 0,
        }}
      >
        Our security check needs JavaScript. If you can&apos;t turn it on, email us at{" "}
        <a href={`mailto:${email}`} style={{ color: "var(--color-gold-on-light)" }}>
          {email}
        </a>
        .
      </p>
    </noscript>
  );
}
