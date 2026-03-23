import { cn } from "@/lib/utils";

interface DividerProps {
  className?: string;
}

export function Divider({ className }: DividerProps) {
  return (
    <hr
      className={cn("w-full", className)}
      style={{
        border: "none",
        borderTop: "0.5px solid rgba(198, 139, 47, 0.2)",
        margin: 0,
      }}
    />
  );
}
