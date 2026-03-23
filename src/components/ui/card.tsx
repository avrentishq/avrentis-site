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
        padding: "24px",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        border: "0.5px solid #e2e8f0",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "8px",
          backgroundColor: "rgba(198, 139, 47, 0.07)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={20} color="#C68B2F" strokeWidth={1.5} />
      </div>

      <h3
        style={{
          fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
          fontWeight: 500,
          fontSize: "18px",
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
          fontSize: "15px",
          color: "#64748b",
          lineHeight: 1.65,
          margin: 0,
        }}
      >
        {description}
      </p>
    </div>
  );
}
