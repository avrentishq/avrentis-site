"use client";

import { useState, useEffect } from "react";

export function AnnouncementStrip() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("avrentis-announcement-dismissed");
    if (!stored) setDismissed(false);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("avrentis-announcement-dismissed", "true");
  };

  if (dismissed) return null;

  return (
    <div
      style={{
        backgroundColor: "#020617",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 24px",
        borderBottom: "0.5px solid rgba(198,139,47,0.1)",
        position: "relative",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
            fontWeight: 400,
            fontSize: "13px",
            color: "#475569",
          }}
        >
          Approval workflow infrastructure for Nigerian Oil &amp; Gas
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <a
            href="/contact"
            style={{
              fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
              fontWeight: 500,
              fontSize: "13px",
              color: "#C68B2F",
              textDecoration: "none",
            }}
          >
            Request early access &rarr;
          </a>
          <button
            onClick={handleDismiss}
            aria-label="Dismiss announcement"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#475569",
              fontSize: "16px",
              padding: "0 4px",
              lineHeight: 1,
            }}
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  );
}
