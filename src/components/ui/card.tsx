"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn("flex flex-col gap-4", className)}
      style={{
        padding: "28px",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        border: "0.5px solid #e2e8f0",
        transition: "border-color 150ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(198,139,47,0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#e2e8f0";
      }}
    >
      {/* Gold-ghost icon container */}
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "4px",
          backgroundColor: "rgba(198, 139, 47, 0.07)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={18} color="#C68B2F" strokeWidth={1.5} />
      </div>

      <h3
        style={{
          fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
          fontWeight: 500,
          fontSize: "15px",
          color: "#0f172a",
          lineHeight: 1.3,
          margin: 0,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
          fontWeight: 400,
          fontSize: "13px",
          color: "#475569",
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {description}
      </p>
    </div>
  );
}
