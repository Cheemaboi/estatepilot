import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { KpiCard } from "@/components/dashboard/kpi-card";
import {
  ActivityFeed,
  LeadSnippetsWidget,
  RecentListingsWidget,
  MarketPulsePanel,
  RevenueActivityCard,
} from "@/components/dashboard/dashboard-widgets";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import {
  getDashboardAppointments,
  getDashboardKpis,
  getDashboardLeads,
  getDashboardProperties,
  getDashboardTransactions,
} from "@/lib/supabase/data";

export default async function DashboardOverviewPage() {
  const [kpis, properties, leads, transactions, appointments] = await Promise.all([
    getDashboardKpis(),
    getDashboardProperties(),
    getDashboardLeads(),
    getDashboardTransactions(),
    getDashboardAppointments(),
  ]);

  const activityFeed = buildActivityFeed({
    appointments,
    leads,
    properties,
    transactions,
  });

  return (
    <DashboardShell
      title="Dashboard overview"
      description={`A clean operating view for agency admins and senior agents, using ${
        hasSupabaseEnv() ? "Supabase-backed data where available" : "mock portfolio data for local development"
      }.`}
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
        <RevenueActivityCard items={transactions} />
        <MarketPulsePanel items={properties} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <RecentListingsWidget items={properties.slice(0, 3)} />
        <LeadSnippetsWidget items={leads.slice(0, 3)} />
        <ActivityFeed items={activityFeed} />
      </div>
    </DashboardShell>
  );
}

function buildActivityFeed({
  appointments,
  leads,
  properties,
  transactions,
}: {
  appointments: Awaited<ReturnType<typeof getDashboardAppointments>>;
  leads: Awaited<ReturnType<typeof getDashboardLeads>>;
  properties: Awaited<ReturnType<typeof getDashboardProperties>>;
  transactions: Awaited<ReturnType<typeof getDashboardTransactions>>;
}): string[] {
  const feed = [
    properties[0]
      ? `${properties[0].agent} updated ${properties[0].name} in ${properties[0].market}.`
      : "",
    leads[0]
      ? `${leads[0].name} moved to ${leads[0].stage.toLowerCase()} for ${leads[0].property}.`
      : "",
    transactions[0]
      ? `${transactions[0].client} is tracking ${transactions[0].property} at ${transactions[0].amount}.`
      : "",
    appointments[0]
      ? `${appointments[0].title} booked for ${appointments[0].property} at ${appointments[0].time}.`
      : "",
  ];

  return feed.filter((item): item is string => Boolean(item));
}
