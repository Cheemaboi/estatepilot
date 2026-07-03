import type { HTMLAttributes } from "react";

type BadgeVariant = "luxury" | "green" | "muted";

const badgeStyles: Record<BadgeVariant, string> = {
  luxury:
    "border-luxury-accent/50 bg-public-bg/68 text-[#f8e7ba] shadow-[0_12px_34px_rgba(0,0,0,0.34)]",
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
