import type { HTMLAttributes } from "react";

type BadgeVariant = "luxury" | "green" | "muted";

const badgeStyles: Record<BadgeVariant, string> = {
  luxury: "border-luxury-accent/40 bg-luxury-accent/12 text-luxury-accent",
  green: "border-green-accent/25 bg-green-accent/12 text-[#bfe7cf]",
  muted: "border-white/14 bg-white/8 text-white/72",
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
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${badgeStyles[variant]} ${className}`}
      {...props}
    />
  );
}
