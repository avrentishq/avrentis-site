"use client";

/**
 * Browser-framed mockups for each layer of the security stack page.
 * Mirrors the real-UI visual language used on /product/how-it-works and
 * the individual module pages — no decorative illustration, just small,
 * scannable representations of the platform's actual security surface.
 */

import { Check, X, AlertTriangle, ShieldCheck, Clock } from "lucide-react";

const mono = "'IBM Plex Mono', monospace";
const sans = "var(--font-sans)";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: mono,
        fontSize: "10px",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "#94a3b8",
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  );
}

/* ── 01. Isolation ──────────────────────────────────────────────── */

export function IsolationMockup() {
  return (
    <div style={{ padding: "22px", display: "flex", flexDirection: "column", gap: "18px", backgroundColor: "#F8FAFC" }}>
      <Label>POSTGRES SESSION · PER-REQUEST</Label>
      <div
        style={{
          fontFamily: mono,
          fontSize: "12px",
          lineHeight: 1.65,
          color: "#0f172a",
          backgroundColor: "#0f172a",
          borderRadius: "8px",
          padding: "18px",
          overflowX: "auto",
        }}
      >
        <div style={{ color: "#64748b" }}>-- every tenant-scoped query runs inside this wrap</div>
        <div style={{ color: "#e2e8f0" }}>
          <span style={{ color: "#C68B2F" }}>withTenantContext</span>(<span style={{ color: "#94D2BD" }}>tenantId</span>,{" "}
          <span style={{ color: "#94D2BD" }}>async</span> () =&gt; {"{"}
        </div>
        <div style={{ color: "#e2e8f0", paddingLeft: "16px" }}>
          <span style={{ color: "#94D2BD" }}>SET LOCAL</span> app.tenant_id ={" "}
          <span style={{ color: "#C68B2F" }}>&apos;{"{tenantId}"}&apos;</span>;
        </div>
        <div style={{ color: "#e2e8f0", paddingLeft: "16px" }}>
          <span style={{ color: "#94D2BD" }}>SELECT</span> * <span style={{ color: "#94D2BD" }}>FROM</span> vouchers;{" "}
          <span style={{ color: "#64748b" }}>-- RLS-enforced</span>
        </div>
        <div style={{ color: "#e2e8f0" }}>{"}"})</div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "6px",
            padding: "12px 14px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <span style={{ fontFamily: sans, fontSize: "11px", color: "#64748b" }}>Tenant A</span>
          <span style={{ fontFamily: sans, fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>
            182 vouchers · 47 users
          </span>
        </div>
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "6px",
            padding: "12px 14px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <span style={{ fontFamily: sans, fontSize: "11px", color: "#64748b" }}>Tenant B</span>
          <span style={{ fontFamily: sans, fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>
            94 vouchers · 22 users
          </span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontFamily: sans,
          fontSize: "12px",
          color: "#475569",
          backgroundColor: "rgba(198,139,47,0.08)",
          border: "1px solid rgba(198,139,47,0.22)",
          borderRadius: "6px",
          padding: "10px 12px",
        }}
      >
        <ShieldCheck size={14} color="#C68B2F" strokeWidth={2} aria-hidden="true" />
        <span>
          A bare <code style={{ fontFamily: mono }}>db.query()</code> without tenant context is blocked at the database.
        </span>
      </div>
    </div>
  );
}

/* ── 02. Authority ──────────────────────────────────────────────── */

const AUTHORITY_ROWS = [
  { capability: "Raise voucher / PO", staff: true, hod: true, finance: true, md: true, admin: true },
  { capability: "Approve as HOD", staff: false, hod: true, finance: false, md: false, admin: false },
  { capability: "Finance review", staff: false, hod: false, finance: true, md: false, admin: false },
  { capability: "MD sanction", staff: false, hod: false, finance: false, md: true, admin: false },
  { capability: "Change a role", staff: false, hod: false, finance: false, md: false, admin: true },
  { capability: "Export audit bundle", staff: false, hod: false, finance: true, md: true, admin: true },
];

export function AuthorityMockup() {
  return (
    <div style={{ padding: "22px", backgroundColor: "#F8FAFC" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <Label>PERMISSION MATRIX · EXCERPT</Label>
        <span style={{ fontFamily: mono, fontSize: "10px", color: "#64748b", letterSpacing: "0.04em" }}>
          54 permissions · 10 roles
        </span>
      </div>
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "6px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr repeat(5, 1fr)",
            padding: "10px 14px",
            backgroundColor: "#F8FAFC",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <span style={{ fontFamily: mono, fontSize: "10px", color: "#64748b", letterSpacing: "0.06em" }}>
            CAPABILITY
          </span>
          {["STAFF", "HOD", "FIN", "MD", "ADM"].map((r) => (
            <span
              key={r}
              style={{
                fontFamily: mono,
                fontSize: "10px",
                color: "#64748b",
                letterSpacing: "0.06em",
                textAlign: "center",
              }}
            >
              {r}
            </span>
          ))}
        </div>
        {AUTHORITY_ROWS.map((row, i) => (
          <div
            key={row.capability}
            style={{
              display: "grid",
              gridTemplateColumns: "1.6fr repeat(5, 1fr)",
              padding: "10px 14px",
              borderTop: i === 0 ? "none" : "1px solid #f1f5f9",
              alignItems: "center",
            }}
          >
            <span style={{ fontFamily: sans, fontSize: "12px", color: "#0f172a" }}>{row.capability}</span>
            {[row.staff, row.hod, row.finance, row.md, row.admin].map((v, j) => (
              <span key={j} style={{ display: "flex", justifyContent: "center" }}>
                {v ? (
                  <Check size={14} color="#047857" strokeWidth={2.5} aria-label="allowed" />
                ) : (
                  <X size={14} color="#cbd5e1" strokeWidth={2} aria-label="not allowed" />
                )}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "8px",
          fontFamily: sans,
          fontSize: "12px",
          color: "#475569",
          backgroundColor: "rgba(198,139,47,0.08)",
          border: "1px solid rgba(198,139,47,0.22)",
          borderRadius: "6px",
          padding: "10px 12px",
          marginTop: "12px",
          lineHeight: 1.55,
        }}
      >
        <AlertTriangle size={14} color="#C68B2F" strokeWidth={2} aria-hidden="true" style={{ marginTop: "2px" }} />
        <span>
          <b>Separation of duties</b> — the submitter of a voucher cannot also approve it. Enforced in the state
          machine, not at the UI.
        </span>
      </div>
    </div>
  );
}

/* ── 03. Session integrity ──────────────────────────────────────── */

export function SessionMockup() {
  return (
    <div style={{ padding: "22px", display: "flex", flexDirection: "column", gap: "14px", backgroundColor: "#F8FAFC" }}>
      <Label>SESSION REVOCATION · LIVE</Label>
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          padding: "16px 18px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#C68B2F",
              }}
            />
            <span style={{ fontFamily: sans, fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>
              Role changed · Amaka Bello
            </span>
          </div>
          <span style={{ fontFamily: mono, fontSize: "11px", color: "#64748b" }}>14:32:08 UTC</span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            fontFamily: sans,
            fontSize: "12px",
          }}
        >
          <div style={{ color: "#64748b" }}>
            Previous · <span style={{ color: "#0f172a", fontWeight: 500 }}>Finance</span>
          </div>
          <div style={{ color: "#64748b" }}>
            New · <span style={{ color: "#0f172a", fontWeight: 500 }}>HOD</span>
          </div>
        </div>
        <div
          style={{
            backgroundColor: "#F8FAFC",
            border: "1px solid #e2e8f0",
            borderRadius: "6px",
            padding: "10px 12px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <ShieldCheck size={14} color="#047857" strokeWidth={2} aria-hidden="true" />
          <span style={{ fontFamily: sans, fontSize: "12px", color: "#0f172a" }}>
            <b>12 active sessions revoked</b> in 0.8s · next request forces re-auth
          </span>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          padding: "14px 18px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <span style={{ fontFamily: mono, fontSize: "10px", color: "#64748b", letterSpacing: "0.06em" }}>
          REVOKED ON
        </span>
        {[
          "Role changed",
          "Account deactivated",
          "Password changed",
          "Access expiry hit",
          "Tenant-wide revocation",
        ].map((t) => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Check size={12} color="#C68B2F" strokeWidth={2.5} aria-hidden="true" />
            <span style={{ fontFamily: sans, fontSize: "12px", color: "#334155" }}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 04. Audit trail ────────────────────────────────────────────── */

const AUDIT_EVENTS = [
  { time: "14:42:17", actor: "Adaeze O.", role: "MD", action: "sanctioned", entity: "PV-2026-0184" },
  { time: "14:29:03", actor: "Tunde A.", role: "Finance", action: "approved", entity: "PV-2026-0184" },
  { time: "11:05:41", actor: "Kemi L.", role: "Staff", action: "submitted", entity: "PV-2026-0184" },
];

export function AuditMockup() {
  return (
    <div style={{ padding: "22px", backgroundColor: "#F8FAFC" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <Label>AUDIT TRAIL · PV-2026-0184</Label>
        <span style={{ fontFamily: mono, fontSize: "10px", color: "#C68B2F", letterSpacing: "0.06em" }}>
          IMMUTABLE
        </span>
      </div>
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "6px",
          overflow: "hidden",
        }}
      >
        {AUDIT_EVENTS.map((e, i) => (
          <div
            key={e.time}
            style={{
              padding: "14px 16px",
              borderTop: i === 0 ? "none" : "1px solid #f1f5f9",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontFamily: mono, fontSize: "11px", color: "#64748b" }}>{e.time}</span>
                <span style={{ fontFamily: sans, fontSize: "12px", fontWeight: 600, color: "#0f172a" }}>
                  {e.actor}
                </span>
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: "10px",
                    color: "#C68B2F",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  {e.role}
                </span>
              </div>
              <span
                style={{
                  fontFamily: mono,
                  fontSize: "11px",
                  color: "#0f172a",
                  backgroundColor: "#F8FAFC",
                  borderRadius: "3px",
                  padding: "2px 6px",
                }}
              >
                {e.action}
              </span>
            </div>
            <span style={{ fontFamily: sans, fontSize: "11px", color: "#64748b" }}>
              entity · {e.entity} · IP 154.113.x.x · via web
            </span>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "8px",
          fontFamily: sans,
          fontSize: "12px",
          color: "#475569",
          backgroundColor: "rgba(198,139,47,0.08)",
          border: "1px solid rgba(198,139,47,0.22)",
          borderRadius: "6px",
          padding: "10px 12px",
          marginTop: "12px",
          lineHeight: 1.55,
        }}
      >
        <ShieldCheck size={14} color="#C68B2F" strokeWidth={2} aria-hidden="true" style={{ marginTop: "2px" }} />
        <span>
          Database triggers block <b>UPDATE</b> and <b>DELETE</b> on audit rows. Not even a platform administrator can
          edit history.
        </span>
      </div>
    </div>
  );
}

/* ── 05. Access lifecycle ───────────────────────────────────────── */

export function LifecycleMockup() {
  return (
    <div style={{ padding: "22px", backgroundColor: "#F8FAFC" }}>
      <Label>USER · AUDIT ACCESS</Label>
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          padding: "18px",
          marginTop: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <div>
          <div style={{ fontFamily: sans, fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>
            Temidayo A. · External Auditor
          </div>
          <div style={{ fontFamily: sans, fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
            temidayo@ext-auditors.com
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <div
            style={{
              backgroundColor: "#F8FAFC",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              padding: "10px 12px",
            }}
          >
            <div style={{ fontFamily: mono, fontSize: "10px", color: "#64748b", letterSpacing: "0.06em" }}>
              ACCESS GRANTED
            </div>
            <div style={{ fontFamily: sans, fontSize: "13px", fontWeight: 500, color: "#0f172a", marginTop: "4px" }}>
              2026-04-01
            </div>
          </div>
          <div
            style={{
              backgroundColor: "rgba(198,139,47,0.10)",
              border: "1px solid rgba(198,139,47,0.22)",
              borderRadius: "6px",
              padding: "10px 12px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <div style={{ fontFamily: mono, fontSize: "10px", color: "#64748b", letterSpacing: "0.06em" }}>
              EXPIRES
            </div>
            <div
              style={{
                fontFamily: sans,
                fontSize: "13px",
                fontWeight: 500,
                color: "#0f172a",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Clock size={12} color="#C68B2F" strokeWidth={2} aria-hidden="true" />
              2026-05-15 · auto-revoke
            </div>
          </div>
        </div>
        <div
          style={{
            backgroundColor: "#F8FAFC",
            border: "1px solid #e2e8f0",
            borderRadius: "6px",
            padding: "10px 12px",
          }}
        >
          <div
            style={{
              fontFamily: mono,
              fontSize: "10px",
              color: "#64748b",
              letterSpacing: "0.06em",
              marginBottom: "6px",
            }}
          >
            PROVISIONED VIA
          </div>
          <div
            style={{
              fontFamily: sans,
              fontSize: "13px",
              color: "#0f172a",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            SCIM 2.0 · Okta
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 06. Encryption & infra ─────────────────────────────────────── */

const STACK_LAYERS = [
  { label: "Browser", detail: "TLS 1.3 · HSTS · strict CSP" },
  { label: "Edge / app", detail: "Fluid Compute · SameSite cookies · BotID" },
  { label: "Database", detail: "Neon Postgres · encrypted at rest · daily snapshots" },
  { label: "Secrets", detail: "AES-256-GCM at application layer (MFA, SSO)" },
  { label: "Object storage", detail: "Cloudflare R2 · short-lived presigned URLs" },
];

export function InfraMockup() {
  return (
    <div style={{ padding: "22px", backgroundColor: "#F8FAFC" }}>
      <Label>PLATFORM STACK</Label>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          marginTop: "12px",
        }}
      >
        {STACK_LAYERS.map((layer) => (
          <div
            key={layer.label}
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              padding: "12px 14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span
              style={{
                fontFamily: mono,
                fontSize: "11px",
                color: "#C68B2F",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                minWidth: "110px",
              }}
            >
              {layer.label}
            </span>
            <span style={{ fontFamily: sans, fontSize: "12px", color: "#334155", textAlign: "right" }}>
              {layer.detail}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
