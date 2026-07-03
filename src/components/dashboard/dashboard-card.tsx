import type { HTMLAttributes } from "react";

export function DashboardCard({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`min-w-0 rounded-2xl border border-black/5 bg-white shadow-[0_14px_38px_rgba(26,39,31,0.08)] ${className}`}
      {...props}
    />
  );
}
