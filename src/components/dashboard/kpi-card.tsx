import { DashboardCard } from "@/components/dashboard/dashboard-card";

type KpiCardProps = {
  label: string;
  value: string;
  change: string;
};

export function KpiCard({ label, value, change }: KpiCardProps) {
  return (
    <DashboardCard className="p-5">
      <p className="text-sm font-medium text-dashboard-muted">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-dashboard-text">{value}</p>
      <p className="mt-2 text-sm font-medium text-green-accent">{change}</p>
    </DashboardCard>
  );
}
