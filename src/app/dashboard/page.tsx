import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { KpiCard } from "@/components/dashboard/kpi-card";
import {
  ActivityFeed,
  LeadSnippetsWidget,
  RecentListingsWidget,
  RegionInsightPanel,
  RevenueChartPlaceholder,
} from "@/components/dashboard/dashboard-widgets";
import {
  getDashboardKpis,
  getDashboardLeads,
  getDashboardProperties,
} from "@/lib/supabase/data";

export default async function DashboardOverviewPage() {
  const [kpis, properties, leads] = await Promise.all([
    getDashboardKpis(),
    getDashboardProperties(),
    getDashboardLeads(),
  ]);

  return (
    <DashboardShell
      title="Dashboard overview"
      description="A clean operating view for agency admins and senior agents, using static portfolio-ready data for now."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
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
        <RecentListingsWidget items={properties.slice(0, 3)} />
        <LeadSnippetsWidget items={leads.slice(0, 3)} />
        <ActivityFeed />
      </div>
    </DashboardShell>
  );
}
