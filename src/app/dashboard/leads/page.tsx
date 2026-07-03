import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatusPill } from "@/components/dashboard/status-pill";
import { getDashboardLeads } from "@/lib/supabase/data";

export default async function DashboardLeadsPage() {
  const leads = await getDashboardLeads();

  return (
    <DashboardShell
      title="Leads and CRM"
      description="Lead stage cards for inquiry tracking, source attribution, and agent follow-up planning."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        {leads.map((lead) => (
          <DashboardCard className="p-5" key={lead.name}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-dashboard-text">
                  {lead.name}
                </h2>
                <p className="mt-2 text-sm text-dashboard-muted">{lead.property}</p>
              </div>
              <StatusPill status={lead.stage} />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-dashboard-bg p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-dashboard-muted">
                  Source
                </p>
                <p className="mt-2 font-semibold text-dashboard-text">{lead.source}</p>
              </div>
              <div className="rounded-2xl bg-dashboard-bg p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-dashboard-muted">
                  Budget
                </p>
                <p className="mt-2 font-semibold text-dashboard-text">{lead.value}</p>
              </div>
            </div>
          </DashboardCard>
        ))}
      </div>
    </DashboardShell>
  );
}
