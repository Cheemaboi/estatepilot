import type { HTMLAttributes } from "react";

type CardVariant = "glass" | "surface" | "dashboard";

const cardStyles: Record<CardVariant, string> = {
  glass:
    "border border-white/14 bg-white/[0.08] text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl",
  surface:
    "border border-white/12 bg-public-panel text-white shadow-[0_24px_80px_rgba(0,0,0,0.24)]",
  dashboard:
    "border border-black/5 bg-dashboard-card text-dashboard-text shadow-[0_14px_38px_rgba(26,39,31,0.08)]",
};

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
};

export function Card({
  className = "",
  variant = "surface",
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-[28px] ${cardStyles[variant]} ${className}`}
      {...props}
    />
  );
}
