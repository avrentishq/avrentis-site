/**
 * ConnectPreview — browser-frame for /product/connect. Shows API keys and
 * webhook subscriptions, matching the real Avrentis integration panel.
 */

export function ConnectPreview() {
  const apiKeys = [
    { name: "SAP integration (prod)", status: "Active", bg: "rgba(4,120,87,0.08)", color: "#047857", used: "2m ago" },
    { name: "QuickBooks sync", status: "Active", bg: "rgba(4,120,87,0.08)", color: "#047857", used: "18m ago" },
    { name: "Legacy Oracle bridge", status: "Rotated", bg: "rgba(148,163,184,0.12)", color: "#64748b", used: "Never" },
  ];

  const webhooks = [
    { event: "voucher.sanctioned", endpoint: "hooks.finance.acme.ng/avrentis", success: "127 / 127" },
    { event: "po.issued", endpoint: "erp.acme.ng/webhooks/avrentis", success: "84 / 84" },
    { event: "user.role_changed", endpoint: "hris.acme.ng/sync", success: "12 / 12" },
  ];

  return (
    <div style={{ padding: "22px 24px" }}>
      {/* API keys section */}
      <div style={{ marginBottom: "14px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "8px" }}>
          <h4 style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 500, color: "#64748b", letterSpacing: "0.04em", textTransform: "uppercase", margin: 0 }}>
            API keys
          </h4>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              fontWeight: 500,
              color: "#0f172a",
            }}
          >
            + New key
          </span>
        </div>
        <div style={{ backgroundColor: "#FFFFFF", border: "1px solid #e2e8f0", borderRadius: "4px" }}>
          {apiKeys.map((key, i) => (
            <div
              key={key.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 14px",
                borderTop: i === 0 ? "none" : "1px solid #e2e8f0",
              }}
            >
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "11px",
                  color: "#64748b",
                  width: "84px",
                  flexShrink: 0,
                }}
              >
                av_***_ak4f
              </span>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#0f172a",
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {key.name}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "10px",
                  fontWeight: 500,
                  backgroundColor: key.bg,
                  color: key.color,
                  borderRadius: "3px",
                  padding: "2px 6px",
                }}
              >
                {key.status}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "11px",
                  color: "#64748b",
                  minWidth: "64px",
                  textAlign: "right",
                }}
              >
                {key.used}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Webhooks section */}
      <div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "8px" }}>
          <h4 style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 500, color: "#64748b", letterSpacing: "0.04em", textTransform: "uppercase", margin: 0 }}>
            Webhooks
          </h4>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 500, color: "#0f172a" }}>
            + New webhook
          </span>
        </div>
        <div style={{ backgroundColor: "#FFFFFF", border: "1px solid #e2e8f0", borderRadius: "4px" }}>
          {webhooks.map((hook, i) => (
            <div
              key={hook.event}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 14px",
                borderTop: i === 0 ? "none" : "1px solid #e2e8f0",
              }}
            >
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "11px",
                  color: "#0f172a",
                  fontWeight: 500,
                  minWidth: "140px",
                }}
              >
                {hook.event}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "11px",
                  color: "#64748b",
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {hook.endpoint}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontFeatureSettings: '"tnum" 1',
                  fontSize: "11px",
                  color: "#047857",
                  fontWeight: 500,
                }}
              >
                {hook.success}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
