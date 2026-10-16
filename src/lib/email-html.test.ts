import { describe, it, expect, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { emailLink, emailShell, escapeHtml, headerSafe, labelledRow } from "@/lib/email-html";
import { EMAIL_FONT_STACK } from "@/lib/static-colors";

describe("email HTML", () => {
  it("escapes every character that could open markup or close an attribute", () => {
    expect(escapeHtml(`<script>alert("x") & 'y'</script>`)).toBe(
      "&lt;script&gt;alert(&quot;x&quot;) &amp; &#39;y&#39;&lt;/script&gt;",
    );
  });

  it("turns line breaks into spaces so a subject can never add a header", () => {
    expect(headerSafe("Acme\r\nBcc: someone@example.test")).toBe("Acme Bcc: someone@example.test");
    expect(headerSafe("one\n\ntwo\rthree")).toBe("one two three");
  });

  it("escapes a row's label and a link's address and text", () => {
    expect(labelledRow("<Name>", "Ada")).toContain("&lt;Name&gt;");
    const link = emailLink(`mailto:"a"@x.test`, "<a>");
    expect(link).toContain(`href="mailto:&quot;a&quot;@x.test"`);
    expect(link).toContain("&lt;a&gt;</a>");
  });

  it("sets the body in the email font stack at the given width", () => {
    const html = emailShell([labelledRow("Name", "Ada")], 640);
    expect(html).toContain(`font-family:${EMAIL_FONT_STACK}`);
    expect(html).toContain("max-width:640px");
    expect(html.startsWith("<table")).toBe(true);
  });
});
