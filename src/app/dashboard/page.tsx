import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { KpiCard } from "@/components/dashboard/kpi-card";
import {
  ActivityFeed,
  LeadSnippetsWidget,
  RecentListingsWidget,
  RegionInsightPanel,
  RevenueChartPlaceholder,
} from "@/components/dashboard/dashboard-widgets";
import { dashboardKpis } from "@/lib/mock-dashboard";

export default function DashboardOverviewPage() {
  return (
    <DashboardShell
      title="Dashboard overview"
      description="A clean operating view for agency admins and senior agents, using static portfolio-ready data for now."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardKpis.map((kpi) => (
          <KpiCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            change={kpi.change}
          />
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.75fr)]">
        <RevenueChartPlaceholder />
        <RegionInsightPanel />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <RecentListingsWidget />
        <LeadSnippetsWidget />
        <ActivityFeed />
      </div>
    </DashboardShell>
  );
}
