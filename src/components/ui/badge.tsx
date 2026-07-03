import type { HTMLAttributes } from "react";

type BadgeVariant = "luxury" | "green" | "muted";

const badgeStyles: Record<BadgeVariant, string> = {
  luxury:
    "border-luxury-accent/45 bg-public-bg/55 text-[#f3dca3] shadow-[0_10px_30px_rgba(0,0,0,0.28)]",
  green: "border-green-accent/35 bg-public-bg/55 text-[#c8efd7]",
  muted: "border-white/18 bg-public-bg/50 text-white/82",
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export function Badge({
  className = "",
  variant = "muted",
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-md ${badgeStyles[variant]} ${className}`}
      {...props}
    />
  );
}
